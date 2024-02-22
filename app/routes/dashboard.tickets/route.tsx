import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import TicketCard from "~/components/cards/TicketCard";
import { getUserTickets } from "~/models/eventTicket.server";
import { getUserId } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await getUserId(request);
    invariant(userId, "userId not found");
    const userTickets = await getUserTickets({ userId });

    return json({ userTickets });
}

export default function DashboardTickets() {
    const { userTickets } = useLoaderData<typeof loader>();
    return (
        <div className="">
            <h1 className="dashboard-section-headding mb-20">Bilety</h1>
            <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2  gap-12 w-full">
                {userTickets.map((ticket) => (
                    <TicketCard
                        key={ticket.eventId + ticket.userId}
                        ticket={ticket}
                    />
                ))}
            </div>
        </div>
    );
}
