# Config
This library wraps the default `@nestjs/config` library and adds the ability to define variables that are required for the service to launch and the ability to parse environment variables.

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@microservice-stack/nest-config';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [
        'STRING_VARIABLE',
        'JSON_VARIABLE',
      ],
      parse: (configVariable, value) => {
        if (configVariable === 'JSON_VARIABLE') {
          return JSON.parse(value);
        }

        return value;
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

```

The `ConfigModule` is registered globally, so you can inject it as you wish

```typescript
import { ConfigService } from '@microservice-stack/nest-config';

export class AppService {
  constructor(private configService: ConfigService) {}
    
  public hello(): string {
    return this.configService.get('STRING_VARIABLE');
  }
}
```