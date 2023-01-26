import {
  MessageHandlerOptions,
  QueueOptions,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { applyDecorators, Logger, SetMetadata } from '@nestjs/common';
import {
  ackErrorHandler,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq/lib/amqp/errorBehaviors';
import { Channel, ConsumeMessage } from 'amqplib';
import { RabbitMQExhangeUtil } from '../rabbitmq-exchange.util';
import {
  Decorators,
  RequeueOnErrorOptions,
  SubscriptionOptions,
} from './interfaces';
import { Event } from '../event/event';
import { DEFAULT_EXCHANGE } from '../..';

export const RABBIT_RETRY_HANDLER = 'RABBIT_RETRY_HANDLER';

export function Subscribe(
  event: Event<unknown>,
  queueName: string,
  options: SubscriptionOptions
): Decorators {
  const exchange = options.exchange ?? DEFAULT_EXCHANGE;
  const routingKey = event.getRoutingKey();
  const queueSpecificRoutingKey = `${queueName}-${routingKey}`;
  const fullQueueName = `${queueName}-${exchange.name}-${routingKey}`;

  const requeueOnErrorOptions: RequeueOnErrorOptions = {
    retry: true,
    deadLetter: true,
    retryInitialDelayInMs: 20_000,
    maxRetries: 5,
    retryBackoffMultiplier: 2,
    ...options.requeueOnError,
  };

  const queueOptions: QueueOptions = {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': RabbitMQExhangeUtil.getDeadLetterExchangeName(
        exchange.name
      ),
      'x-dead-letter-routing-key': queueSpecificRoutingKey,
      ...options.queue?.arguments,
    },
    ...options.queue,
  };

  const baseMessageHandlerOptions: MessageHandlerOptions = {
    createQueueIfNotExists: true,
    queue: fullQueueName,
    errorHandler: createErrorHandler(
      queueName,
      requeueOnErrorOptions,
      exchange.name,
      event.isSensitive
    ),
    queueOptions,
  };

  const decorators: MethodDecorator[] = [
    RabbitSubscribe({
      exchange: exchange.name,
      routingKey: routingKey,
      ...baseMessageHandlerOptions,
    }),
    SetMetadata(RABBIT_RETRY_HANDLER, {
      type: 'subscribe',
      routingKey: queueName,
      exchange: RabbitMQExhangeUtil.getRetryExchangeName(exchange.name),
      ...baseMessageHandlerOptions,
    }),
  ];

  return applyDecorators(...decorators);
}

function createErrorHandler(
  queueSpecificRoutingKey: string,
  requeueOnError: RequeueOnErrorOptions,
  exchangeName: string,
  isSensitive: boolean
): (
  channel: Channel,
  msg: ConsumeMessage,
  error: unknown
) => void | Promise<void> {
  return (channel: Channel, msg: ConsumeMessage, error) => {
    const messageHeaders = msg.properties.headers;

    const retryAttempt: number = messageHeaders['x-retry'] ?? 0;

    Logger.error({
      message: `Event handling failed for routing key "${queueSpecificRoutingKey}"`,
      payload: isSensitive ? msg.content.toString() : undefined,
      error,
      requeue: requeueOnError !== undefined,
      retryAttempt,
    });

    if (retryAttempt < requeueOnError.maxRetries) {
      const delay: number =
        messageHeaders['x-delay'] ??
        requeueOnError.retryInitialDelayInMs /
          requeueOnError.retryBackoffMultiplier;

      const retryHeaders = {
        ...messageHeaders,
        'x-delay': delay * requeueOnError.retryBackoffMultiplier,
        'x-retry': retryAttempt + 1,
        'event-id': messageHeaders['event-id'],
      };

      channel.publish(
        RabbitMQExhangeUtil.getRetryExchangeName(exchangeName),
        queueSpecificRoutingKey,
        msg.content,
        {
          headers: retryHeaders,
        }
      );
    } else {
      return pushToDeadLetterQueue(channel, msg, error);
    }

    return ackErrorHandler(channel, msg, error);
  };
}

function pushToDeadLetterQueue(
  channel: Channel,
  msg: ConsumeMessage,
  error
): void | Promise<void> {
  return defaultNackErrorHandler(channel, msg, error);
}
