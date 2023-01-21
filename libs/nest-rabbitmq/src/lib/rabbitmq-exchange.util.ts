import { Injectable } from '@nestjs/common';
import { RabbitMQExchange } from './rabbitmq.interfaces';
import { RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class RabbitMQExhangeUtil {
  public static createExchanges(
    exchanges: RabbitMQExchange[]
  ): RabbitMQExchangeConfig[] {
    return exchanges.flatMap((exchange: RabbitMQExchange) => {
      const retryExchange: RabbitMQExchangeConfig = {
        name: RabbitMQExhangeUtil.getRetryExchangeName(exchange.name),
        type: 'x-delayed-message',
        options: {
          arguments: {
            'x-delayed-type': 'direct',
          },
        },
      };

      const deadLetterExchange: RabbitMQExchangeConfig = {
        name: RabbitMQExhangeUtil.getDeadLetterExchangeName(exchange.name),
        type: 'direct',
      };

      return [exchange, retryExchange, deadLetterExchange];
    });
  }

  public static getRetryExchangeName(exchange: string): string {
    return `${exchange}.retry`;
  }

  public static getDeadLetterExchangeName(exchange: string): string {
    return `${exchange}.dead`;
  }

  public static getDeadLetterQueueName(queueName: string): string {
    return `${queueName}.dead`;
  }
}
