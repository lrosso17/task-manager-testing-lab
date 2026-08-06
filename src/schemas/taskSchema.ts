import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  status: z.enum(['pending', 'completed']),
  createdAt: z.string().datetime().optional(),
});

export const TaskListSchema = z.array(TaskSchema);

// Esquema del body que se envía en POST /tasks
export const CreateTaskRequestSchema = z.object({
  title: z.string().min(1),
});

// La respuesta de POST /tasks es una única tarea (mismo contrato que TaskSchema)
export const CreateTaskResponseSchema = TaskSchema;

export type Task = z.infer<typeof TaskSchema>;
export type CreateTaskRequest = z.infer<typeof CreateTaskRequestSchema>;
