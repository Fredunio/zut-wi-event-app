import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, json, useLoaderData } from "@remix-run/react";
import { Editor } from "@tinymce/tinymce-react";
import { Calendar, Clock, LibraryBig, MapPin, Octagon } from "lucide-react";
import { useRef } from "react";
import invariant from "tiny-invariant";
import { EventCardSubmitForm } from "~/components/cards/EventCard";
import { EventSubmitForm } from "~/components/forms/EventSubmitButton";
import { getEvent } from "~/models/event.server";
import {
    formatDate,
    getEventDefaultImage,
    isRequestStatus,
    parseDatabaseName,
    useOptionalUser,
    useUser,
} from "~/utils";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    invariant(params.eventId, "eventId not found");

    const event = await getEvent({ id: params.eventId });
    const TINY_API_KEY = process.env.TINY_API_KEY;

    if (!event) {
        throw new Response("Not Found", { status: 404 });
    }
    return json({ event, TINY_API_KEY });
};

export default function EventPage() {
    const { event, TINY_API_KEY } = useLoaderData<typeof loader>();
    const editorRef = useRef<null | {
        getContent: () => string;
    }>(null);

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
        <main className="mx-auto max-w-[900px] py-20 px-12 flex items-center flex-col">
            <img
                src={event.image || getEventDefaultImage()}
                alt="Zdjęcie wydarzenia"
                className="w-full h-80 object-cover rounded-t-xl shadow-lg"
            />
            <div className="w-full max-w-4xl mt-12">
                <h1 className="text-4xl font-extrabold">{event.name}</h1>
                <div className="flex items-center gap-4 mt-2">
                    {event.tags.map((tag) => (
                        <span
                            key={tag.tagName}
                            className="badge badge-lg  badge-accent"
                        >
                            {tag.tagName}
                        </span>
                    ))}
                </div>

                <Link
                    to={`/evets/${event.categoryName}`}
                    className="link text-lg font-bold flex items-center gap-2 mt-8"
                >
                    <LibraryBig />

                    {parseDatabaseName(event.categoryName)}
                </Link>

                <div className="flex items-center w-full gap-8  mb-12 whitespace-nowrap flex-wrap">
                    <p className="flex items-center gap-2">
                        <MapPin />
                        <span className="text-lg font-bold">
                            {/* {event.location} */}
                            ZUT Wydział Informatyki W1 sala 201
                        </span>
                    </p>
                    <p className="flex items-center gap-2 text-lg font-bold">
                        <Calendar />{" "}
                        <span className="">{formatDate(event.dateFrom)}</span>{" "}
                        {event.dateTo && (
                            <span> - {formatDate(event.dateTo)}</span>
                        )}
                    </p>
                    <p className="flex items-center gap-2">
                        <Clock />{" "}
                        <span className="text-lg font-bold">20:00</span>{" "}
                    </p>
                    {/* TODO: uncomment below when implemented */}
                    {/* <p className="inline">
                        <Clock /> {event.timeFrom}{" "}
                        {event.timeTo && <span> - {event.timeTo}</span>}
                    </p> */}
                </div>
                <Editor
                    id="event-page-body"
                    init={{
                        menubar: false,
                        statusbar: false,
                        toolbar: false,
                        readonly: true,
                        plugins: "autoresize",
                        // inline: true,
                    }}
                    disabled
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    apiKey={TINY_API_KEY}
                    value={event.body}
                    initialValue={event.body}
                />
            </div>
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
        </main>
    );
}
