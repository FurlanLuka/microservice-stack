import { generateFiles, joinPathFragments, Tree } from '@nrwl/devkit';

interface Options { 
  includeQueue: boolean;
  applicationName: string;
}

export function createConstantsLibraryFiles(
  tree: Tree,
  libraryRoot: string,
  options: Options,
) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files/library-constants'),
    joinPathFragments(libraryRoot, 'src'),
    {
      tmpl: '',
      ...options
    }
  );
}
