import {
    Outlet,
    useLoaderData,
    useLocation,
    useNavigate,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getEventCategories } from "~/models/event.server";
import { parseDatabaseName, useOptionalUser } from "~/utils";

export async function loader() {
    const eventCategories = await getEventCategories();
    return json({ eventCategories });
}

function NavLinkButton({
    to,
    children,
}: {
    to: string;
    children: React.ReactNode;
}) {
    return (
        <NavLink
            to={to}
            className={({ isActive, isPending }) => {
                const baseClasses = "btn btn-sm text-lg";
                // if (isPending) {
                //     return `${baseClasses} loading`;
                // }
                if (isActive || isPending) {
                    return `${baseClasses} btn-primary`;
                }
                return baseClasses;
            }}
        >
            {children}
        </NavLink>
    );
}

export default function Events() {
    const { eventCategories } = useLoaderData<typeof loader>();

    const location = useLocation();
    const navigate = useNavigate();
    console.log(location.pathname);

    useEffect(() => {
        if (location.pathname === "/events") {
            console.log("redirecting");
            navigate("/events/all");
        }
    }, [location.pathname, navigate]);

    return (
        <div className="container py-20 px-10">
            <h1 className="dashboard-section-headding">Wydarzenia</h1>
            <div role="tablist" className="flex items-center gap-4 mb-10">
                <NavLinkButton to={`/events/all`} key={"all"}>
                    Wszystkie
                </NavLinkButton>
                {eventCategories.map((category) => (
                    <NavLinkButton
                        to={`/events/${category.name}`}
                        key={category.name}
                    >
                        {parseDatabaseName(category.pluralName)}
                    </NavLinkButton>
                ))}
                {/* <NavLink
                    to="/events/all"
                    role="tab"
                    className={({ isActive, isPending }) => {
                        const baseClasses = "btn btn-sm text-lg";
                        if (isPending) {
                            return `${baseClasses} loading`;
                        }
                        if (isActive) {
                            return `${baseClasses} btn-primary`;
                        }
                        return baseClasses;
                    }}
                >
                    Wszystkie
                </NavLink>
                <NavLink
                    to="/events/conferences"
                    role="tab"
                    className={({ isActive, isPending }) => {
                        const baseClasses = "btn btn-sm text-lg";
                        if (isPending) {
                            return `${baseClasses} loading`;
                        }
                        if (isActive) {
                            return `${baseClasses} btn-primary`;
                        }
                        return baseClasses;
                    }}
                >
                    Konferencje
                </NavLink>
                <NavLink
                    to="/events/training"
                    role="tab"
                    className={({ isActive, isPending }) => {
                        const baseClasses = "btn btn-sm text-lg";
                        if (isPending) {
                            return `${baseClasses} loading`;
                        }
                        if (isActive) {
                            return `${baseClasses} btn-primary`;
                        }
                        return baseClasses;
                    }}
                >
                    Szkolenia
                </NavLink>
                <NavLink
                    to="/events/workshops"
                    role="tab"
                    className={({ isActive, isPending }) => {
                        const baseClasses = "btn btn-sm text-lg";
                        if (isPending) {
                            return `${baseClasses} loading`;
                        }
                        if (isActive) {
                            return `${baseClasses} btn-primary`;
                        }
                        return baseClasses;
                    }}
                >
                    Warsztaty
                </NavLink> */}
            </div>
            <Outlet />
        </div>
    );
}
