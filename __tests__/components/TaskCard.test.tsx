import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TaskCard } from '../../src/components/TaskCard';
import { Task } from '../../src/types';

const tareaPendiente: Task = { id: 'c1', title: 'Diseñar wireframes', status: 'pending' };
const tareaCompletada: Task = { id: 'c2', title: 'Diseñar wireframes', status: 'completed' };

// onDelete es una dependencia inyectada por el componente padre (la pantalla
// que gestiona la lista); se reemplaza con jest.fn() para comprobar que
// TaskCard la invoca con el id correcto, sin acoplar el test a cómo el
// padre decide borrar la tarea.
const onDeleteSpy = jest.fn();

describe('TaskCard', () => {
  beforeEach(() => {
    onDeleteSpy.mockClear();
  });

  it('renderiza el título recibido por props', async () => {
    await render(<TaskCard task={tareaPendiente} onDelete={onDeleteSpy} />);
    expect(screen.getByText('Diseñar wireframes')).toBeTruthy();
  });

  it('muestra la etiqueta de "Pendiente" cuando el estado de la tarea es pending', async () => {
    await render(<TaskCard task={tareaPendiente} onDelete={onDeleteSpy} />);
    expect(screen.getByText('○ Pendiente')).toBeTruthy();
    expect(screen.queryByText('✓ Completada')).toBeNull();
  });

  it('muestra la etiqueta de "Completada" cuando el estado de la tarea es completed', async () => {
    await render(<TaskCard task={tareaCompletada} onDelete={onDeleteSpy} />);
    expect(screen.getByText('✓ Completada')).toBeTruthy();
    expect(screen.queryByText('○ Pendiente')).toBeNull();
  });

  it('expone un rol de accesibilidad de tipo "button" en el contenedor', async () => {
    await render(<TaskCard task={tareaPendiente} onDelete={onDeleteSpy} />);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('invoca a onDelete exactamente una vez y con el id de la tarea al presionar "Eliminar"', async () => {
    await render(<TaskCard task={tareaPendiente} onDelete={onDeleteSpy} />);

    await fireEvent.press(screen.getByText('Eliminar'));

    expect(onDeleteSpy).toHaveBeenCalledTimes(1);
    expect(onDeleteSpy).toHaveBeenCalledWith('c1');
  });

  it('genera una etiqueta accesible de eliminación que incluye el título de la tarea', async () => {
    await render(<TaskCard task={tareaPendiente} onDelete={onDeleteSpy} />);
    expect(screen.getByLabelText('Eliminar tarea Diseñar wireframes')).toBeTruthy();
  });
});
