import { useLoaderData } from "@remix-run/react";
import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    MetaFunction,
    json,
    redirect,
} from "@remix-run/node";
import {
    commitSession,
    getSession,
    redirectUnauthorized,
    requireAdmin,
    setToastMessage,
} from "~/session.server";
import {
    createEvent,
    editEvent,
    getAdminEvent,
    getEventCategories,
} from "~/models/event.server";
import { getTags } from "~/models/tag.server";
import invariant from "tiny-invariant";
import EventForm from "~/components/forms/EventForm";
import { eventFormSchema, validateEventForm } from "~/app-types";

export const meta: MetaFunction = () => [{ title: "Edytuj Wydarzenie" }];

export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.eventId, "eventId not found");

    const eventCategories = await getEventCategories();
    const tags = await getTags();
    const event = await getAdminEvent({ id: params.eventId });

    return json({
        TINY_API_KEY: process.env.TINY_API_KEY,
        eventCategories,
        tags,
        event,
    });
};

export async function action({ params, request }: ActionFunctionArgs) {
    const admin = await requireAdmin(request);

    const session = await getSession(request);
    const formData = await request.formData();
    const eventId = params.eventId;
    // TODO: change it
    if (!eventId) {
        return json({ message: "eventId not found" }, 400);
    }

    let values = Object.fromEntries(formData);
    const { "tags[]": tagsString, ...restValues } = values;
    let tags: { tagName: string }[] = [];

    if (typeof tagsString === "string") {
        tags = tagsString.split(",").map((tag) => ({ tagName: tag }));
    }

    const parsedSchema = eventFormSchema.safeParse({ ...restValues, tags });
    if (!parsedSchema.success) {
        console.log("parsed schema", parsedSchema.error.issues);
        return json({ errors: parsedSchema.error.issues }, { status: 400 });
    }

    await editEvent({ id: eventId, ...parsedSchema.data });

    setToastMessage(session, "Wydarzenie zostało zaktualizowane");
    return redirect("/dashboard/admin/events", {
        headers: { "Set-Cookie": await commitSession(session) },
    });
}

export default function DashboardAdminEditEvent() {
    const { eventCategories, tags, TINY_API_KEY, event } =
        useLoaderData<typeof loader>();

    return (
        <main className="container flex items-center justify-center flex-col">
            <h1 className="text-4xl font-bold mb-16">Edytuj {event?.name}</h1>
            {event && (
                <EventForm
                    TINY_API_KEY={TINY_API_KEY}
                    eventCategories={eventCategories}
                    tags={tags.map((tag) => tag.name)}
                    edit={true}
                    event={event}
                />
            )}
        </main>
    );
}
