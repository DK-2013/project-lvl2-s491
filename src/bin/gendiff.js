#!/usr/bin/env node
import program from 'commander';
import { readFileSync } from 'fs';
import genDiff, { getParser } from '..';

program.description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .option('-f, --format <type>', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    const firstParser = getParser(firstConfig);
    const secondParser = getParser(secondConfig);
    const obj1 = firstParser.parse(readFileSync(firstConfig));
    const obj2 = secondParser.parse(readFileSync(secondConfig));
    // eslint-disable-next-line no-console
    console.log(genDiff(obj1, obj2));
  });

program.parse(process.argv);
