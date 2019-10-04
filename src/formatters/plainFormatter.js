import _ from 'lodash';
import nodeTypes from '../nodeTypes';

const [unchanged, added, deleted, updated, nested] = nodeTypes;

const renderProp = (action, path) => `Property '${path.join('.')}' was ${action}`;
const renderValue = (value) => {
  if (_.isObject(value)) return '[complex value]';
  if (_.isString(value)) return `'${value}'`;
  return value;
};

const renders = {
  [added]: ({ value }, path) => `${renderProp('added', path)} with value: ${renderValue(value)}`,
  [updated]: ({ valueBefore, valueAfter }, path) => {
    const renderedValueBefore = renderValue(valueBefore);
    const renderedValueAfter = renderValue(valueAfter);
    return `${renderProp('updated', path)}. From ${renderedValueBefore} to ${renderedValueAfter}`;
  },
  [nested]: ({ children }, path, fn) => fn(children, path),
  [deleted]: (node, path) => renderProp('removed', path),
  [unchanged]: () => null,
};


const render = (data, path) => {
  const renderNode = (node) => renders[node.type](node, [...path, node.prop], render);
  return data.map(renderNode).filter(_.identity).join('\n');
};

export default (data) => render(data, []);
