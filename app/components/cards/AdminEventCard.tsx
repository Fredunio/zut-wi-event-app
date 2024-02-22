import {
    AlarmClock,
    AlarmClockOff,
    Bookmark,
    Calendar,
    CalendarOff,
    Check,
    Clock,
    Clock2,
    Edit,
    Eye,
    Trash,
} from "lucide-react";
import type { Event } from "@prisma/client";

// import { EventApplicationStatus } from "~/types/app.types";
import { formatDate, getEventDefaultImage, parseDatabaseName } from "~/utils";
import { Link } from "@remix-run/react";

export default function AdminEventCard({ event }: { event: Event }) {
    return (
        <div className="card card-normal min-w-80 w-full bg-base-200 shadow-xl">
            <figure>
                <img
                    src={event.image || getEventDefaultImage()}
                    alt="Event cover"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title  whitespace-nowrap flex-wrap justify-between gap-2">
                    <span className="font-bold">{event.name}</span>
                    {/* <div className="flex gap-1 items-center justify-end flex-wrap w-full"> */}
                    <div className="badge badge-outline">
                        {parseDatabaseName(event.categoryName)}
                    </div>
                    {/* <div className="badge badge-outline">Web</div> */}
                    {/* <div className="badge badge-outline">Intership</div> */}
                    {/* </div> */}
                </h2>
                <div className="flex items-center font-semibold">
                    <p className="inline-flex items-center gap-2">
                        <span className="font-bold ">
                            <Calendar size={16} />
                            {/* when event already ended */}
                            {/* <CalendarOff size={16}/> */}
                        </span>{" "}
                        {/* 2021-04-20 */}
                        {formatDate(event.dateFrom)}
                    </p>
                    <p className="inline-flex items-center gap-2">
                        <span className="font-bold ">
                            <Clock size={16} />
                            {/* when event already ended */}
                            {/* <AlarmClockOff size={16} /> */}
                        </span>{" "}
                        20:00
                    </p>
                </div>
                <p>{event.info}</p>
                <div className="flex items-center justify-between mt-8">
                    <button
                        title="Usuń"
                        type="button"
                        className="btn btn-outline btn-error"
                    >
                        <Trash />
                    </button>
                    <Link
                        to={`/dashboard/edit-event/${event.id}`}
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
