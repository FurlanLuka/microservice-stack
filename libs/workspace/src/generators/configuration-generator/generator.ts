import {
  addDependenciesToPackageJson,
  GeneratorCallback,
  Tree,
} from '@nrwl/devkit';
import {
  CLASS_TRANSFORMER_VERSION,
  CLASS_VALIDATOR_VERSION,
  MICROSERVICE_STACK_VERSION,
  NESTJS_TYPEORM_VERSION,
  PG_VERSION,
  TYPEORM_VERSION,
} from '../../utils/package-versions';
import { createDeploymentFiles } from './lib/create-deployment-files';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

const CONFIGURATION_FILE_NAME = 'microservice-stack.json';

function addDependencies(tree: Tree): GeneratorCallback {
  const devDependencies = {};
  const dependencies = {
    '@microservice-stack/nest-application': MICROSERVICE_STACK_VERSION,
    '@microservice-stack/module-health': MICROSERVICE_STACK_VERSION,
    '@microservice-stack/module-config': MICROSERVICE_STACK_VERSION,
    '@microservice-stack/module-rabbitmq': MICROSERVICE_STACK_VERSION,
    '@microservice-stack/module-typeorm-migrations': MICROSERVICE_STACK_VERSION,
    '@nestjs/typeorm': NESTJS_TYPEORM_VERSION,
    'class-validator': CLASS_VALIDATOR_VERSION,
    'class-transformer': CLASS_TRANSFORMER_VERSION,
    typeorm: TYPEORM_VERSION,
    pg: PG_VERSION,
  };

  return addDependenciesToPackageJson(tree, dependencies, devDependencies);
}

export default function configurationGenerator(tree: Tree) {
  if (tree.exists(CONFIGURATION_FILE_NAME)) {
    throw new Error('Microservice stack configuration already exists.');
  }

  tree.write(CONFIGURATION_FILE_NAME, JSON.stringify({}));

  const addDependenciesTask = addDependencies(tree);

  createDeploymentFiles(tree);

  return runTasksInSerial(addDependenciesTask);
}
