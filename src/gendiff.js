import _ from 'lodash';

const getActions = (prop, beforeVal, afterVal) => {
  if (beforeVal === afterVal) return [[`  ${prop}`, afterVal]];
  return [[`+ ${prop}`, afterVal], [`- ${prop}`, beforeVal]].filter(el => el[1] !== undefined);
};

export const getDiff = (obj1, obj2) => {
  const allKeys = _.union(Object.keys(obj1), Object.keys(obj2));
  return allKeys.reduce(
    (acc, prop) => [...acc, ...getActions(prop, obj1[prop], obj2[prop])], [],
  );
};

const toString = (diff) => {
  const strings = diff.map(([prop, val]) => `  ${prop}: ${val}`);
  return `{\n${strings.join('\n')}\n}`;
};

export default (before, after) => toString(getDiff(before, after));
