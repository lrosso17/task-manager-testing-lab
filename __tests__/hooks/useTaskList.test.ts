import { renderHook, act } from '@testing-library/react-native';
import { useTaskList } from '../../src/hooks/useTaskList';
import { Task } from '../../src/types';

describe('useTaskList', () => {
  it('arranca sin tareas, sin error y con el contador en cero cuando no recibe datos iniciales', async () => {
    const { result } = await renderHook(() => useTaskList());
    expect(result.current.tasks).toEqual([]);
    expect(result.current.taskCount).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('respeta la lista inicial recibida por parámetro', async () => {
    const iniciales: Task[] = [{ id: 'a1', title: 'Tarea precargada', status: 'pending' }];
    const { result } = await renderHook(() => useTaskList(iniciales));
    expect(result.current.taskCount).toBe(1);
    expect(result.current.tasks[0].title).toBe('Tarea precargada');
  });

  it('agrega una tarea nueva con estado "pending" y sin error', async () => {
    const { result } = await renderHook(() => useTaskList());

    await act(() => {
      result.current.addTask('Comprar boletos');
    });

    expect(result.current.taskCount).toBe(1);
    expect(result.current.tasks[0].title).toBe('Comprar boletos');
    expect(result.current.tasks[0].status).toBe('pending');
    expect(result.current.error).toBeNull();
  });

  it('no agrega la tarea y expone un mensaje de error cuando el título está vacío', async () => {
    const { result } = await renderHook(() => useTaskList());

    await act(() => {
      result.current.addTask('   ');
    });

    expect(result.current.tasks).toHaveLength(0);
    expect(result.current.error).toBe('El título no puede estar vacío');
  });

  it('limpia el error previo tan pronto se registra una tarea válida', async () => {
    const { result } = await renderHook(() => useTaskList());

    // Primero se fuerza el estado de error...
    await act(() => {
      result.current.addTask('');
    });
    expect(result.current.error).not.toBeNull();

    // ...y luego se valida que una operación exitosa lo restablezca.
    await act(() => {
      result.current.addTask('Reunión de equipo');
    });
    expect(result.current.error).toBeNull();
    expect(result.current.taskCount).toBe(1);
  });

  it('elimina la tarea correspondiente al id indicado y conserva las demás', async () => {
    const iniciales: Task[] = [
      { id: 'a1', title: 'Tarea A', status: 'pending' },
      { id: 'a2', title: 'Tarea B', status: 'completed' },
      { id: 'a3', title: 'Tarea C', status: 'pending' },
    ];
    const { result } = await renderHook(() => useTaskList(iniciales));

    await act(() => {
      result.current.removeTask('a2');
    });

    expect(result.current.tasks).toHaveLength(2);
    expect(result.current.tasks.map((t) => t.id)).toEqual(['a1', 'a3']);
  });

  it('no falla ni cambia la lista al intentar eliminar un id que no existe', async () => {
    const iniciales: Task[] = [{ id: 'a1', title: 'Tarea única', status: 'pending' }];
    const { result } = await renderHook(() => useTaskList(iniciales));

    await act(() => {
      result.current.removeTask('id-inexistente');
    });

    expect(result.current.tasks).toHaveLength(1);
  });
});
