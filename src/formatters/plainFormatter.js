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
const propAddedUpdate = (parentProp, parentValue) => _.map(parentValue,
  (childValue, key) => ({ prop: [parentProp, key].join('.'), value: childValue, type: added }));
const propUpdate = (parentProp) => (node) => _.set(node, 'prop', [parentProp, node.prop].join('.'));

const addedRender = (node) => {
  const { prop, value } = node;
  const toRender = _.isObject(value) ? [].concat(node, propAddedUpdate(prop, value)) : [node];
  return toRender.map((nd) => `${renderProp(nd)} with value: ${renderValue(nd.value)}`).join('\n');
};

const updatedRender = (node) => {
  const { prop, valueBefore, valueAfter } = node;
  const updatedStr = `${renderProp(node)}. From ${renderValue(valueBefore)} to ${renderValue(valueAfter)}`;
  if (_.isObject(valueAfter)) return [].concat(updatedStr, propAddedUpdate(prop, valueAfter).map(addedRender)).join('\n');
  return updatedStr;
};

const renders = {
  [added]: addedRender,
  [updated]: updatedRender,
  [nested]: updatedRender,
  [deleted]: (node) => `${renderProp(node)}`,
  [unchanged]: () => '',
};


const render = (data) => {
  const renderNode = (node) => {
    if (_.has(node, 'diff')) return render(node.diff.map(propUpdate(node.prop)));
    return renders[node.type](node);
  };
  return data.map(renderNode).filter(_.identity).join('\n');
};

export default render;
