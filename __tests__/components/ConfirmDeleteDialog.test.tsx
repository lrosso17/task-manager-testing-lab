import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ConfirmDeleteDialog } from '../../src/components/ConfirmDeleteDialog';

// onConfirm/onCancel son callbacks que en producción los provee la pantalla
// contenedora (quien realmente borra la tarea o cierra el modal). Se
// mockean con jest.fn() para verificar, de forma aislada, que el diálogo
// dispara la acción correcta según el botón presionado, sin ejecutar
// lógica real de borrado.
describe('ConfirmDeleteDialog', () => {
  it('muestra el título fijo "Eliminar tarea" cuando está visible', async () => {
    await render(
      <ConfirmDeleteDialog visible taskTitle="Comprar café" onConfirm={jest.fn()} onCancel={jest.fn()} />
    );
    expect(screen.getByText('Eliminar tarea')).toBeTruthy();
  });

  it('incluye el nombre de la tarea entre comillas dentro del mensaje de confirmación', async () => {
    await render(
      <ConfirmDeleteDialog visible taskTitle="Renovar el pasaporte" onConfirm={jest.fn()} onCancel={jest.fn()} />
    );
    expect(
      screen.getByText(
        '¿Seguro que quieres eliminar "Renovar el pasaporte"? Esta acción no se puede deshacer.'
      )
    ).toBeTruthy();
  });

  it('usa un texto genérico ("esta tarea") cuando no se recibe taskTitle', async () => {
    await render(<ConfirmDeleteDialog visible onConfirm={jest.fn()} onCancel={jest.fn()} />);
    expect(
      screen.getByText('¿Seguro que quieres eliminar esta tarea? Esta acción no se puede deshacer.')
    ).toBeTruthy();
  });

  it('invoca onConfirm exactamente una vez al presionar el botón de confirmación', async () => {
    const onConfirmSpy = jest.fn();
    await render(
      <ConfirmDeleteDialog visible taskTitle="Tarea X" onConfirm={onConfirmSpy} onCancel={jest.fn()} />
    );

    await fireEvent.press(screen.getByLabelText('Confirmar eliminación'));

    expect(onConfirmSpy).toHaveBeenCalledTimes(1);
  });

  it('invoca onCancel y no onConfirm al presionar "Cancelar"', async () => {
    const onConfirmSpy = jest.fn();
    const onCancelSpy = jest.fn();
    await render(
      <ConfirmDeleteDialog
        visible
        taskTitle="Tarea X"
        onConfirm={onConfirmSpy}
        onCancel={onCancelSpy}
      />
    );

    await fireEvent.press(screen.getByLabelText('Cancelar'));

    expect(onCancelSpy).toHaveBeenCalledTimes(1);
    expect(onConfirmSpy).not.toHaveBeenCalled();
  });
});
