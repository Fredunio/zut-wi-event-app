import { Calendar, Clock } from "lucide-react";
import { useFetcher } from "react-router-dom";
import { TActionReturnData, TRequestStatus } from "~/app-types";
import { applicationsStatusMessages } from "~/lib/app-data";
import { TEventListItem } from "~/models/event.server";

import {
    dateToTime,
    formatDate,
    getEventDefaultImage,
    isRequestStatus,
    useOptionalUser,
} from "~/utils";
import BookmarkSolid from "../icons/Bookmark/BookmarkSolid";
import BookmarkSolidSlash from "../icons/Bookmark/BookmarkSolidSlash";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "@remix-run/react";
import { EventSubmitForm } from "../forms/EventSubmitButton";

export default function EventCard({ event }: { event: TEventListItem }) {
    const user = useOptionalUser();

    const userId = user?.id;
    const userJoined = user?.participatedEvents.some(
        (participatedEvent) => participatedEvent.eventId === event.id
    );

    const userApplied = user?.eventAppliedRequests.some(
        (appliedRequest) => appliedRequest.eventId === event.id
    );

    const applicationRequestStatus = user?.eventAppliedRequests.find(
        (appliedRequest) => appliedRequest.eventId === event.id
    )?.status;

    return (
        <div className="card card-normal min-w-80 w-full bg-base-200 shadow-xl overflow-hidden">
            <figure className="hover:scale-105 h-72 hover:brightness-90 transition-all duration-300">
                <Link to={`/event/${event.id}`} className="w-full h-full">
                    <img
                        src={event.image || getEventDefaultImage()}
                        alt="Event cover"
                        className="object-cover w-full h-full"
                    />
                </Link>
            </figure>
            <BookmarkButton
                eventId={event.id}
                isLoggedIn={Boolean(userId)}
                isSaved={
                    user?.bookmarkedEvents.some(
                        (bookmark) => bookmark.eventId === event.id
                    ) || false
                }
            />
            <div className="card-body">
                <h2 className="card-title  whitespace-nowrap flex-wrap justify-between gap-2">
                    <span className="font-bold text-2xl">{event.name}</span>
                    <div className="flex gap-1 items-center justify-end flex-nowrap ">
                        {event.tags.map((tag) => (
                            <div
                                key={tag.tagName}
                                className="badge badge-outline"
                            >
                                {tag.tagName}
                            </div>
                        ))}
                    </div>
                </h2>
                <div className="flex items-start flex-col gap-1 font-semibold ">
                    <p className="inline-flex items-center gap-2">
                        <span className="font-bold ">
                            <Calendar size={16} />
                            {/* when event already ended */}
                            {/* <CalendarOff size={16}/> */}
                        </span>{" "}
                        {formatDate(event.dateFrom)}
                        {event.dateTo && ` - ${formatDate(event.dateTo)}`}
                    </p>
                    <p className="inline-flex items-center gap-2">
                        <span className="font-bold ">
                            <Clock size={16} />
                            {/* when event already ended */}
                            {/* <AlarmClockOff size={16} /> */}
                        </span>
                        {dateToTime(event.dateFrom)}
                        {event.dateTo && ` - ${dateToTime(event.dateTo)}`}
                    </p>
                </div>
                <p className="line-clamp-2">{event.info}</p>
                <EventSubmitForm
                    eventId={event.id}
                    loggedInUserId={userId}
                    needRegistration={event.needRegistration}
                    joined={userJoined}
                    applied={userApplied}
                    status={
                        isRequestStatus(applicationRequestStatus)
                            ? applicationRequestStatus
                            : undefined
                    }
                />
            </div>
        </div>
    );
}

function BookmarkButton({
    eventId,
    isLoggedIn,
    isSaved,
}: {
    eventId: string;
    isLoggedIn?: boolean;
    isSaved: boolean;
}) {
    const fetcherBookmark = useFetcher<TActionReturnData>({
        key: `event-bookmark-${eventId}`,
    });
    const isLoading =
        fetcherBookmark.state === "loading" ||
        fetcherBookmark.state === "submitting";

    useEffect(() => {
        if (fetcherBookmark.data && fetcherBookmark.state === "submitting") {
            if (fetcherBookmark.data.ok) {
                toast.success(fetcherBookmark.data.message);
            } else {
                toast.error(fetcherBookmark.data.message);
            }
        }
    }, [fetcherBookmark.data, fetcherBookmark.state]);

    if (isSaved) {
        return (
            <fetcherBookmark.Form
                method="delete"
                action={`/event/${eventId}/bookmark`}
                className="absolute right-4"
            >
                <button
                    title="Usuń z zapisanych"
                    type="submit"
                    disabled={isLoading || !isLoggedIn}
                    aria-label="Remove from favorites"
                >
                    <BookmarkSolidSlash
                        strokeWidth={0.5}
                        stroke="black"
                        className="transition-all  delay-75 scale-y-[2.5] scale-x-150 text-accent opacity-90 hover:opacity-100 hover:text-error -translate-y-2 hover:translate-y-1"
                    />
                </button>
            </fetcherBookmark.Form>
        );
    }

    return (
        <fetcherBookmark.Form
            method="post"
            action={`/event/${eventId}/bookmark`}
            className="absolute right-4"
        >
            <button
                title="Dodaj do zapisanych"
                type="submit"
                disabled={isLoading}
                className=""
                aria-label="Add to favorites"
            >
                <BookmarkSolid
                    strokeWidth={0.5}
                    stroke="black"
                    className="transition-all  delay-75 scale-y-[2.5] scale-x-150 text-white opacity-90 hover:opacity-100 hover:text-primary -translate-y-2 hover:translate-y-1"
                />
            </button>
        </fetcherBookmark.Form>
    );
}
