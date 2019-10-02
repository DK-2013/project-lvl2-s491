import _ from 'lodash';
import nodeTypes from '../nodeTypes';

const [unchanged, added, deleted, updated, nested] = nodeTypes;

const acts = {
  [added]: 'added',
  [deleted]: 'removed',
  [unchanged]: ' ',
  [updated]: 'updated',
  [nested]: 'updated',
};

const renderProp = ({ type }, path) => `Property '${path.join('.')}' was ${acts[type]}`;
const renderValue = (value) => {
  if (_.isObject(value)) return '[complex value]';
  if (_.isString(value)) return `'${value}'`;
  return value;
};
const addedObjectRender = (object, path, render) => _.map(
  object,
  (value, prop) => render({ type: added, value }, [...path, prop]),
).join('\n');

const renders = {
  [added]: ({ type, value }, path) => {
    const addedString = `${renderProp({ type }, path)} with value: ${renderValue(value)}`;
    if (_.isObject(value)) return [addedString, addedObjectRender(value, path, renders[added])].join('\n');
    return addedString;
  },
  [updated]: ({ type, valueBefore, valueAfter }, path) => {
    const updatedStr = `${renderProp({ type }, path)}. From ${renderValue(valueBefore)} to ${renderValue(valueAfter)}`;
    if (_.isObject(valueAfter)) return [updatedStr, addedObjectRender(valueAfter, path, renders[added])].join('\n');
    return updatedStr;
  },
  [nested]: ({ diff }, path, fn) => fn(diff, path),
  [deleted]: renderProp,
  [unchanged]: () => '',
};


const render = (data, path = []) => {
  const renderNode = (node) => renders[node.type](node, [...path, node.prop], render);
  return data.map(renderNode).filter(_.identity).join('\n');
};

export default render;
