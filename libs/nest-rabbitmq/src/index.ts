import { RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';

export * from './lib/decorators';
export * from './lib/rabbitmq-exchange.util';
export * from './lib/rabbitmq.interfaces';
export * from './lib/rabbitmq.module';
export * from './lib/rabbitmq.service';
export * from './lib/event/event';

export const DEFAULT_EXCHANGE: RabbitMQExchangeConfig = {
  name: 'default',
  type: 'topic',
};

/**
 * @author Andraz Cuderman - https://github.com/acuderman
 */
