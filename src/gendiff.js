import _ from 'lodash';
import nodeTypes from './nodeTypes';

const [unchanged, added, deleted, updated, nested] = nodeTypes;


const nodeBuilders = [
  {
    check: (prop, objectBefore, objectAfter) => {
      const valueBefore = objectBefore[prop];
      const valueAfter = objectAfter[prop];
      return _.isObject(valueBefore) && _.isObject(valueAfter);
    },
    build: (valueBefore, valueAfter, fn) => {
      const diff = fn(valueBefore, valueAfter);
      return diff.every(({ type }) => type === unchanged)
        ? { value: valueAfter, type: unchanged }
        // eslint-disable-next-line object-curly-newline
        : { valueBefore, valueAfter, diff, type: nested };
    },
  },
  {
    check: (prop, objectBefore, objectAfter) => objectBefore[prop] === objectAfter[prop],
    build: (valueBefore, valueAfter) => ({ value: valueAfter, type: unchanged }),
  },
  {
    check: (prop, objectBefore, objectAfter) => !_.has(objectAfter, prop),
    build: (valueBefore) => ({ value: valueBefore, type: deleted }),
  },
  {
    check: (prop, objectBefore) => !_.has(objectBefore, prop),
    build: (valueBefore, valueAfter) => ({ value: valueAfter, type: added }),
  },
  {
    check: () => true,
    // eslint-disable-next-line object-curly-newline
    build: (valueBefore, valueAfter) => ({ valueBefore, valueAfter, type: updated }),
  },
];

const getNodeBuilder = (prop, objectBefore, objectAfter) => nodeBuilders.find(
  ({ check }) => check(prop, objectBefore, objectAfter),
);

const genDiff = (objectBefore, objectAfter) => {
  const allKeys = _.union(Object.keys(objectBefore), Object.keys(objectAfter)).sort();
  return allKeys.map((prop) => {
    const { build } = getNodeBuilder(prop, objectBefore, objectAfter);
    const valueBefore = objectBefore[prop];
    const valueAfter = objectAfter[prop];
    return { ...build(valueBefore, valueAfter, genDiff), prop };
  });
};

export default genDiff;
