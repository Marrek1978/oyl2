import { useSortable } from "@dnd-kit/sortable";
// import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
// import React from "react";
// import ToDoItem from "~/components/list/todos/ToDoItem";
import ProgressEvidenceItem from "./ProgressEvidenceItem";

function SortableProgressItem(props:any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
  useSortable({ id: props.id });

const style = {
  transform: CSS.Transform.toString(transform),
  transition,
};

return (
  <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
    <ProgressEvidenceItem
      todo={props.todo}
      key={props.todo.id}
      id={props.todo.id}
      removeTodo={props.removeTodo}
      editTodo={props.handleOpenEditModal}
    />
  </div>
);
}
export default SortableProgressItem