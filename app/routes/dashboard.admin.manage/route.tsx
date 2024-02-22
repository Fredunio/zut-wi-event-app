import { NavLink, Outlet, useLocation, useNavigate } from "@remix-run/react";
import { useEffect } from "react";

const adminManageNavLinks = [
    {
        name: "Aplikacje na wydarzenia",
        href: "event-applications",
    },
    {
        name: "Aplikacje na stanowiska",
        href: "booth-applications",
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

export default function DashboardAdminManage() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === "/dashboard/admin/manage") {
            navigate(`/dashboard/admin/manage/${adminManageNavLinks[0].href}`, {
                replace: true,
            });
        }
    }, [location.pathname, navigate]);

    return (
        <div className="overflow-x-auto -mt-8">
            <div role="tablist" className="tabs tabs-sm tabs-boxed flex ">
                {adminManageNavLinks.map((link) => (
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
            <Outlet />
        </div>
    );
}
