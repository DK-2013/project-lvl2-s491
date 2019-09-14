import { has } from 'lodash';
import { safeLoad as yamlParse } from 'js-yaml';
import { parse as iniParse } from 'ini';

const parsers = {
  json: JSON.parse,
  yml: yamlParse,
  ini: iniParse,
};

export default (data, type = 'json') => {
  if (has(parsers, type)) {
    return parsers[type](data);
  }
  const msg = `Not found parser type: ${type}`;
  throw new Error(msg);
};
