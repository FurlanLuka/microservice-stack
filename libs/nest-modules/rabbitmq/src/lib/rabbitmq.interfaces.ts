import {
  RabbitMQConfig as IRabbitMQConfig,
  RabbitMQExchangeConfig,
} from '@golevelup/nestjs-rabbitmq';
import {
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common';

export interface RabbitMQConfig extends IRabbitMQConfig {
  enableRetryExchange
}

export interface RabbitMQExchange extends RabbitMQExchangeConfig {
  initRetryExchange?: boolean;
  initDeadLetterExchange?: boolean;
}

export interface RabbitMQModuleConfig {
  imports: Array<
    Type | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  inject: (InjectionToken | OptionalFactoryDependency)[];
  useFactory: (...args: unknown[]) => RabbitMQConfig;
}
