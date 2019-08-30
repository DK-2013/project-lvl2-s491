#!/usr/bin/env node
import program from 'commander';
import genDiff from '..';

program.description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .option('-f, --format <type>', 'Output format', 'tree')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig, { format }) => {
    // eslint-disable-next-line no-console
    console.log(genDiff(firstConfig, secondConfig, format));
  });

program.parse(process.argv);
