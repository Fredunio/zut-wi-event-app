import { useLoaderData } from "@remix-run/react";
import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    MetaFunction,
    json,
    redirect,
} from "@remix-run/node";
import {
    commitSession,
    getSession,
    requireAdmin,
    setToastMessage,
} from "~/session.server";
import { Editor } from "@tinymce/tinymce-react";
import { Plus, X } from "lucide-react";
import { createJobFair, jobFairFormSchema } from "~/models/jobFair.server";
import JobFairForm from "~/components/forms/JobFairForm";
import { ZodIssue } from "zod";

export const meta: MetaFunction = () => [{ title: "Dodaj Targ Pracy" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const admin = await requireAdmin(request);
    return json({
        TINY_API_KEY: process.env.TINY_API_KEY,
    });
};

export async function action({ request }: ActionFunctionArgs) {
    const admin = await requireAdmin(request);
    const session = await getSession(request);

    const formData = await request.formData();
    let values = Object.fromEntries(formData);

    console.log("form data values", values);

    const schemaParsed = jobFairFormSchema.safeParse(values);
    if (!schemaParsed.success) {
        console.log("schemaParsed.error", schemaParsed.error);
        return json(
            { errors: schemaParsed.error.issues as ZodIssue[] },
            { status: 400 }
        );
    }

    await createJobFair({ ...schemaParsed.data });
    setToastMessage(session, "Targ pracy został dodany");
    return redirect("/dashboard/admin/job-fairs", {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}

export type TJobFairAction = typeof action;

export default function DashboardAdminAddEvent() {
    const { TINY_API_KEY } = useLoaderData<typeof loader>();

    return (
        <main className="container flex items-center justify-center flex-col">
            <h1 className="text-4xl font-bold mb-16">Dodaj Targ Pracy</h1>
            <JobFairForm TINY_API_KEY={TINY_API_KEY} />
        </main>
    );
}
