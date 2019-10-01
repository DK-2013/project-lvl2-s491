import _ from 'lodash';
import nodeTypes from '../nodeTypes';

const [unchanged, added, deleted, updated, nested] = nodeTypes;

const getIndent = (depth) => _.repeat('  ', depth);

const renderProp = (prop, depth, prefix = ' ') => `${getIndent(depth)}${prefix} ${prop}: `;

const renderValue = (value, depth, render) => {
  if (!_.isObject(value)) return value;
  const keys = _.keys(value).sort();
  const strings = keys.map((prop) => render({ prop, value: value[prop] }));
  return ['{', ...strings, `${getIndent(depth)}}`].join('\n');
};

const getRenderEntry = (depth) => ({ prop, value }, prefix) => {
  const renderedProp = renderProp(prop, depth, prefix);
  const renderedValue = renderValue(value, depth + 1, getRenderEntry(depth + 2));
  return `${renderedProp}${renderedValue}`;
};

const renders = {
  [nested]: ({ prop, diff }, depth, fn) => [
    `${renderProp(prop, depth)}{`,
    fn(diff, depth + 1),
    `${getIndent(depth + 1)}}`,
  ].join('\n'),
  [updated]: ({ prop, valueBefore, valueAfter }, depth) => [
    renders[deleted]({ prop, value: valueBefore }, depth),
    renders[added]({ prop, value: valueAfter }, depth),
  ].join('\n'),
  [unchanged]: (node, depth) => getRenderEntry(depth)(node),
  [added]: (node, depth) => getRenderEntry(depth)(node, '+'),
  [deleted]: (node, depth) => getRenderEntry(depth)(node, '-'),
};

const renderDiff = (data, depth) => data.map((node) => {
  const render = renders[node.type];
  return render(node, depth + 1, renderDiff);
}).join('\n');

export default (data) => ['{', renderDiff(data, 0), '}'].join('\n');
