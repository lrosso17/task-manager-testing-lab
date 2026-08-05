import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';
import { server } from '../../src/mocks/server';
import { TaskListApiScreen } from '../../src/screens/TaskListApiScreen';

const API_URL = 'https://api.taskmanager.com';

const renderScreen = () => render(<TaskListApiScreen />);

describe('TaskListApiScreen - Integración (MSW)', () => {
  it('muestra las tareas obtenidas de la API exitosamente', async () => {
    server.use(
      http.get(`${API_URL}/tasks`, () =>
        HttpResponse.json([{ id: '1', title: 'Tarea desde API', status: 'pending' }])
      )
    );

    await renderScreen();

    await waitFor(() => {
      expect(screen.getByText('Tarea desde API')).toBeTruthy();
    });
  });

  it('muestra un mensaje de error cuando la API falla al obtener tareas', async () => {
    server.use(
      http.get(`${API_URL}/tasks`, () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 })
      )
    );

    await renderScreen();

    await waitFor(() => {
      expect(screen.getByText('Error al obtener las tareas')).toBeTruthy();
    });
  });

  it('muestra estado vacío cuando la API devuelve una lista vacía', async () => {
    server.use(http.get(`${API_URL}/tasks`, () => HttpResponse.json([])));

    await renderScreen();

    await waitFor(() => {
      expect(screen.getByText('No hay tareas aún')).toBeTruthy();
    });
  });

  it('crea una tarea exitosamente y la agrega a la lista', async () => {
    await renderScreen();
    await waitFor(() => expect(screen.getByText('No hay tareas aún')).toBeTruthy());

    await fireEvent.changeText(screen.getByTestId('input-titulo-api'), 'Nueva tarea API');
    await fireEvent.press(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(screen.getByText('Nueva tarea API')).toBeTruthy();
    });
  });

  it('muestra un mensaje de error cuando falla la creación de la tarea', async () => {
    server.use(
      http.post(`${API_URL}/tasks`, () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 })
      )
    );

    await renderScreen();
    await waitFor(() => expect(screen.getByText('No hay tareas aún')).toBeTruthy());

    await fireEvent.changeText(screen.getByTestId('input-titulo-api'), 'Tarea fallida');
    await fireEvent.press(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(screen.getByText('Error al crear la tarea')).toBeTruthy();
    });
  });
});