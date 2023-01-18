import { generateFiles, joinPathFragments, Tree } from '@nrwl/devkit';

export function createDeploymentFiles(
  tree: Tree,
) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files'),
    '',
    {
      tmpl: '',
    }
  );
}
