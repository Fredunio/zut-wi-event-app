import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import EventCard from "~/components/cards/EventCard";
import EventListPageLayout from "~/components/layout/EventListPageLayout";
import { getEventListItems } from "~/models/event.server";
import { useOptionalUser } from "~/utils";

export async function loader({ params }: LoaderFunctionArgs) {
    const eventsByCategory = await getEventListItems({
        limit: 3,
        category: params.category,
    });

    return json({
        eventsByCategory,
    });
}

export default function EventsCategoryRoute() {
    const { eventsByCategory } = useLoaderData<typeof loader>();
    const user = useOptionalUser();

    return (
        <div>
            <EventListPageLayout>
                {eventsByCategory.map((event, i) => (
                    <EventCard event={event} key={event.id} />
                ))}
            </EventListPageLayout>
        </div>
    );
}
