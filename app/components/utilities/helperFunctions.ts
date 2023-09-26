import type { CreationTodo, Todo } from "~/types/listTypes";
import type { CreationRoutineToDo } from "~/types/routineTypes";

import type {
  DesireWithOutcomes,
  DesireWithOutcomesWithStringDates,
} from "~/types/desireTypes";

export function transformToDoDataDates(data: any) {
  return data.map((item: any) => ({
    ...item,
    createdAt: new Date(item.createdAt!),
    updatedAt: new Date(item.updatedAt!),
    todos: item.todos.map((todo: any) => ({
      ...todo,
      createdAt: new Date(todo.createdAt!),
      updatedAt: new Date(todo.updatedAt!),
      dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
    })),
  }));
}

export function transformRoutineDataDates(routines: any) {
  return routines.map((routine: any) => ({
    ...routine,
    createdAt: new Date(routine.createdAt!),
    updatedAt: new Date(routine.updatedAt!),
    routineToDos: routine.routineToDos.map((routineToDo: any) => ({
      ...routineToDo,
      createdAt: new Date(routineToDo.createdAt!),
      updatedAt: new Date(routineToDo.updatedAt!),
    })),
  }));
}

export function transformDesireWithOutcomesDataDates(
  desires: DesireWithOutcomesWithStringDates[]
): DesireWithOutcomes[] {
  return desires.map((desire: DesireWithOutcomesWithStringDates) => ({
    ...desire,
    createdAt: new Date(desire.createdAt!),
    updatedAt: new Date(desire.updatedAt!),
    outcomes: desire.outcomes.map((outcome) => ({
      ...outcome,
      createdAt: new Date(outcome.createdAt!),
      updatedAt: new Date(outcome.updatedAt!),
    })),
  }));
}

 

export function transformScheduledListsDataDates(lists: any) {
  return lists.map((list: any) => ({
    ...list,
    createdAt: new Date(list.createdAt!),
    updatedAt: new Date(list.updatedAt!),
    start: new Date(list.start),
    end: new Date(list.end),
  }));
}

export function sortTodos(todos: Todo[]): Todo[] {
  const todosCopy = [...todos];

  todosCopy.sort((a, b) => {
    // Put completed todos at the bottom
    if (a.complete && !b.complete) {
      return 1;
    } else if (!a.complete && b.complete) {
      return -1;
    } else if (a.urgent && !b.urgent) {
      return -1;
    } else if (!a.urgent && b.urgent) {
      return 1;
    } else if (a.important && !b.important) {
      return -1;
    } else if (!a.important && b.important) {
      return 1;
    } else {
      return 0;
    }
  });

  return resetTodoSortOrder(todosCopy);
}

export function resetTodoSortOrder(todos: CreationTodo[]): CreationTodo[] {
  return todos.map((todo, index) => {
    return {
      ...todo,
      sortOrder: index,
    };
  });
}

export function resetRoutineTodosSortOrder(todos: CreationRoutineToDo[]) {
  return todos.map((todo, index) => {
    return {
      ...todo,
      sortOrder: index,
    };
  });
}
