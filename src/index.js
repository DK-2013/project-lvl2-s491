import { isFunction } from 'lodash';
import { readFileSync } from 'fs';
import { join as getPath } from 'path';
import genDiff from './gendiff';
import getParser from './parsers';
import getFormatter from './formatters';


const receiveData = (pathToData) => {
  const rawData = readFileSync(getPath(pathToData), 'utf8');
  return getParser(pathToData).parse(rawData);
};

const getFormat = format => (isFunction(format) ? format : getFormatter(format));

export default (pathToCfgBefore, pathToCfgAfter, { format = 'tree', getData = receiveData } = {}) => {
  const before = getData(pathToCfgBefore);
  const after = getData(pathToCfgAfter);
  const diff = genDiff(before, after);
  return getFormat(format)(diff);
};
