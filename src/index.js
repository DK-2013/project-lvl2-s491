import { readFileSync } from 'fs';
import { extname, join as getPath } from 'path';
import genDiff from './gendiff';
import parse from './parsers';
import getFormatter from './formatters';

const getDataType = (pathToData) => {
  const fileExtensionName = extname(pathToData);
  return fileExtensionName && fileExtensionName.replace('.', '');
};

const getData = (pathToData) => {
  const rawData = readFileSync(getPath(pathToData), 'utf8');
  const dataType = getDataType(pathToData);
  return parse(rawData, dataType);
};

export default (pathToConfigBefore, pathToConfigAfter, format = 'tree') => {
  const configBefore = getData(pathToConfigBefore);
  const configAfter = getData(pathToConfigAfter);
  const diff = genDiff(configBefore, configAfter);
  return getFormatter(format)(diff);
};
