import { has } from 'lodash';
import treeFormatter from './treeFormatter';
import plainFormatter from './plainFormatter';
import jsonFormatter from './jsonFormatter';

const formatters = {
  tree: treeFormatter,
  plain: plainFormatter,
  json: jsonFormatter,
  object: (data) => data,
};

export default (format) => {
  if (has(formatters, format)) return formatters[format];
  const msg = `Unsupported format: '${format}'`;
  throw new Error(msg);
};
