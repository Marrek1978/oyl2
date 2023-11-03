import type{ ScheduledItem } from "@prisma/client";

 export type Item = ScheduledItem | Omit<ScheduledItem, 'createdAt' | 'updatedAt' | 'userId'> 