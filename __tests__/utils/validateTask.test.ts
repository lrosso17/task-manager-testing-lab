import { validateTaskTitle } from '../../src/utils/validateTask';

describe('validateTaskTitle', () => {
  it('retorna null cuando el título es válido', () => {
    expect(validateTaskTitle('Comprar boletos')).toBeNull();
  });

  it('marca como inválido un título vacío', () => {
    expect(validateTaskTitle('')).toBe('El título es obligatorio');
  });

  it('marca como inválido un título con solo espacios', () => {
    expect(validateTaskTitle('   ')).toBe('El título es obligatorio');
  });

  it('rechaza un título con menos de 3 caracteres', () => {
    expect(validateTaskTitle('Hi')).toBe('El título debe tener al menos 3 caracteres');
  });

  it('rechaza un título de más de 100 caracteres', () => {
    const titulo = 'a'.repeat(101);
    expect(validateTaskTitle(titulo)).toBe('El título no puede exceder los 100 caracteres');
  });
});
