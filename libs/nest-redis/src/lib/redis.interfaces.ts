import {
  Type,
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
} from '@nestjs/common';

export interface ConnectionOptions {
  connectionName: string;
  connectionUrl: string;
  keyPrefix?: string;
}

export type RedisConfig = {
  connections: ConnectionOptions[];
};

export interface RedisOptions {
  imports: Array<
    Type | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  inject: (InjectionToken | OptionalFactoryDependency)[];
  useFactory: (...args: unknown[]) => RedisConfig;
}
