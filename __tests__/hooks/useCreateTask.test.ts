import { renderHook, act } from '@testing-library/react-native';
import { useCreateTask } from '../../src/hooks/useCreateTask';
import * as taskService from '../../src/services/taskService';

// Pruebas de useCreateTask: valida la transición de estados (success/error)
// al crear una tarea, sin depender de un backend real.

jest.spyOn(taskService, 'createTask');
const createTaskMock = taskService.createTask as jest.MockedFunction<typeof taskService.createTask>;

describe('useCreateTask', () => {
  beforeEach(() => {
    createTaskMock.mockReset();
  });

  it('cambia a estado success y agrega la tarea cuando el servicio responde bien', async () => {
    createTaskMock.mockResolvedValueOnce({ id: '1', title: 'Tarea de prueba', status: 'pending' });
    const { result } = await renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.submit('Tarea de prueba');
    });

    expect(result.current.status).toBe('success');
    expect(result.current.tasks).toHaveLength(1);
  });

  it('cambia a estado error cuando el servicio falla', async () => {
    createTaskMock.mockRejectedValueOnce(new Error('fallo de red'));
    const { result } = await renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.submit('Otra tarea');
    });

    expect(result.current.status).toBe('error');
    expect(result.current.tasks).toHaveLength(0);
  });

  it('elimina una tarea ya creada a partir de su id', async () => {
    createTaskMock.mockResolvedValueOnce({ id: '9', title: 'Por eliminar', status: 'pending' });
    const { result } = await renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.submit('Por eliminar');
    });
    expect(result.current.tasks).toHaveLength(1);

    await act(() => {
      result.current.removeTask('9');
    });
    expect(result.current.tasks).toHaveLength(0);
  });
});
