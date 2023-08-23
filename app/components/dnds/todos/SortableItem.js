import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// import { useDroppable } from "@dnd-kit/core";

import ToDoItem from "~/components/list/todos/ToDoItem";

export function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ToDoItem
        todo={props.todo}
        key={props.todo.id}
        id={props.todo.id}
        removeTodo={props.removeTodo}
        editTodo={props.handleOpenEditModal}
      />
    </div>
  );
}

export default SortableItem;
