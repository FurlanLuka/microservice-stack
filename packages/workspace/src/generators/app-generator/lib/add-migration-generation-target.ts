import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';

export function addMigrationGenerationTarget(tree: Tree, projectName: string) {
  const projectConfig = readProjectConfiguration(tree, projectName);

  updateProjectConfiguration(tree, projectName, {
    ...projectConfig,
    targets: {
      ...projectConfig.targets,
      'generate-migrations': {
        executor: 'nx:run-commands',
        options: {
          command: `npm run build ${projectName} && node dist/apps/${projectName}/main generate-migration`,
        },
      },
    },
  });
}
