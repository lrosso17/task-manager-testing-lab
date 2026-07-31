import { renderHook, act } from '@testing-library/react-native';
import { useCreateTask } from '../../src/hooks/useCreateTask';
import * as taskService from '../../src/services/taskService';

// Se mockea createTask porque es la dependencia externa (llamada asíncrona
// al servicio) y así se puede controlar si resuelve o falla sin depender
// de una API real.
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
});
