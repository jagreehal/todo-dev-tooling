import { z } from 'zod';

export const TodoSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  completed: z.boolean().optional(),
});

export type DataStore = {
  getTodos(): Todo[];
  addTodo(todo: Todo): void;
  editTodo(id: string, title?: string, completed?: boolean): boolean;
  deleteTodo(id: string): boolean;
  completeTodo(id: string): boolean;
};

export type Todo = z.infer<typeof TodoSchema>;
