import { readFileSync } from 'fs';
import { join as getPath } from 'path';
import genDiff from './gendiff';
import getParse from './parsers';
import getFormatter from './formatters';


const getData = (pathToData) => {
  const rawData = readFileSync(getPath(pathToData), 'utf8');
  const parse = getParse(pathToData);
  return parse(rawData);
};

export default (pathToConfigBefore, pathToConfigAfter, format = 'tree') => {
  const configBefore = getData(pathToConfigBefore);
  const configAfter = getData(pathToConfigAfter);
  const diff = genDiff(configBefore, configAfter);
  return getFormatter(format)(diff);
};
