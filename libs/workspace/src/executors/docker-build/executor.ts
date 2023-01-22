import { ExecutorContext, logger } from '@nrwl/devkit';
import { execSync } from 'child_process';
import { DockerBuildExecutorSchema } from './schema';

export default async function runExecutor(
  options: DockerBuildExecutorSchema,
  context: ExecutorContext
) {
  if (context.projectName === undefined) {
    logger.error(`Project name is not available.`);

    return { success: false };
  }

  const projectConfig = context.workspace.projects[context.projectName];
  const versionTag = `${context.projectName}-${options.imageTag}`;

  logger.info(`Building docker image for ${context.projectName}...`);

  execSync(
    `docker build -f ${projectConfig.root}/Dockerfile.ci -t ${options.ecrRegistry}/${options.ecrRepository}:${versionTag} .`
  );

  logger.info(`Pushing docker image to registry...`);

  execSync(`
    docker push ${options.ecrRegistry}/${options.ecrRepository}:${versionTag}
  `);

  console.log('Executor ran for Build', options);

  return {
    success: true,
  };
}
