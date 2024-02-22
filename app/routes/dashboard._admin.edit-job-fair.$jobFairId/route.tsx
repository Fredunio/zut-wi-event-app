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
import {
    createJobFair,
    editJobFair,
    getAdminJobFair,
    jobFairFormSchema,
} from "~/models/jobFair.server";
import JobFairForm from "~/components/forms/JobFairForm";
import invariant from "tiny-invariant";

export const meta: MetaFunction = () => [{ title: "Edytuj Targ Pracy" }];

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const admin = await requireAdmin(request);
    const jobFairId = params.jobFairId;
    invariant(jobFairId, "jobFairId not found");

    const jobFair = await getAdminJobFair(jobFairId);
    return json({
        jobFair,
        TINY_API_KEY: process.env.TINY_API_KEY,
    });
};

export async function action({ request, params }: ActionFunctionArgs) {
    const admin = await requireAdmin(request);
    const session = await getSession(request);

    const jobFairId = params.jobFairId;
    invariant(jobFairId, "jobFairId not found");

    const formData = await request.formData();
    let values = Object.fromEntries(formData);

    console.log("form data values", values);

    const schemaParsed = jobFairFormSchema.safeParse(values);
    if (!schemaParsed.success) {
        console.log("schemaParsed.error", schemaParsed.error);
        return json({ error: schemaParsed.error }, { status: 400 });
    }

    await editJobFair(jobFairId, { ...schemaParsed.data });
    setToastMessage(session, "Targ pracy został zaktualizowany");
    return redirect("/dashboard/admin/job-fairs", {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}

export type TJobFairAction = typeof action;

export default function DashboardAdminAddEvent() {
    const { jobFair, TINY_API_KEY } = useLoaderData<typeof loader>();

    return (
        <main className="container flex items-center justify-center flex-col">
            <h1 className="text-4xl font-bold mb-16">Edytuj Targ Pracy</h1>
            <JobFairForm
                editMode={true}
                jobFair={jobFair}
                TINY_API_KEY={TINY_API_KEY}
            />
        </main>
    );
}
