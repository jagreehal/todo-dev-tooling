import { z } from 'zod';

export const TodoSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  completed: z.boolean().optional(),
});

export type Todo = z.infer<typeof TodoSchema>;
