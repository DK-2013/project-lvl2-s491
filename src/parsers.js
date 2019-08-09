import { extname } from 'path';
import { safeLoad as yamlParser } from 'js-yaml';
import { parse as iniParser } from 'ini';

const parsers = {
  '.json': data => JSON.parse(data),
  '.yml': data => yamlParser(data),
  '.ini': data => iniParser(data),
};

const getType = path => extname(path) || '.json';

export default path => ({ parse: parsers[getType(path)] });
