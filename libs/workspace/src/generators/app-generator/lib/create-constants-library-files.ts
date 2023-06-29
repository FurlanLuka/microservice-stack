import { generateFiles, joinPathFragments, Tree } from '@nx/devkit';

interface Options {
  includeQueue: boolean;
  includeDatabase: boolean;
  includeRedis: boolean;
  applicationName: string;
}

export function createConstantsLibraryFiles(
  tree: Tree,
  libraryRoot: string,
  options: Options
) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files/library-constants'),
    joinPathFragments(libraryRoot, 'src'),
    {
      tmpl: '',
      ...options,
    }
  );
}
