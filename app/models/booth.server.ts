import { Prisma } from "@prisma/client";
import { z } from "zod";
import { TRequestStatus } from "~/app-types";
import { prisma } from "~/db.server";
import { ACCEPTED_IMAGE_MIME_TYPES, MAX_FILE_SIZE } from "~/lib/app-data";
import { timeStringToDate } from "~/utils";

const boothSelect = Prisma.validator<Prisma.BoothSelect>()({
    id: true,
    name: true,
    info: true,
    images: true,
    JobFairBoothApplication: {
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    isOrganization: true,
                    avatar: true,
                    organization: {
                        select: {
                            image: true,
                            name: true,
                            email: true,
                            website: true,
                        },
                    },
                },
            },
        },
    },

    sponsorshipPackage: true,
});

export type TBooth = Prisma.BoothGetPayload<{
    select: typeof boothSelect;
}>;

export function getBooth(id: string) {
    return prisma.booth.findUnique({
        where: {
            id,
        },
        select: boothSelect,
    });
}

export function getBoothListItems() {
    return prisma.booth.findMany({
        select: boothSelect,
    });
}

export async function requestBooth({
    boothId,
    userId,
    jobFairId,
}: {
    boothId: string;
    userId: string;
    jobFairId: string;
}) {
    const applied = await prisma.jobFairBoothApplication.findFirst({
        where: {
            userId,
            jobFairId,
            status: {
                not: "rejected",
            },
        },
    });

    if (applied) {
        throw new Error("Już wysłałeś wniosek o stoisko na te targi pracy.");
    }

    return prisma.jobFairBoothApplication.create({
        data: {
            status: "pending",
            booth: {
                connect: {
                    id: boothId,
                },
            },
            jobFair: {
                connect: {
                    id: jobFairId,
                },
            },
            user: {
                connect: {
                    id: userId,
                },
            },
        },
    });
}

export async function cancelBoothRequest({
    boothId,
    userId,
    jobFairId,
}: {
    boothId: string;
    userId: string;
    jobFairId: string;
}) {
    return prisma.jobFairBoothApplication.deleteMany({
        where: {
            userId,
            jobFairId,
            boothId,
        },
    });
}

export async function changeBoothRequestStatus({
    boothRequestId,
    status,
}: {
    boothRequestId: string;
    status: TRequestStatus;
}) {
    return prisma.jobFairBoothApplication.update({
        where: {
            id: boothRequestId,
        },
        data: {
            status,
        },
    });
}
