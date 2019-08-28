import _ from 'lodash';
import actions from './actions';

const {
  UNCHANGED, ADDED, DELETED, UPDATED,
} = actions;

const genDiff = (obj1, obj2) => {
  const allKeys = _.union(Object.keys(obj1), Object.keys(obj2)).sort();
  return allKeys.reduce(
    // eslint-disable-next-line no-use-before-define
    (acc, prop) => [...acc, getNode(prop, obj1, obj2)], [],
  );
};

const getNode = (prop, beforeObj, afterObj) => {
  const before = beforeObj[prop];
  const after = afterObj[prop];
  if (before === after) return { prop, val: after, act: UNCHANGED };
  if (_.isObject(before) && _.isObject(after)) {
    const diff = genDiff(before, after);
    if (diff.every(({ act }) => act === UNCHANGED)) return { prop, val: after, act: UNCHANGED };
    return {
      prop, val: { before, after }, diff, act: UPDATED,
    };
  }
  if (!_.has(afterObj, prop)) return { prop, val: before, act: DELETED };
  if (!_.has(beforeObj, prop)) return { prop, val: after, act: ADDED };
  return { prop, val: { before, after }, act: UPDATED };
};

export default (before, after) => genDiff(before, after);
