import { generateFiles, joinPathFragments, Tree } from '@nrwl/devkit';

interface Options {
  includeQueue: boolean;
  includeDatabase: boolean;
  includeRedis: boolean;
  organisationName: string;
  applicationName: string;
  capitalApplicationName: string;
}

export function createApplicationFiles(
  tree: Tree,
  applicationRoot: string,
  options: Options
) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files/application/src'),
    joinPathFragments(applicationRoot, 'src'),
    {
      tmpl: '',
      ...options,
    }
  );
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files/application/env'),
    joinPathFragments(applicationRoot),
    {
      tmpl: '',
      ...options,
    }
  );

  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files/application/deployment'),
    applicationRoot,
    {
      tmpl: '',
      ...options,
    }
  );
}
