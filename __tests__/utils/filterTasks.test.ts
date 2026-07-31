import { filterTasksByStatus } from '../../src/utils/filterTasks';
import { Task } from '../../src/types';

// Pruebas de filterTasksByStatus: valida el filtrado de tareas
// por estado, el comportamiento con listas vacías y la
// validación de estados no permitidos.

const tasks: Task[] = [
  { id: '1', title: 'Enviar informe', status: 'completed' },
  { id: '2', title: 'Revisar correos', status: 'pending' },
  { id: '3', title: 'Actualizar dependencias', status: 'pending' },
];

describe('filterTasksByStatus', () => {
  it('filtra solo las tareas pendientes', () => {
    const result = filterTasksByStatus(tasks, 'pending');
    expect(result).toEqual([tasks[1], tasks[2]]);
    expect(result).toContain(tasks[1]);
  });

  it('retorna todas las tareas cuando el filtro es "all"', () => {
    expect(filterTasksByStatus(tasks, 'all')).toEqual(tasks);
  });

  it('retorna un arreglo vacío si la lista de entrada está vacía', () => {
    expect(filterTasksByStatus([], 'pending')).toEqual([]);
  });

  it('retorna un arreglo vacío si ninguna tarea coincide con el estado', () => {
    const soloCompletadas: Task[] = [{ id: '9', title: 'Ya hecha', status: 'completed' }];
    expect(filterTasksByStatus(soloCompletadas, 'pending')).toEqual([]);
  });

  it('lanza un error si el estado no es válido', () => {
    // @ts-expect-error se prueba un valor fuera del tipo permitido
    expect(() => filterTasksByStatus(tasks, 'urgente')).toThrow('Estado inválido: urgente');
  });

  it('lanza un error si el estado llega como null', () => {
    // @ts-expect-error se prueba un valor nulo, no contemplado en el tipo
    expect(() => filterTasksByStatus(tasks, null)).toThrow();
  });
});
