import { Link } from "@remix-run/react";
import React from "react";

export default function MobileDrawer({
    children,
}: {
    children: React.ReactNode;
}) {
    const drawerCheckboxRef = React.useRef<HTMLInputElement>(null);
    const handleDrawerClose = () => {
        drawerCheckboxRef.current?.click();
    };
    return (
        <div className="drawer z-50">
            <input
                ref={drawerCheckboxRef}
                id="app-header-drawer"
                type="checkbox"
                className="drawer-toggle"
            />

            <div className="drawer-content z-50">{children}</div>

            <div className="drawer-side z-50">
                <label
                    htmlFor="app-header-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                ></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-200 text-2xl font-bold text-base-content">
                    {/* Sidebar content here */}
                    <li>
                        <Link onClick={handleDrawerClose} to="/events">
                            Wydarzenia
                        </Link>
                    </li>
                    <li>
                        <Link onClick={handleDrawerClose} to="/job-fair">
                            Targ Pracy
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
