import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TaskCard } from '../../src/components/TaskCard';
import { Task } from '../../src/types';

const tarea: Task = { id: 'a11y-1', title: 'Verificar contraste de colores', status: 'pending' };

describe('TaskCard — accesibilidad', () => {
  it('el botón de eliminar es localizable mediante su accessibilityLabel', async () => {
    await render(<TaskCard task={tarea} onDelete={jest.fn()} />);
    expect(screen.getByLabelText('Eliminar tarea Verificar contraste de colores')).toBeTruthy();
  });

  it('la tarjeta completa es localizable por rol de accesibilidad "button"', async () => {
    await render(<TaskCard task={tarea} onDelete={jest.fn()} />);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('el estado de la tarea queda disponible como texto para lectores de pantalla', async () => {
    const completada: Task = { ...tarea, status: 'completed' };
    await render(<TaskCard task={completada} onDelete={jest.fn()} />);
    expect(screen.getByText('✓ Completada')).toBeTruthy();
  });
});
