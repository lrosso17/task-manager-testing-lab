import { http, HttpResponse } from 'msw';
import { server } from '../../src/mocks/server';
import {
  TaskSchema,
  TaskListSchema,
  CreateTaskResponseSchema,
} from '../../src/schemas/taskSchema';

const API_URL = 'https://api.taskmanager.com';

/**
 * Pruebas de contrato de API (Actividad 4).
 *
 * Contrato evaluado:
 * 1) GET /tasks  -> devuelve Task[] (TaskListSchema)
 * 2) POST /tasks -> recibe { title: string } y devuelve una Task (TaskSchema)
 *
 * Cada endpoint tiene un caso de respuesta VÁLIDA (cumple el esquema) y un
 * caso de respuesta INVÁLIDA (el backend rompe el contrato), usando MSW
 * para simular la respuesta real de red y Zod (`safeParse`) para validarla.
 */
describe('API Contract - GET /tasks', () => {
  it('respuesta válida: cumple TaskListSchema (id:string, title:string, status enum)', async () => {
    const res = await fetch(`${API_URL}/tasks`);
    const body = await res.json();

    const result = TaskListSchema.safeParse(body);

    expect(res.ok).toBe(true);
    expect(result.success).toBe(true);
  });

  it('respuesta inválida: detecta violación del contrato (tipo incorrecto y status fuera de enum)', async () => {
    server.use(
      http.get(`${API_URL}/tasks`, () =>
        HttpResponse.json([
          // id numérico (debería ser string) y status fuera del enum permitido
          { id: 1, title: 'Tarea rota', status: 'archived' },
        ])
      )
    );

    const res = await fetch(`${API_URL}/tasks`);
    const body = await res.json();

    const result = TaskListSchema.safeParse(body);

    expect(result.success).toBe(false);
  });
});

describe('API Contract - POST /tasks', () => {
  it('respuesta válida: cumple TaskSchema al crear una tarea', async () => {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Nueva tarea de prueba' }),
    });
    const body = await res.json();

    const result = CreateTaskResponseSchema.safeParse(body);

    expect(res.status).toBe(201);
    expect(result.success).toBe(true);
  });

  it('respuesta inválida: detecta cuando la API omite un campo requerido (title)', async () => {
    server.use(
      http.post(`${API_URL}/tasks`, () =>
        HttpResponse.json({ id: '99', status: 'pending' }, { status: 201 })
      )
    );

    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Otra tarea' }),
    });
    const body = await res.json();

    const result = TaskSchema.safeParse(body);

    expect(result.success).toBe(false);
  });
});

describe('API Contract - validaciones adicionales del esquema Task', () => {
  it('TaskSchema rechaza un id de tipo incorrecto', () => {
    const invalidResponse = { id: 123, title: 'Test', status: 'pending' };
    expect(TaskSchema.safeParse(invalidResponse).success).toBe(false);
  });

  it('TaskSchema rechaza cuando falta un campo requerido', () => {
    const incompleteResponse = { id: '1', status: 'pending' };
    expect(TaskSchema.safeParse(incompleteResponse).success).toBe(false);
  });
});
