import type { Desire, Project } from "@prisma/client";
import type { ListAndToDos } from "./listTypes";
import type { RoutineAndToDos } from "./routineTypes";

export type ProjectWithStringDates = Project & { createdAt: String, updatedAt: String }

export type ProjectFromDB = Omit<Project, 'description' | 'desireid'> & { description: string | null,  desireId: string | null}
export type ProjectFromDBWithStringDates = Omit<Project, 'createdAt' | 'updatedAt' | 'description' | 'desireid'> 
   & { createdAt:string, updatedAt:string, description: string | null,  desireId: string | null}

export type ProjectWithListsAndRoutines = Project & {lists: ListAndToDos[],  routines: RoutineAndToDos[]}


export type ProjectWithDesires = Project & {desires: {desire: Desire}[]}

export interface ProjectValidationErrorsTypes {
  title?: Project['title']
  description?: Project['description']
}