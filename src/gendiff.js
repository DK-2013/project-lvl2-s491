import _ from 'lodash';
import actions from './actions';

const [unchanged, added, deleted, updated] = actions;


const nodeBuilders = [
  {
    check: (prop, objBefore, objAfter) => _.isObject(objBefore[prop]) && _.isObject(objAfter[prop]),
    build: (prop, valBefore, valAfter, fn) => {
      const diff = fn(valBefore, valAfter);
      return diff.every(({ act }) => act === unchanged)
        ? { prop, val: valAfter, act: unchanged }
        // eslint-disable-next-line object-curly-newline
        : { prop, valBefore, valAfter, diff, act: updated };
    },
  },
  {
    check: (prop, objBefore, objAfter) => objBefore[prop] === objAfter[prop],
    build: (prop, valBefore, valAfter) => ({ prop, val: valAfter, act: unchanged }),
  },
  {
    check: (prop, objBefore, objAfter) => !_.has(objAfter, prop),
    build: (prop, valBefore) => ({ prop, val: valBefore, act: deleted }),
  },
  {
    check: (prop, objBefore) => !_.has(objBefore, prop),
    build: (prop, valBefore, valAfter) => ({ prop, val: valAfter, act: added }),
  },
  {
    check: () => true,
    // eslint-disable-next-line object-curly-newline
    build: (prop, valBefore, valAfter) => ({ prop, valBefore, valAfter, act: updated }),
  },
];

const getNodeBuilder = (prop, objBefore, objAfter) => nodeBuilders.find(
  ({ check }) => check(prop, objBefore, objAfter),
);

const genDiff = (obj1, obj2) => {
  const allKeys = _.union(Object.keys(obj1), Object.keys(obj2)).sort();
  return allKeys.map((prop) => {
    const { build } = getNodeBuilder(prop, obj1, obj2);
    return build(prop, obj1[prop], obj2[prop], genDiff);
  });
};

export default (valueBefore, valueAfter) => genDiff(valueBefore, valueAfter);
