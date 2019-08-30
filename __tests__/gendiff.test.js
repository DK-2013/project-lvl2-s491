import { readFileSync } from 'fs';
import { join as getPath } from 'path';
import genDiff from '../src';

const pathEntry = '__tests__/__fixtures__';

describe('Invalid arguments', () => {
  test('File not found', () => {
    expect(() => {
      genDiff(getPath(pathEntry, 'nested', 'therefore.json'), getPath(pathEntry, 'nested', 'after.json'));
    }).toThrow();
    expect(() => {
      genDiff(getPath(pathEntry, 'nested', 'before.json'), getPath(pathEntry, 'compressed', 'after.json'));
    }).toThrow();
  });
  test('Unsupported format - xml', () => {
    const pathToBefore = getPath(pathEntry, 'nested', 'before.json');
    const pathToAfter = getPath(pathEntry, 'nested', 'after.json');
    expect(() => {
      genDiff(pathToBefore, pathToAfter, 'xml');
    }).toThrow();
  });
});

describe.each(['plain', 'nested'])('Data structure: %s', (structure) => {
  describe.each(['json', 'yml', 'ini'])('Parser: %s', (type) => {
    const pathBefore = getPath(pathEntry, structure, `before.${type}`);
    const pathAfter = getPath(pathEntry, structure, `after.${type}`);
    test.each(['tree', 'plain'])('Output format - %s', (format) => {
      const path = getPath(pathEntry, structure, `${format}diff.txt`);
      const rawDiff = readFileSync(path, 'utf8');
      expect(genDiff(pathBefore, pathAfter, format)).toBe(rawDiff);
    });
    test('Output format - json', () => {
      const format = 'json';
      const path = getPath(pathEntry, structure, `${format}diff.txt`);
      const rawDiff = readFileSync(path, 'utf8');
      expect(JSON.parse(genDiff(pathBefore, pathAfter, format))).toEqual(JSON.parse(rawDiff));
    });
  });
});
