import { generateFiles, joinPathFragments, Tree } from '@nrwl/devkit';

interface Options { 
  includeQueue: boolean;
  includeDatabase: boolean;
  organisationName: string;
  applicationName: string;
}

export function createApplicationFiles(
  tree: Tree,
  applicationRoot: string,
  options: Options,
) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files/application/src'),
    joinPathFragments(applicationRoot, 'src'),
    {
      tmpl: '',
      ...options
    }
  );
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files/application/env'),
    joinPathFragments(applicationRoot),
    {
      tmpl: '',
      ...options
    }
  );
}
