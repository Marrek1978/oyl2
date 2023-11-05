

export type SortableWithTitleAndDesc<T extends { id: string, sortOrder: number, title: string, description: string | null} = {id: string, sortOrder: number, title: string, description: string}> = T;

export type HasSortOrder = {
  sortOrder: any;
  id:string;
  [key: string]: any;
};
