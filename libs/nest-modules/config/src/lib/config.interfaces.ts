export interface ConfigOptions {
  requiredEnvironmentVariables: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parse?: (configVariable: string, value: any) => any;
}
