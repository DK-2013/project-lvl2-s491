import _ from 'lodash';
import actions from '../actions';

const [unchanged, added, deleted, updated] = actions;

const acts = {
  [added]: 'added',
  [deleted]: 'removed',
  [unchanged]: ' ',
  [updated]: 'updated',
};

const renderProp = ({ act, prop }) => `Property '${prop}' was ${acts[act]}`;
const renderValue = (val) => {
  if (_.isObject(val)) return '[complex value]';
  if (_.isString(val)) return `'${val}'`;
  return val;
};
const propAddedUpdate = (prntProp, prntVal) => _.map(prntVal,
  (chVal, key) => ({ prop: [prntProp, key].join('.'), val: chVal, act: added }));
const propUpdate = (prntProp) => (node) => _.set(node, 'prop', [prntProp, node.prop].join('.'));

const renders = {
  [added]: (node) => {
    const { prop, val } = node;
    const toRender = _.isObject(val) ? [].concat(node, propAddedUpdate(prop, val)) : [node];
    return toRender.map((nd) => `${renderProp(nd)} with value: ${renderValue(nd.val)}`).join('\n');
  },
  [updated]: (node) => {
    const { prop, valBefore, valAfter } = node;
    const updatedStr = `${renderProp(node)}. From ${renderValue(valBefore)} to ${renderValue(valAfter)}`;
    if (_.isObject(valAfter)) return [].concat(updatedStr, propAddedUpdate(prop, valAfter).map(renders[added])).join('\n');
    return updatedStr;
  },
  [deleted]: (node) => `${renderProp(node)}`,
  [unchanged]: () => '',
};


const render = (data) => {
  const renderNode = (node) => {
    if (_.has(node, 'diff')) return render(node.diff.map(propUpdate(node.prop)));
    return renders[node.act](node);
  };
  return data.map(renderNode).filter(_.identity).join('\n');
};

export default render;
