import { prisma } from "~/db.server";
import type { Prisma, ScheduledList, User } from "@prisma/client";

export async function saveScheduledLists({
  userId,
  ScheduledLists,
}: {
  userId: User["id"];
  ScheduledLists:
    | ScheduledList[]
    | Omit<ScheduledList, "createdAt" | "updatedAt" | "userId">[];
}) {
  try {
    const upsertScheduledLists = ScheduledLists.map(
      (list): Promise<ScheduledList> => {
        return prisma.scheduledList.upsert({
          where: { id: list.id },
          create: {
            listId: list.listId,
            title: list.title,
            start: list.start,
            end: list.end,
            isDraggable: list.isDraggable,
            description: list.description as Prisma.InputJsonValue,
            user: { connect: { id: userId } },
          },
          update: {
            listId: list.listId,
            title: list.title,
            start: list.start,
            end: list.end,
            isDraggable: list.isDraggable,
            description: list.description as Prisma.InputJsonValue,
          },
        });
      }
    );

    const results = await Promise.all(upsertScheduledLists);
    return { results };
  } catch (error) {
    throw error;
  }
}

export async function getScheduledLists(userId: User["id"]) {
  try {
    const scheduledLists = await prisma.scheduledList.findMany({
      where: { userId: userId },
    });
    return scheduledLists;
  } catch (error) {
    throw error;
  }
}

export async function deleteScheduledList({ id }: Pick<ScheduledList, "id">) {
  try {
    const deleteResult = await prisma.scheduledList.delete({
      where: { id },
    });
    return deleteResult;
  } catch (error) {
    throw error;
  }
}
