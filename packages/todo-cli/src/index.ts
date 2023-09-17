#!/usr/bin/env node

import { program } from 'commander';
import { z } from 'zod';

import { ToDoSDK } from '@jagreehal/todo-sdk';

const TodoIdSchema = z.string().uuid();

const sdk = new ToDoSDK();

program.version('1.0.0').description('CLI for ToDo SDK');

program
  .command('list')
  .description('List all todos')
  .action(() => {
    const todos = sdk.getTodos();
    todos.forEach((todo) => {
      console.log(
        `[${todo.id}] - ${todo.title} ${todo.completed ? '(completed)' : ''}`,
      );
    });
  });

program
  .command('add <title>')
  .description('Add a new todo')
  .action((title) => {
    sdk.addTodo(title);
    console.log(`Added new todo: ${title}`);
  });

program
  .command('delete <id>')
  .description('Delete a todo by its ID')
  .action((idString) => {
    const validationResult = TodoIdSchema.safeParse(idString);
    if (!validationResult.success) {
      console.error(validationResult.error.message);
      process.exit(1);
    }

    const success = sdk.deleteTodo(idString);
    if (success) {
      console.log(`Deleted todo with ID: ${idString}`);
    } else {
      console.error(`No todo found with ID: ${idString}`);
    }
  });

program
  .command('complete <id>')
  .description('Mark a todo as completed by its ID')
  .action((idString) => {
    const validationResult = TodoIdSchema.safeParse(idString);
    if (!validationResult.success) {
      console.error(validationResult.error.message);
      process.exit(1);
    }

    const success = sdk.completeTodo(idString);
    if (success) {
      console.log(`Marked todo with ID: ${idString} as completed`);
    } else {
      console.error(`No todo found with ID: ${idString}`);
    }
  });

program.parse(process.argv);
