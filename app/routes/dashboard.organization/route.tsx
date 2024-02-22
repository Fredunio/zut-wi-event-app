import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import {
    NavLink,
    Outlet,
    useLoaderData,
    useLocation,
    useNavigate,
} from "@remix-run/react";
import { useEffect } from "react";
import invariant from "tiny-invariant";
import DashboardBoothRequestCard from "~/components/cards/DashboardBoothRequestCard";
import {
    getUserDashboardBoothRequests,
    getUserDashboardEvents,
} from "~/models/event.server";
import { getUser } from "~/session.server";
import { isOrganization } from "~/utils";

const organizationLinks = [
    {
        name: "Aplikacje na stanowiska",
        href: "booth-requests",
    },
    {
        name: "Dane firmy",
        href: "data",
    },
];

function activeTabClass({
    isActive,
    isPending,
}: {
    isActive: boolean;
    isPending: boolean;
}) {
    const baseClasses = "tab";
    if (isPending || isActive) {
        return `${baseClasses} tab-active`;
    }
    return `${baseClasses}`;
}

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await getUser(request);
    if (!isOrganization(user)) {
        return redirect("/dashboard/home");
    }
    invariant(user, "user not found");
    const boothRequests = await getUserDashboardBoothRequests(user.id);
    return json({ boothRequests });
}

export default function DashboardEvents() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === "/dashboard/organization") {
            navigate("/dashboard/organization/booth-requests", {
                replace: true,
            });
        }
    }, [location.pathname, navigate]);
    return (
        <div>
            <h1 className="dashboard-section-headding">Firma</h1>
            <div role="tablist" className="tabs tabs-boxed">
                {organizationLinks.map((link) => (
                    <NavLink
                        to={link.href}
                        role="tab"
                        className={activeTabClass}
                        key={link.href}
                    >
                        {link.name}
                    </NavLink>
                ))}
            </div>
            <div className="mt-10 overflow-y-visible">
                <Outlet />
            </div>
        </div>
    );
}
