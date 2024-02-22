import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AdminEventCard from "~/components/cards/AdminEventCard";
import EventSearchbar from "~/components/forms/EventSearchbarAdmin";
import {
    getAdminEventListItems,
    getEventCategories,
} from "~/models/event.server";
import { getTags } from "~/models/tag.server";
import { requireAdmin } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const admin = await requireAdmin(request);

    const events = await getAdminEventListItems();
    const eventCategories = await getEventCategories();
    const tags = await getTags();
    return json({
        eventCategories,
        tags,
        events,
    });
};

export default function DashboardAdminEvents() {
    const { eventCategories, tags, events } = useLoaderData<typeof loader>();

    return (
        <div>
            <EventSearchbar />
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 mt-8">
                {events.map((event, i) => (
                    <AdminEventCard event={event} key={event.id} />
                ))}
            </div>
        </div>
    );
}
