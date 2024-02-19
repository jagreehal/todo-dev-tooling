import { describe, expect, test, beforeEach } from 'vitest';
import { ToDoSDK } from './index';

describe('ToDoSDK', () => {
  let sdk: ToDoSDK;

  // This will reset the state before every test
  beforeEach(() => {
    sdk = new ToDoSDK();
  });

  test('addTodo', () => {
    const todo = sdk.addTodo('Test Todo');
    expect(typeof todo.id).toBe('string');
    expect(todo.title).toBe('Test Todo');
    expect(todo.completed).toBe(false);
  });

  test('getTodos', () => {
    sdk.addTodo('Test Todo');
    expect(sdk.getTodos()).toHaveLength(1);
  });

  test('deleteTodo', () => {
    const todo = sdk.addTodo('Test Todo');
    const result = sdk.deleteTodo(todo.id);
    expect(result).toBe(true);
    expect(sdk.getTodos()).toHaveLength(0);
  });

  test('completeTodo', () => {
    const todo = sdk.addTodo('Test Todo');
    const result = sdk.completeTodo(todo.id);
    expect(result.success).toBe(true); // Modified this line
    const completedTodo = sdk.getTodos()[0];
    expect(completedTodo.completed).toBe(true);
  });

  test('editTodo', () => {
    const todo = sdk.addTodo('Test Todo');

    const editTitleResult = sdk.editTodo(todo.id, 'Edited Test Todo');
    expect(editTitleResult).toBe(true);
    let editedTodo = sdk.getTodos()[0];
    expect(editedTodo.title).toBe('Edited Test Todo');

    const editCompletedResult = sdk.editTodo(todo.id, undefined, true);
    expect(editCompletedResult).toBe(true);
    editedTodo = sdk.getTodos()[0];
    expect(editedTodo.completed).toBe(true);

    const nonExistentEdit = sdk.editTodo(
      'non-existent-uuid',
      'Non-existent Todo',
    );
    expect(nonExistentEdit).toBe(false);
  });
});
