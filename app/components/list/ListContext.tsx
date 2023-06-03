import React, { createContext, useState, useContext } from 'react';
import type { Todo } from '~/types/listTypes';

interface ListProviderProps {
  children: React.ReactNode;
}
interface ListContextValue {
  listTitle: string;
  setListTitle: React.Dispatch<React.SetStateAction<string>>;
  isRecurring: boolean;
  setIsRecurring: React.Dispatch<React.SetStateAction<boolean>>;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const ListContext = createContext<ListContextValue | undefined>(undefined);

const ListProvider:React.FC<ListProviderProps> = ({ children }) => {
  const [listTitle, setListTitle] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [todos, setTodos] = useState<Todo[]>([]);

  const value = { listTitle, setListTitle, isRecurring, setIsRecurring, todos, setTodos };

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
};

const useList = () => {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error('useList must be used within a ListProvider');
  }
  return context;
};

export { ListProvider, useList };
