import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import DashboardBoothRequestCard from "~/components/cards/DashboardBoothRequestCard";
import { getUserDashboardBoothRequests } from "~/models/event.server";
import { getUser } from "~/session.server";
import { isOrganization } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await getUser(request);
    if (!isOrganization(user)) {
        return redirect("/dashboard/home");
    }
    invariant(user, "user not found");
    const boothRequests = await getUserDashboardBoothRequests(user.id);
    console.log("boothRequests", boothRequests);
    return json({ boothRequests });
}

export default function DashboardBoothRequests() {
    const { boothRequests } = useLoaderData<typeof loader>();
    console.log("boothRequests", boothRequests);

    return (
        <div className="flex flex-col gap-8">
            {boothRequests
                .sort((a, b) => Number(a.updatedAt) - Number(b.updatedAt))
                .map((boothReq) => (
                    <DashboardBoothRequestCard
                        key={boothReq.id}
                        boothRequest={boothReq}
                    />
                ))}
        </div>
    );
}
