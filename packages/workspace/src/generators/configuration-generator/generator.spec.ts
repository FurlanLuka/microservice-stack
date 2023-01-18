import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readJson } from '@nrwl/devkit';

import { ConfigurationGeneratorSchema } from './schema';
import configurationGenerator from './generator';

const defaultSchema: ConfigurationGeneratorSchema = {
  organisationName: 'microservice-stack',
  deploymentConfigurationEnabled: false,
  includeDatabase: true,
};

describe('Configuration generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should generate default project configuration', async () => {
    configurationGenerator(tree, defaultSchema);

    expect(tree.exists('microservice-stack.json')).toBeTruthy();
    expect(readJson(tree, 'microservice-stack.json')).toStrictEqual({
      ...defaultSchema,
      includeDatabase: true,
      includeQueue: false,
      includeRedis: false,
    });

    const packageJson = readJson(tree, 'package.json');

    expect(packageJson.dependencies['@microservice-stack/module-health']).toBeDefined();
    expect(packageJson.dependencies['@microservice-stack/module-config']).toBeDefined();
    expect(packageJson.dependencies['@microservice-stack/module-typeorm-migrations']).toBeDefined();
    expect(packageJson.dependencies['@microservice-stack/nest-application']).toBeDefined();
  });
});
