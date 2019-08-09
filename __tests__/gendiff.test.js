import { readFileSync } from 'fs';
import genDiff, { getParser } from '../src';

const pathEntry = '__tests__/__fixtures__';
const rawDiff = readFileSync(`${pathEntry}/diff.txt`, 'utf8');
const pathBeforeJson = `${pathEntry}/before.json`;
const pathAfterJson = `${pathEntry}/after.json`;
const pathBeforeYaml = `${pathEntry}/before.yml`;
const pathAfterYaml = `${pathEntry}/after.yml`;

const beforeObj = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
};
const afterObj = {
  timeout: 20,
  verbose: true,
  host: 'hexlet.io',
};

test('json parser', () => {
  const parser = getParser(pathBeforeJson);
  expect(parser.parse(readFileSync(pathBeforeJson))).toEqual(beforeObj);
  expect(parser.parse(readFileSync(pathAfterJson))).toEqual(afterObj);
});

test('yaml parser', () => {
  const parser = getParser(pathBeforeYaml);
  expect(parser.parse(readFileSync(pathBeforeYaml))).toEqual(beforeObj);
  expect(parser.parse(readFileSync(pathAfterYaml))).toEqual(afterObj);
});

test('objects diff', () => {
  expect(genDiff(beforeObj, afterObj)).toBe(rawDiff);
});
