import { DynamicModule, Module } from '@nestjs/common';
import { RedisOptions } from './redis.interfaces';
import { RedisService } from './redis.service';

@Module({})
export class RedisModule {
  static register(options: RedisOptions): DynamicModule {
    return {
      module: RedisModule,
      imports: options.imports,
      providers: [
        {
          inject: options.inject,
          provide: 'CONFIG_OPTIONS',
          useFactory: options.useFactory,
        },
        RedisService,
      ],
      exports: [RedisService],
      global: true,
    };
  }
}
