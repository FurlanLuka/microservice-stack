import { QueueOptions } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQExchange } from '../rabbitmq.interfaces';

// eslint-disable-next-line @typescript-eslint/ban-types
export type Decorators = <TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>
) => void;

export interface SubscriptionOptions {
  requeueOnError?: RequeueOnErrorOptions;
  exchange?: RabbitMQExchange;
  queue?: QueueOptions;
}

export interface RequeueOnErrorOptions {
  retry: boolean;
  deadLetter: boolean;
  retryInitialDelayInMs: number;
  maxRetries: number;
  retryBackoffMultiplier: number;
}

export { QueueOptions };
