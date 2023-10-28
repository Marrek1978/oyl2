import type { Routine, Task } from "@prisma/client";

export type RoutineAndTasks = Routine & { tasks: Task[] };

export interface CreationTask {
  id: string;
  body: string;
  complete: boolean;
  sortOrder: number;
}


export type RoutineToDo = CreationTask | Task;

export type RoutineWithStrDates = Omit<Routine, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type TasksWithStrDates = Omit<Task, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type RoutineAndTasksWithStrDates = RoutineWithStrDates & {
  tasks: TasksWithStrDates[];
};
