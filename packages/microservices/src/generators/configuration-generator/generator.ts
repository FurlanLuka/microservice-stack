import { addDependenciesToPackageJson, readJson, Tree } from '@nrwl/devkit';
import {
  MICROSERVICE_STACK_VERSION,
  NESTJS_TYPEORM_VERSION,
  TYPEORM_VERSION,
} from '../../utils/package-versions';
import { ConfigurationGeneratorSchema } from './schema';

const CONFIGURATION_FILE_NAME = 'microservice-stack.json';

function addDependencies(tree: Tree, schema: ConfigurationGeneratorSchema) {
  const dependencies = {
    '@microservice-stack/nest-application': MICROSERVICE_STACK_VERSION,
    '@microservice-stack/module-health': MICROSERVICE_STACK_VERSION,
    '@microservice-stack/module-config': MICROSERVICE_STACK_VERSION,
  };

  if (schema.includeDatabase) {
    dependencies['@microservice-stack/module-typeorm-migrations'] =
      MICROSERVICE_STACK_VERSION;
    dependencies['typeorm'] = TYPEORM_VERSION;
    dependencies['@nestjs/typeorm'] = NESTJS_TYPEORM_VERSION;
  }

  addDependenciesToPackageJson(tree, dependencies, {});
}

export default function configurationGenerator(
  tree: Tree,
  schema: ConfigurationGeneratorSchema
) {
  if (tree.exists(CONFIGURATION_FILE_NAME)) {
    throw new Error('Microservice stack configuration already exists.');
  }

  tree.write(
    CONFIGURATION_FILE_NAME,
    JSON.stringify({
      organisationName: schema.organisationName,
      deploymentConfigurationEnabled: schema.deploymentConfigurationEnabled,
      includeQueue: schema.includeQueue ?? false,
      includeRedis: schema.includeRedis ?? false,
      includeDatabase: schema.includeDatabase ?? false,
    })
  );

  addDependencies(tree, schema);
}

export function getConfiguration(tree: Tree): ConfigurationGeneratorSchema {
  if (!tree.exists(CONFIGURATION_FILE_NAME)) {
    throw new Error(
      'Microservice stack configuration does not exist. Please generate configuration'
    );
  }

  return readJson(tree, CONFIGURATION_FILE_NAME);
}
