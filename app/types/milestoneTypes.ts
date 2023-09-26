import type { MilestoneGroup } from "@prisma/client";


export type MilestoneGroupsWithStrDates = Omit<MilestoneGroup, 'createdAt' | 'updatedAt'> & {'createdAt': string, 'updatedAt': string}