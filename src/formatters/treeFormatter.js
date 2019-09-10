import _ from 'lodash';
import nodeTypes from '../nodeTypes';

const [unchanged, added, deleted, updated, nested] = nodeTypes;

const prefixes = {
  [added]: '+',
  [deleted]: '-',
  [unchanged]: ' ',
  [updated]: ' ',
  [nested]: ' ',
};

const getIndent = (lvl) => _.repeat('  ', lvl);

const renderProp = ({ type, prop }, lvl) => `${getIndent(lvl)}${prefixes[type] || ' '} ${prop}: `;

const renderValue = (value, lvl) => {
  if (!_.isObject(value)) return value;

  const keys = _.keys(value).sort();
  const strings = keys.map((key) => {
    const renderedProp = renderProp({ prop: key }, lvl + 1);
    const renderedValue = renderValue(value[key], lvl + 1);
    return `${renderedProp}${renderedValue}`;
  });
  return ['{', ...strings, `${getIndent(lvl)}}`].join('\n');
};

const getRenderEntry = (lvl) => (node) => {
  const renderedProp = renderProp(node, lvl);
  const renderedValue = renderValue(node.value, lvl + 1);
  return `${renderedProp}${renderedValue}\n`;
};

const renders = [
  {
    checker: (type) => type === nested,
    render: (node, lvl, fn) => [
      renderProp(node, lvl),
      fn(node.diff, lvl + 1),
    ].join(''),
  },
  {
    checker: (type) => type === updated,
    render: ({ prop, valueBefore, valueAfter }, lvl) => {
      const nodes = [
        { prop, value: valueBefore, type: deleted },
        { prop, value: valueAfter, type: added }];
      return nodes.map(getRenderEntry(lvl)).join('');
    },
  },
  {
    checker: () => true,
    render: (node, lvl) => getRenderEntry(lvl)(node),
  },
];

const getRender = ({ type }) => renders.find(({ checker }) => checker(type));

const formatter = (data, lvl = 0) => {
  const openString = '{\n';
  const innerStrings = data.map((node) => {
    const { render } = getRender(node);
    return render(node, lvl + 1, formatter);
  });
  const closeString = `${getIndent(lvl)}}${lvl > 0 ? '\n' : ''}`;
  return [openString, ...innerStrings, closeString].join('');
};

export default formatter;
