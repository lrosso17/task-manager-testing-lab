import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TaskList } from '../../src/components/TaskList';
import { Task } from '../../src/types';

const tareaUno: Task = { id: 'l1', title: 'Regar las plantas', status: 'pending' };
const tareaDos: Task = { id: 'l2', title: 'Pagar el arriendo', status: 'completed' };
const tareaTres: Task = { id: 'l3', title: 'Llamar al dentista', status: 'pending' };

describe('TaskList', () => {
  it('muestra el mensaje de estado vacío cuando no hay tareas', async () => {
    await render(<TaskList tasks={[]} />);
    expect(screen.getByText('No hay tareas aún')).toBeTruthy();
  });

  it('oculta el mensaje de estado vacío tan pronto existe al menos una tarea', async () => {
    await render(<TaskList tasks={[tareaUno]} />);
    expect(screen.queryByText('No hay tareas aún')).toBeNull();
  });

  it('usa el singular "1 tarea" cuando la lista contiene un único elemento', async () => {
    await render(<TaskList tasks={[tareaUno]} />);
    expect(screen.getByText('1 tarea')).toBeTruthy();
  });

  it('usa el plural "N tareas" cuando hay más de un elemento', async () => {
    await render(<TaskList tasks={[tareaUno, tareaDos, tareaTres]} />);
    expect(screen.getByText('3 tareas')).toBeTruthy();
  });

  it('renderiza el título de cada tarea de la lista', async () => {
    await render(<TaskList tasks={[tareaUno, tareaDos]} />);
    expect(screen.getByText('Regar las plantas')).toBeTruthy();
    expect(screen.getByText('Pagar el arriendo')).toBeTruthy();
  });

  it('propaga el id correcto a onDelete al eliminar una tarjeta específica de la lista', async () => {
    const onDeleteSpy = jest.fn();
    await render(<TaskList tasks={[tareaUno, tareaDos]} onDelete={onDeleteSpy} />);

    const botonesEliminar = screen.getAllByText('Eliminar');
    await fireEvent.press(botonesEliminar[1]);

    expect(onDeleteSpy).toHaveBeenCalledWith('l2');
  });
});
