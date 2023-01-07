import { generateFiles, joinPathFragments, Tree } from '@nrwl/devkit';

export function createFiles(
  tree: Tree,
  libraryRoot: string,
  libraryName: string
) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files'),
    joinPathFragments(libraryRoot, 'src'),
    {
      tmpl: '',
      libraryName,
    }
  );
}
