import { readFileSync } from 'fs';
import { join as getPath } from 'path';
import genDiff, { getDiff, getParser } from '../src';

const pathEntry = '__tests__/__fixtures__';
const objects = JSON.parse(readFileSync(getPath(pathEntry, 'input.json'), 'utf8'));
const expectedDiff = JSON.parse(readFileSync(getPath(pathEntry, 'innerdiff.json'), 'utf8'));

describe('Inner diff', () => {
  test('for equal objects', () => {
    const before = { prop: { key: 777 } };
    const after = { prop: { key: 777 } };
    const expected = [{ act: 0, prop: 'prop', val: { key: 777 } }];
    expect(getDiff(before, after)).toEqual(expected);
  });
  test.each([['plain'], ['nested']])('for %s data structure', (structure) => {
    const cfg = objects[structure];
    expect(getDiff(cfg.before, cfg.after)).toEqual(expectedDiff[structure]);
  });
});

describe.each([['plain'], ['nested']])('Data structure - %s', (structure) => {
  describe.each([['json'], ['yml'], ['ini']])('%s parser', (type) => {
    test.each([['before'], ['after']])(`%s.${type}`, (fileName) => {
      const path = getPath(pathEntry, structure, `${fileName}.${type}`);
      const parser = getParser(path);
      expect(parser.parse(readFileSync(path, 'utf8'))).toEqual(objects[structure][fileName]);
    });
  });

  describe.each([['tree'], ['plain'], ['json']])('Output format - %s', (format) => {
    test(`${structure} objects diff`, () => {
      const path = getPath(pathEntry, structure, `${format}diff.txt`);
      const rawDiff = readFileSync(path, 'utf8');
      expect(genDiff(objects[structure].before, objects[structure].after, format)).toBe(rawDiff);
    });
  });
});
