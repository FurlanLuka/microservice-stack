export interface DeployExecutorSchema {
  ecrRegistry: string;
  ecrRepository: string;
  imageTag: string;
  environment: string;
}
