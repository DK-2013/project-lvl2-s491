import _ from 'lodash';
import nodeTypes from '../nodeTypes';

const [unchanged, added, deleted, updated, nested] = nodeTypes;

const getIndent = (lvl) => _.repeat('  ', lvl);

const renderProp = (prop, lvl, prefix = ' ') => `${getIndent(lvl)}${prefix} ${prop}: `;

const renderValue = (value, lvl, render) => {
  if (!_.isObject(value)) return value;
  const keys = _.keys(value).sort();
  const body = keys.map((prop) => render({ prop, value: value[prop] })).join('\n');
  return ['{\n', body, `${getIndent(lvl)}}`].join('');
};

const getRenderEntry = (lvl) => ({ prop, value }, prefix) => {
  const renderedProp = renderProp(prop, lvl, prefix);
  const renderedValue = renderValue(value, lvl + 1, getRenderEntry(lvl + 2));
  return `${renderedProp}${renderedValue}\n`;
};

const renders = {
  [nested]: ({ prop, diff }, lvl, fn) => [
    renderProp(prop, lvl),
    '{\n',
    fn(diff, lvl + 1),
    `${getIndent(lvl + 1)}}\n`,
  ].join(''),
  [updated]: ({ prop, valueBefore, valueAfter }, lvl) => [
    renders[deleted]({ prop, value: valueBefore }, lvl),
    renders[added]({ prop, value: valueAfter }, lvl),
  ].join(''),
  [unchanged]: (node, lvl) => getRenderEntry(lvl)(node),
  [added]: (node, lvl) => getRenderEntry(lvl)(node, '+'),
  [deleted]: (node, lvl) => getRenderEntry(lvl)(node, '-'),
};

const renderDiff = (data, lvl) => data.map((node) => {
  const render = renders[node.type];
  return render(node, lvl + 1, renderDiff);
}).join('');

export default (data) => ['{\n', renderDiff(data, 0), '}'].join('');
