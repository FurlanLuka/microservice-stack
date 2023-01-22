import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';

export function addDeploymentTarget(tree: Tree, projectName: string) {
  const projectConfig = readProjectConfiguration(tree, projectName);

  updateProjectConfiguration(tree, projectName, {
    ...projectConfig,
    targets: {
      ...projectConfig.targets,
      'docker-build': {
        executor: '@microservice-stack/workspace:docker-build',
      },
      'helm-deploy': {
        executor: '@microservice-stack/workspace:helm-deploy',
      },
    },
  });
}
