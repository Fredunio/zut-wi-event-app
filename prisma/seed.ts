import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const dummyUsers = [
    {
        email: "test@example.com",
        role: {
            connect: {
                name: "admin",
            },
        },
        phoneNumber: "666-666-6666",
    },
    {
        email: "johnDoe@example.com",
        role: {
            connect: {
                name: "user",
            },
        },
        isStudent: true,
        phoneNumber: "111-111-1111",
    },
    {
        email: "harryJogger@example.com",
        role: {
            connect: {
                name: "user",
            },
        },
        isStudent: true,
        phoneNumber: "222-222-2222",
    },
    {
        email: "cloveMarlo@example.com",
        role: {
            connect: {
                name: "user",
            },
        },
        phoneNumber: "333-333-3333",
    },
    {
        email: "tony@example.com",
        role: {
            connect: {
                name: "admin",
            },
        },
        phoneNumber: "444-444-4444",
    },
    {
        email: "peterPan@example.com",
        role: {
            connect: {
                name: "user",
            },
        },
        isStudent: true,
        phoneNumber: "555-555-5555",
    },
];

async function seed() {
    // cleanup the existing database
    for (const user of dummyUsers) {
        await prisma.user.delete({ where: { email: user.email } }).catch(() => {
            // no worries if it doesn't exist yet
        });
        await prisma.password
            .deleteMany({ where: { userId: user.email } })
            .catch(() => {
                // no worries if it doesn't exist yet
            });
    }

    await prisma.userRole.deleteMany().catch(() => {
        // no worries if it doesn't exist yet
    });
    await prisma.eventCategory.deleteMany().catch(() => {
        // no worries if it doesn't exist yet
    });
    await prisma.tag.deleteMany().catch(() => {
        // no worries if it doesn't exist yet
    });

    await prisma.userRole
        .createMany({
            data: [
                {
                    name: "admin",
                },
                {
                    name: "user",
                },
            ],
        })
        .catch(() => {
            // no worries if it exists
        });

    for (const user of dummyUsers) {
        await prisma.user.create({
            data: {
                ...user,
                password: {
                    create: {
                        hash: bcrypt.hashSync("12345678", 10),
                    },
                },
            },
        });
    }

    await prisma.eventCategory
        .createMany({
            data: [
                {
                    name: "konferencja",
                    pluralName: "konferencje",
                },
                {
                    name: "szkolenie",
                    pluralName: "szkolenia",
                },
                {
                    name: "warsztat",
                    pluralName: "warsztaty",
                },
                {
                    name: "inne",
                    pluralName: "inne",
                },
            ],
        })
        .catch(() => {
            // no worries if it exists
        });

    await prisma.tag
        .createMany({
            data: [
                {
                    name: "nowy",
                },
                {
                    name: "kariera",
                },
                {
                    name: "rozwój",
                },
                {
                    name: "studia",
                },
            ],
        })
        .catch(() => {
            // no worries if it exists
        });

    console.log(`Database has been seeded. 🌱`);
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
