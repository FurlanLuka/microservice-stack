import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import appLibraryGenerator from './generator';
import applicationGenerator from '../app-generator/generator';
import { AppLibraryGeneratorSchema } from './schema';
import configurationGenerator from '../configuration-generator/generator';

const defaultAppLibrarySchema: AppLibraryGeneratorSchema = {
  appName: 'api-test',
  libraryName: 'lib',
};

describe('Application library generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    configurationGenerator(tree, {
      deploymentConfigurationEnabled: false,
      organisationName: 'microservice-stack',
    });
  });

  it('should fail generating lib because application does not exist', async () => {
    expect(
      appLibraryGenerator(tree, defaultAppLibrarySchema)
    ).rejects.toThrowError();
  });

  it('should generate application library', async () => {
    await applicationGenerator(tree, {
      applicationName: 'test',
    });

    await appLibraryGenerator(tree, defaultAppLibrarySchema);

    const config = readProjectConfiguration(
      tree,
      `${defaultAppLibrarySchema.appName}-${defaultAppLibrarySchema.libraryName}`
    );

    expect(config).toBeDefined();
  });
});
