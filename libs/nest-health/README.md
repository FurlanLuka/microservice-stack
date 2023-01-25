# Health

This library provides a module that adds a `/health` endpoint to your nest service. This endpoint can be used for Kubernetes health checks.

```typescript
import { Module } from '@nestjs/common';
import { HealthModule } from '@microservice-stack/nest-health';

@Module({
  imports: [HealthModule],
})
export class AppModule {}
```