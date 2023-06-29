import {
  GeneratorCallback,
  getWorkspaceLayout,
  joinPathFragments,
  Tree,
} from '@nx/devkit';
import { LibraryGeneratorSchema } from './schema';
import { libraryGenerator as nestLibraryGenerator } from '@nx/nest';
import { Linter } from '@nx/linter';
import { deleteFiles } from '../../utils/delete-files';
import { createFiles } from './lib/create-files';
import { runTasksInSerial } from '@nx/workspace/src/utilities/run-tasks-in-serial';

export async function libraryGenerator(
  tree: Tree,
  { libraryName, projectName, libraryType }: LibraryGeneratorSchema
): Promise<GeneratorCallback> {
  const workspace = getWorkspaceLayout(tree);

  const tags: string[] = [];

  if (libraryType === 'API') {
    tags.push(`scope:api:lib:${projectName}`);
  } else if (libraryType === 'UTIL') {
    tags.push(`scope:api:lib:util:${libraryName}`, `scope:api:lib:util`);
  }

  const nestLibraryGeneratorTask = await nestLibraryGenerator(tree, {
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

  return runTasksInSerial(nestLibraryGeneratorTask);
}
