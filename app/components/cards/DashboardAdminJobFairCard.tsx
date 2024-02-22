import { Link } from "@remix-run/react";
import { Calendar, Clock, Edit, Eye, Trash } from "lucide-react";
import React from "react";
import { TJobFairListItem } from "~/models/jobFair.server";
import {
    dateToTime,
    formatDate,
    getEventDefaultImage,
    parseDatabaseName,
} from "~/utils";

export default function DashboardAdminJobFairCard({
    jobFair,
}: {
    jobFair: TJobFairListItem;
}) {
    return (
        <div className="card card-normal min-w-80 w-full bg-base-200 shadow-xl">
            <figure>
                <img
                    src={jobFair.image || getEventDefaultImage()}
                    alt="Event cover"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title  whitespace-nowrap flex-wrap justify-between gap-2">
                    <span className="font-bold">{jobFair.name}</span>
                    {/* <div className="flex gap-1 items-center justify-end flex-wrap w-full"> */}

                    {/* <div className="badge badge-outline">Web</div> */}
                    {/* <div className="badge badge-outline">Intership</div> */}
                    {/* </div> */}
                </h2>
                <div className="flex flex-col items-start gap-2 font-semibold">
                    <p className="inline-flex items-center gap-2">
                        <span className="font-bold ">
                            <Calendar size={16} />
                            {/* when jobFair already ended */}
                            {/* <CalendarOff size={16}/> */}
                        </span>{" "}
                        {/* 2021-04-20 */}
                        {formatDate(jobFair.dateFrom)} -{" "}
                        {formatDate(jobFair.dateTo)}
                    </p>
                    <p className="inline-flex items-center gap-2">
                        <span className="font-bold ">
                            <Clock size={16} />
                            {/* when jobFair already ended */}
                            {/* <AlarmClockOff size={16} /> */}
                        </span>{" "}
                        {dateToTime(jobFair.dailyTimeFrom)} -
                        {dateToTime(jobFair.dailyTimeTo)}
                    </p>
                </div>
                <p>{jobFair.info}</p>
                <div className="flex items-center justify-between mt-8">
                    <button
                        title="Usuń"
                        type="button"
                        className="btn btn-outline btn-error"
                    >
                        <Trash />
                    </button>
                    <Link
                        to={`/dashboard/edit-job-fair/${jobFair.id}`}
                        title="Edytuj"
                        type="button"
                        className="btn btn-outline"
                    >
                        <Edit />
                    </Link>
                    <button
                        title="Widoczność"
                        type="button"
                        className="btn btn-outline"
                    >
                        <Eye />
                    </button>
                </div>
            </div>
        </div>
    );
}
