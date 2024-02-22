import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { TActionReturnData, TRequestStatus } from "~/app-types";
import { applicationsStatusMessages } from "~/lib/app-data";

export function EventSubmitForm({
    eventId,
    loggedInUserId,
    needRegistration,
    joined,
    applied,
    status,
}: {
    eventId: string;
    loggedInUserId?: string;
    needRegistration?: boolean;
    joined?: boolean;
    applied?: boolean;
    status?: TRequestStatus;
}) {
    const fetcherJoin = useFetcher<TActionReturnData>({
        key: `event-join-${eventId}`,
    });
    const fetcherApply = useFetcher<TActionReturnData>({
        key: `event-apply-${eventId}`,
    });
    const fetcherLeave = useFetcher<TActionReturnData>({
        key: `event-leave-${eventId}`,
    });
    const fetcherCancel = useFetcher<TActionReturnData>({
        key: `event-cancel-${eventId}`,
    });

    const loading =
        fetcherJoin.state === "loading" ||
        fetcherApply.state === "loading" ||
        fetcherLeave.state === "loading" ||
        fetcherCancel.state === "loading";
    const submitting =
        fetcherJoin.state === "submitting" ||
        fetcherApply.state === "submitting" ||
        fetcherLeave.state === "submitting" ||
        fetcherCancel.state === "submitting";

    const isLoading = loading || submitting;

    const buttonClasses = `btn btn-primary flex-grow text-lg w-full group`;

    const userJoined = Boolean(loggedInUserId) && joined;
    const userApplied = Boolean(loggedInUserId) && applied;

    useEffect(() => {
        if (fetcherApply.data && fetcherApply.state === "submitting") {
            if (fetcherApply.data.ok) {
                toast.success(fetcherApply.data.message);
            } else {
                toast.error(fetcherApply.data.message);
            }
        }
    }, [fetcherApply.data]);

    useEffect(() => {
        if (fetcherJoin.data && fetcherJoin.state === "submitting") {
            if (fetcherJoin.data.ok) {
                toast.success(fetcherJoin.data.message);
            } else {
                toast.error(fetcherJoin.data.message);
            }
        }
    }, [fetcherJoin.state, fetcherJoin.data]);

    useEffect(() => {
        if (fetcherLeave.data && fetcherLeave.state === "submitting") {
            if (fetcherLeave.data.ok) {
                toast.success(fetcherLeave.data.message);
            } else {
                toast.error(fetcherLeave.data.message);
            }
        }
    }, [fetcherLeave.state, fetcherLeave.data]);

    useEffect(() => {
        if (fetcherCancel.data && fetcherCancel.state === "submitting") {
            if (fetcherCancel.data.ok) {
                toast.success(fetcherCancel.data.message);
            } else {
                toast.error(fetcherCancel.data.message);
            }
        }
    }, [fetcherCancel.state, fetcherCancel.data]);

    return (
        <div className="card-actions justify-end mt-6 w-full">
            {/* user can be in those  states:
                - not logged in
                - logged in but not joined
                - logged in and joined - if not needRegistration,
                - logged in and not applied - if needRegistration
                - logged in and applied but not joined - if needRegistration, 
                - logged in and applied and joined - if needRegistration,
                
                status of application can be:
                - pending
                - accepted
                - rejected
            */}
            {!loggedInUserId ? (
                needRegistration ? (
                    <fetcherApply.Form
                        method="post"
                        action={`/event/${eventId}/apply`}
                    >
                        <SubmitButton
                            btnText="Aplikuj"
                            isLoading={isLoading}
                            baseClass={buttonClasses}
                        />
                    </fetcherApply.Form>
                ) : (
                    <fetcherJoin.Form
                        method="post"
                        action={`/event/${eventId}/join`}
                    >
                        <SubmitButton
                            btnText="Dołącz"
                            isLoading={isLoading}
                            baseClass={buttonClasses}
                        />
                    </fetcherJoin.Form>
                )
            ) : null}

            {loggedInUserId &&
                needRegistration &&
                (userApplied ? (
                    status === "pending" ? (
                        <fetcherCancel.Form
                            method="post"
                            action={`/event/${eventId}/cancel-application`}
                        >
                            <SubmitButton
                                isLoading={isLoading}
                                baseClass={buttonClasses}
                                classes="btn-info"
                            >
                                <span className="group-hover:hidden">
                                    {applicationsStatusMessages[status]}
                                </span>
                                <span className="hidden group-hover:block">
                                    Anuluj
                                </span>
                            </SubmitButton>
                        </fetcherCancel.Form>
                    ) : status === "approved" ? (
                        <fetcherLeave.Form
                            method="post"
                            action={`/event/${eventId}/leave`}
                        >
                            <SubmitButton
                                btnText={applicationsStatusMessages[status]}
                                isLoading={isLoading}
                                baseClass={buttonClasses}
                            />
                        </fetcherLeave.Form>
                    ) : status === "rejected" ? (
                        <SubmitButton
                            btnText={applicationsStatusMessages[status]}
                            isLoading={isLoading}
                            baseClass={buttonClasses}
                        />
                    ) : null
                ) : (
                    <fetcherApply.Form
                        method="post"
                        action={`/event/${eventId}/apply`}
                    >
                        <SubmitButton
                            btnText="Aplikuj"
                            isLoading={isLoading}
                            baseClass={buttonClasses}
                        />
                    </fetcherApply.Form>
                ))}

            {loggedInUserId && !needRegistration ? (
                userJoined ? (
                    <fetcherLeave.Form
                        method="post"
                        action={`/event/${eventId}/leave`}
                    >
                        <SubmitButton
                            btnText="Opuść"
                            isLoading={isLoading}
                            baseClass={buttonClasses}
                        />
                    </fetcherLeave.Form>
                ) : (
                    <fetcherJoin.Form
                        method="post"
                        action={`/event/${eventId}/join`}
                    >
                        <SubmitButton
                            btnText="Dołącz"
                            isLoading={isLoading}
                            baseClass={buttonClasses}
                        />
                    </fetcherJoin.Form>
                )
            ) : null}
        </div>
    );
}

function SubmitButton({
    btnText,
    isLoading,
    baseClass,
    classes,
    children,
}: {
    btnText?: string;
    isLoading: boolean;
    baseClass: string;
    classes?: string;
    children?: React.ReactNode;
}) {
    return (
        <button
            disabled={isLoading}
            type="submit"
            className={`${baseClass} ${classes}`}
        >
            {!isLoading && btnText}
            {!isLoading && children}
            <ButtonSpinner showSpinner={isLoading} />
        </button>
    );
}

function ButtonSpinner({ showSpinner }: { showSpinner: boolean }) {
    if (!showSpinner) {
        return null;
    }
    return <span className="loading loading-spinner loading-md" />;
}
