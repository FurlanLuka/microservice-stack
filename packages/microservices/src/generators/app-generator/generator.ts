import { getWorkspaceLayout, joinPathFragments, Tree } from '@nrwl/devkit';
import { ApplicationGeneratorSchema } from './schema';
import { applicationGenerator as nestApplicationGenerator } from '@nrwl/nest';
import { Linter } from '@nrwl/linter';
import { deleteFiles } from '../../utils/delete-files';
import { createApplicationFiles } from './lib/create-application-files';
import { ConfigurationGeneratorSchema } from '../configuration-generator/schema';
import { getConfiguration } from '../configuration-generator/generator';
import { libraryGenerator } from '../library-generator/generator';
import { createConstantsLibraryFiles } from './lib/create-constants-library-files';
import { createDtoLibraryFiles } from './lib/create-dto-library-files';
import { addMigrationGenerationTarget } from './lib/add-migration-generation-target';
import serviceDeploymentGenerator from '../service-deployment-generator/generator';

export default async function applicationGenerator(
  tree: Tree,
  { applicationName, includeQueue, includeDatabase }: ApplicationGeneratorSchema
): Promise<void> {
  const {
    organisationName,
    deploymentConfigurationEnabled,
  }: ConfigurationGeneratorSchema = getConfiguration(tree);

  await nestApplicationGenerator(tree, {
    name: applicationName,
    standaloneConfig: true,
    directory: `api`,
    linter: Linter.EsLint,
    tags: [`scope:api:lib:util`, `scope:api:lib:${applicationName}`].join(','),
  });

  const applicationRoot: string = joinPathFragments(
    getWorkspaceLayout(tree).appsDir,
    `api/${applicationName}`
  );

  deleteFiles(tree, `${applicationRoot}/src`);

  createApplicationFiles(tree, applicationRoot, {
    includeQueue: includeQueue ?? false,
    includeDatabase: includeDatabase ?? false,
    applicationName,
    organisationName,
  });

  const libraryRoot: string = joinPathFragments(
    getWorkspaceLayout(tree).libsDir,
    `api/${applicationName}`
  );

  await libraryGenerator(tree, {
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

  await libraryGenerator(tree, {
    libraryName: 'data-transfer-objects',
    projectName: applicationName,
    libraryType: 'API',
  });

  deleteFiles(tree, `${libraryRoot}/data-transfer-objects/src`);

  createDtoLibraryFiles(tree, `${libraryRoot}/data-transfer-objects`);

  if (includeDatabase) {
    addMigrationGenerationTarget(tree, `api-${applicationName}`);
  }

  if (deploymentConfigurationEnabled) {
    serviceDeploymentGenerator(tree, { applicationName });
  }
}
