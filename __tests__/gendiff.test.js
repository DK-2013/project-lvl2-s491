import fs from 'fs';
import genDiff from '../src';

const rawDiff = fs.readFileSync('__tests__/__fixtures__/diff.txt', 'utf8');

test('diff from runtime', () => {
  const before = {
    host: 'hexlet.io',
    timeout: 50,
    proxy: '123.234.53.22',
    follow: false,
  };
  const after = {
    timeout: 20,
    verbose: true,
    host: 'hexlet.io',
  };
  expect(genDiff(before, after)).toBe(rawDiff);
});

test('diff from files', () => {
  const path = '__tests__/__fixtures__/';
  expect(genDiff(`${path}before.json`, `${path}after.json`)).toBe(rawDiff);
});
