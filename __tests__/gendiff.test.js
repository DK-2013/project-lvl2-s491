import { readFileSync } from 'fs';
import { join as getPath } from 'path';
import genDiff, { getParser } from '../src';

const pathEntry = '__tests__/__fixtures__';

const objects = {
  plain: {
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
  },
  nested: {
    before: {
      common: {
        setting1: 'Value 1',
        setting2: 200,
        setting3: true,
        setting6: {
          key: 'value',
        },
      },
      group1: {
        baz: 'bas',
        foo: 'bar',
        nest: {
          key: 'value',
        },
      },
      group2: {
        abc: 12345,
      },
    },
    after: {
      common: {
        follow: false,
        setting1: 'Value 1',
        setting3: {
          key: 'value',
        },
        setting4: 'blah blah',
        setting5: {
          key5: 'value5',
        },
        setting6: {
          key: 'value',
          ops: 'vops',
        },
      },
      group1: {
        foo: 'bar',
        baz: 'bars',
        nest: 'str',
      },
      group3: {
        fee: 100500,
      },
    },
  },
};

describe.each([['plain'], ['nested']])('Structure - %s', (structure) => {
  describe.each([['json'], ['yml'], ['ini']])('%s parser', (type) => {
    test.each([['before'], ['after']])(`%s.${type}`, (fileName) => {
      const path = getPath(pathEntry, structure, `${fileName}.${type}`);
      const parser = getParser(path);
      expect(parser.parse(readFileSync(path, 'utf8'))).toEqual(objects[structure][fileName]);
    });
  });

  test(`${structure} objects diff`, () => {
    const path = getPath(pathEntry, structure, 'diff.txt');
    const rawDiff = readFileSync(path, 'utf8');
    expect(genDiff(objects[structure].before, objects[structure].after)).toBe(rawDiff);
  });
});
