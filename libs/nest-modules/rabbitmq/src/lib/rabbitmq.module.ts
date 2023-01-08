import { DynamicModule, Module, Provider } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitmqExchangeUtil } from './rabbitmq-exchange.util';
import { RabbitmqService } from './rabbitmq.service';
import {
  RabbitMQInitConfig,
  RabbitMQModuleConfig,
} from './rabbitmq.interfaces';

@Module({})
export class RabbitmqModule {
  static register(options: RabbitMQModuleConfig): DynamicModule {
    const rmqConfigFactory = (...args): RabbitMQInitConfig => {
      const config = options.useFactory(...args);

      return {
        ...config,
        exchanges: RabbitmqExchangeUtil.createExchanges(config.exchanges),
      };
    };

    const imports = [
      RabbitMQModule.forRootAsync(RabbitMQModule, {
        imports: options.imports,
        inject: options.inject,
        useFactory: rmqConfigFactory,
      }),
    ];

    const exports: Provider[] = [RabbitMQModule, RabbitmqService];
    const providers: Provider[] = [RabbitmqService];

    return {
      module: RabbitmqModule,
      providers,
      imports,
      exports,
      global: true,
    };
  }
}
