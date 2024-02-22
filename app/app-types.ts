import z from "zod";

export const eventFormSchema = z.object({
    categoryName: z.string({ required_error: "Kategoria jest wymagana" }),
    dateFrom: z.string({ required_error: "Data rozpoczęcia jest wymagana" }),
    dateTo: z.string().optional(),
    timeFrom: z.string().optional(),
    timeTo: z.string().optional(),
    info: z.string({ required_error: "Krótki opis jest wymagany" }),
    body: z.string({ required_error: "Opis Wydarzenia jest wymagany" }),
    location: z.string({ required_error: "Lokalizacja jest wymagana" }),
    // TODO: add image validation
    // image: z.string().optional(),
    name: z.string({ required_error: "Nazwa jest wymagana" }),
    tags: z.array(z.object({ tagName: z.string() })),
    needRegistration: z.string().optional(),
    hidden: z.string().optional(),
});

export type TEventForm = z.infer<typeof eventFormSchema>;

export function validateEventForm(data: unknown) {
    return eventFormSchema.safeParse(data);
}

// const requestStatus = ["pending", "approved", "rejected"];

export const requestStatus = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
} as const;

export type TRequestStatus = keyof typeof requestStatus;

// TODO: use it in the future
export type TActionReturnData = { message: string; ok: boolean };
