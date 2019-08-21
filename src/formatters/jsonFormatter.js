import _ from 'lodash';
import actions from '../actions';


const {
  UNCHANGED, ADDED, DELETED, UPDATED,
} = actions;

const actsMap = {
  [ADDED]: 'add',
  [DELETED]: 'del',
  [UNCHANGED]: '',
  [UPDATED]: 'upd',
};

const updateActsValue = data => data.reduce((acc, node) => {
  if (!_.has(node, 'diff')) return [...acc, { ...node, act: actsMap[node.act] }];
  return [...acc, { ...node, act: actsMap[node.act], diff: updateActsValue(node.diff) }];
}, []);

export default data => JSON.stringify(updateActsValue(data));
