import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TaskCard } from '../../src/components/TaskCard';
import { Task } from '../../src/types';

const tarea: Task = { id: 'c1', title: 'Diseñar wireframes', status: 'pending' };

describe('TaskCard', () => {
  it('muestra el título y el estado de la tarea', async () => {
    await render(<TaskCard task={tarea} onDelete={jest.fn()} />);
    expect(screen.getByText('Diseñar wireframes')).toBeTruthy();
    expect(screen.getByText('○ Pendiente')).toBeTruthy();
  });

  it('llama a onDelete con el id correcto al presionar Eliminar', async () => {
    const onDelete = jest.fn();
    await render(<TaskCard task={tarea} onDelete={onDelete} />);
    await fireEvent.press(screen.getByText('Eliminar'));
    expect(onDelete).toHaveBeenCalledWith('c1');
  });
});
