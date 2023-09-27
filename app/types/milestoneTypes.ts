import type { Milestone, MilestoneGroup } from "@prisma/client";

export type CreateMilestone = Omit<Milestone, "id" | "createdAt" | "updatedAt">;

export type MilestoneGroupsWithMilestones = MilestoneGroup & {
  milestones: Milestone[];
};

export type MilestoneGroupsWithMilestonesWithStringDates = MilestoneGroupsWithStrDates & {
  milestones: MilestoneWithStrDates[];
};

export type MilestoneGroupsWithStrDates = Omit<
  MilestoneGroup,
  "createdAt" | "updatedAt"
> & { createdAt: string; updatedAt: string };

export type MilestoneWithStrDates = Omit<
  Milestone,
  "createdAt" | "updatedAt" | "dueDate" | "completedAt"
> & {
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  completedAt: string;
};
