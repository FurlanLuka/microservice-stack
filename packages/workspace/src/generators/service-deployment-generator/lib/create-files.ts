import { generateFiles, joinPathFragments, Tree } from '@nrwl/devkit';

export function createServiceDeploymentFiles(
  tree: Tree,
  applicationRoot: string,
  applicationName: string,
) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files'),
    applicationRoot,
    {
      tmpl: '',
      applicationName,
    }
  );
}
