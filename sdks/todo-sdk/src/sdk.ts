import * as logger from '@jagreehal/todo-logger';
import { v4 as uuidv4 } from 'uuid';
import { InMemoryStore } from './stores/memory';
import { DataStore, Todo, TodoSchema } from './types';

export class ToDoSDK {
  private store: DataStore;

  constructor(store: DataStore = new InMemoryStore()) {
    this.store = store;
    logger.debug('Initialized with store: %O', store);
  }

  getTodos(): Todo[] {
    logger.debug('Fetching all todos');
    return this.store.getTodos();
  }

  addTodo(title: string): Todo {
    logger.debug('Adding todo with title: %s', title);
    const todo = { id: uuidv4(), title, completed: false };
    TodoSchema.parse(todo);
    this.store.addTodo(todo);
    return todo;
  }

  editTodo(id: string, title?: string, completed?: boolean): boolean {
    logger.debug('Editing todo with id: %s', id);
    const todo = this.store.getTodos().find((todo) => todo.id === id);
    if (!todo) {
      logger.debug('Todo with id %s not found', id);
      return false;
    }

    if (title !== undefined) {
      todo.title = title;
    }

    if (completed !== undefined) {
      todo.completed = completed;
    }

    TodoSchema.parse(todo);

    return this.store.editTodo(id, title, completed);
  }

  deleteTodo(id: string): boolean {
    logger.debug('Deleting todo with id: %s', id);
    return this.store.deleteTodo(id);
  }

  completeTodo(id: string): { success: boolean; alreadyCompleted?: boolean } {
    logger.debug('Completing todo with id: %s', id);

    const todo = this.store.getTodos().find((t) => t.id === id);
    if (!todo) {
      logger.debug('Todo with id %s not found', id);
      return { success: false };
    }

    if (todo.completed) {
      return { success: false, alreadyCompleted: true };
    }

    return { success: this.store.completeTodo(id) };
  }

  logError() {
    logger.error(
      'Example Error',
      new Error(`This is the error: ${Math.random()}`),
    );
  }
}
