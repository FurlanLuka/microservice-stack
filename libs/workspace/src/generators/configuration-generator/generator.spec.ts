import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readJson } from '@nx/devkit';
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

    expect(tree.exists(`.github/workflows/check.yaml`)).toBeTruthy();

    expect(tree.exists(`.github/workflows/deploy.yaml`)).toBeTruthy();

    const packageJson = readJson(tree, 'package.json');

    expect(
      packageJson.dependencies['@microservice-stack/nest-health']
    ).toStrictEqual(MICROSERVICE_STACK_VERSION);
    expect(
      packageJson.dependencies['@microservice-stack/nest-config']
    ).toStrictEqual(MICROSERVICE_STACK_VERSION);
    expect(
      packageJson.dependencies['@microservice-stack/nest-rabbitmq']
    ).toStrictEqual(MICROSERVICE_STACK_VERSION);
    expect(
      packageJson.dependencies['@microservice-stack/nest-redis']
    ).toStrictEqual(MICROSERVICE_STACK_VERSION);
    expect(
      packageJson.dependencies['@microservice-stack/nest-typeorm-migrations']
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
