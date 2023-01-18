import { Tree } from '@nrwl/devkit';

export function deleteFile(tree: Tree, path: string): void {
  if (tree.isFile(path)) {
    tree.delete(path);
  }
}
