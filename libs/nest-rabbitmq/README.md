# RabbitMQ

This library provides a module that enables the usage of RabbitMQ inside your project. It comes with support for publishing events as well as subscribing to them

### Import

```typescript
import { Module } from '@nestjs/common';
import { RabbitmqModule } from '@microservice-stack/nest-rabbitmq';
import { ConfigModule, ConfigService } from '@microservice-stack/nest-config';

@Module({
  imports: [
    RabbitmqModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('QUEUE_URL'),
      }),
    }),
  ],
})
export class AppModule {}
```

### Publish

```typescript
export interface HelloWorldEventPayload {
  hello: string;
}

export const HELLO_WORLD_EVENT = new Event<HelloWorldEventPayload>('hello.world', 1);
```

```typescript
import { RabbitmqService } from '@microservice-stack/nest-rabbitmq';
import { HELLO_WORLD_EVENT } from './constants';

export class HelloService {
  constructor(private queueService: RabbitmqService) {}

  public sayHello(): void {
    this.queueService.publishEvent(HELLO_WORLD_EVENT, { hello: 'world' });
  }
}
```

### Subscribe

Queue controllers should be defined separately from Rest controllers as any Rest endpoints defined in them will not work.

```typescript
import { Controller } from "@nestjs/common";
import { Subscribe } from "@microservice-stack/nest-rabbitmq";
import { HELLO_WORLD_EVENT, HelloWorldEventPayload } from './constants';

@Controller()
export class HelloQueueController {
  static CONTROLLER_QUEUE_NAME = 'hello-queue';

  @Subscribe(HELLO_WORLD_EVENT, HelloQueueController.CONTROLLER_QUEUE_NAME)
  public hello(payload: HelloWorldEventPayload): void {
    console.log(payload.hello);
  }
}
```
