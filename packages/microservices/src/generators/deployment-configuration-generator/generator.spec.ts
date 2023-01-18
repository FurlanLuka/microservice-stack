import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';

import deploymentConfigurationGenerator from './generator';
import configurationGenerator from '../configuration-generator/generator';

describe('Deployment configuration generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    configurationGenerator(tree, {
      deploymentConfigurationEnabled: true,
      organisationName: 'microservice-stack',
      includeRedis: true,
      includeDatabase: true,
      includeQueue: true,
    });
  });

  it('should generate deployment configuration', async () => {
    await deploymentConfigurationGenerator(tree);

    expect(tree.exists(`ingress-values.yaml`)).toBeDefined();
    expect(tree.exists(`charts/ingress-controller`)).toBeDefined();
    expect(tree.exists(`charts/node-service`)).toBeDefined();
    expect(tree.exists(`local/package.json`)).toBeDefined();
    expect(tree.exists(`local/start-cluster.js`)).toBeDefined();
    expect(tree.exists(`local/helm/pg-values.yml`)).toBeDefined();
    expect(tree.exists(`local/helm/rmq-values.yml`)).toBeDefined();
    expect(tree.exists(`local/helm/redis-values.yml`)).toBeDefined();
  });
});
