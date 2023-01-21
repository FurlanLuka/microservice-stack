import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readJson } from '@nrwl/devkit';
import configurationGenerator from './generator';
import {
  CLASS_TRANSFORMER_VERSION,
  CLASS_VALIDATOR_VERSION,
  MICROSERVICE_STACK_VERSION,
  NESTJS_TYPEORM_VERSION,
  PG_VERSION,
  TYPEORM_VERSION,
} from '../../utils/package-versions';

describe('Configuration generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should generate default project configuration', async () => {
    configurationGenerator(tree);

    expect(tree.exists('microservice-stack.json')).toBeTruthy();
    expect(readJson(tree, 'microservice-stack.json')).toStrictEqual({});

    const packageJson = readJson(tree, 'package.json');

    expect(
      packageJson.dependencies['@microservice-stack/module-health']
    ).toStrictEqual(MICROSERVICE_STACK_VERSION);
    expect(
      packageJson.dependencies['@microservice-stack/module-config']
    ).toStrictEqual(MICROSERVICE_STACK_VERSION);
    expect(
      packageJson.dependencies['@microservice-stack/module-rabbitmq']
    ).toStrictEqual(MICROSERVICE_STACK_VERSION);
    expect(
      packageJson.dependencies['@microservice-stack/module-typeorm-migrations']
    ).toStrictEqual(MICROSERVICE_STACK_VERSION);
    expect(
      packageJson.dependencies['@microservice-stack/nest-application']
    ).toStrictEqual(MICROSERVICE_STACK_VERSION);
    expect(packageJson.dependencies['@nestjs/typeorm']).toStrictEqual(
      NESTJS_TYPEORM_VERSION
    );
    expect(packageJson.dependencies['class-validator']).toStrictEqual(
      CLASS_VALIDATOR_VERSION
    );
    expect(packageJson.dependencies['class-transformer']).toStrictEqual(
      CLASS_TRANSFORMER_VERSION
    );
    expect(packageJson.dependencies['typeorm']).toStrictEqual(TYPEORM_VERSION);
    expect(packageJson.dependencies['pg']).toStrictEqual(PG_VERSION);
  });
});
