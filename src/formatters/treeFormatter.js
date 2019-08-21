import _ from 'lodash';
import actions from '../actions';

const {
  UNCHANGED, ADDED, DELETED, UPDATED,
} = actions;

const prefixes = {
  [ADDED]: '+',
  [DELETED]: '-',
  [UNCHANGED]: ' ',
  [UPDATED]: ' ',
};

const getIndent = lvl => _.repeat('  ', lvl);
const renderProp = ({ act, prop }, lvl) => `${getIndent(lvl)}${prefixes[act] || ' '} ${prop}: `;
// eslint-disable-next-line no-use-before-define
const render = (data, lvl) => renders.find(({ checker }) => checker(data)).render(data, lvl);

const renders = [
  {
    checker: diff => _.isArray(diff),
    render: (diff, lvl = 0) => {
      const openStr = '{\n';
      const strings = diff.map(node => render(node, lvl + 1));
      const closeStr = `${getIndent(lvl)}}${lvl > 0 ? '\n' : ''}`;
      return [openStr, ...strings, closeStr].join('');
    },
  },
  {
    checker: node => _.has(node, 'diff'),
    render: (node, lvl) => [
      renderProp(node, lvl),
      render(node.diff, lvl + 1),
    ].join(''),
  },
  {
    checker: ({ act }) => act === UPDATED,
    render: ({ prop, val }, lvl) => {
      const { before, after } = val;
      const nodes = [
        { prop, val: before, act: DELETED },
        { prop, val: after, act: ADDED }];
      return nodes.map(node => render(node, lvl)).join('');
    },
  },
  {
    checker: ({ val }) => _.isObject(val),
    render: (node, lvl) => [
      renderProp(node, lvl),
      render(_.keys(node.val).sort().map(prop => ({ prop, val: node.val[prop] })), lvl + 1),
    ].join(''),
  },
  {
    checker: () => true,
    render: (node, lvl) => `${renderProp(node, lvl)}${node.val}\n`,
  },
];

export default render;
