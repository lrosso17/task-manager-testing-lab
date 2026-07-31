import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TaskCard } from '../../src/components/TaskCard';
import { Task } from '../../src/types';

// Pruebas de TaskCard: verifica que la tarjeta muestre bien los datos de
// la tarea (en ambos estados) y que dispare la acción de eliminar.
const tarea: Task = { id: 'c1', title: 'Diseñar wireframes', status: 'pending' };

describe('TaskCard', () => {
  it('muestra el título y el estado pendiente de la tarea', async () => {
    await render(<TaskCard task={tarea} onDelete={jest.fn()} />);
    expect(screen.getByText('Diseñar wireframes')).toBeTruthy();
    expect(screen.getByText('○ Pendiente')).toBeTruthy();
  });

  it('muestra el estado completada cuando la tarea ya se hizo', async () => {
    const tareaCompletada: Task = { ...tarea, status: 'completed' };
    await render(<TaskCard task={tareaCompletada} onDelete={jest.fn()} />);
    expect(screen.getByText('✓ Completada')).toBeTruthy();
  });

  it('llama a onDelete con el id correcto al presionar Eliminar', async () => {
    // onDelete se mockea con jest.fn() porque en realidad la borra el
    // componente padre; aquí solo interesa comprobar que TaskCard lo
    // invoca con el id correcto, no la lógica de borrado en sí.
    const onDelete = jest.fn();
    await render(<TaskCard task={tarea} onDelete={onDelete} />);
    await fireEvent.press(screen.getByText('Eliminar'));
    expect(onDelete).toHaveBeenCalledWith('c1');
  });
});
