import { generateFiles, joinPathFragments, Tree } from '@nx/devkit';

export function createDtoLibraryFiles(tree: Tree, libraryRoot: string) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files/library-data-transfer-objects'),
    joinPathFragments(libraryRoot, 'src'),
    {
      tmpl: '',
    }
  );
}
