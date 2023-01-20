export interface ApplicationGeneratorSchema {
  applicationName: string;
  includeQueue?: boolean;
  includeRedis?: boolean;
  includeDatabase?: boolean;
}
