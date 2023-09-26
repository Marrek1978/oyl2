

export type Sortable<T extends { id: string, sortOrder: number, title: string, description: string | null} = {id: string, sortOrder: number, title: string, description: string}> = T;
