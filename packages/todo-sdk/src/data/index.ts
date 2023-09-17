import { Todo } from '../types';

export interface DataStore {
  getTodos(): Todo[];
  addTodo(todo: Todo): void;
  editTodo(id: string, title?: string, completed?: boolean): boolean;
  deleteTodo(id: string): boolean;
  completeTodo(id: string): boolean;
}
export class InMemoryStore implements DataStore {
  private todos: Todo[] = [];

  getTodos(): Todo[] {
    return this.todos;
  }

  addTodo(todo: Todo): void {
    this.todos.push(todo);
  }

  editTodo(id: string, title?: string, completed?: boolean): boolean {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) return false;

    if (title) todo.title = title;
    if (completed !== undefined) todo.completed = completed;

    return true;
  }

  deleteTodo(id: string): boolean {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter((todo) => todo.id !== id);
    return this.todos.length < initialLength;
  }

  completeTodo(id: string): boolean {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) return false;
    todo.completed = true;
    return true;
  }
}
