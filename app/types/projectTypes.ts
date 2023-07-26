import type { Desire, Project } from "@prisma/client";

export type ProjectWithStringDates = Project & { createdAt: String, updatedAt: String }


export type ProjectWithDesires = Project & {desires: {desire: Desire}[]}

export interface ProjectValidationErrorsTypes {
  title?: Project['title']
  description?: Project['description']
}