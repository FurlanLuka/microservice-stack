import {
  Tree,
} from '@nrwl/devkit';
import { getConfiguration } from '../configuration-generator/generator';
import { ConfigurationGeneratorSchema } from '../configuration-generator/schema';
import { createDeploymentFiles } from './lib/create-deployment-files';

export default async function deploymentConfigurationGenerator(
  tree: Tree,
): Promise<void> {
  const {
    deploymentConfigurationEnabled,
  }: ConfigurationGeneratorSchema = getConfiguration(tree);

  if (deploymentConfigurationEnabled) {
    createDeploymentFiles(tree);
  }
}
