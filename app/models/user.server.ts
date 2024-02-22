import { Password, Prisma, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

// export type TAppUser = Prisma.UserGetPayload<{
//     include: {
//         bookmarkedEvents: {
//             select: {
//                 eventId: true;
//             };
//         };
//         participatedEvents: {
//             select: {
//                 eventId: true;
//             };
//         };
//         eventAppliedRequests: {
//             select: {
//                 eventId: true;
//                 status: true;
//             };
//         };
//         participatedJobFairs: {
//             select: {
//                 jobFairId: true;
//             };
//         };
//     };
// }>;

const userInclude = Prisma.validator<Prisma.UserInclude>()({
    bookmarkedEvents: {
        select: {
            eventId: true,
            event: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
        },
    },
    participatedEvents: {
        select: {
            eventId: true,
            event: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
        },
    },
    organization: true,
    eventAppliedRequests: {
        select: {
            eventId: true,
            status: true,
        },
    },
});

export type TAppUser = Prisma.UserGetPayload<{
    include: typeof userInclude;
}>;

export async function getUserById(id: User["id"]) {
    return prisma.user.findUnique({
        where: { id },
        include: userInclude,
        // include: {
        //     bookmarkedEvents: {
        //         select: {
        //             eventId: true,
        //         },
        //     },
        //     participatedEvents: {
        //         select: {
        //             eventId: true,
        //         },
        //     },
        //     eventAppliedRequests: {
        //         select: {
        //             eventId: true,
        //             status: true,
        //         },
        //     },
        //     participatedJobFairs: {
        //         select: {
        //             jobFairId: true,
        //         },
        //     },
        // },
    });
}

export async function getUserByEmail(email: User["email"]) {
    return prisma.user.findUnique({ where: { email } });
}

export async function createUser(
    email: User["email"],
    password: string,
    organizationData?: {
        organizationName: string;
        organizationNip: string;
        organizationFullAddress: string;
        organizationPostalCode: string;
        organizationCity: string;
    }
) {
    const hashedPassword = await bcrypt.hash(password, 10);

    // TODO: add organization
    return prisma.user.create({
        data: {
            email,
            password: {
                create: {
                    hash: hashedPassword,
                },
            },
            organization: organizationData && {
                create: {
                    email,
                    name: organizationData.organizationName,
                    nip: organizationData.organizationNip,
                    fullAddress: organizationData.organizationFullAddress,
                    postalCode: organizationData.organizationPostalCode,
                    city: organizationData.organizationCity,
                },
            },
            isOrganization: Boolean(organizationData),
        },
    });
}

export async function deleteUserByEmail(email: User["email"]) {
    return prisma.user.delete({ where: { email } });
}

export async function getAllUsers() {
    return prisma.user.findMany();
}

export async function verifyLogin(
    email: User["email"],
    password: Password["hash"]
) {
    const userWithPassword = await prisma.user.findUnique({
        where: { email },
        include: {
            password: true,
        },
    });

    if (!userWithPassword || !userWithPassword.password) {
        return null;
    }

    const isValid = await bcrypt.compare(
        password,
        userWithPassword.password.hash
    );

    if (!isValid) {
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = userWithPassword;

    return userWithoutPassword;
}

const userProfileSelect = Prisma.validator<Prisma.UserSelect>()({
    id: true,
    email: true,
    avatar: true,
    createdAt: true,
    updatedAt: true,
    emailVerified: true,
    isStudent: true,
    phoneNumber: true,
    phoneNumberVerified: true,
    studentEmail: true,
    studentId: true,
    suspended: true,
});

export type TUserProfile = Prisma.UserGetPayload<{
    select: typeof userProfileSelect;
}>;

export async function getUserProfileById(id: User["id"]) {
    return prisma.user.findUnique({
        where: { id },
        select: userProfileSelect,
    });
}

export const organizationFormSchema = z.object({
    name: z.string({ required_error: "Nazwa firmy jest wymagana" }),
    nip: z.string({ required_error: "NIP jest wymagany" }),
    fullAddress: z.string({ required_error: "Adres firmy jest wymagany" }),
    postalCode: z.string({ required_error: "Kod pocztowy jest wymagany" }),
    city: z.string({ required_error: "Miasto jest wymagane" }),
    email: z
        .string({
            required_error: "Email jest wymagany",
        })
        .email(),
    phone: z.string().optional(),
    website: z.string().optional(),
});

export type TOrganizationForm = z.infer<typeof organizationFormSchema>;

export function updateOrganizationData(data: TOrganizationForm) {
    return prisma.organization.update({
        where: { email: data.email },
        data: {
            name: data.name,
            nip: data.nip,
            fullAddress: data.fullAddress,
            postalCode: data.postalCode,
            city: data.city,
            phone: data.phone,
            website: data.website,
        },
    });
}
