import { DynamicModule, Logger, Module, Provider } from '@nestjs/common';
import { RabbitMQConfig, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQExhangeUtil } from './rabbitmq-exchange.util';
import { RabbitmqService } from './rabbitmq.service';
import { RabbitMQModuleConfig } from './rabbitmq.interfaces';
import { DEFAULT_EXCHANGE } from '..';

@Module({})
export class RabbitmqModule {
  static register(options: RabbitMQModuleConfig): DynamicModule {
    const imports = [
      RabbitMQModule.forRootAsync(RabbitMQModule, {
        imports: options.imports,
        inject: options.inject,
        useFactory: (...args): RabbitMQConfig => {
          const config = options.useFactory(...args);

          return {
            ...config,
            exchanges: RabbitMQExhangeUtil.createExchanges([
              DEFAULT_EXCHANGE,
              ...(config.exchanges ? config.exchanges : []),
            ]),
            prefetchCount: 250,
            enableControllerDiscovery: true,
            connectionInitOptions: { wait: false },
            logger: new Logger(),
          };
        },
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
