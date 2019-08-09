import { extname } from 'path';
import { safeLoad as yamlParser } from 'js-yaml';

const parsers = {
  '.yml': data => yamlParser(data),
  '.json': data => JSON.parse(data),
};

const getType = path => extname(path) || '.json';

export default path => ({ parse: parsers[getType(path)] });
