import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    json,
    redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { TActionReturnData } from "~/app-types";
import DashboardBoothRequestCard from "~/components/cards/DashboardBoothRequestCard";
import OrganizationDataForm from "~/components/forms/OrganizationDataForm";
import { getUserDashboardBoothRequests } from "~/models/event.server";
import {
    organizationFormSchema,
    updateOrganizationData,
} from "~/models/user.server";
import {
    commitSession,
    getSession,
    getUser,
    setToastMessage,
} from "~/session.server";
import { isOrganization } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await getUser(request);
    if (!isOrganization(user)) {
        return redirect("/dashboard/home");
    }
    invariant(user, "user not found");
    return json({ user });
}

export async function action({ request }: ActionFunctionArgs) {
    const user = await getUser(request);
    const session = await getSession(request);
    if (!isOrganization(user)) {
        return redirect("/dashboard/home");
    }
    invariant(user, "user not found");

    const formData = await request.formData();
    let values = Object.fromEntries(formData);

    const schemaParsed = organizationFormSchema.safeParse(values);
    if (!schemaParsed.success) {
        console.log("schemaParsed.error", schemaParsed.error);
        return json({ error: schemaParsed.error }, { status: 400 });
    }

    await updateOrganizationData({ ...schemaParsed.data });

    setToastMessage(session, "Dane zostały zaktualizowane");
    return redirect("/dashboard/organization/data", {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}

export default function DashboardBoothRequests() {
    const { user } = useLoaderData<typeof loader>();

    return (
        <div className="flex flex-col">
            <OrganizationDataForm user={user} />
        </div>
    );
}
