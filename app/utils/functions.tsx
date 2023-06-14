
 // adjust the path according to your project structure

import { ToDo } from "@prisma/client";

export function transformData(data: any) {

  return data.map((item: any) => ({
    ...item,
    createdAt: new Date(item.createdAt!),
    updatedAt: new Date(item.updatedAt!),
    dueDate: item.dueDate ? new Date(item.dueDate) : null,
  }));
} 