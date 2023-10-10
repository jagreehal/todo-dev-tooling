import { DataStore, Todo } from '../types';
import fs from 'fs';
import path from 'path';
import * as logger from '@jagreehal/todo-logger';

export class JSONFileStore implements DataStore {
  private todos: Todo[] = [];
  private filePath: string;

  constructor(fileName: string) {
    this.filePath = path.resolve(__dirname, fileName);
    this.loadFromFile();
  }

  private saveToFile() {
    try {
      const dataString = JSON.stringify(this.todos, null, 2);
      fs.writeFileSync(this.filePath, dataString, 'utf8');
      logger.debug(`Data saved to file ${this.filePath}`);
    } catch (error) {
      logger.debug(`Error saving to file: ${this.filePath}`, error);
    }
  }

  private loadFromFile() {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, 'utf8');
        this.todos = JSON.parse(fileContent);
        logger.debug('Data loaded from file');
      } else {
        this.saveToFile();
        logger.debug(
          `File not found. A new file (${this.filePath}) has been created.`,
        );
      }
    } catch (error) {
      logger.error('Error loading from file:', error);
    }
  }

  getTodos(): Todo[] {
    return this.todos;
  }

  addTodo(todo: Todo): void {
    this.todos.push(todo);
    this.saveToFile();
  }

  editTodo(id: string, title?: string, completed?: boolean): boolean {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) return false;

    if (title) todo.title = title;
    if (completed !== undefined) todo.completed = completed;

    this.saveToFile();
    return true;
  }

  deleteTodo(id: string): boolean {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter((todo) => todo.id !== id);
    const isDeleted = this.todos.length < initialLength;

    if (isDeleted) {
      this.saveToFile();
    }

    return isDeleted;
  }

  completeTodo(id: string): boolean {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) return false;
    todo.completed = true;

    this.saveToFile();
    return true;
  }
}
