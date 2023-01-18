import { getWorkspaceLayout, joinPathFragments, Tree } from '@nrwl/devkit';
import { LibraryGeneratorSchema } from './schema';
import { libraryGenerator as nestLibraryGenerator } from '@nrwl/nest';
import { Linter } from '@nrwl/linter';
import { deleteFiles } from '../../utils/delete-files';
import { createFiles } from './lib/create-files';

export async function libraryGenerator(
  tree: Tree,
  { libraryName, projectName, libraryType }: LibraryGeneratorSchema
): Promise<void> {
  const workspace = getWorkspaceLayout(tree);

  const tags: string[] = [];

  if (libraryType === 'API') {
    tags.push(`scope:api:lib:${projectName}`);
  } else if (libraryType === 'UTIL') {
    tags.push(`scope:api:lib:util:${libraryName}`, `scope:api:lib:util`);
  }

  await nestLibraryGenerator(tree, {
    name: libraryName,
    standaloneConfig: true,
    buildable: false,
    controller: false,
    directory: `api/${projectName}`,
    importPath: `@${workspace.npmScope}/api/${projectName}/${libraryName}`,
    linter: Linter.EsLint,
    service: false,
    publishable: false,
    tags: tags.join(','),
  });

  const libraryRoot: string = joinPathFragments(
    workspace.libsDir,
    `api/${projectName}/${libraryName}`
  );

  deleteFiles(tree, `${libraryRoot}/src/lib`);
  createFiles(tree, libraryRoot, libraryName);
}
