import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TaskForm } from '../../src/components/TaskForm';

describe('TaskForm', () => {
  it('renderiza el campo de texto y el botón "Guardar"', async () => {
    await render(<TaskForm onSubmit={jest.fn()} />);
    expect(screen.getByTestId('input-titulo')).toBeTruthy();
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('actualiza el valor visible del campo a medida que el usuario escribe', async () => {
    await render(<TaskForm onSubmit={jest.fn()} />);
    const input = screen.getByTestId('input-titulo');

    await fireEvent.changeText(input, 'Organizar el escritorio');

    expect(input.props.value).toBe('Organizar el escritorio');
  });

  it('llama a onSubmit con el texto ingresado al presionar "Guardar"', async () => {
    const onSubmitSpy = jest.fn();
    await render(<TaskForm onSubmit={onSubmitSpy} />);

    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Actualizar el CV'
    );
    await fireEvent.press(screen.getByRole('button'));

    expect(onSubmitSpy).toHaveBeenCalledTimes(1);
    expect(onSubmitSpy).toHaveBeenCalledWith('Actualizar el CV');
  });

  it('no invoca onSubmit si se presiona "Guardar" sin escribir nada (campo vacío)', async () => {
    const onSubmitSpy = jest.fn();
    await render(<TaskForm onSubmit={onSubmitSpy} />);

    await fireEvent.press(screen.getByRole('button'));

    expect(onSubmitSpy).not.toHaveBeenCalled();
  });

  it('no invoca onSubmit si el campo contiene únicamente espacios en blanco', async () => {
    const onSubmitSpy = jest.fn();
    await render(<TaskForm onSubmit={onSubmitSpy} />);

    await fireEvent.changeText(screen.getByTestId('input-titulo'), '     ');
    await fireEvent.press(screen.getByRole('button'));

    expect(onSubmitSpy).not.toHaveBeenCalled();
  });
});
