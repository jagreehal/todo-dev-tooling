#!/usr/bin/env node
import * as logger from '@jagreehal/todo-logger';
import { JSONFileStore, ToDoSDK } from '@jagreehal/todo-sdk';
import { program } from 'commander';
import { z } from 'zod';
import { version } from '../package.json';

const TodoIdSchema = z.string().uuid();

const sdk = new ToDoSDK(new JSONFileStore('todos.json'));

logger.init({
  sentry: {
    dsn: 'https://6637ef503a14d7b026b05808475f41ad@o4506026535485440.ingest.sentry.io/4506026536665088',
  },
  pino: {
    level: 'debug',
  },
});

program.version(version).description(`CLI for ToDo SDK: ${version}`);

program
  .command('list')
  .description('List all todos')
  .action(() => {
    const todos = sdk.getTodos();
    for (const todo of todos) {
      console.log(
        `[${todo.id}] - ${todo.title} ${todo.completed ? '✅' : '⭕'}`,
      );
    }
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

program
  .command('error')
  .description('Cause an error to be logged')
  .action(() => {
    sdk.logError();
  });

program.parse(process.argv);
