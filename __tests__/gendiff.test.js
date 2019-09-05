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
    const pathToCfgBefore = getPath(pathEntry, structure, `before.${type}`);
    const pathToCfgAfter = getPath(pathEntry, structure, `after.${type}`);
    test.each(['tree', 'plain'])('Output format - %s', (format) => {
      const pathToExpectedCfg = getPath(pathEntry, structure, `${format}diff.txt`);
      const expectedDiff = readFileSync(pathToExpectedCfg, 'utf8');
      const actualDiff = genDiff(pathToCfgBefore, pathToCfgAfter, format);
      expect(actualDiff).toBe(expectedDiff);
    });
    test('Output format - json', () => {
      const format = 'json';
      const pathToExpectedCfg = getPath(pathEntry, structure, `${format}diff.txt`);
      const rawExpectedDiff = readFileSync(pathToExpectedCfg, 'utf8');
      const expectedDiff = JSON.parse(rawExpectedDiff);
      const rawActualDiff = genDiff(pathToCfgBefore, pathToCfgAfter, format);
      const actualDiff = JSON.parse(rawActualDiff);
      expect(actualDiff).toEqual(expectedDiff);
    });
  });
});
