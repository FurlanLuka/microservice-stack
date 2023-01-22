export interface DockerBuildExecutorSchema {
  ecrRegistry: string;
  ecrRepository: string;
  imageTag: string;
}
