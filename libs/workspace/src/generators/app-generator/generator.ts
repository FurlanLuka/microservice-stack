import {
  GeneratorCallback,
  getWorkspaceLayout,
  joinPathFragments,
  Tree,
} from '@nrwl/devkit';
import { ApplicationGeneratorSchema } from './schema';
import { applicationGenerator as nestApplicationGenerator } from '@nrwl/nest';
import { Linter } from '@nrwl/linter';
import { deleteFiles } from '../../utils/delete-files';
import { createApplicationFiles } from './lib/create-application-files';
import { libraryGenerator } from '../library-generator/generator';
import { createConstantsLibraryFiles } from './lib/create-constants-library-files';
import { createDtoLibraryFiles } from './lib/create-dto-library-files';
import { addMigrationGenerationTarget } from './lib/add-migration-generation-target';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { addDeploymentTarget } from './lib/add-deployment-target';

export default async function applicationGenerator(
  tree: Tree,
  { applicationName, includeQueue, includeDatabase }: ApplicationGeneratorSchema
): Promise<GeneratorCallback> {
  const workspace = getWorkspaceLayout(tree);

  const nestApplicationGeneratorTask = await nestApplicationGenerator(tree, {
    name: applicationName,
    standaloneConfig: true,
    directory: `api`,
    linter: Linter.EsLint,
    tags: [`scope:api:lib:util`, `scope:api:lib:${applicationName}`].join(','),
  });

  const applicationRoot: string = joinPathFragments(
    workspace.appsDir,
    `api/${applicationName}`
  );

  deleteFiles(tree, `${applicationRoot}/src`);

  createApplicationFiles(tree, applicationRoot, {
    includeQueue: includeQueue ?? false,
    includeDatabase: includeDatabase ?? false,
    applicationName,
    organisationName: workspace.npmScope,
  });

  const libraryRoot: string = joinPathFragments(
    getWorkspaceLayout(tree).libsDir,
    `api/${applicationName}`
  );

  const constantsLibraryGeneratorTask = await libraryGenerator(tree, {
    libraryName: 'constants',
    projectName: applicationName,
    libraryType: 'API',
  });

  deleteFiles(tree, `${libraryRoot}/constants/src`);

  createConstantsLibraryFiles(tree, `${libraryRoot}/constants`, {
    includeQueue: includeQueue ?? false,
    includeDatabase: includeDatabase ?? false,
    applicationName,
  });

  const dtoLibraryGeneratortask = await libraryGenerator(tree, {
    libraryName: 'data-transfer-objects',
    projectName: applicationName,
    libraryType: 'API',
  });

  deleteFiles(tree, `${libraryRoot}/data-transfer-objects/src`);

  createDtoLibraryFiles(tree, `${libraryRoot}/data-transfer-objects`);

  addMigrationGenerationTarget(tree, `api-${applicationName}`);
  addDeploymentTarget(tree, `api-${applicationName}`);

  return runTasksInSerial(
    nestApplicationGeneratorTask,
    constantsLibraryGeneratorTask,
    dtoLibraryGeneratortask
  );
}
