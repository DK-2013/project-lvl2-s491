import { readFileSync } from 'fs';
import { join as getPath } from 'path';
import genDiff, { getParser } from '../src';

const pathEntry = '__tests__/__fixtures__';
const rawDiff = readFileSync(`${pathEntry}/diff.txt`, 'utf8');

const objects = {
  before: {
    host: 'hexlet.io',
    timeout: 50,
    proxy: '123.234.53.22',
    follow: false,
  },
  after: {
    timeout: 20,
    verbose: true,
    host: 'hexlet.io',
  },
};

describe.each([['json'], ['yml'], ['ini']])('%s parser', (type) => {
  test.each([['before'], ['after']])(`%s.${type}`, (fileName) => {
    const path = getPath(pathEntry, `${fileName}.${type}`);
    const parser = getParser(path);
    expect(parser.parse(readFileSync(path, 'utf8'))).toEqual(objects[fileName]);
  });
});

test('objects diff', () => {
  expect(genDiff(objects.before, objects.after)).toBe(rawDiff);
});
