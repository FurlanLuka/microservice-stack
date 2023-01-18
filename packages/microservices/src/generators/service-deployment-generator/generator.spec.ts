import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';

import serviceDeploymentGenerator from './generator';
import applicationGenerator from '../app-generator/generator';
import { ServiceDeploymentGeneratorSchema } from './schema';
import configurationGenerator from '../configuration-generator/generator';

const defaultSchema: ServiceDeploymentGeneratorSchema = {
  applicationName: 'api-test',
};

describe('Service deployment generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    configurationGenerator(tree, {
      deploymentConfigurationEnabled: false,
      organisationName: 'microservice-stack',
    });
  });

  it('should fail generating deployment configuration because application does not exist', async () => {
    expect(
      serviceDeploymentGenerator(tree, defaultSchema)
    ).rejects.toThrowError();
  });

  it('should generate deployment configuration', async () => {
    await applicationGenerator(tree, {
      applicationName: 'test',
      includeDatabase: false,
      includeQueue: false,
    });

    await serviceDeploymentGenerator(tree, defaultSchema);

    expect(
      tree.exists(`apps/api/${defaultSchema.applicationName}/deployment-values.yaml`)
    ).toBeDefined();
    expect(
      tree.exists(`apps/api/${defaultSchema.applicationName}/Dockerfile.local`)
    ).toBeDefined();
    expect(
      tree.exists(`apps/api/${defaultSchema.applicationName}/Dockerfile.ci`)
    ).toBeDefined();
  });
});
