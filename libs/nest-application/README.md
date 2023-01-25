# Application

This library streamlines the nest service start configuration by providing default nest configuration including&#x20;

* Fastify framework instead of Express because of its superior performance
* Winston logger formatted to raw JSON, so your service logs can easily be connected to services such as Datadog
* Enabled global Validation pipe for the use of class validator decorators
* Enabled cors

```typescript
import { AppModule } from './app.module';
import { startService } from '@microservice-stack/nest-application';

async function bootstrap(): Promise<void> {
  await startService('Service Name', AppModule);
}

bootstrap();
```