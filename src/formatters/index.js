import { has } from 'lodash';
import treeFormatter from './treeFormatter';
import plainFormatter from './plainFormatter';

const formatters = {
  tree: treeFormatter,
  plain: plainFormatter,
};

export default (format) => {
  if (has(formatters, format)) return formatters[format];
  const msg = `Unsupported format: '${format}'`;
  throw new Error(msg);
};
