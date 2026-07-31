import { renderHook, act } from '@testing-library/react-native';
import { useCounter } from '../../src/hooks/useCounter';

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
});
