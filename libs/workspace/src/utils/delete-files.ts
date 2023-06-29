import { Tree } from '@nx/devkit';

export function deleteFiles(tree: Tree, path: string): void {
  const files = tree.children(path);

  files.forEach((file) => tree.delete(`${path}/${file}`));
}
