import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { Ban, Check, Edit, X } from "lucide-react";
import React from "react";
import invariant from "tiny-invariant";
import EventCard from "~/components/cards/EventCard";
import {
    getEventApplicationRequests,
    getUserSavedEvents,
} from "~/models/event.server";
import { getUserId } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const eventApplicationRequests = await getEventApplicationRequests();

    return json({ eventApplicationRequests });
}

export default function DashboardAdminEventApplications() {
    const { eventApplicationRequests } = useLoaderData<typeof loader>();

    // TODO: extract to a component, and ad {key:} so the state is different for each row
    const fetcherApprove = useFetcher();
    const fetcherReject = useFetcher();

    const isLoadingApprove =
        fetcherApprove.state === "loading" ||
        fetcherApprove.state === "submitting";
    const isLoadingReject =
        fetcherReject.state === "loading" ||
        fetcherReject.state === "submitting";

    return (
        <div className="overflow-x-auto mt-12">
            <table className="table table-zebra">
                {/* head */}
                <thead>
                    <tr>
                        <th></th>
                        <th>Wydarzenie</th>
                        <th>Użytkownik</th>
                        <th>Student</th>
                        <th>Status</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {eventApplicationRequests.map((ev, i) => {
                        return (
                            <React.Fragment key={i}>
                                {ev.userApplicationRequests.map(
                                    (application, j) => {
                                        return (
                                            <tr
                                                key={
                                                    application.event.id +
                                                    application.user.id
                                                }
                                            >
                                                <th>{j + 1}</th>
                                                <td>
                                                    <Link
                                                        to={`/dashboard/edit-event/${ev.id}`}
                                                        className="link text-lg"
                                                    >
                                                        {application.event.name}
                                                    </Link>
                                                </td>
                                                <td>
                                                    {application.user.email}
                                                </td>
                                                <td>
                                                    {application.user
                                                        .isStudent ? (
                                                        <Check />
                                                    ) : (
                                                        ""
                                                    )}
                                                </td>
                                                <td>{application.status}</td>
                                                <td className="flex items-center gap-2">
                                                    {/* <fetcherReject.Form
                                                        aria-disabled={
                                                            isLoadingReject
                                                        }
                                                        method="post"
                                                        action={`/dashboard/admin/event-applications/reject?eventId=${application.event.id}&userId=${application.user.id}`}
                                                    >
                                                        <button
                                                            disabled={
                                                                isLoadingReject
                                                            }
                                                            title="Odrzuć"
                                                            type="submit"
                                                            className={`btn btn-sm btn-outline btn-square btn-error ${
                                                                isLoadingReject
                                                                    ? "loading loading-spinner"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </fetcherReject.Form>
                                                    <fetcherApprove.Form
                                                        aria-disabled={
                                                            isLoadingApprove
                                                        }
                                                        method="post"
                                                        action={`/dashboard/admin/event-applications/approve?eventId=${application.event.id}&userId=${application.user.id}`}
                                                    >
                                                        <button
                                                            disabled={
                                                                isLoadingApprove
                                                            }
                                                            title="Akceptuj"
                                                            type="submit"
                                                            className={`btn btn-sm btn-outline btn-square btn-success ${
                                                                isLoadingApprove
                                                                    ? "loading loading-spinner"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                    </fetcherApprove.Form>  */}
                                                    <RejectForm
                                                        eventId={
                                                            application.event.id
                                                        }
                                                        userId={
                                                            application.user.id
                                                        }
                                                    />
                                                    <ApproveForm
                                                        eventId={
                                                            application.event.id
                                                        }
                                                        userId={
                                                            application.user.id
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function RejectForm({ eventId, userId }: { eventId: string; userId: string }) {
    const fetcherReject = useFetcher({ key: `reject-${eventId}-${userId}` });

    const isLoadingReject =
        fetcherReject.state === "loading" ||
        fetcherReject.state === "submitting";
    return (
        <fetcherReject.Form
            aria-disabled={isLoadingReject}
            method="post"
            action={`/dashboard/admin/event-applications/reject?eventId=${eventId}&userId=${userId}`}
        >
            <button
                title="Odrzuć"
                type="submit"
                className={`btn btn-sm btn-outline btn-square btn-error ${
                    isLoadingReject ? "loading loading-spinner" : ""
                }`}
            >
                <X size={14} />
            </button>
        </fetcherReject.Form>
    );
}

function ApproveForm({ eventId, userId }: { eventId: string; userId: string }) {
    const fetcherApprove = useFetcher({ key: `approve-${eventId}-${userId}` });

    const isLoadingApprove =
        fetcherApprove.state === "loading" ||
        fetcherApprove.state === "submitting";
    return (
        <fetcherApprove.Form
            aria-disabled={isLoadingApprove}
            method="post"
            action={`/dashboard/admin/event-applications/approve?eventId=${eventId}&userId=${userId}`}
        >
            <button
                title="Akceptuj"
                type="submit"
                className={`btn btn-sm btn-outline btn-square btn-success ${
                    isLoadingApprove ? "loading loading-spinner" : ""
                }`}
            >
                <Check size={14} />
            </button>
        </fetcherApprove.Form>
    );
}
