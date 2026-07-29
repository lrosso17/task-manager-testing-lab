import { filterTasksByStatus } from '../../src/utils/filterTasks';
import { Task } from '../../src/types';

const listaBase: Task[] = [
  { id: 't1', title: 'Enviar informe mensual', status: 'completed' },
  { id: 't2', title: 'Revisar correos pendientes', status: 'pending' },
  { id: 't3', title: 'Actualizar dependencias', status: 'pending' },
  { id: 't4', title: 'Cerrar sprint', status: 'completed' },
  { id: 't5', title: 'Escribir pruebas unitarias', status: 'pending' },
];

describe('filterTasksByStatus', () => {
  it('retorna únicamente las tareas pendientes cuando se filtra por "pending"', () => {
    const resultado = filterTasksByStatus(listaBase, 'pending');
    expect(resultado).toHaveLength(3);
    expect(resultado).toContain(listaBase[1]);
    expect(resultado.every((t) => t.status === 'pending')).toBe(true);
  });

  it('retorna únicamente las tareas completadas cuando se filtra por "completed"', () => {
    const resultado = filterTasksByStatus(listaBase, 'completed');
    expect(resultado).toEqual([listaBase[0], listaBase[3]]);
  });

  it('retorna la lista completa sin modificarla cuando el filtro es "all"', () => {
    const resultado = filterTasksByStatus(listaBase, 'all');
    expect(resultado).toEqual(listaBase);
    expect(resultado).toHaveLength(5);
  });

  it('retorna un arreglo vacío cuando ninguna tarea coincide con el estado', () => {
    // "archived" es un valor válido para la función, pero ninguna tarea
    // de la lista base tiene ese estado.
    const resultado = filterTasksByStatus(listaBase, 'archived');
    expect(resultado).toEqual([]);
  });

  it('lanza un error al recibir un estado que no existe en el dominio', () => {
    expect(() =>
      // @ts-expect-error: se prueba deliberadamente un valor fuera del tipo FilterStatus
      filterTasksByStatus(listaBase, 'urgente')
    ).toThrow('Estado inválido: urgente');
  });

  it('no muta el arreglo original al filtrar', () => {
    const copiaOriginal = [...listaBase];
    filterTasksByStatus(listaBase, 'pending');
    expect(listaBase).toEqual(copiaOriginal);
  });

  it('retorna un arreglo vacío si la lista de entrada ya viene vacía', () => {
    expect(filterTasksByStatus([], 'pending')).toEqual([]);
  });
});
