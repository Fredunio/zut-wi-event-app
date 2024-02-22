import { Link } from "@remix-run/react";
import { Bookmark, Calendar, Check, Clock2, MapPin } from "lucide-react";
import { TJobFairListItem } from "~/models/jobFair.server";
import { dateToTime, formatDate, useOptionalOrganizationUser } from "~/utils";

export default function JobFairCard({
    jobFair,
}: {
    jobFair: TJobFairListItem;
}) {
    const user = useOptionalOrganizationUser();

    const userId = user?.id;

    const userApplied = user?.eventAppliedRequests.some(
        (appliedRequest) => appliedRequest.eventId === jobFair.id
    );

    const requestStatus = user?.eventAppliedRequests.find(
        (appliedRequest) => appliedRequest.eventId === jobFair.id
    )?.status;

    return (
        <div className="card card-side min-w-96 w-full bg-base-100 shadow-xl">
            <figure>
                <img
                    src={
                        jobFair.image ||
                        "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    alt="Zdjęcie Targu Pracy"
                />
            </figure>
            <div className="card-body justify-normal">
                <h2 className="card-title text-2xl font-bold whitespace-nowrap">
                    <span>{jobFair.name}</span>
                </h2>
                <p className="flex-grow-0">{jobFair.info}</p>
                <div className="flex flex-col gap-2 flex-grow justify-center">
                    <p className="flex flex-grow-0 gap-4">
                        <MapPin size={20} />
                        <span className="font-semibold text-lg">
                            {jobFair.location}
                        </span>
                    </p>
                    <p className="flex flex-grow-0 gap-4">
                        <Calendar size={20} />
                        <span className="font-semibold text-lg">
                            {formatDate(jobFair.dateFrom)} -{" "}
                            {formatDate(jobFair.dateTo)}
                        </span>
                    </p>
                    <p className="flex flex-grow-0 gap-4">
                        <Clock2 size={20} />
                        <span className="font-semibold text-lg">
                            {dateToTime(jobFair.dailyTimeFrom)} -{" "}
                            {dateToTime(jobFair.dailyTimeTo)}
                        </span>
                    </p>
                </div>
                <div className="card-actions mt-auto">
                    <Link
                        to={`/job-fair`}
                        className="btn btn-primary flex-grow text-lg"
                    >
                        Zobacz Więcej
                    </Link>
                </div>
                {/* {user ? (
                    userApplied ? (
                        requestStatus === "approved" ? (
                            <button className="btn btn-success flex-grow text-lg">
                                Zapisany
                                <Check />
                            </button>
                        ) : requestStatus === "pending" ? (
                            <button className="btn btn-info flex-grow text-lg">
                                Oczekuje
                                <Clock2 size={20} />
                            </button>
                        ) : requestStatus === "rejected" ? (
                            <button className="btn btn-warning flex-grow text-lg">
                                Odrzucony
                            </button>
                        ) : null
                    ) : (
                        <Link
                            to={`/job-fairs/${jobFair.id}`}
                            className="btn btn-primary flex-grow text-lg"
                        >
                            Zapisz się
                        </Link>
                    )
                ) : null} */}

                {/* <JobFairCardSubmitForm
                    jobFairId={jobFair.id}
                    loggedInUserId={userId}
                    applied={userApplied}
                    status={
                        isRequestStatus(applicationRequestStatus)
                            ? applicationRequestStatus
                            : undefined
                    }
                /> */}
                {/* <div className="card-actions justify-end mt-4">
                    {status === "approved" ? (
                        <button className="btn btn-success flex-grow text-lg">
                            Zapisany
                            <Check />
                        </button>
                    ) : status === "pending" ? (
                        <button className="btn btn-info flex-grow text-lg">
                            Oczekuje
                            <Clock2 size={20} />
                        </button>
                    ) : status === "rejected" ? (
                        <button className="btn btn-warning flex-grow text-lg">
                            Odrzucony
                        </button>
                    ) : (
                        <button className="btn btn-primary flex-grow text-lg">
                            Dołącz
                        </button>
                    )}
                </div> */}
            </div>
        </div>
    );
}
