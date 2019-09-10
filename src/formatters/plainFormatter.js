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

const renderProp = ({ type, prop }) => `Property '${prop}' was ${acts[type]}`;
const renderValue = (value) => {
  if (_.isObject(value)) return '[complex value]';
  if (_.isString(value)) return `'${value}'`;
  return value;
};
const castToAddedNodes = (parentProp, object) => _.map(object,
  (value, prop) => ({ type: added, prop: [parentProp, prop].join('.'), value }));

const renders = {
  [added]: (node) => {
    const { prop, value } = node;
    const toRender = _.isObject(value) ? [].concat(node, castToAddedNodes(prop, value)) : [node];
    return toRender.map((addedNode) => `${renderProp(addedNode)} with value: ${renderValue(addedNode.value)}`).join('\n');
  },
  [updated]: (node) => {
    const { prop, valueBefore, valueAfter } = node;
    const updatedStr = `${renderProp(node)}. From ${renderValue(valueBefore)} to ${renderValue(valueAfter)}`;
    if (_.isObject(valueAfter)) return [].concat(updatedStr, castToAddedNodes(prop, valueAfter).map(renders[added])).join('\n');
    return updatedStr;
  },
  [nested]: ({ diff, prop: parentProp }, fn) => {
    const expandChildNodeProp = (propOfParent) => (node) => ({ ...node, prop: [propOfParent, node.prop].join('.') });
    return fn(diff.map(expandChildNodeProp(parentProp)));
  },
  [deleted]: (node) => `${renderProp(node)}`,
  [unchanged]: () => '',
};


const render = (data) => {
  const renderNode = (node) => renders[node.type](node, render);
  return data.map(renderNode).filter(_.identity).join('\n');
};

export default render;
