import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import EventCard from "~/components/cards/EventCard";
import { getUserSavedEvents } from "~/models/event.server";
import { getUserId } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await getUserId(request);
    invariant(userId, "userId not found");

    const userEvents = await getUserSavedEvents({ userId });
    return json({ userEvents });
}

export default function DashboardBookmarks() {
    const userEvents = useLoaderData<typeof loader>();
    return (
        <div>
            <h1 className="dashboard-section-headding">Zapisane</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
                {userEvents.userEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
}
