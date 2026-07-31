import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TaskList } from '../../src/components/TaskList';
import { Task } from '../../src/types';

// Pruebas de TaskList: valida el estado condicional según haya o no tareas.
describe('TaskList', () => {
  it('muestra el mensaje de lista vacía cuando no hay tareas', async () => {
    await render(<TaskList tasks={[]} />);
    expect(screen.getByText('No hay tareas aún')).toBeTruthy();
  });

  it('muestra la lista y el contador de tareas cuando sí hay elementos', async () => {
    const tasks: Task[] = [
      { id: '1', title: 'Regar las plantas', status: 'pending' },
      { id: '2', title: 'Pagar el arriendo', status: 'completed' },
    ];
    await render(<TaskList tasks={tasks} />);
    expect(screen.getByText('2 tareas')).toBeTruthy();
    expect(screen.getByText('Regar las plantas')).toBeTruthy();
  });
});
