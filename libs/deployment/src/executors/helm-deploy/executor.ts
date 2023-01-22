import { ExecutorContext, logger } from '@nrwl/devkit';
import { execSync } from 'child_process';
import { DeployExecutorSchema } from './schema';

export default async function runExecutor(
  { imageTag, ecrRegistry, ecrRepository, environment }: DeployExecutorSchema,
  { projectName, workspace }: ExecutorContext
) {
  if (projectName === undefined) {
    logger.error(`Project name is not available.`);

    return { success: false };
  }

  logger.info(`Ecr registry url ${ecrRegistry}`);

  const projectConfig = workspace.projects[projectName];
  const versionTag = `${projectName}-${imageTag}`;

  logger.info(`Deploying ${projectName}...`);

  execSync(
    `helm upgrade --install ${projectName} ${projectConfig.root}/chart --set tag=${versionTag} --set image=${ecrRegistry}/${ecrRepository} --set environment=${environment}`
  );

  return {
    success: true,
  };
}
