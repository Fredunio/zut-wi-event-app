import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "~/db.server";
import { ACCEPTED_IMAGE_MIME_TYPES, MAX_FILE_SIZE } from "~/lib/app-data";
import { timeStringToDate } from "~/utils";

export const jobFairFormSchema = z.object({
    dateFrom: z.string({ required_error: "Data rozpoczęcia jest wymagana" }),
    dateTo: z.string({ required_error: "Data zakończenia jest wymagana" }),
    dailyTimeFrom: z.string({
        required_error: "Godzina rozpoczęcia jest wymagana",
    }),
    dailyTimeTo: z.string({
        required_error: "Godzina zakończenia jest wymagana",
    }),
    location: z.string({ required_error: "Lokalizacja jest wymagana" }),
    image: z.any().optional(),
    // TODO: uncomment when image upload is implemented
    // on the server when user selects no image, the value is Blob { size: 0, type: 'application/octet-stream' },
    // image: z
    //     .any()
    //     .refine((files) => {
    //         return files?.[0]?.size <= MAX_FILE_SIZE;
    //     }, `Max image size is 5MB.`)
    //     .refine(
    //         (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
    //         "Only .jpg, .jpeg, .png and .webp formats are supported."
    //     ),
    info: z.string({ required_error: "Krótki opis jest wymagany" }),
    body: z.string({ required_error: "Opis Wydarzenia jest wymagany" }),
    hidden: z.string().optional(),
    name: z.string({ required_error: "Nazwa jest wymagana" }),
});

export type TJobFairForm = z.infer<typeof jobFairFormSchema>;

export async function createJobFair({
    dateFrom,
    dateTo,
    dailyTimeFrom,
    dailyTimeTo,
    location,
    info,
    image,
    body,
    hidden,
    name,
}: TJobFairForm) {
    console.log("dailyTimeFrom", dailyTimeFrom);
    console.log("dailyTimeTo", new Date(dailyTimeTo));

    await prisma.jobFair.create({
        data: {
            dateFrom: new Date(dateFrom).toISOString(),
            dateTo: new Date(dateTo).toISOString(),
            dailyTimeFrom: timeStringToDate(dailyTimeFrom).toISOString(),
            dailyTimeTo: timeStringToDate(dailyTimeTo).toISOString(),
            body,
            info,
            hidden: Boolean(hidden),
            location,
            name,
        },
    });
}

export async function editJobFair(
    id: string,
    {
        dateFrom,
        dateTo,
        dailyTimeFrom,
        dailyTimeTo,
        location,
        info,
        image,
        body,
        hidden,
        name,
    }: TJobFairForm
) {
    await prisma.jobFair.update({
        where: {
            id,
        },
        data: {
            dateFrom: new Date(dateFrom).toISOString(),
            dateTo: new Date(dateTo).toISOString(),
            dailyTimeFrom: timeStringToDate(dailyTimeFrom).toISOString(),
            dailyTimeTo: timeStringToDate(dailyTimeTo).toISOString(),
            body,
            info,
            hidden: Boolean(hidden),
            location,
            name,
        },
    });
}

const jobFairAdminSelect = Prisma.validator<Prisma.JobFairSelect>()({
    id: true,
    name: true,
    dateFrom: true,
    dateTo: true,
    dailyTimeFrom: true,
    dailyTimeTo: true,
    location: true,
    image: true,
    info: true,
    body: true,
    hidden: true,
});

export type TJobFairAdmin = Prisma.JobFairGetPayload<{
    select: typeof jobFairAdminSelect;
}>;

export function getAdminJobFair(id: string) {
    return prisma.jobFair.findUnique({
        where: {
            id,
        },
        select: jobFairAdminSelect,
    });
}

const jobFairSelectListItem = Prisma.validator<Prisma.JobFairSelect>()({
    id: true,
    name: true,
    dateFrom: true,
    dateTo: true,
    dailyTimeFrom: true,
    dailyTimeTo: true,
    location: true,
    image: true,
    info: true,
    hidden: true,
    body: true,
    JobFairBoothApplication: true,
});

export type TJobFairListItem = Prisma.JobFairGetPayload<{
    select: typeof jobFairSelectListItem;
}>;

export function getJobFairListItems() {
    return prisma.jobFair.findMany({
        where: {
            hidden: false,
        },
        select: jobFairSelectListItem,
    });
}

export function getCurrentJobFair() {
    return prisma.jobFair.findFirst({
        where: {
            hidden: false,
            dateTo: {
                gte: new Date(),
            },
        },
        select: jobFairSelectListItem,
    });
}

export function getSponsorshipBenefits() {
    return prisma.jobFairSponsorshipPackage.findMany();
}

const boothRequestInclude =
    Prisma.validator<Prisma.JobFairBoothApplicationInclude>()({
        booth: true,
        jobFair: true,
        user: {
            include: {
                organization: true,
            },
        },
    });

export type TBoothRequest = Prisma.JobFairBoothApplicationGetPayload<{
    include: typeof boothRequestInclude;
}>;

export function getBoothRequests() {
    return prisma.jobFairBoothApplication.findMany({
        include: boothRequestInclude,
    });
}

export function getAdminJobFairs() {
    return prisma.jobFair.findMany({
        select: jobFairSelectListItem,
    });
}
