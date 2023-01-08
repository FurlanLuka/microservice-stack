import { Inject, Injectable } from '@nestjs/common';
import { ConfigOptions } from './config.interfaces';
import { ConfigService as OriginalConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(
    private configService: OriginalConfigService,
    @Inject('CONFIG_OPTIONS') private options: ConfigOptions
  ) {
    options.requiredEnvironmentVariables.forEach((variableName: string) => {
      if (this.configService.get(variableName) === undefined) {
        throw new Error(`INVALID_CONFIG_${variableName}_MISSING`);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public get<T = any>(configVariable: string): T {
    const value = this.configService.get(configVariable);

    if (this.options.parse) {
      return this.options.parse(configVariable, value);
    }

    return value;
  }
}
