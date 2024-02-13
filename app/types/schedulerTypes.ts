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

export type ScheduledItemWithStrDates = Omit<
  ScheduledItem,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export type AllMiscLists = ListAndToDos[];
export type AllMiscListsDraggableObj = {
  id: string;
  title: string;
  name: string;
  description: string;
  lists: ListAndToDos[];
};

export type AllDraggedItems =
  | ListAndToDos
  | RoutineAndTasks
  | OutcomeWithAll
  | DesireWithOutcomesAndAll
  | AllMiscListsDraggableObj
  | undefined;

export type JustDroppedItem = Omit<
  ScheduledItem,
  | "createdAt"
  | "updatedAt"
  | "userId"
  | ("description" & { description: string })
>;

export type OutcomeListsDescription = {
  type: "outcomeLists";
  isMainFocus: boolean;
  desireId: string;
  outcomeId: string;
  lists: ListAndToDos[];
};

type OutcomeItemDescription = {
  type: "outcome";
  isMainFocus: boolean;
  subType: "list" | "routine";
  outcomeId: string;
  itemId: string;
};

type ListItemDescription = {
  type: "list";
  listId: string;
};

type RoutineItemDescription = {
  type: "routine";
  routineId: string;
};

export type DraggedItemDescription =
  | OutcomeListsDescription
  | OutcomeItemDescription
  | ListItemDescription
  | RoutineItemDescription;

export type DroppedItem = {
  id: string;
  itemId: string;
  title: string;
  isDraggable: boolean;
  start: Date;
  end: Date;
  description: Description;
};

export type Description = {
  type?: "outcome" | "outcomeLists" | "list" | "routine" | "allMiscLists";
  isMainFocus?: boolean;
  subType?: "list" | "routine";
  desireId?: string;
  outcomeId?: string | null;
  listId?: string;
  routineId?: string;
  itemId?: string;
};
