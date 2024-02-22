import type { Event, User } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { TEventForm, requestStatus } from "~/app-types";

import { prisma } from "~/db.server";
import { timeStringToDate } from "~/utils";

export function getEvent({ id }: Pick<Event, "id">) {
    return prisma.event.findFirst({
        where: { id, hidden: false },
        include: {
            tags: { select: { tagName: true } },
        },
    });
}

const adminEventInlcude = Prisma.validator<Prisma.EventInclude>()({
    tags: {
        select: { tagName: true },
    },
});

export type TAdminEvent = Prisma.EventGetPayload<{
    include: typeof adminEventInlcude;
}>;

export function getAdminEvent({ id }: Pick<Event, "id">) {
    return prisma.event.findFirst({
        where: { id },
        include: adminEventInlcude,
    });
}

// TODO: maybe create variable, but there will not be any type checking
export type TEventListItem = Prisma.EventGetPayload<{
    select: {
        id: true;
        categoryName: true;
        dateFrom: true;
        dateTo: true;
        location: true;
        info: true;
        image: true;
        name: true;
        needRegistration: true;
        tags: { select: { tagName: true } };
        timeFrom: true;
        timeTo: true;
        participants: {
            select: {
                userId: true;
            };
        };
        userApplicationRequests: {
            select: {
                userId: true;
            };
        };
    };
    orderBy: { dateFrom: "desc" };
}>;

// TODO: add bookmarked events
export function getEventListItems({
    limit,
    category,
    loggedInUserId,
}: {
    limit?: number;
    category?: string;
    loggedInUserId?: string;
}) {
    return prisma.event.findMany({
        where: { hidden: false, categoryName: category },
        select: {
            id: true,
            categoryName: true,
            dateFrom: true,
            dateTo: true,
            location: true,
            info: true,
            image: true,
            name: true,
            needRegistration: true,
            tags: { select: { tagName: true } },
            participants: {
                select: {
                    userId: true,
                },
            },
            userApplicationRequests: {
                select: {
                    userId: true,
                },
            },
        },
        orderBy: { dateFrom: "desc" },
        take: limit,
    });
}
export function getAdminEventListItems() {
    return prisma.event.findMany({
        select: {
            id: true,
            categoryName: true,
            dateFrom: true,
            dateTo: true,
            location: true,
            info: true,
            image: true,
            name: true,
            needRegistration: true,
            tags: { select: { tagName: true } },
        },
        orderBy: { dateFrom: "desc" },
    });
}

export async function createEvent({
    categoryName,
    dateFrom,
    dateTo,
    timeFrom,
    timeTo,
    location,
    info,
    body,
    // image,
    hidden,
    name,
    needRegistration,
    tags,
}: TEventForm) {
    const tagCreateArray = tags.map((tagInput) => ({
        tag: {
            connectOrCreate: {
                where: { name: tagInput.tagName },
                create: { name: tagInput.tagName },
            },
        },
    }));

    console.log("dateFrom", dateFrom);
    console.log("dateTo", dateTo);
    console.log("timeFrom", timeFrom);
    console.log("timeTo", timeTo);
    await prisma.event.create({
        data: {
            categoryName,
            dateFrom: new Date(dateFrom).toISOString(),
            dateTo: dateTo ? new Date(dateTo).toISOString() : null,
            timeFrom: timeFrom
                ? timeStringToDate(timeFrom).toISOString()
                : null,
            timeTo: timeTo ? timeStringToDate(timeTo).toISOString() : null,
            body,
            info,
            // image,
            hidden: Boolean(hidden),
            location,
            name,
            needRegistration: Boolean(needRegistration),
            tags: {
                create: tagCreateArray,
            },
        },
    });
}

export async function editEvent({
    id,
    categoryName,
    dateFrom,
    dateTo,
    timeFrom,
    timeTo,
    location,
    info,
    body,
    // image,
    hidden,
    name,
    needRegistration,
    tags,
}: TEventForm & {
    id: Event["id"];
}) {
    console.log("needRegistration editEvent", needRegistration);

    const tagCreateArray = tags.map((tagInput) => ({
        tag: {
            connectOrCreate: {
                where: { name: tagInput.tagName },
                create: { name: tagInput.tagName },
            },
        },
    }));

    // Workaround for prisma not supporting cascade delete
    const deleteTags = prisma.$queryRaw`DELETE FROM "TagToEvent" WHERE "eventId" = ${id}`;

    const updateEvent = prisma.event.update({
        where: { id },
        data: {
            categoryName,
            dateFrom: new Date(dateFrom).toISOString(),
            dateTo: dateTo ? new Date(dateTo).toISOString() : null,
            timeFrom: timeFrom ? new Date(timeFrom).toISOString() : null,
            timeTo: timeTo ? new Date(timeTo).toISOString() : null,
            body,
            info,
            // image,
            hidden: Boolean(hidden),
            location,
            name,
            needRegistration: Boolean(needRegistration),
            tags: {
                create: tagCreateArray,
            },
        },
    });

    // const connectTags = prisma.event.update({
    //     where: { id },
    //     data: {
    //         tags: {
    //             create: tagCreateArray,
    //         },
    //     },
    // });

    await prisma.$transaction([deleteTags, updateEvent]);
}

export function deleteEvent({ id }: Pick<Event, "id">) {
    return prisma.event.delete({
        where: { id },
    });
}

export function getEventCategories() {
    return prisma.eventCategory.findMany();
}

export function getEventParticipantIDs({ id }: Pick<Event, "id">) {
    return prisma.event.findFirst({
        where: { id },
        select: {
            participants: {
                select: {
                    userId: true,
                },
            },
        },
    });
}

const userDashboardEventsSelect = Prisma.validator<Prisma.EventSelect>()({
    id: true,
    categoryName: true,
    dateFrom: true,
    dateTo: true,
    location: true,
    info: true,
    image: true,
    createdAt: true,
    timeFrom: true,
    timeTo: true,
    name: true,
    needRegistration: true,
    tags: { select: { tagName: true } },
});

export type TUserDashboardEvent = Prisma.EventGetPayload<{
    select: typeof userDashboardEventsSelect;
}>;

export async function getUserDashboardEvents({ userId }: { userId: string }) {
    return prisma.event.findMany({
        where: {
            hidden: false,
            OR: [
                { participants: { some: { userId } } },
                { userApplicationRequests: { some: { userId } } },
            ],
        },
        select: userDashboardEventsSelect,
        orderBy: { dateFrom: "desc" },
    });
}

export async function getUserSavedEvents({ userId }: { userId: string }) {
    return prisma.event.findMany({
        where: { hidden: false, usersBookmarked: { some: { userId } } },
        select: userDashboardEventsSelect,
        orderBy: { dateFrom: "desc" },
    });
}

const userDashboardBoothRequestSelect =
    Prisma.validator<Prisma.JobFairBoothApplicationSelect>()({
        id: true,
        status: true,
        jobFairId: true,
        userId: true,
        boothId: true,
        createdAt: true,
        updatedAt: true,
        booth: {
            select: {
                id: true,
                name: true,
                info: true,
                sponsorshipPackageName: true,
                images: true,
            },
        },
        jobFair: {
            select: {
                id: true,
                image: true,
                name: true,
            },
        },
    });

export type TUserDashboardBoothRequest =
    Prisma.JobFairBoothApplicationGetPayload<{
        select: typeof userDashboardBoothRequestSelect;
    }>;

export async function getUserDashboardBoothRequests(userId: string) {
    return prisma.jobFairBoothApplication.findMany({
        where: { userId },
        select: userDashboardBoothRequestSelect,
    });
}

export async function bookmarkEvent(userId: User["id"], eventId: Event["id"]) {
    return prisma.user.update({
        where: { id: userId },
        data: {
            bookmarkedEvents: {
                create: {
                    event: {
                        connect: { id: eventId },
                    },
                },
            },
        },
    });
}

export async function unbookmarkEvent(
    userId: User["id"],
    eventId: Event["id"]
) {
    return prisma.user.update({
        where: { id: userId },
        data: {
            bookmarkedEvents: {
                delete: {
                    userId_eventId: {
                        eventId: eventId,
                        userId: userId,
                    },
                },
            },
        },
    });
}

export async function getEventName(eventId: Event["id"]) {
    return prisma.event.findUnique({
        where: {
            id: eventId,
        },
        select: {
            name: true,
        },
    });
}

export async function joinEvent(userId: User["id"], eventId: User["id"]) {
    const eventName = await getEventName(eventId);

    if (!eventName) {
        throw new Error("Event not found");
    }

    const addUserToEvent = prisma.user.update({
        where: { id: userId },
        data: {
            participatedEvents: {
                create: {
                    event: {
                        connect: { id: eventId },
                    },
                },
            },
        },
    });

    const createTicketForUser = prisma.eventTicket.create({
        data: {
            qrCode: eventId + userId,
            eventId,
            userId,
            name: eventName.name,
        },
    });

    return prisma.$transaction([addUserToEvent, createTicketForUser]);
}

export async function leaveEvent(userId: User["id"], eventId: User["id"]) {
    await prisma.user.update({
        where: { id: userId },
        data: {
            participatedEvents: {
                delete: {
                    userId_eventId: {
                        eventId: eventId,
                        userId: userId,
                    },
                },
            },
        },
    });

    await prisma.eventTicket.delete({
        where: {
            userId_eventId: {
                eventId,
                userId,
            },
        },
    });
}

export async function applyForEvent(userId: User["id"], eventId: User["id"]) {
    const applicationStatus = await prisma.user.findFirst({
        where: {
            id: userId,
            eventAppliedRequests: {
                some: {
                    eventId,
                },
            },
        },
        select: {
            eventAppliedRequests: {
                where: {
                    eventId,
                },
                select: {
                    status: true,
                },
            },
        },
    });

    if (
        applicationStatus?.eventAppliedRequests[0].status ===
        requestStatus["rejected"]
    ) {
        return;
    }

    return prisma.user.update({
        where: { id: userId },
        data: {
            eventAppliedRequests: {
                create: {
                    status: requestStatus["pending"],
                    event: {
                        connect: { id: eventId },
                    },
                },
            },
        },
    });
}

export async function cancelEventApplication(
    userId: User["id"],
    eventId: User["id"]
) {
    return prisma.user.update({
        where: { id: userId },
        data: {
            eventAppliedRequests: {
                delete: {
                    userId_eventId: {
                        eventId: eventId,
                        userId: userId,
                    },
                },
            },
        },
    });
}

export async function acceptUserEventApplicationRequest(
    userId: User["id"],
    eventId: User["id"]
) {
    await prisma.user.update({
        where: { id: userId },
        data: {
            eventAppliedRequests: {
                update: {
                    where: {
                        userId_eventId: {
                            eventId,
                            userId,
                        },
                    },
                    data: {
                        status: requestStatus["approved"],
                    },
                },
            },
        },
    });

    await joinEvent(userId, eventId);
}

export async function rejectUserEventApplicationRequest(
    userId: User["id"],
    eventId: User["id"]
) {
    return prisma.user.update({
        where: { id: userId },
        data: {
            eventAppliedRequests: {
                update: {
                    where: {
                        userId_eventId: {
                            eventId,
                            userId,
                        },
                    },
                    data: {
                        status: requestStatus["rejected"],
                    },
                },
            },
        },
    });
}

const eventApplicationRequestsSelect = Prisma.validator<Prisma.EventSelect>()({
    id: true,
    userApplicationRequests: {
        select: {
            status: true,
            user: {
                select: {
                    id: true,
                    avatar: true,
                    email: true,
                    isStudent: true,
                },
            },
            event: {
                select: {
                    id: true,
                    name: true,
                    dateFrom: true,
                    location: true,
                    categoryName: true,
                    dateTo: true,
                    timeFrom: true,
                    timeTo: true,
                },
            },
        },
    },
    // eventAppliedRequests: {
    //     select: {
    //         eventId: true,
    //         status: true,
    //         userId: true,
    //     },
    // },
});

export type TEventApplicationRequest = Prisma.UserGetPayload<{
    select: typeof eventApplicationRequestsSelect;
}>;

export async function getEventApplicationRequests() {
    return prisma.event.findMany({
        where: {
            // OR: [
            //     { AND: { dateFrom: { lte: new Date() }, dateTo: null } },
            //     { dateTo: { gte: new Date() } },
            // ],
            // userApplicationRequests: {
            //     none: {
            //         user: {
            //             suspended: false,
            //         },
            //     },
            // },
        },
        select: eventApplicationRequestsSelect,
    });
}
