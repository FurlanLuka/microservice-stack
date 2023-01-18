import { QueueOptions, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Decorators } from './interfaces';

export function Rpc(
  routingKey: string,
  queueName: string,
  exchange: string,
  queueOptions: QueueOptions,
): Decorators {

  return RabbitRPC({
    exchange: exchange,
    createQueueIfNotExists: true,
    queue: queueName,
    routingKey: routingKey,
    queueOptions: queueOptions
  })
}
