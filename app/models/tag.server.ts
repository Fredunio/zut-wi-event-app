import type { Tag } from "@prisma/client";

import { prisma } from "~/db.server";

export function createTag({ name }: Pick<Tag, "name">) {
    return prisma.tag.create({
        data: { name },
    });
}

export function deleteTag({ name }: Pick<Tag, "name">) {
    return prisma.tag.delete({ where: { name } });
}

export function updateTag({
    name,
    newName,
}: {
    name: string;
    newName: string;
}) {
    return prisma.tag.update({
        where: { name },
        data: { name: newName },
    });
}

export function getTags() {
    return prisma.tag.findMany();
}
