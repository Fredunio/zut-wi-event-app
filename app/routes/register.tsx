import type {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { getZodIssueMessage, safeRedirect, validateEmail } from "~/utils";
import { ZodIssue, z } from "zod";

const registerUserSchema = z.object({
    email: z
        .string({ required_error: "Email jest wymagany" })
        .email({ message: "Wpisz poprawny adres email" }),
    password: z.string({ required_error: "Hasło jest wymagane" }).min(8, {
        message: "Hasło musi mieć co najmniej 8 znaków",
    }),
});

const registerOrganizationSchema = registerUserSchema.extend({
    organizationName: z.string().min(1, "Nazwa firmy jest wymagana"),
    organizationNip: z
        .string()
        .min(10, "NIP musi mieć co najmniej 10 znaków")
        .refine((value) => value.match(/\d{3}-\d{2}-\d{2}-\d{3}/), {
            message: "NIP musi być w formacie 123-45-67-890",
        }),

    organizationFullAdress: z.string().min(1, "Adres firmy jest wymagany"),
    organizationPostalCode: z
        .string()
        .min(6, "Kod pocztowy jest wymagany")
        .refine((value) => value.match(/\d{2}-\d{3}/), {
            message: "Kod pocztowy musi być w formacie 12-345",
        }),
    organizationCity: z.string().min(1, "Miasto jest wymagane"),
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const userId = await getUserId(request);
    if (userId) return redirect("/");
    return json({});
};

async function checkIfUserExists(email: string) {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return new z.ZodError([
            {
                code: "custom",
                message: "Użytkownik o podanym adresie email już istnieje",
                path: ["email"],
            },
        ]);
    }
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const isOrganization = formData.get("isOrganization");
    const organizationName = formData.get("organizationName");
    const organizationNip = formData.get("nip");
    const organizationFullAdress = formData.get("organizationFullAdress");
    const organizationPostalCode = formData.get("organizationPostalCode");
    const organizationCity = formData.get("organizationCity");

    const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
    let newUser: any = null;

    if (!isOrganization) {
        const parsedUser = registerUserSchema.safeParse({
            email: email,
            password: password,
        });

        if (!parsedUser.success) {
            console.log(parsedUser);
            return json({ errors: parsedUser.error.issues }, { status: 400 });
        }
        console.log("parsedUser.data: ", parsedUser.data);
        const existingUserError = await checkIfUserExists(
            parsedUser.data.email
        );
        if (existingUserError) {
            return json({ errors: existingUserError.issues }, { status: 400 });
        }

        newUser = await createUser(
            parsedUser.data.email,
            parsedUser.data.password
        );
    } else if (isOrganization) {
        const parsedOrganization = registerOrganizationSchema.safeParse({
            email: email,
            password: password,
            organizationName: organizationName,
            organizationNip: organizationNip,
            organizationFullAdress: organizationFullAdress,
            organizationPostalCode: organizationPostalCode,
            organizationCity: organizationCity,
        });

        if (!parsedOrganization.success) {
            console.log(parsedOrganization.error);
            return json(
                { errors: parsedOrganization.error.issues },
                { status: 400 }
            );
        }

        const existingOrganizationError = await checkIfUserExists(
            parsedOrganization.data.email
        );
        if (existingOrganizationError) {
            return json(
                { errors: existingOrganizationError.issues },
                { status: 400 }
            );
        }

        newUser = await createUser(
            parsedOrganization.data.email,
            parsedOrganization.data.password,
            {
                organizationName: parsedOrganization.data.organizationName,
                organizationNip: parsedOrganization.data.organizationNip,
                organizationFullAddress:
                    parsedOrganization.data.organizationFullAdress,
                organizationPostalCode:
                    parsedOrganization.data.organizationPostalCode,
                organizationCity: parsedOrganization.data.organizationCity,
            }
        ).catch((e) => {
            const customError = new z.ZodError([
                {
                    code: "custom",
                    message: "Coś poszło nie tak",
                    path: ["email"],
                },
            ]);
            return json({ errors: customError.issues }, { status: 400 });
        });
    }

    return createUserSession({
        redirectTo,
        remember: false,
        request,
        userId: newUser.id,
    });
};

export const meta: MetaFunction = () => [{ title: "Rejestracja" }];

export default function Join() {
    const [searchParams, setSearchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") ?? undefined;
    const actionData = useActionData<typeof action>();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [isOrganization, setIsOrganization] = useState(false);

    const isOrganizationParam = searchParams.get("organization");
    const errorsArray = actionData?.errors as ZodIssue[];
    const getErrorMessage = useCallback(
        (key: string) => {
            return getZodIssueMessage(errorsArray, key);
        },

        [actionData]
    );

    useEffect(() => {
        if (getErrorMessage("email")) {
            emailRef.current?.focus();
        } else if (getErrorMessage("password")) {
            passwordRef.current?.focus();
        }
    }, [actionData]);

    return (
        <div className="flex min-full-height py-10 px-5 flex-col items-center justify-center">
            <div className="flex  flex-col shadow-xl border-1 bg-base-200 border-primary/30 py-12 rounded-md px-8">
                <h1 className="text-center text-4xl mb-10 font-bold tracking-tight">
                    <span className="block text-primary drop-shadow-md">
                        Rejestracja
                    </span>
                </h1>
                <div className="mx-auto w-full max-w-md px-8">
                    <Form method="post" className="space-y-6">
                        <label htmlFor="email" className="form-control w-full ">
                            <div className="label">
                                <span className="label-text">Email</span>
                            </div>
                            <input
                                ref={emailRef}
                                id="email"
                                required
                                // eslint-disable-next-line jsx-a11y/no-autofocus
                                autoFocus={true}
                                name="email"
                                type="email"
                                autoComplete="email"
                                aria-invalid={
                                    getErrorMessage("email") ? true : undefined
                                }
                                aria-describedby="email-error"
                                className="input input-bordered w-full min-w-80"
                            />
                            {getErrorMessage("email") ? (
                                <div
                                    className="pt-1 text-error"
                                    id="email-error"
                                >
                                    {getErrorMessage("email")}
                                </div>
                            ) : null}
                        </label>

                        <label
                            htmlFor="password"
                            className="form-control w-full "
                        >
                            <div className="label">
                                <span className="label-text">Hasło</span>
                            </div>
                            <input
                                id="password"
                                ref={passwordRef}
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                aria-invalid={
                                    getErrorMessage("password")
                                        ? true
                                        : undefined
                                }
                                aria-describedby="password-error"
                                className="input input-bordered w-full "
                            />
                            {getErrorMessage("password") ? (
                                <div
                                    className="pt-1 text-error"
                                    id="password-error"
                                >
                                    {getErrorMessage("password")}
                                </div>
                            ) : null}
                        </label>
                        <div className="form-control">
                            <label className="label justify-normal gap-4 cursor-pointer">
                                <span className="label-text">
                                    Zarejestruj jako firma
                                </span>
                                <input
                                    onChange={(e) =>
                                        setIsOrganization(e.target.checked)
                                    }
                                    type="checkbox"
                                    name="isOrganization"
                                    value="true"
                                    defaultChecked={
                                        isOrganizationParam === "true"
                                    }
                                    className="checkbox checkbox-primary"
                                />
                            </label>
                        </div>
                        {isOrganization ? (
                            <>
                                <label
                                    htmlFor="organizationName"
                                    className="form-control w-full "
                                >
                                    <div className="label">
                                        <span className="label-text">
                                            Nazwa firmy
                                        </span>
                                    </div>
                                    <input
                                        id="organizationName"
                                        name="organizationName"
                                        type="text"
                                        aria-invalid={
                                            getErrorMessage("organizationName")
                                                ? true
                                                : undefined
                                        }
                                        aria-describedby="organizationName-error"
                                        className="input input-bordered w-full "
                                    />
                                    {getErrorMessage("organizationName") ? (
                                        <div
                                            className="pt-1 text-error"
                                            id="organizationName-error"
                                        >
                                            {getErrorMessage(
                                                "organizationName"
                                            )}
                                        </div>
                                    ) : null}
                                </label>
                                <label
                                    htmlFor="nip"
                                    className="form-control w-full "
                                >
                                    <div className="label">
                                        <span className="label-text">NIP</span>
                                    </div>
                                    <input
                                        id="nip"
                                        name="nip"
                                        placeholder="123-45-67-890"
                                        type="text"
                                        aria-invalid={
                                            getErrorMessage("organizationName")
                                                ? true
                                                : undefined
                                        }
                                        aria-describedby="nip-error"
                                        className="input input-bordered w-full "
                                    />
                                    {getErrorMessage("organizationNip") ? (
                                        <div
                                            className="pt-1 text-error"
                                            id="nip-error"
                                        >
                                            {getErrorMessage("organizationNip")}
                                        </div>
                                    ) : null}
                                </label>

                                <label
                                    htmlFor="organizationFullAdress"
                                    className="form-control w-full "
                                >
                                    <div className="label">
                                        <span className="label-text">
                                            Pełny adres
                                        </span>
                                    </div>
                                    <input
                                        id="organizationFullAdress"
                                        name="organizationFullAdress"
                                        placeholder="Np. Kolorowa 12a/4"
                                        type="text"
                                        aria-invalid={
                                            getErrorMessage(
                                                "organizationFullAdress"
                                            )
                                                ? true
                                                : undefined
                                        }
                                        aria-describedby="organizationFullAdress-error"
                                        className="input input-bordered w-full "
                                    />

                                    {getErrorMessage(
                                        "organizationFullAdress"
                                    ) ? (
                                        <div
                                            className="pt-1 text-error"
                                            id="organizationFullAdress-error"
                                        >
                                            {getErrorMessage(
                                                "organizationFullAdress"
                                            )}
                                        </div>
                                    ) : null}
                                </label>
                                <label
                                    htmlFor="organizationPostalCode"
                                    className="form-control w-full "
                                >
                                    <div className="label">
                                        <span className="label-text">
                                            Kod pocztowy
                                        </span>
                                    </div>
                                    <input
                                        id="organizationPostalCode"
                                        name="organizationPostalCode"
                                        type="text"
                                        placeholder="12-345"
                                        aria-invalid={
                                            getErrorMessage(
                                                "organizationPostalCode"
                                            )
                                                ? true
                                                : undefined
                                        }
                                        aria-describedby="organizationPostalCode-error"
                                        className="input input-bordered w-full "
                                    />
                                    {getErrorMessage(
                                        "organizationPostalCode"
                                    ) ? (
                                        <div
                                            className="pt-1 text-error"
                                            id="organizationPostalCode-error"
                                        >
                                            {getErrorMessage(
                                                "organizationPostalCode"
                                            )}
                                        </div>
                                    ) : null}
                                </label>
                                <label
                                    htmlFor="organizationCity"
                                    className="form-control w-full "
                                >
                                    <div className="label">
                                        <span className="label-text">
                                            Miasto firmy
                                        </span>
                                    </div>
                                    <input
                                        placeholder="Szczecin"
                                        id="organizationCity"
                                        name="organizationCity"
                                        type="text"
                                        aria-invalid={
                                            getErrorMessage("organizationCity")
                                                ? true
                                                : undefined
                                        }
                                        aria-describedby="organizationCity-error"
                                        className="input input-bordered w-full "
                                    />
                                    {getErrorMessage("organizationCity") ? (
                                        <div
                                            className="pt-1 text-error"
                                            id="organizationCity-error"
                                        >
                                            {getErrorMessage(
                                                "organizationCity"
                                            )}
                                        </div>
                                    ) : null}
                                </label>
                            </>
                        ) : null}

                        <input
                            type="hidden"
                            name="redirectTo"
                            value={redirectTo}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary text-lg font-bold w-full"
                        >
                            Potwierdź
                        </button>
                        <div className="flex items-center justify-center">
                            <div className="text-center text-sm text-gray-500">
                                Masz już konto?{" "}
                                <Link
                                    className="link link-primary"
                                    to={{
                                        pathname: "/login",
                                        search: searchParams.toString(),
                                    }}
                                >
                                    Zaloguj się
                                </Link>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}
