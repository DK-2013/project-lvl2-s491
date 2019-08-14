import _ from 'lodash';

const ADDED = '+';
const DELETED = '-';
const UNCHANGED = ' ';

export const getDiff = (obj1, obj2) => {
  const allKeys = _.union(Object.keys(obj1), Object.keys(obj2)).sort();
  return allKeys.reduce(
    // eslint-disable-next-line no-use-before-define
    (acc, prop) => [...acc, ...getNodes(prop, obj1[prop], obj2[prop])], [],
  );
};

const getNodes = (prop, beforeVal, afterVal) => {
  if (beforeVal === afterVal) return [{ prop, val: afterVal, act: UNCHANGED }];
  if (beforeVal instanceof Object && afterVal instanceof Object) {
    return [{ prop, val: getDiff(beforeVal, afterVal), act: UNCHANGED }];
  }
  const before = beforeVal instanceof Object ? getDiff(beforeVal, beforeVal) : beforeVal;
  const after = afterVal instanceof Object ? getDiff(afterVal, afterVal) : afterVal;
  const nodes = [{ prop, val: before, act: DELETED }, { prop, val: after, act: ADDED }];
  return nodes.filter(el => el.val !== undefined);
};

const toString = (diff, lvl) => {
  const openStr = '{\n';
  const strings = diff.map(({ act, prop, val }) => {
    const value = val instanceof Array ? toString(val, lvl + 2) : val;
    return `${_.repeat('  ', lvl)}${act} ${prop}: ${value}\n`;
  });
  const closeStr = `${_.repeat('  ', lvl - 1)}}`;
  return [openStr, ...strings, closeStr].join('');
};

export default (before, after) => toString(getDiff(before, after), 1);
