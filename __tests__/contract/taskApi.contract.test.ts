import { TaskSchema, TaskListSchema } from '../../src/schemas/taskSchema';

describe('Contrato de la API de tareas', () => {
  it('acepta una lista de tareas bien formada como respuesta de GET /tasks', () => {
    const respuesta = [
      { id: 'x1', title: 'Tarea válida uno', status: 'pending' },
      { id: 'x2', title: 'Tarea válida dos', status: 'completed' },
    ];
    expect(TaskListSchema.safeParse(respuesta).success).toBe(true);
  });

  it('acepta una tarea individual que incluye createdAt en formato ISO', () => {
    const tarea = {
      id: 'x3',
      title: 'Tarea con fecha',
      status: 'pending',
      createdAt: '2026-07-28T10:00:00.000Z',
    };
    expect(TaskSchema.safeParse(tarea).success).toBe(true);
  });

  it('rechaza una tarea cuyo id no es una cadena de texto', () => {
    const tarea = { id: 999, title: 'Id numérico', status: 'pending' };
    expect(TaskSchema.safeParse(tarea).success).toBe(false);
  });

  it('rechaza una tarea sin el campo title', () => {
    const tarea = { id: 'x4', status: 'pending' };
    expect(TaskSchema.safeParse(tarea).success).toBe(false);
  });

  it('rechaza una tarea con un título vacío', () => {
    const tarea = { id: 'x5', title: '', status: 'pending' };
    expect(TaskSchema.safeParse(tarea).success).toBe(false);
  });

  it('rechaza una tarea con un status fuera del enum permitido', () => {
    const tarea = { id: 'x6', title: 'Estado inválido', status: 'archived' };
    expect(TaskSchema.safeParse(tarea).success).toBe(false);
  });
});
