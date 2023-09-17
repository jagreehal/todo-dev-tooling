import express from 'express';
import { ToDoSDK, Todo } from '@jagreehal/todo-sdk';

const app = express();
const sdk = new ToDoSDK();

app.use(express.json());

app.get('/todos', (req, res) => {
  res.status(200).json(sdk.getTodos());
});

app.post('/todos', (req, res) => {
  const title: string = req.body.title;
  if (title) {
    const newTodo: Todo = sdk.addTodo(title);
    res.status(201).json(newTodo);
  } else {
    res.status(400).json({ error: 'Title is required' });
  }
});

app.delete('/todos/:id', (req, res) => {
  const id: string = req.params.id;

  // Check if the ID is in a valid UUID format
  if (
    !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      id,
    )
  ) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const success = sdk.deleteTodo(id);
  if (success) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

app.patch('/todos/:id/complete', (req, res) => {
  const id: string = req.params.id;

  // Check if the ID is in a valid UUID format
  if (
    !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      id,
    )
  ) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const success = sdk.completeTodo(id);
  if (success) {
    res.status(200).json({ message: 'Todo marked as completed' });
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

export default app;
