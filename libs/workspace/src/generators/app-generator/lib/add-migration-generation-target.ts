import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';

export function addMigrationGenerationTarget(tree: Tree, projectName: string) {
  const projectConfig = readProjectConfiguration(tree, projectName);

  updateProjectConfiguration(tree, projectName, {
    ...projectConfig,
    targets: {
      ...projectConfig.targets,
      'generate-migrations': {
        executor: 'nx:run-commands',
        options: {
          command: `nx run ${projectName}:build && node dist/apps/${projectName.replace(
            '-',
            '/'
          )}/main generate-migrations`,
        },
      },
    },
  });
}
