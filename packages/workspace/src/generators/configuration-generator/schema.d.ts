export interface ConfigurationGeneratorWithDeploymentSchema {
  organisationName: string;
  deploymentConfigurationEnabled: true;
  includeQueue: boolean;
  includeRedis: boolean;
  includeDatabase: boolean;
}

export interface ConfigurationGeneratorWithoutDeploymentSchema {
  organisationName: string;
  deploymentConfigurationEnabled: false;
  includeQueue?: boolean;
  includeRedis?: boolean;
  includeDatabase?: boolean;
}

export type ConfigurationGeneratorSchema =
  | ConfigurationGeneratorWithDeploymentSchema
  | ConfigurationGeneratorWithoutDeploymentSchema;
