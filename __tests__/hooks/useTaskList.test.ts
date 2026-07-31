import { renderHook, act } from '@testing-library/react-native';
import { useTaskList } from '../../src/hooks/useTaskList';

describe('useTaskList', () => {
  it('agrega una tarea nueva', async () => {
    const { result } = await renderHook(() => useTaskList());
    await act(() => {
      result.current.addTask('Comprar leche');
    });
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Comprar leche');
  });

  it('no agrega la tarea si el título viene vacío', async () => {
    const { result } = await renderHook(() => useTaskList());
    await act(() => {
      result.current.addTask('');
    });
    expect(result.current.tasks).toHaveLength(0);
    expect(result.current.error).toBe('El título no puede estar vacío');
  });
});
