import { User } from "@prisma/client";
import { Form, Link, NavLink } from "@remix-run/react";
import {
    ArrowRight,
    Bell,
    Bookmark,
    Building2,
    CalendarFold,
    LogOut,
    Menu,
    Shield,
    SquareUser,
    Ticket,
} from "lucide-react";

import logo from "public/images/wi_logo.png";
import useTheme from "~/hooks/useTheme";
import { TAppUser } from "~/models/user.server";
import { getEventDefaultImage, useOptionalUser } from "~/utils";

export default function AppHeader() {
    const user = useOptionalUser();
    return (
        <header className="bg-base-300/80 backdrop-blur-lg h-[var(--header-height)] z-20 navbar items-center justify-between lg:px-4 pl-2 py-2 shadow border-b-1 border-primary sticky top-0">
            <div className="flex items-center gap-20">
                <div className="flex items-center ">
                    <HamburgerButton />
                    <h1 className="text-3xl ml-8 lg:ml-0 font-bold flex flex-nowrap whitespace-nowrap items-center gap-2">
                        <img src={logo} alt="Logo" className="h-10 w-auto" />
                        <Link to="/">WI Events</Link>
                    </h1>
                </div>
                <div className="lg:flex hidden items-center gap-4  ">
                    <NavLink
                        className={({ isActive, isPending }) => {
                            const baseClasses = "header-nav-link";

                            if (isActive) {
                                return `${baseClasses} header-nav-link-active`;
                            }
                            return baseClasses;
                        }}
                        to="/events/all"
                    >
                        Wydarzenia
                    </NavLink>
                    <NavLink
                        className={({ isActive, isPending }) => {
                            const baseClasses = "header-nav-link";
                            // if (isPending) {
                            //     return `${baseClasses} loading`;
                            // }
                            if (isActive) {
                                return `${baseClasses} header-nav-link-active`;
                            }
                            return baseClasses;
                        }}
                        to="/job-fair"
                    >
                        Targi Pracy
                    </NavLink>
                </div>
            </div>

            <ThemeToggle />

            <div className="flex items-center gap-8">
                <div className="flex items-center justify-center gap-2">
                    {user ? (
                        <>
                            <NotificationButton />
                            <BookmarkButton user={user} />
                        </>
                    ) : null}
                </div>
                {user ? <AvatarButton user={user} /> : <AuthButtons />}
            </div>
        </header>
    );
}

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="tooltip tooltip-bottom" data-tip="Zmiana motywu">
            <button className="btn btn-sm btn-square btn-ghost">
                <label className="swap swap-rotate ">
                    {/* this hidden checkbox controls the state */}
                    <input
                        type="checkbox"
                        className="swap-checkbox"
                        value={theme}
                        onChange={toggleTheme}
                    />
                    {/* sun icon */}
                    <svg
                        className="swap-off fill-current w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                    </svg>
                    {/* moon icon */}
                    <svg
                        className="swap-on fill-current w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                    </svg>
                </label>
            </button>
        </div>
    );
}

function AvatarButton({ user }: { user: TAppUser }) {
    if (!user) {
        return null;
    }

    return (
        <div className="dropdown dropdown-end ">
            <div
                tabIndex={0}
                role="button"
                className={`btn btn-circle lg:btn-block lg:rounded-md lg:px-2 lg:btn-ghost shadow lg:bg-base-200 lg:flex-nowrap`}
            >
                <span className="lg:flex hidden">{user.email}</span>
                <div className={` avatar ${user.avatar ? "" : "placeholder"}`}>
                    <div className="w-10 rounded-full bg-neutral text-neutral-content">
                        {user.avatar ? (
                            <img
                                alt="Avatar"
                                // src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                                src={user.avatar}
                            />
                        ) : (
                            <span className="text-lg">
                                {user.email[0].toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <ul
                tabIndex={0}
                className="menu gap-2 text-lg dropdown-content z-[1] p-2 shadow bg-base-300 rounded-box w-52 mt-4 pb-2 pt-4"
            >
                <li>
                    <Link
                        className="flex items-center w-full gap-4"
                        to={"dashboard/profile"}
                    >
                        <SquareUser />
                        <span>Profil</span>
                    </Link>
                </li>
                <li>
                    <Link
                        className="flex items-center w-full gap-4"
                        to={"dashboard/tickets"}
                    >
                        <Ticket />
                        <span>Bilety</span>
                    </Link>
                </li>
                <li>
                    <Link
                        className="flex items-center w-full gap-4"
                        to={"dashboard/events"}
                    >
                        <CalendarFold />
                        <span>Wydarzenia</span>
                    </Link>
                </li>
                {user.roleName === "admin" && (
                    <li>
                        <Link
                            className="flex items-center w-full gap-4"
                            to={"dashboard/admin"}
                        >
                            <Shield />
                            <span>Administracja</span>
                        </Link>
                    </li>
                )}
                {user.isOrganization && (
                    <li>
                        <Link
                            className="flex w-full items-center gap-4"
                            to={"dashboard/organization"}
                        >
                            <Building2 />
                            <span>Firma</span>
                        </Link>
                    </li>
                )}
                <li className="mt-4 font-bold w-full bg-primary rounded-lg">
                    <Form
                        className="w-full flex"
                        action="/logout"
                        method="post"
                    >
                        <button
                            className="flex  items-center justify-center text-center w-full"
                            type="submit"
                        >
                            <span className="text-primary-content text-center block font-semibold">
                                Wyloguj
                            </span>
                            {/* <LogOut className="text-primary-content" /> */}
                        </button>
                    </Form>
                </li>
            </ul>
        </div>
    );
}

function AuthButtons() {
    return (
        <div className="flex items-center gap-2">
            <Link to={"/login"} className="btn btn-ghost btn-sm rounded-btn">
                Login
            </Link>
            <Link
                to={"/register"}
                className="btn btn-primary btn-sm rounded-btn"
            >
                Rejestracja
            </Link>
        </div>
    );
}

function HamburgerButton() {
    return (
        <div className="flex-none lg:hidden">
            <label
                htmlFor="app-header-drawer"
                title="Menu"
                className="drawer-button btn btn-square btn-ghost"
            >
                <Menu size={28} />
            </label>
        </div>
    );
}

function BookmarkButton({ user }: { user: TAppUser }) {
    return (
        <div data-tip="Zapisane" className="dropdown dropdown-end">
            <button className="btn btn-square btn-sm btn-ghost ">
                <Bookmark />
            </button>
            <div className="dropdown-content z-[1] flex flex-col gap-2 p-2 shadow bg-base-200 rounded-box min-w-60">
                {user.bookmarkedEvents.map((event) => (
                    <Link
                        className="btn btn-ghost w-full  justify-normal pl-0 overflow-hidden"
                        key={event.eventId}
                        to={`/event/${event.eventId}`}
                    >
                        <img
                            src={event.event.image || getEventDefaultImage()}
                            alt={event.event.name}
                            className="h-full object-cover w-16"
                        />

                        <span>{event.event.name}</span>
                    </Link>
                ))}
                <Link
                    className="btn btn-primary w-full mt-4"
                    to={"/dashboard/bookmarks"}
                >
                    Wszystkie
                </Link>
            </div>
        </div>
    );
}

function NotificationButton() {
    return (
        <div className="tooltip tooltip-bottom" data-tip="Powiadomienia">
            <button className="btn btn-square btn-sm btn-ghost ">
                <Bell />
            </button>
        </div>
    );
}
