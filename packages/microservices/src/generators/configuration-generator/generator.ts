import { readJson, Tree } from '@nrwl/devkit';
import { ConfigurationGeneratorSchema } from './schema';

const CONFIGURATION_FILE_NAME = 'microservice-stack.json';

export default function configurationGenerator(
  tree: Tree,
  schema: ConfigurationGeneratorSchema
) {
  if (tree.exists(CONFIGURATION_FILE_NAME)) {
    throw new Error('Microservice stack configuration already exists.');
  }

  tree.write(CONFIGURATION_FILE_NAME, JSON.stringify({
    organisationName: schema.organisationName,
    deploymentConfigurationEnabled: schema.deploymentConfigurationEnabled,
    includeQueue: schema.includeQueue ?? false,
    includeRedis: schema.includeRedis ?? false,
    includePostgres: schema.includePostgres ?? false,
  }));
}

export function getConfiguration(tree: Tree): ConfigurationGeneratorSchema {
  if (!tree.exists(CONFIGURATION_FILE_NAME)) {
    throw new Error(
      'Microservice stack configuration does not exist. Please generate configuration'
    );
  }

  return readJson(tree, CONFIGURATION_FILE_NAME);
}
