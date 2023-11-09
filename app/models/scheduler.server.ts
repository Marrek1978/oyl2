import { prisma } from "~/db.server";
import type { Prisma, ScheduledItem, User } from "@prisma/client";

export async function createScheduledItems({
  userId,
  scheduleItems,
}: {
  userId: User["id"];
  scheduleItems:
    | ScheduledItem[]
    | Omit<ScheduledItem, "createdAt" | "updatedAt" | "userId">[];
}) {
  try {
    const upsertScheduledItems = scheduleItems.map(
      (item): Promise<ScheduledItem> => {
        return prisma.scheduledItem.upsert({
          where: { id: item.id },
          create: {
            itemId: item.itemId,
            title: item.title,
            start: item.start,
            end: item.end,
            isDraggable: item.isDraggable,
            description: item.description as Prisma.InputJsonValue,
            user: { connect: { id: userId } },
          },
          update: {
            itemId: item.itemId,
            title: item.title,
            start: item.start,
            end: item.end,
            isDraggable: item.isDraggable,
            description: item.description as Prisma.InputJsonValue,
          },
        });
      }
    );

    const results = await Promise.all(upsertScheduledItems);
    return { results };
  } catch (error) {
    throw error;
  }
}

export async function getScheduledItems(userId: User["id"]) {
  try {
    return await prisma.scheduledItem.findMany({
      where: { userId: userId },
    });
  } catch (error) {  
    throw error;
  }
}

export async function deleteScheduledItem(id: string) {
  try {
    const deleteResult = await prisma.scheduledItem.delete({
      where: { id },
    });
    return deleteResult;
  } catch (error) {
    throw error;
  }
}
