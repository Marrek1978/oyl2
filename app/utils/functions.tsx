

export function transformData(data: any) {

  return data.map((item: any) => ({
    ...item,
    createdAt: new Date(item.createdAt!),
    updatedAt: new Date(item.updatedAt!),
    dueDate: item.dueDate ? new Date(item.dueDate) : null,
  }));
} 

export const formatDate = (dateString: Date | null) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
};

export const formatDateDayDate = (dateString: Date | null) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return `${date.toLocaleString('default', { weekday: 'short', month:'short', day:'numeric' } )} `;
};