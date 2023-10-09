import type { Routine as PrismaRoutine, RoutineToDo as RoutineToDos} from "@prisma/client";

export type RoutineAndToDos = PrismaRoutine & { routineToDos: RoutineToDos[] };

export interface CreationRoutineToDo {
  id: string;
  body: string;
  complete: boolean;
  sortOrder: number;
}

export interface DatabaseRoutineToDo extends CreationRoutineToDo {
  createdAt: Date;
  updatedAt: Date;
  routineId: string;
}

export type RoutineToDo = CreationRoutineToDo | DatabaseRoutineToDo;

export type RoutineWithStrDates = Omit<PrismaRoutine, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
