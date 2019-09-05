import { readFileSync } from 'fs';
import { join as getPath } from 'path';
import genDiff from './gendiff';
import getParse from './parsers';
import getFormatter from './formatters';


const receiveData = (pathToData) => {
  const rawData = readFileSync(getPath(pathToData), 'utf8');
  const parse = getParse(pathToData);
  return parse(rawData);
};

export default (pathToCfgBefore, pathToCfgAfter, format = 'tree', getData = receiveData) => {
  const cfgBefore = getData(pathToCfgBefore);
  const cfgAfter = getData(pathToCfgAfter);
  const diff = genDiff(cfgBefore, cfgAfter);
  return getFormatter(format)(diff);
};
