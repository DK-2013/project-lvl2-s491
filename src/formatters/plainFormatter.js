import _ from 'lodash';
import actions from '../actions';

const {
  UNCHANGED, ADDED, DELETED, UPDATED,
} = actions;

const acts = {
  [ADDED]: 'added',
  [DELETED]: 'removed',
  [UNCHANGED]: ' ',
  [UPDATED]: 'updated',
};

const renderProp = ({ act, prop }) => `Property '${prop}' was ${acts[act]}`;
const renderValue = (val) => {
  if (_.isObject(val)) return '[complex value]';
  if (_.isString(val)) return `'${val}'`;
  return val;
};
const propAddedUpdate = (prntProp, prntVal) => _.map(prntVal,
  (chVal, key) => ({ prop: [prntProp, key].join('.'), val: chVal, act: ADDED }));
const propUpdate = prntProp => node => _.set(node, 'prop', [prntProp, node.prop].join('.'));

const renders = {
  [ADDED]: (node) => {
    const { prop, val } = node;
    const toRender = _.isObject(val) ? [].concat(node, propAddedUpdate(prop, val)) : [node];
    return toRender.map(nd => `${renderProp(nd)} with value: ${renderValue(nd.val)}`).join('\n');
  },
  [UPDATED]: (node) => {
    const { prop, val } = node;
    const updatedStr = `${renderProp(node)}. From ${renderValue(val.before)} to ${renderValue(val.after)}`;
    if (_.isObject(val.after)) return [].concat(updatedStr, propAddedUpdate(prop, val.after).map(renders[ADDED])).join('\n');
    return updatedStr;
  },
  [DELETED]: node => `${renderProp(node)}`,
  [UNCHANGED]: () => '',
};


const render = (data) => {
  const renderNode = (node) => {
    if (_.has(node, 'children')) return render(node.val.map(propUpdate(node.prop)));
    return renders[node.act](node);
  };
  return data.map(renderNode).filter(_.identity).join('\n');
};

export default render;
