import type {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useCallback, useEffect, useRef } from "react";

import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { getZodIssueMessage, safeRedirect, validateEmail } from "~/utils";
import z, { ZodIssue } from "zod";

export const loginSchema = z.object({
    email: z.string({ required_error: "Email jest wymagany" }).email({
        message: "Wpisz poprawny adres email",
    }),
    password: z
        .string({ required_error: "Hasło jest wymagane" })
        .min(8, "Hasło musi mieć co najmniej 8 znaków"),
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const userId = await getUserId(request);
    if (userId) return redirect("/");
    return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
    const remember = formData.get("remember");

    const schemaParsed = loginSchema.safeParse({
        email: email,
        password: password,
    });

    if (!schemaParsed.success) {
        return json(
            { errors: schemaParsed.error.issues as ZodIssue[] },
            {
                status: 400,
            }
        );
    }

    const user = await verifyLogin(
        schemaParsed.data.email,
        schemaParsed.data.password
    );

    if (!user) {
        const loginError = new z.ZodError([
            {
                code: "invalid_literal",
                expected: "email",
                received: "password",
                message: "Niepoprawny email lub hasło",
                path: ["email"],
            },
        ]);
        return json(
            {
                errors: loginError.issues as ZodIssue[],
            },
            { status: 400 }
        );
    }

    return createUserSession({
        redirectTo,
        remember: remember === "on" ? true : false,
        request,
        userId: user.id,
    });
};

export const meta: MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/dashboard";
    const actionData = useActionData<typeof action>();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const errorsArray = actionData?.errors as ZodIssue[] | undefined;
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
        <div className="flex flex-col items-center justify-center full-height">
            <div className="flex w-auto flex-col shadow-xl border-1 bg-base-200 border-primary/30 py-12 rounded-md px-8">
                <h1 className="text-center text-4xl mb-10 font-bold tracking-tight">
                    <span className="block text-primary drop-shadow-md">
                        Login
                    </span>
                </h1>
                <div className="mx-auto w-full max-w-md px-8 ">
                    <Form method="post" className="space-y-6 ">
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
                                autoComplete="current-password"
                                aria-invalid={
                                    getErrorMessage("password")
                                        ? true
                                        : undefined
                                }
                                aria-describedby="password-error"
                                className="input input-bordered w-full min-w-80"
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
                        <input
                            type="hidden"
                            name="redirectTo"
                            value={redirectTo}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary text-lg font-bold w-full"
                        >
                            Zaloguj się
                        </button>
                        <div className="flex items-center justify-between">
                            <div className="form-control">
                                <label className="label cursor-pointer  gap-2">
                                    <input
                                        value="on"
                                        type="checkbox"
                                        name="remember"
                                        className="checkbox checkbox-sm"
                                    />
                                    <span className="label-text">
                                        Zapamiętaj mnie
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="text-center text-sm">
                            Nie masz konta?{" "}
                            <Link
                                className="link link-primary"
                                to={{
                                    pathname: "/register",
                                    search: searchParams.toString(),
                                }}
                            >
                                Zarejestruj się
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}
