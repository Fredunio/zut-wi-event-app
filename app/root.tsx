import toast, { Toaster } from "react-hot-toast";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
    Link,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from "@remix-run/react";

import { commitSession, getSession, getUser } from "~/session.server";
import stylesheet from "~/styles/globals.css";

import AppHeader from "./components/layout/AppHeader";
import { ThemeProvider } from "./providers/ThemeProvider";
import { useSWEffect, LiveReload } from "@remix-pwa/sw";
import { useEffect } from "react";
import MobileDrawer from "./components/layout/MobileDrawer";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: stylesheet },
    // ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request);
    const toastMessage = session.get("toastMessage") || null;

    return json(
        { user: await getUser(request), toastMessage },
        {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        }
    );

    // return json({ user: await getUser(request) });
};

export default function App() {
    const { toastMessage } = useLoaderData<typeof loader>();
    useEffect(() => {
        console.log("toastMessage", toastMessage);
        if (!toastMessage) {
            return;
        }
        toast(toastMessage);
    }, [toastMessage]);

    useSWEffect();
    return (
        <html lang="en" className="h-full">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <ThemeProvider>
                <body className="min-h-full bg-base-100">
                    <Toaster />
                    <MobileDrawer>
                        <AppHeader />
                        <Outlet />
                    </MobileDrawer>

                    {/* IMPORTANT: Outlet has some minimal height, so full-height class doenst work properly */}
                    {/* TODO: try to find a fix */}

                    <ScrollRestoration />
                    <Scripts />
                    <LiveReload />
                </body>
            </ThemeProvider>
        </html>
    );
}
