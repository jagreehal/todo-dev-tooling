import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import app from './app';

const request = supertest(app);

describe('ToDo API', () => {
  let createdTodoId: string;

  it('should fetch all todos', async () => {
    const response = await request.get('/todos');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it('should create a new todo', async () => {
    const response = await request.post('/todos').send({ title: 'New Todo' });
    expect(response.status).toBe(201);
    expect(response.body.title).toBe('New Todo');
    createdTodoId = response.body.id;
  });

  it('should not create a todo without title', async () => {
    const response = await request.post('/todos').send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Title is required');
  });

  it('should complete a todo', async () => {
    const response = await request.patch(`/todos/${createdTodoId}/complete`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Todo marked as completed');
  });

  it('should not complete an already completed todo', async () => {
    const response = await request.patch(`/todos/${createdTodoId}/complete`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Todo already completed');
  });

  it('should not complete a non-existing todo', async () => {
    const nonExistentId = '12345678-1234-1234-1234-123456789012'; // Sample UUID
    const response = await request.patch(`/todos/${nonExistentId}/complete`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Todo not found');
  });

  it('should delete a todo', async () => {
    const response = await request.delete(`/todos/${createdTodoId}`);
    expect(response.status).toBe(204);
  });

  it('should not delete a non-existing todo', async () => {
    const nonExistentId = '12345678-1234-1234-1234-123456789012';
    const response = await request.delete(`/todos/${nonExistentId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Todo not found');
  });

  it('should not delete a todo with invalid ID format', async () => {
    const invalidId = '1234';
    const response = await request.delete(`/todos/${invalidId}`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid ID format');
  });
});
