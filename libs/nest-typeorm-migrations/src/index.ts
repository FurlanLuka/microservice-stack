import { Type, DynamicModule, ForwardReference } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MigrationGeneratorModule } from './lib/migration-generator.module';
import { MigrationGeneratorService } from './lib/migration-generator.service';

export async function generateMigration(
  appName: string,
  appModule: Type | DynamicModule | Promise<DynamicModule> | ForwardReference
): Promise<void> {
  const app = await NestFactory.create(
    MigrationGeneratorModule.register(appModule)
  );

  const migrationGeneratorService = app.get(MigrationGeneratorService);

  await migrationGeneratorService.generateMigration(appName);
  await app.close();

  process.exit(0);
}
