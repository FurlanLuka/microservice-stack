import { generateFiles, joinPathFragments, Tree } from '@nrwl/devkit';

interface Options {
  name: string;
  capitalName: string;
  organisationName: string;
}

export function createServiceLibraryFiles(
  tree: Tree,
  libraryRoot: string,
  options: Options,
) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files/library-service'),
    joinPathFragments(libraryRoot, 'src'),
    options,
  );
}
