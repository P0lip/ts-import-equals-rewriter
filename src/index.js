import transform from './ast/transform';
import argv from './cli/index';
import fs from './fs';

(async () => {
  try {
    await fs({
      target: argv.target,
      transform,
    });
    process.exit(0);
  } catch (ex) {
    console.error(ex);
    process.exit(1);
  }
})();
