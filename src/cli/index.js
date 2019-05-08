import yargs from 'yargs';
import * as path from 'path';

const cwd = process.cwd();

// yargs
// .option('lodash', {
//   default: ['node_modules', '**/*.{test,spec}.{js,jsx,ts,tsx}'],
//   description: 'Pattern of files to ignore',
//   type: 'boolean',
// })
// .option('quote', {
//   default: 'single',
// });

const { argv } = yargs;

export default {
  argv,
  target: argv._[argv._.length - 1]
    ? path.resolve(cwd, argv._[argv._.length - 1])
    : cwd,
};
