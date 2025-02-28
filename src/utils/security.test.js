/**
 * Tests unitaires pour les fonctions de sécurité
 */

import { 
  isValidStockSymbol, 
  isValidResolution, 
  isValidTimestamp, 
  sanitizeStockSymbol 
} from './security';

describe('Validation des symboles boursiers', () => {
  test('Les symboles boursiers standards sont valides', () => {
    expect(isValidStockSymbol('AAPL')).toBe(true);
    expect(isValidStockSymbol('MSFT')).toBe(true);
    expect(isValidStockSymbol('^GSPC')).toBe(true);
    expect(isValidStockSymbol('^FCHI')).toBe(true);
  });

  test('Les symboles de crypto Binance sont valides', () => {
    expect(isValidStockSymbol('BINANCE:BTCUSDT')).toBe(true);
    expect(isValidStockSymbol('BINANCE:ETHUSDT')).toBe(true);
  });

  test('Les symboles invalides sont rejetés', () => {
    expect(isValidStockSymbol('')).toBe(false);
    expect(isValidStockSymbol(null)).toBe(false);
    expect(isValidStockSymbol(undefined)).toBe(false);
    expect(isValidStockSymbol('SELECT * FROM users')).toBe(false);
    expect(isValidStockSymbol('<script>alert("XSS")</script>')).toBe(false);
  });
});

describe('Validation des résolutions', () => {
  test('Les résolutions valides sont acceptées', () => {
    expect(isValidResolution('1')).toBe(true);
    expect(isValidResolution('5')).toBe(true);
    expect(isValidResolution('15')).toBe(true);
    expect(isValidResolution('30')).toBe(true);
    expect(isValidResolution('60')).toBe(true);
    expect(isValidResolution('D')).toBe(true);
    expect(isValidResolution('W')).toBe(true);
    expect(isValidResolution('M')).toBe(true);
  });

  test('Les résolutions invalides sont rejetées', () => {
    expect(isValidResolution('')).toBe(false);
    expect(isValidResolution('10')).toBe(false);
    expect(isValidResolution('H')).toBe(false);
    expect(isValidResolution('MINUTE')).toBe(false);
  });
});

describe('Validation des timestamps', () => {
  test('Les timestamps valides sont acceptés', () => {
    const now = Math.floor(Date.now() / 1000);
    const oneYearAgo = now - 365 * 24 * 60 * 60;
    
    expect(isValidTimestamp(now)).toBe(true);
    expect(isValidTimestamp(oneYearAgo)).toBe(true);
    expect(isValidTimestamp(1609459200)).toBe(true); // 1er janvier 2021
  });

  test('Les timestamps invalides sont rejetés', () => {
    expect(isValidTimestamp(-1)).toBe(false);
    expect(isValidTimestamp(0)).toBe(false);
    expect(isValidTimestamp(Date.now() * 2)).toBe(false); // future lointain
    expect(isValidTimestamp(null)).toBe(false);
    expect(isValidTimestamp('2021-01-01')).toBe(false); // string au lieu de nombre
  });
});

describe('Nettoyage des symboles', () => {
  test('Les symboles valides sont nettoyés correctement', () => {
    expect(sanitizeStockSymbol('aapl')).toBe('AAPL');
    expect(sanitizeStockSymbol(' MSFT ')).toBe('MSFT');
    expect(sanitizeStockSymbol('binance:btcusdt')).toBe('BINANCE:BTCUSDT');
  });

  test('Les symboles invalides retournent null', () => {
    expect(sanitizeStockSymbol('')).toBeNull();
    expect(sanitizeStockSymbol(null)).toBeNull();
    expect(sanitizeStockSymbol('<script>alert("XSS")</script>')).toBeNull();
  });
});
