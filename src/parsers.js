import { extname as getParseType } from 'path';
import { has } from 'lodash';
import { safeLoad as yamlParse } from 'js-yaml';
import { parse as iniParse } from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yml': yamlParse,
  '.ini': iniParse,
};

export default (path = 'fake.json') => {
  const type = getParseType(path);
  if (has(parsers, type)) return parsers[type];
  const msg = `Сould not parse config: ${path}`;
  throw new Error(msg);
};
