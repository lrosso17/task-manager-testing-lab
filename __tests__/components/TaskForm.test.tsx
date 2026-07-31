import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TaskForm } from '../../src/components/TaskForm';

describe('TaskForm', () => {
  it('envía el título escrito al presionar Guardar', async () => {
    const onSubmit = jest.fn();
    await render(<TaskForm onSubmit={onSubmit} />);

    await fireEvent.changeText(screen.getByTestId('input-titulo'), 'Actualizar el CV');
    await fireEvent.press(screen.getByRole('button'));

    expect(onSubmit).toHaveBeenCalledWith('Actualizar el CV');
  });

  it('no envía nada si el campo está vacío', async () => {
    const onSubmit = jest.fn();
    await render(<TaskForm onSubmit={onSubmit} />);

    await fireEvent.press(screen.getByRole('button'));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
