import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { Ban, Check, Edit, X } from "lucide-react";
import React from "react";
import invariant from "tiny-invariant";
import { requestStatus } from "~/app-types";
import EventCard from "~/components/cards/EventCard";
import {
    getEventApplicationRequests,
    getUserSavedEvents,
} from "~/models/event.server";
import { getBoothRequests } from "~/models/jobFair.server";
import { getUserId } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const boothRequests = await getBoothRequests();

    return json({ boothRequests });
}

export default function DashboardAdminBoothRequests() {
    const { boothRequests } = useLoaderData<typeof loader>();

    const fetcherApprove = useFetcher({
        key: `approve-${boothRequests.length}`,
    });
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
                        <th aria-label="Lp."></th>
                        <th>Stanowisko</th>
                        <th>Firma</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Akcje</th>
                        <th aria-label="Akcje"></th>
                    </tr>
                </thead>
                <tbody>
                    {boothRequests
                        .sort(
                            (a, b) =>
                                new Date(b.createdAt).getTime() -
                                new Date(a.createdAt).getTime()
                        )
                        .map((boothReq, i) => {
                            return (
                                <tr
                                    key={
                                        boothReq.id +
                                        boothReq.userId +
                                        boothReq.jobFairId
                                    }
                                >
                                    <th>{i + 1}</th>
                                    <td>
                                        <p className="link text-lg">
                                            {boothReq.booth.name}
                                        </p>
                                    </td>
                                    <td>{boothReq.user.organization?.name}</td>
                                    <td>{boothReq.user.organization?.email}</td>
                                    <td>{boothReq.status}</td>
                                    <td className="flex items-center gap-2">
                                        {/* <fetcherReject.Form
                                        key={`reject-${boothReq.id}`}
                                        aria-disabled={isLoadingReject}
                                        method="post"
                                        action={`/dashboard/admin/booth-request/change-status`}
                                    >
                                        <input
                                            type="hidden"
                                            name="newStatus"
                                            value={requestStatus["rejected"]}
                                        />
                                        <input
                                            type="hidden"
                                            name="boothRequestId"
                                            value={boothReq.id}
                                        />
                                        <button
                                            disabled={isLoadingReject}
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
                                        key={boothReq.id}
                                        aria-disabled={isLoadingApprove}
                                        method="post"
                                        action={`/dashboard/admin/booth-request/change-status`}
                                    >
                                        <input
                                            type="hidden"
                                            name="newStatus"
                                            value={requestStatus["approved"]}
                                        />
                                        <input
                                            type="hidden"
                                            name="boothRequestId"
                                            value={boothReq.id}
                                        />
                                        <button
                                            disabled={isLoadingApprove}
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
                                    </fetcherApprove.Form> */}
                                        <RejectForm boothReqId={boothReq.id} />
                                        <ApproveForm boothReqId={boothReq.id} />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
}

function RejectForm({ boothReqId }: { boothReqId: string }) {
    const fetcherReject = useFetcher({ key: `reject-${boothReqId}` });
    const isLoadingReject =
        fetcherReject.state === "loading" ||
        fetcherReject.state === "submitting";

    return (
        <fetcherReject.Form
            key={`reject-${boothReqId}`}
            aria-disabled={isLoadingReject}
            method="post"
            action={`/dashboard/admin/booth-request/change-status`}
        >
            <input
                type="hidden"
                name="newStatus"
                value={requestStatus["rejected"]}
            />
            <input type="hidden" name="boothRequestId" value={boothReqId} />
            <button
                disabled={isLoadingReject}
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

function ApproveForm({ boothReqId }: { boothReqId: string }) {
    const fetcherApprove = useFetcher({ key: `approve-${boothReqId}` });
    const isLoadingApprove =
        fetcherApprove.state === "loading" ||
        fetcherApprove.state === "submitting";

    return (
        <fetcherApprove.Form
            key={boothReqId}
            aria-disabled={isLoadingApprove}
            method="post"
            action={`/dashboard/admin/booth-request/change-status`}
        >
            <input
                type="hidden"
                name="newStatus"
                value={requestStatus["approved"]}
            />
            <input type="hidden" name="boothRequestId" value={boothReqId} />
            <button
                disabled={isLoadingApprove}
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
