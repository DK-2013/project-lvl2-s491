import _ from 'lodash';
import actions from '../actions';

const [unchanged, added, deleted, updated] = actions;

const prefixes = {
  [added]: '+',
  [deleted]: '-',
  [unchanged]: ' ',
  [updated]: ' ',
};

const getIndent = (lvl) => _.repeat('  ', lvl);
const renderProp = ({ act, prop }, lvl) => `${getIndent(lvl)}${prefixes[act] || ' '} ${prop}: `;

const renders = [
  {
    checker: (diff) => _.isArray(diff),
    render: (diff, lvl = 0, fn) => {
      const openStr = '{\n';
      const strings = diff.map((node) => fn(node, lvl + 1));
      const closeStr = `${getIndent(lvl)}}${lvl > 0 ? '\n' : ''}`;
      return [openStr, ...strings, closeStr].join('');
    },
  },
  {
    checker: (node) => _.has(node, 'diff'),
    render: (node, lvl, fn) => [
      renderProp(node, lvl),
      fn(node.diff, lvl + 1),
    ].join(''),
  },
  {
    checker: ({ act }) => act === updated,
    render: ({ prop, valBefore, valAfter }, lvl, fn) => {
      const nodes = [
        { prop, val: valBefore, act: deleted },
        { prop, val: valAfter, act: added }];
      return nodes.map((node) => fn(node, lvl)).join('');
    },
  },
  {
    checker: ({ val }) => _.isObject(val),
    render: (node, lvl, fn) => {
      const valProps = _.keys(node.val).sort();
      const nodes = valProps.map((prop) => ({ prop, val: node.val[prop] }));
      return [renderProp(node, lvl), fn(nodes, lvl + 1)].join('');
    },
  },
  {
    checker: () => true,
    render: (node, lvl) => `${renderProp(node, lvl)}${node.val}\n`,
  },
];

const getRender = (data) => renders.find(({ checker }) => checker(data));

const formatter = (data, lvl) => {
  const { render } = getRender(data);
  return render(data, lvl, formatter);
};

export default formatter;
