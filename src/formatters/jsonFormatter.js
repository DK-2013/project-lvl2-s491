import _ from 'lodash';
import actions from '../actions';


const [unchanged, added, deleted, updated] = actions;

const actsMap = {
  [added]: 'add',
  [deleted]: 'del',
  [unchanged]: '',
  [updated]: 'upd',
};

const updateActsValue = (data) => data.reduce((acc, node) => {
  if (!_.has(node, 'diff')) return [...acc, { ...node, act: actsMap[node.act] }];
  return [...acc, { ...node, act: actsMap[node.act], diff: updateActsValue(node.diff) }];
}, []);

export default (data) => JSON.stringify(updateActsValue(data));
