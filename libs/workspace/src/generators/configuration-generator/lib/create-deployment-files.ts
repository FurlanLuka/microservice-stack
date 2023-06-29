import { generateFiles, joinPathFragments, Tree } from '@nx/devkit';

export function createDeploymentFiles(tree: Tree) {
  generateFiles(tree, joinPathFragments(__dirname, '..', 'files'), '', {
    tmpl: '',
  });
}
