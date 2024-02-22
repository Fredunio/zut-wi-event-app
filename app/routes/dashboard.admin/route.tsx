import {
    NavLink,
    Outlet,
    redirect,
    useLocation,
    useNavigate,
} from "@remix-run/react";
import { useEffect } from "react";
import { getUser, redirectUnauthorized } from "~/session.server";

export async function loader({ request }: { request: Request }) {
    const user = await getUser(request);
    if (!user || user.roleName !== "admin") {
        redirectUnauthorized();
    }
    return true;
}

const adminNavLinks = [
    {
        name: "Wydarzenia ZUT",
        href: "events",
    },
    {
        name: "Targi Pracy",
        href: "job-fairs",
    },
    {
        name: "Użytkownicy",
        href: "users",
    },
    {
        name: "Zarządzaj",
        href: "manage",
    },
    {
        name: "Dane aplikacji",
        href: "app-data",
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

export default function DashboardAdmin() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === "/dashboard/admin") {
            navigate("/dashboard/admin/events", { replace: true });
        }
    }, [location.pathname, navigate]);

    return (
        <div>
            <h1 className="dashboard-section-headding">Panel Administratora</h1>
            <div role="tablist" className="tabs tabs-boxed">
                {adminNavLinks.map((link) => (
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
