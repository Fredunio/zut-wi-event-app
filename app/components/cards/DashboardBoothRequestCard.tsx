import { JobFairBoothApplication } from "@prisma/client";
import { Form, Link, useFetcher } from "@remix-run/react";
import { requestStatus } from "~/app-types";
import { applicationsStatusMessages } from "~/lib/app-data";
import { TUserDashboardBoothRequest } from "~/models/event.server";
import {
    getEventDefaultImage,
    isRequestStatus,
    parseDatabaseName,
} from "~/utils";

export default function DashboardBoothRequestCard({
    boothRequest,
}: {
    boothRequest: TUserDashboardBoothRequest;
}) {
    const fetcher = useFetcher({ key: boothRequest.id });

    return (
        <div className="card card-side w-full bg-base-100 shadow-xl">
            <figure>
                <img
                    src={
                        boothRequest.booth.images.length > 0
                            ? boothRequest.booth.images[0]
                            : getEventDefaultImage()
                    }
                    alt={boothRequest.booth.name}
                    className="rounded-t-lg"
                />
            </figure>

            <div className="card-body">
                <h2 className="card-title font-bold text-2xl">
                    Aplikacja na stanowisko{" "}
                    <Link
                        // TODO: implement url modal for booth details
                        to={`/job-fair/?boothId=${boothRequest.booth.id}`}
                        className="link link-info"
                    >
                        {boothRequest.booth.name}
                    </Link>
                </h2>
                <p className="text-xl ">
                    Status:{" "}
                    <span className="font-semibold">
                        {isRequestStatus(boothRequest.status) &&
                            applicationsStatusMessages[boothRequest.status]}
                    </span>
                </p>
                <p className="text-xl ">
                    Pakiet:{" "}
                    <span className="font-semibold">
                        {parseDatabaseName(
                            boothRequest.booth.sponsorshipPackageName
                        )}
                    </span>
                </p>
                <div className="flex justify-end">
                    {boothRequest.status === requestStatus["pending"] && (
                        <fetcher.Form
                            method="DELETE"
                            action={`/job-fair/request-booth/${boothRequest.booth.id}/${boothRequest.jobFair.id}`}
                        >
                            <button
                                type="submit"
                                className="btn btn-outline text-lg font-semibold btn-warning"
                            >
                                Anuluj
                            </button>
                        </fetcher.Form>
                    )}
                    {boothRequest.status === requestStatus["approved"] && (
                        <p className="bg-success mt-4 w-full text-lg font-semibold rounded-md text-center py-4 px-4">
                            <span className="text-success-content">
                                Zaakceptowane
                            </span>
                        </p>
                    )}
                    {boothRequest.status === requestStatus["rejected"] && (
                        <p className="bg-error mt-4 w-full rounded-md text-lg font-semibold text-center py-4 px-4">
                            <span className="text-error-content">
                                Odrzucone
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
