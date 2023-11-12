import type { ScheduledItem } from "@prisma/client";
import type { ListAndToDos } from "./listTypes";
import type { RoutineAndTasks } from "./routineTypes";
import type { OutcomeWithAll } from "./outcomeTypes";
import type { DesireWithOutcomesAndAll } from "./desireTypes";

export type ScheduleItemNotYetSaved = Omit<
  ScheduledItem,
  "createdAt" | "updatedAt" | "userId"
>;
export type AllScheduleItems = ScheduledItem | ScheduleItemNotYetSaved;

export type ScheduledItemWithStrDates = Omit<ScheduledItem, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type AllDraggedItems =
  | ListAndToDos
  | RoutineAndTasks
  | OutcomeWithAll
  | DesireWithOutcomesAndAll
  | undefined;

export type JustDroppedItem = Omit<
  ScheduledItem,
  | "createdAt"
  | "updatedAt"
  | "userId"
  | ("description" & { description: string })
>;


type TimeblockItem = {
  type: 'timeblock';
  isMainFocus: boolean;
  desireId: string;
  outcomeId: string;
};

type OutcomeItem = {
  type: 'outcome';
  isMainFocus: boolean;
  subType: 'list' | 'routine';
  outcomeId: string;
  itemId: string;
};

type ListItem = {
  type: 'list';
  listId: string;
};

type RoutineItem = {
  type: 'routine';
  routineId: string;
};

export type DraggedItemDescription = TimeblockItem | OutcomeItem | ListItem | RoutineItem ;

export type DroppedItem = Omit<ScheduledItem, 'createdAt' | 'updatedAt' | 'userId' | 'description' & { description: DraggedItemDescription }>