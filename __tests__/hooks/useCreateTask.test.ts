import { renderHook, act } from '@testing-library/react-native';
import { useCreateTask } from '../../src/hooks/useCreateTask';
import { createTask } from '../../src/services/taskService';

// Se mockea el módulo completo de taskService porque el hook depende de una
// llamada externa (createTask). Aislarla nos permite:
//   1) probar la lógica de estado (idle/loading/success/error) sin red real,
//   2) forzar de forma determinista el caso de éxito y el caso de error,
//   3) evitar pruebas lentas o inestables por I/O.
jest.mock('../../src/services/taskService');

const mockedCreateTask = createTask as jest.MockedFunction<typeof createTask>;

describe('useCreateTask', () => {
  beforeEach(() => {
    mockedCreateTask.mockClear();
  });

  it('inicia en estado "idle" y con la lista de tareas vacía', async () => {
    const { result } = await renderHook(() => useCreateTask());
    expect(result.current.status).toBe('idle');
    expect(result.current.tasks).toEqual([]);
  });

  it('pasa a "success" y agrega la tarea al inicio de la lista cuando el servicio responde bien', async () => {
    mockedCreateTask.mockResolvedValueOnce({ id: '1', title: 'Estudiar Jest', status: 'pending' });

    const { result } = await renderHook(() => useCreateTask());
    await act(async () => {
      await result.current.submit('Estudiar Jest');
    });

    expect(mockedCreateTask).toHaveBeenCalledWith('Estudiar Jest');
    expect(mockedCreateTask).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe('success');
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Estudiar Jest');
  });

  it('pasa a "error" cuando el servicio de creación falla', async () => {
    mockedCreateTask.mockRejectedValueOnce(new Error('Fallo de red'));

    const { result } = await renderHook(() => useCreateTask());
    await act(async () => {
      await result.current.submit('Tarea que falla');
    });

    expect(result.current.status).toBe('error');
    expect(result.current.tasks).toEqual([]);
  });

  it('elimina una tarea existente por su id', async () => {
    mockedCreateTask.mockResolvedValueOnce({ id: '1', title: 'Tarea A', status: 'pending' });

    const { result } = await renderHook(() => useCreateTask());
    await act(async () => {
      await result.current.submit('Tarea A');
    });
    expect(result.current.tasks).toHaveLength(1);

    await act(async () => {
      result.current.removeTask('1');
    });
    expect(result.current.tasks).toEqual([]);
  });
});
