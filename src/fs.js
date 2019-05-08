import { promises as fs } from 'fs';
import fg from 'fast-glob';

export default async ({ target: cwd, transform }) => {
  const files = await fg.async('**/*.ts{x,}', {
    absolute: true,
    cwd,
    nocase: true,
    unique: true,
  });

  await Promise.all(
    files.map(async file => {
      const code = await fs.readFile(file, 'utf-8');
      try {
        const output = transform(code);
        if (output !== '') {
          await fs.writeFile(file, output);
        }
      } catch (ex) {
        console.error(file, ex);
      }
    }),
  );
};
