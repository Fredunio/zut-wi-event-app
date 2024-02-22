import { prisma } from "~/db.server";

export async function createEventTicket(eventId: string, userId: string) {
    const eventName = await prisma.event.findUnique({
        where: {
            id: eventId,
        },
        select: {
            name: true,
        },
    });

    if (!eventName) {
        throw new Error("Event not found");
    }

    return prisma.eventTicket.create({
        data: {
            qrCode: eventId + userId,
            eventId,
            userId,
            name: eventName.name,
        },
    });
}

export async function deleteEventTicket(eventId: string, userId: string) {
    return prisma.eventTicket.delete({
        where: {
            userId_eventId: {
                eventId,
                userId,
            },
        },
    });
}

export async function getUserTickets({ userId }: { userId: string }) {
    return prisma.eventTicket.findMany({
        where: { userId },
        orderBy: { event: { dateFrom: "desc" } },
    });
}
