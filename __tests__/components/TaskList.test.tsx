import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TaskList } from '../../src/components/TaskList';

describe('TaskList', () => {
  it('muestra el mensaje de lista vacía cuando no hay tareas', async () => {
    await render(<TaskList tasks={[]} />);
    expect(screen.getByText('No hay tareas aún')).toBeTruthy();
  });
});
