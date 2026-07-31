import { renderHook, act } from '@testing-library/react-native';
import { useCounter } from '../../src/hooks/useCounter';

// Pruebas de useCounter: valida el valor inicial y que las actualizaciones
// de estado se apliquen en el orden en que se disparan los act().
describe('useCounter', () => {
  it('inicia en 0 por defecto', async () => {
    const { result } = await renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('incrementa el contador en el orden correcto', async () => {
    const { result } = await renderHook(() => useCounter());
    await act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);

    await act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(2);
  });

  it('decrementa y luego reinicia al valor inicial con reset()', async () => {
    const { result } = await renderHook(() => useCounter(5));
    await act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(4);

    await act(() => {
      result.current.reset();
    });
    expect(result.current.count).toBe(5);
  });
});
