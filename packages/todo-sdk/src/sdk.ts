import debug from 'debug';
import { DataStore, InMemoryStore } from './data';
import { Todo, TodoSchema } from './types';
import { v4 as uuidv4 } from 'uuid';

// Set up a debugger with the namespace 'ToDoSDK'
const log = debug('ToDoSDK');

export class ToDoSDK {
  private store: DataStore;

  constructor(store: DataStore = new InMemoryStore()) {
    this.store = store;
    log('Initialized with store: %O', store);
  }

  getTodos(): Todo[] {
    log('Fetching all todos');
    return this.store.getTodos();
  }

  addTodo(title: string): Todo {
    log('Adding todo with title: %s', title);
    const newTodo = { id: uuidv4(), title, completed: false };
    TodoSchema.parse(newTodo);
    this.store.addTodo(newTodo);
    return newTodo;
  }

  editTodo(id: string, title?: string, completed?: boolean): boolean {
    log('Editing todo with id: %s', id);
    const todo = this.store.getTodos().find((todo) => todo.id === id);
    if (!todo) {
      log('Todo with id %s not found', id);
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
    log('Deleting todo with id: %s', id);
    return this.store.deleteTodo(id);
  }

  completeTodo(id: string): { success: boolean; alreadyCompleted?: boolean } {
    log('Completing todo with id: %s', id);

    const todo = this.store.getTodos().find((t) => t.id === id);
    if (!todo) {
      log('Todo with id %s not found', id);
      return { success: false };
    }

    if (todo.completed) {
      return { success: false, alreadyCompleted: true };
    }

    return { success: this.store.completeTodo(id) };
  }
}
