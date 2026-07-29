import { validateTaskTitle } from '../../src/utils/validateTask';

// La función retorna `null` cuando el título es válido y un mensaje de
// texto cuando no lo es, por lo que cada bloque agrupa los casos según
// el tipo de resultado esperado.
describe('validateTaskTitle', () => {
  describe('títulos que deben aceptarse (retornan null)', () => {
    it('acepta un título de longitud normal', () => {
      expect(validateTaskTitle('Pagar servicios públicos')).toBeNull();
    });

    it('acepta el límite inferior permitido (3 caracteres)', () => {
      expect(validateTaskTitle('Ir!')).toBeNull();
    });

    it('acepta el límite superior permitido (100 caracteres)', () => {
      const limite = 'x'.repeat(100);
      expect(validateTaskTitle(limite)).toBeNull();
      expect(limite).toHaveLength(100);
    });

    it('ignora espacios al inicio y al final al validar la longitud', () => {
      // "  Hola  " tiene 8 caracteres en bruto pero 4 después de trim(),
      // por lo que debe considerarse válido igual que "Hola".
      expect(validateTaskTitle('   Hola   ')).toBeNull();
    });
  });

  describe('títulos que deben rechazarse (retornan mensaje de error)', () => {
    it('rechaza una cadena vacía', () => {
      expect(validateTaskTitle('')).toBe('El título es obligatorio');
    });

    it('rechaza una cadena compuesta solo por espacios', () => {
      expect(validateTaskTitle('      ')).toBe('El título es obligatorio');
    });

    it('rechaza un título de un solo carácter por debajo del mínimo', () => {
      expect(validateTaskTitle('A')).toBe('El título debe tener al menos 3 caracteres');
    });

    it('rechaza el título justo un carácter por debajo del límite mínimo (2)', () => {
      expect(validateTaskTitle('Hi')).toBe('El título debe tener al menos 3 caracteres');
    });

    it('rechaza un título que excede el límite máximo por un solo carácter (101)', () => {
      const excedido = 'y'.repeat(101);
      expect(validateTaskTitle(excedido)).toBe('El título no puede exceder los 100 caracteres');
    });

    it('rechaza un título extremadamente largo', () => {
      const muyLargo = 'z'.repeat(500);
      expect(validateTaskTitle(muyLargo)).toContain('no puede exceder');
    });
  });
});
