import { readFileSync } from 'fs';
import { join as getPath } from 'path';
import genDiff from '../src';

const pathEntry = '__tests__/__fixtures__';

describe('Invalid arguments', () => {
  test('File not found', () => {
    expect(() => {
      const pathToConfigBefore = getPath(pathEntry, 'nested', 'therefore.json');
      const pathToConfigAfter = getPath(pathEntry, 'nested', 'after.json');
      genDiff(pathToConfigBefore, pathToConfigAfter);
    }).toThrow();
    expect(() => {
      const pathToConfigBefore = getPath(pathEntry, 'nested', 'before.json');
      const pathToConfigAfter = getPath(pathEntry, 'compressed', 'after.json');
      genDiff(pathToConfigBefore, pathToConfigAfter);
    }).toThrow();
  });
  test('Unsupported format - xml', () => {
    const pathToConfigBefore = getPath(pathEntry, 'nested', 'before.json');
    const pathToConfigAfter = getPath(pathEntry, 'nested', 'after.json');
    expect(() => {
      genDiff(pathToConfigBefore, pathToConfigAfter, 'xml');
    }).toThrow();
  });
});

describe.each(['plain', 'nested'])('Data structure: %s', (structure) => {
  describe.each(['json', 'yml', 'ini'])('Parser: %s', (type) => {
    const pathToConfigBefore = getPath(pathEntry, structure, `before.${type}`);
    const pathToConfigAfter = getPath(pathEntry, structure, `after.${type}`);
    test.each(['tree', 'plain'])('Output format - %s', (format) => {
      const pathToExpectedConfig = getPath(pathEntry, structure, `${format}diff.txt`);
      const expectedDiff = readFileSync(pathToExpectedConfig, 'utf8');
      const actualDiff = genDiff(pathToConfigBefore, pathToConfigAfter, format);
      expect(actualDiff).toBe(expectedDiff);
    });
    test('Output format - json', () => {
      const format = 'json';
      const pathToExpectedConfig = getPath(pathEntry, structure, `${format}diff.txt`);
      const rawExpectedDiff = readFileSync(pathToExpectedConfig, 'utf8');
      const expectedDiff = JSON.parse(rawExpectedDiff);
      const rawActualDiff = genDiff(pathToConfigBefore, pathToConfigAfter, format);
      const actualDiff = JSON.parse(rawActualDiff);
      expect(actualDiff).toEqual(expectedDiff);
    });
  });
});
