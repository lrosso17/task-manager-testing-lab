import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TaskForm } from '../../src/components/TaskForm';
import { LabeledInput } from '../../src/components/LabeledInput';
import { StatusBadge } from '../../src/components/StatusBadge';
import { ConfirmDeleteDialog } from '../../src/components/ConfirmDeleteDialog';

describe('Accesibilidad - Componentes adicionales', () => {
  it('TaskForm: el campo de título tiene accessibilityLabel', async () => {
    await render(<TaskForm onSubmit={jest.fn()} />);
    const input = screen.getByLabelText('Título de la tarea');
    expect(input).toBeTruthy();
  });

  it('LabeledInput: expone su label como texto visible asociado al campo', async () => {
    await render(
      <LabeledInput label="Correo electrónico" placeholder="juan@correo.com" />
    );
    expect(screen.getByText('Correo electrónico')).toBeTruthy();
    expect(screen.getByPlaceholderText('juan@correo.com')).toBeTruthy();
  });

  it('StatusBadge: tiene accessibilityLabel descriptivo según el estado', async () => {
    await render(<StatusBadge status="completed" />);
    expect(screen.getByLabelText('Estado: Completada')).toBeTruthy();
  });

  it('ConfirmDeleteDialog: ambos botones tienen accessibilityRole button', async () => {
    await render(
      <ConfirmDeleteDialog
        visible={true}
        taskTitle="Tarea de prueba"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
});