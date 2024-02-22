import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import EventCard from "~/components/cards/EventCard";
import EventSearchbar from "~/components/forms/EventSearchbar";
import EventListPageLayout from "~/components/layout/EventListPageLayout";
import { getEventListItems } from "~/models/event.server";
import { useOptionalUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const events = await getEventListItems({});
    // console.log("events", events);
    return json({
        events,
    });
};

export default function EventsAll() {
    const { events } = useLoaderData<typeof loader>();
    const user = useOptionalUser();
    return (
        <EventListPageLayout>
            {events.map((event, i) => (
                <EventCard event={event} key={event.id} />
            ))}
        </EventListPageLayout>
    );
}
