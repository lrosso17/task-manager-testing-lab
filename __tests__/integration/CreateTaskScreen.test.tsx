import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CreateTaskScreen } from '../../src/screens/CreateTaskScreen';

// Métricas de área segura mínimas requeridas por SafeAreaProvider en
// entorno de pruebas (sin dispositivo real que las reporte).
const areaSegura = {
  frame: { x: 0, y: 0, width: 375, height: 812 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

const montarPantalla = () =>
  render(
    <SafeAreaProvider initialMetrics={areaSegura}>
      <CreateTaskScreen />
    </SafeAreaProvider>
  );

describe('CreateTaskScreen — flujo de integración', () => {
  it('permite crear una tarea desde el formulario y la refleja en la lista con mensaje de éxito', async () => {
    await montarPantalla();

    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Preparar demo del sprint'
    );
    await fireEvent.press(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(screen.getByText('Tarea creada exitosamente')).toBeTruthy();
    });
    expect(screen.getByText('Preparar demo del sprint')).toBeTruthy();
  });

  it('abre el diálogo de confirmación al eliminar y quita la tarea de la lista al confirmar', async () => {
    await montarPantalla();

    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Tarea temporal para borrar'
    );
    await fireEvent.press(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(screen.getByText('Tarea temporal para borrar')).toBeTruthy();
    });

    await fireEvent.press(screen.getByLabelText('Eliminar tarea Tarea temporal para borrar'));
    expect(screen.getByText('Eliminar tarea')).toBeTruthy();

    await fireEvent.press(screen.getByLabelText('Confirmar eliminación'));

    await waitFor(() => {
      expect(screen.queryByText('Tarea temporal para borrar')).toBeNull();
    });
  });
});
