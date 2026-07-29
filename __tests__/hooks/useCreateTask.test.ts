import { renderHook, act } from '@testing-library/react-native';
import { useCreateTask } from '../../src/hooks/useCreateTask';
import * as taskService from '../../src/services/taskService';

// Se mockea el módulo `taskService` completo en lugar de dejar que
// `createTask` corra tal cual. Motivo: aunque hoy `createTask` no llama a
// una API real, sí representa el punto de integración con el backend del
// hook, y es asíncrono. Mockearlo permite:
//   1) controlar de forma determinista si la llamada "resuelve" o "falla",
//      algo que no se puede forzar de otro modo desde el hook;
//   2) probar la máquina de estados (idle → loading → success/error) sin
//      depender de temporizadores reales ni de una futura API HTTP;
//   3) mantener las pruebas rápidas y reproducibles.
jest.spyOn(taskService, 'createTask');
const createTaskMock = taskService.createTask as jest.MockedFunction<typeof taskService.createTask>;

describe('useCreateTask', () => {
  beforeEach(() => {
    createTaskMock.mockReset();
  });

  it('inicia en estado "idle" con la lista de tareas vacía', async () => {
    const { result } = await renderHook(() => useCreateTask());
    expect(result.current.status).toBe('idle');
    expect(result.current.tasks).toEqual([]);
  });

  it('transiciona a "success" e inserta la tarea al inicio de la lista cuando el servicio resuelve', async () => {
    createTaskMock.mockResolvedValueOnce({
      id: 'srv-1',
      title: 'Tarea creada por el servicio',
      status: 'pending',
    });

    const { result } = await renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.submit('Tarea creada por el servicio');
    });

    expect(createTaskMock).toHaveBeenCalledWith('Tarea creada por el servicio');
    expect(createTaskMock).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe('success');
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].id).toBe('srv-1');
  });

  it('antepone las tareas nuevas a las existentes en lugar de reemplazarlas', async () => {
    createTaskMock
      .mockResolvedValueOnce({ id: 'srv-1', title: 'Primera', status: 'pending' })
      .mockResolvedValueOnce({ id: 'srv-2', title: 'Segunda', status: 'pending' });

    const { result } = await renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.submit('Primera');
    });
    await act(async () => {
      await result.current.submit('Segunda');
    });

    expect(result.current.tasks.map((t) => t.title)).toEqual(['Segunda', 'Primera']);
  });

  it('transiciona a "error" y no agrega ninguna tarea cuando el servicio rechaza la promesa', async () => {
    createTaskMock.mockRejectedValueOnce(new Error('Tiempo de espera agotado'));

    const { result } = await renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.submit('Tarea que fallará');
    });

    expect(result.current.status).toBe('error');
    expect(result.current.tasks).toEqual([]);
  });

  it('elimina una tarea previamente creada a partir de su id', async () => {
    createTaskMock.mockResolvedValueOnce({ id: 'srv-9', title: 'Por eliminar', status: 'pending' });

    const { result } = await renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.submit('Por eliminar');
    });
    expect(result.current.tasks).toHaveLength(1);

    await act(() => {
      result.current.removeTask('srv-9');
    });
    expect(result.current.tasks).toEqual([]);
  });
});
