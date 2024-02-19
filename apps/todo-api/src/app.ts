import { Todo, ToDoSDK } from '@jagreehal/todo-sdk';
import express from 'express';

const app = express();
const sdk = new ToDoSDK();

app.use(express.json());

app.get('/todos', (_, response) => {
  response.status(200).json(sdk.getTodos());
});

app.post('/todos', (request, response) => {
  const title: string = request.body.title;
  if (title) {
    const todo: Todo = sdk.addTodo(title);
    response.status(201).json(todo);
  } else {
    response.status(400).json({ error: 'Title is required' });
  }
});

app.delete('/todos/:id', (request, response) => {
  const id: string = request.params.id;

  // Check if the ID is in a valid UUID format
  if (!/^[\dA-Fa-f]{8}(?:-[\dA-Fa-f]{4}){3}-[\dA-Fa-f]{12}$/.test(id)) {
    return response.status(400).json({ error: 'Invalid ID format' });
  }

  const success = sdk.deleteTodo(id);
  if (success) {
    response.status(204).send();
  } else {
    response.status(404).json({ error: 'Todo not found' });
  }
});

app.patch('/todos/:id/complete', (request, response) => {
  const id: string = request.params.id;

  const result = sdk.completeTodo(id);

  if (result.success) {
    response.status(200).json({ message: 'Todo marked as completed' });
  } else if (result.alreadyCompleted) {
    response.status(400).json({ error: 'Todo already completed' });
  } else {
    response.status(404).json({ error: 'Todo not found' });
  }
});

export default app;
