import { QueueOptions } from '@golevelup/nestjs-rabbitmq';

// eslint-disable-next-line @typescript-eslint/ban-types
export type Decorators = <TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void;

export interface SubscriptionOptions {
  onError?: RequeueOnErrorOptions;
  exchange: string;
  queue?: QueueOptions;
  logEventPayload?: boolean;
}

export interface RequeueOnErrorOptions {
  retry?: boolean,
  deadLetter?: boolean,
  retryInitialDelayInMs?: number,
  maxRetries?: number,
  retryBackoffMultiplier?: number
}

export interface SubscriptionOptionsWithDefaults extends Required<SubscriptionOptions>{
  onError: Required<RequeueOnErrorOptions>
}

export {
  QueueOptions
}