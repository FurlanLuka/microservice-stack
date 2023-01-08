import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule as OriginalConfigModule } from '@nestjs/config';
import { ConfigOptions } from './config.interfaces';
import { ConfigService } from './config.service';

@Global()
@Module({})
export class ConfigModule {
  static register(options: ConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
      imports: [OriginalConfigModule.forRoot({ cache: true })],
      global: true,
    };
  }
}
