import { describe, expect, it } from 'vitest';
import { translateTimeMessage, translateServerResponse } from '../../utils/TranslatorUtils';
import { serverResponses } from '../../constants/serverResponses';

describe('Portuguese Utils unit tests', () => {
  it('should translate all time ago messages to es', () => {
    expect(translateTimeMessage('2 years ago', 'es')).toBe('Hace 2 años');
    expect(translateTimeMessage('1 year ago', 'es')).toBe('Hace 1 año');
    expect(translateTimeMessage('2 months ago', 'es')).toBe('Hace 2 meses');
    expect(translateTimeMessage('1 month ago', 'es')).toBe('Hace 1 mes');
    expect(translateTimeMessage('2 days ago', 'es')).toBe('Hace 2 días');
    expect(translateTimeMessage('1 day ago', 'es')).toBe('Hace 1 día');
    expect(translateTimeMessage('2 hours ago', 'es')).toBe('Hace 2 horas');
    expect(translateTimeMessage('1 hour ago', 'es')).toBe('Hace 1 hora');
    expect(translateTimeMessage('2 minutes ago', 'es')).toBe('Hace 2 minutos');
    expect(translateTimeMessage('1 minute ago', 'es')).toBe('Hace 1 minuto');
    expect(translateTimeMessage('2 seconds ago', 'es')).toBe('Hace 2 segundos');
    expect(translateTimeMessage('1 second ago', 'es')).toBe('Hace 1 segundo');
    expect(translateTimeMessage('Moments ago', 'es')).toBe('Hace momentos');
    expect(translateTimeMessage('lala', 'es')).toBe('lala');
    expect(translateTimeMessage('null', 'es')).toBe('null');
  });

  it('should translate all time left messages to es', () => {
    expect(translateTimeMessage('2 years left', 'es')).toBe('Faltan 2 años');
    expect(translateTimeMessage('1 year left', 'es')).toBe('Falta 1 año');
    expect(translateTimeMessage('2 months left', 'es')).toBe('Faltan 2 meses');
    expect(translateTimeMessage('1 month left', 'es')).toBe('Falta 1 mes');
    expect(translateTimeMessage('2 days left', 'es')).toBe('Faltan 2 días');
    expect(translateTimeMessage('1 day left', 'es')).toBe('Falta 1 día');
    expect(translateTimeMessage('lala', 'es')).toBe('lala');
    expect(translateTimeMessage('null', 'es')).toBe('null');
  });

  it('should translate all server responses to es', () => {
    const keys: string[] = Object.keys(serverResponses);

    expect(translateServerResponse(keys[0], 'es'))
      .toBe('Contraseña inválida: La contraseña debe tener al menos 8 caracteres, 1 mayúscula y 1 carácter especial');
    expect(translateServerResponse(keys[1], 'es'))
      .toBe('Contraseña inválida: La contraseña debe tener al menos 1 mayúscula y 1 carácter especial');
    expect(translateServerResponse(keys[2], 'es'))
      .toBe('Contraseña inválida: La contraseña debe tener al menos 1 carácter especial');
    expect(translateServerResponse(keys[3], 'es'))
      .toBe('¡El correo ya está registrado!');
    expect(translateServerResponse(keys[4], 'es'))
      .toBe('¡Prohibido! Acceso denegado');
    expect(translateServerResponse(keys[5], 'es'))
      .toBe('¡Error interno del servidor!');
    expect(translateServerResponse(keys[6], 'es'))
      .toBe('Has alcanzado el límite máximo de intentos de inicio de sesión. Por favor, espera 30 minutos');
    expect(translateServerResponse(keys[7], 'es'))
      .toBe('Por favor, completa todos los campos');
    expect(translateServerResponse(keys[8], 'es'))
      .toBe('¡Por favor, ingresa tu nombre de usuario y contraseña!');
    expect(translateServerResponse(keys[9], 'es'))
      .toBe('¡Por favor, escriba al menos 3 caracteres!');
    expect(translateServerResponse(keys[10], 'es'))
      .toBe('La longitud máxima del texto es 2000');
    expect(translateServerResponse(keys[11], 'es'))
      .toBe('Error desconocido');
    expect(translateServerResponse(keys[12], 'es'))
      .toBe('¡Información incorrecta o incompleta!');
    expect(translateServerResponse(keys[13], 'es'))
      .toBe('¡Usuario o contraseña incorrectos!');
  });
});
