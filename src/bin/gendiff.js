#!/usr/bin/env node
import program from 'commander';
import genDiff from '..';

program.description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .option('-f, --format <type>', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    // eslint-disable-next-line no-console
    console.log(genDiff(firstConfig, secondConfig));
  });

program.parse(process.argv);
