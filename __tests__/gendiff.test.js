import { readFileSync } from 'fs';
import { join as getPath } from 'path';
import genDiff from '../src';

const pathEntry = '__tests__/__fixtures__';
let config;
let objects;
let expectedDiff;

beforeAll(() => {
  objects = JSON.parse(readFileSync(getPath(pathEntry, 'input.json'), 'utf8'));
});

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
      genDiff(pathToBefore, pathToAfter, { format: 'xml' });
    }).toThrow("Unsupported format: 'xml'");
  });
});

describe('Inner diff', () => {
  beforeAll(() => {
    config = { format: dt => dt, getData: data => data };
    expectedDiff = JSON.parse(readFileSync(getPath(pathEntry, 'innerdiff.json'), 'utf8'));
  });
  test('for equal objects', () => {
    const before = { prop: { key: 777 } };
    const after = { prop: { key: 777 } };
    const expected = [{ act: 0, prop: 'prop', val: { key: 777 } }];
    expect(genDiff(before, after, config)).toEqual(expected);
  });
  test.each(['plain', 'nested'])('for %s data structure', (structure) => {
    const cfg = objects[structure];
    expect(genDiff(cfg.before, cfg.after, config)).toEqual(expectedDiff[structure]);
  });
});

describe.each(['plain', 'nested'])('Data structure: %s', (structure) => {
  describe.each(['json', 'yml', 'ini'])('Parser: %s', (type) => {
    const pathBefore = getPath(pathEntry, structure, `before.${type}`);
    const pathAfter = getPath(pathEntry, structure, `after.${type}`);
    test.each(['tree', 'plain'])('Output format - %s', (format) => {
      const path = getPath(pathEntry, structure, `${format}diff.txt`);
      const rawDiff = readFileSync(path, 'utf8');
      expect(genDiff(pathBefore, pathAfter, { format })).toBe(rawDiff);
    });
    test('Output format - json', () => {
      const format = 'json';
      const path = getPath(pathEntry, structure, `${format}diff.txt`);
      const rawDiff = readFileSync(path, 'utf8');
      expect(JSON.parse(genDiff(pathBefore, pathAfter, { format }))).toEqual(JSON.parse(rawDiff));
    });
  });
});
