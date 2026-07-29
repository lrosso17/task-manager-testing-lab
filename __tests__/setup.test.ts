describe('Entorno de pruebas', () => {
  it('ejecuta aritmética básica correctamente', () => {
    expect(2 * 3).toBe(6);
  });

  it('resuelve matchers sobre arreglos y objetos', () => {
    const modulos = ['utils', 'hooks', 'components'];
    expect(modulos).toContain('hooks');
    expect(modulos).toHaveLength(3);
    expect({ ok: true }).toEqual({ ok: true });
  });
});
