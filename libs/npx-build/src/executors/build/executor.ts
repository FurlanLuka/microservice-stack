import { exec } from 'child_process';
import { promisify } from 'util';
import { BuildExecutorSchema } from './schema';
import * as fs from 'fs';

export default async function runExecutor(options: BuildExecutorSchema) {
  const { stdout, stderr } = await promisify(exec)(
    `nx run ${options.applicationName}:build`
  );

  console.log(stdout);
  console.log(stderr);

  if (stderr) {
    return {
      success: false,
    };
  }

  const filePath = `${options.outputPath}/src/index.js`;

  const file = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath, `#!/usr/bin/env node\n\n${file}`);

  console.log('Executor ran for Build', options);
  return {
    success: true,
  };
}
