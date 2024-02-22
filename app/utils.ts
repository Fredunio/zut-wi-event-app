import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import type { TAppUser } from "~/models/user.server";
import { TRequestStatus } from "./app-types";
import { ZodIssue } from "zod";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
    to: FormDataEntryValue | string | null | undefined,
    defaultRedirect: string = DEFAULT_REDIRECT
) {
    if (!to || typeof to !== "string") {
        return defaultRedirect;
    }

    if (!to.startsWith("/") || to.startsWith("//")) {
        return defaultRedirect;
    }

    return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
    id: string
): Record<string, unknown> | undefined {
    const matchingRoutes = useMatches();
    const route = useMemo(
        () => matchingRoutes.find((route) => route.id === id),
        [matchingRoutes, id]
    );
    return route?.data as Record<string, unknown>;
}

function isUser(user: unknown): user is TAppUser {
    return (
        user != null &&
        typeof user === "object" &&
        "email" in user &&
        typeof user.email === "string"
    );
}

export function isOrganization(user: unknown): user is TAppUser {
    return (
        user != null &&
        typeof user === "object" &&
        "organizationId" in user &&
        user.organizationId != null &&
        "isOrganization" in user &&
        user.isOrganization === true
    );
}

export function useOptionalUser(): TAppUser | undefined {
    const data = useMatchesData("root");
    if (!data || !isUser(data.user)) {
        return undefined;
    }
    return data.user;
}

export function useOptionalOrganizationUser(): TAppUser | undefined {
    const data = useMatchesData("root");
    if (!data || !isOrganization(data.user)) {
        return undefined;
    }
    return data.user;
}

export function useUser(): TAppUser {
    const maybeUser = useOptionalUser();
    if (!maybeUser) {
        throw new Error(
            "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
        );
    }
    return maybeUser;
}

export function useOrganizationUser(): TAppUser {
    const maybeUser = useOptionalOrganizationUser();
    if (!maybeUser) {
        throw new Error(
            "No organization user found in root loader, but organization user is required by useOrganizationUser. If organization user is optional, try useOptionalOrganizationUser instead."
        );
    }
    return maybeUser;
}

export function validateEmail(email: unknown): email is string {
    return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function getEventDefaultImage() {
    return "https://plus.unsplash.com/premium_photo-1679547202918-bf37285d3caf?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    // return "/images/default-event-image.jpg";
}

export function parseDatabaseName(text_from_db: string | undefined) {
    // split then replace underscores with spaces and each word with first letter capitalized

    if (!text_from_db) {
        return "";
    }

    return text_from_db
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function formatDate(date: Date | null | undefined) {
    if (!date) {
        return null;
    }
    return new Date(date).toLocaleDateString("pl-PL", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function dateToTime(date: Date | string | null | undefined) {
    if (!date) {
        return undefined;
    }
    return new Date(date).toLocaleTimeString("pl-PL", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function timeStringToDate(timeString: string) {
    const today = new Date();
    const [hours, minutes] = timeString.split(":").map(Number);
    today.setHours(hours);
    today.setMinutes(minutes);
    return today;
}

export function isRequestStatus(
    status: string | undefined
): status is TRequestStatus {
    return (
        status === "pending" || status === "approved" || status === "rejected"
    );
}

export function getZodIssueMessage(
    issueArray: ZodIssue[] | undefined,
    key: string
) {
    if (!issueArray) {
        return null;
    }

    const errorIndex = issueArray.findIndex((e) => {
        return e.path.includes(key);
    });
    if (errorIndex === -1) {
        return null;
    }

    return issueArray?.[errorIndex].message;
}
