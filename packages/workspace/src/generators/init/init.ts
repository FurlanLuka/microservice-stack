import { GeneratorCallback, Tree } from '@nrwl/devkit';
import { initGenerator } from '@nrwl/nest';

export async function init(tree: Tree): Promise<GeneratorCallback> {
  return initGenerator(tree, { unitTestRunner: 'jest' });
}
