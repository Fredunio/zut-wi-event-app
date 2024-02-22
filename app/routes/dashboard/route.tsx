import { MetaFunction } from "@remix-run/node";
import { NavLink, Outlet, useLocation, useNavigate } from "@remix-run/react";
import {
    Bookmark,
    Briefcase,
    CalendarDays,
    Home,
    Settings,
    ShieldHalf,
    SquareUser,
    Ticket,
} from "lucide-react";
import { useEffect } from "react";
import { useUser } from "~/utils";

const sideNavLinks = [
    {
        name: "Pulpit",
        href: "home",
        icon: <Home strokeWidth={1.5} />,
    },
    {
        name: "Wydarzenia",
        href: "events",
        icon: <CalendarDays strokeWidth={1.5} />,
    },

    { name: "Bilety", href: "tickets", icon: <Ticket strokeWidth={1.5} /> },
    {
        name: "Zapisane",
        href: "bookmarks",
        icon: <Bookmark strokeWidth={1.5} />,
    },
    { name: "Profil", href: "profile", icon: <SquareUser strokeWidth={1.5} /> },
    // {
    //     name: "Ustawienia",
    //     href: "settings",
    //     icon: <Settings strokeWidth={1.5} />,
    // },
];

const adminLink = {
    name: "Administracja",
    href: "admin",
    icon: <ShieldHalf strokeWidth={1.5} />,
};

const organizationLink = {
    name: "Firma",
    href: "organization",
    icon: <Briefcase strokeWidth={1.5} />,
};

export const meta: MetaFunction = () => [{ title: "Pulpit" }];

export default function DashboardPage() {
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location.pathname);

    useEffect(() => {
        if (location.pathname === "/dashboard") {
            console.log("redirecting");
            navigate("/dashboard/home", { replace: true });
        }
    }, [location.pathname, navigate]);

    return (
        <div className="dashboard-layout">
            <SideNav />
            <main className="dashboard-main-content px-40 py-12 w-full">
                <Outlet />
            </main>
        </div>
    );
}

function SideNav() {
    const user = useUser();

    return (
        <aside className="dashboard-sidebar border-r-1 border-primary/20">
            <nav className="flex flex-col items-center justify-around gap-4">
                {sideNavLinks.map((sideLink) => (
                    <SideNavLink
                        key={sideLink.href}
                        href={`/dashboard/${sideLink.href}`}
                        name={sideLink.name}
                        icon={sideLink.icon}
                    />
                ))}
                {user?.roleName === "admin" && (
                    <SideNavLink
                        key={adminLink.href}
                        href={adminLink.href}
                        name={adminLink.name}
                        icon={adminLink.icon}
                    />
                )}
                {user.isOrganization && (
                    <SideNavLink
                        key={organizationLink.href}
                        href={organizationLink.href}
                        name={organizationLink.name}
                        icon={organizationLink.icon}
                    />
                )}
            </nav>
        </aside>
    );
}

function SideNavLink({
    href,
    name,
    icon,
    className,
}: {
    href: string;
    name: string;
    icon: JSX.Element;
    className?: string;
}) {
    return (
        <div
            key={href}
            className={`tooltip tooltip-right w-full flex items-center justify-center ${className}`}
            data-tip={name}
        >
            <NavLink
                className={({ isActive, isPending }) => {
                    // return 'btn btn-square  btn-ghost btn-primary';
                    const baseClasses = "btn btn-square";
                    // if (isPending) {
                    //     return `${baseClasses} loading`;
                    // }
                    if (isActive || isPending) {
                        return `${baseClasses} btn-primary`;
                    }
                    return `${baseClasses} btn-ghost`;
                }}
                key={href}
                to={href}
                // className="btn btn-square btn-primary"
            >
                {icon}
                {/* {button.name} */}
            </NavLink>
        </div>
    );
}
