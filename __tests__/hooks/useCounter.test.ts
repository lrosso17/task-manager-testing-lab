import { renderHook, act } from '@testing-library/react-native';
import { useCounter } from '../../src/hooks/useCounter';

describe('useCounter', () => {
  it('usa 0 como valor inicial cuando no se pasa un argumento', async () => {
    const { result } = await renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('respeta el valor inicial personalizado recibido por parámetro', async () => {
    const { result } = await renderHook(() => useCounter(25));
    expect(result.current.count).toBe(25);
  });

  it('incrementa el valor de forma acumulativa en llamadas sucesivas', async () => {
    const { result } = await renderHook(() => useCounter(0));

    await act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);

    await act(() => {
      result.current.increment();
      result.current.increment();
    });
    expect(result.current.count).toBe(3);
  });

  it('permite que el contador tome valores negativos al decrementar', async () => {
    const { result } = await renderHook(() => useCounter(1));

    await act(() => {
      result.current.decrement();
      result.current.decrement();
    });
    expect(result.current.count).toBe(-1);
  });

  it('reset() vuelve siempre al valor inicial, sin importar cuánto se haya modificado', async () => {
    const { result } = await renderHook(() => useCounter(7));

    await act(() => {
      result.current.increment();
      result.current.increment();
      result.current.decrement();
    });
    expect(result.current.count).toBe(8);

    await act(() => {
      result.current.reset();
    });
    expect(result.current.count).toBe(7);
  });
});
