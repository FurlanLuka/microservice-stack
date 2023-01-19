import {
  QueueOptions,
  RabbitMQExchangeConfig,
  RabbitRPC,
} from '@golevelup/nestjs-rabbitmq';
import { Decorators } from './interfaces';
import { DEFAULT_EXCHANGE } from '../..';

export function Rpc(
  routingKey: string,
  queueName: string,
  exchange: RabbitMQExchangeConfig = DEFAULT_EXCHANGE,
  queueOptions: QueueOptions
): Decorators {
  const fullQueueName = `${queueName}-${exchange.name}_${routingKey}`;

  return RabbitRPC({
    exchange: exchange.name,
    createQueueIfNotExists: true,
    queue: fullQueueName,
    routingKey: routingKey,
    queueOptions: {
      durable: true,
      ...queueOptions,
    },
  });
}
