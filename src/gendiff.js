import fs from 'fs';
import _ from 'lodash';

const prepare = (data) => {
  switch (typeof data) {
    case 'string':
      return JSON.parse(fs.readFileSync(data, 'utf8'));
    case 'object':
      return data;
    default:
      throw new Error('Invalid argument');
  }
};

const getActions = (prop, beforeVal, afterVal) => {
  if (beforeVal === afterVal) return [[`  ${prop}`, afterVal]];
  return [[`+ ${prop}`, afterVal], [`- ${prop}`, beforeVal]].filter(el => el[1] !== undefined);
};

export const getDiff = (data1, data2) => {
  const before = prepare(data1);
  const after = prepare(data2);
  const allKeys = _.union(Object.keys(before), Object.keys(after));
  return allKeys.reduce(
    (acc, prop) => [...acc, ...getActions(prop, before[prop], after[prop])], [],
  );
};

const toString = (diff) => {
  const strings = diff.map(([prop, val]) => `  ${prop}: ${val}`);
  return `{\n${strings.join('\n')}\n}`;
};

export default (before, after) => toString(getDiff(before, after));
