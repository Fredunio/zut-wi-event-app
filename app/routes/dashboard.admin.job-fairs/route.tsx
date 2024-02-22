import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Plus } from "lucide-react";
import DashboardAdminJobFairCard from "~/components/cards/DashboardAdminJobFairCard";
import { getAdminJobFairs } from "~/models/jobFair.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const jobFairs = await getAdminJobFairs();
    return json({ jobFairs });
}

export default function DashboardAdminJobFairs() {
    const { jobFairs } = useLoaderData<typeof loader>();

    return (
        <div>
            <div className="flex w-full">
                <Link
                    to="/dashboard/add-job-fair"
                    type="button"
                    className="btn btn-secondary ml-auto  text-lg font-semibold"
                >
                    Stwórz
                    <Plus size={20} />
                </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 mt-8">
                {jobFairs.map((jobFair) => (
                    <DashboardAdminJobFairCard
                        jobFair={jobFair}
                        key={jobFair.id}
                    />
                ))}
            </div>
        </div>
    );
}
