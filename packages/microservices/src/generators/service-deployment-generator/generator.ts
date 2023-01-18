import {
  getWorkspaceLayout,
  joinPathFragments,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { ServiceDeploymentGeneratorSchema } from './schema';
import { createServiceDeploymentFiles } from './lib/create-files';

export default async function serviceDeploymentGenerator(
  tree: Tree,
  { applicationName }: ServiceDeploymentGeneratorSchema
): Promise<void> {
  const config = readProjectConfiguration(tree, applicationName);

  if (config.projectType !== 'application') {
    throw new Error('Selected application does not exist.');
  }
  const applicationRoot: string = joinPathFragments(
    getWorkspaceLayout(tree).appsDir,
    `api/${applicationName}`
  );

  createServiceDeploymentFiles(tree, applicationRoot, applicationName);
}
