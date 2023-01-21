import { DynamicModule, Module } from '@nestjs/common';
import { MigrationGeneratorService } from './migration-generator.service';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';

@Module({})
export class MigrationGeneratorModule {
  static register(
    appModule: Type | DynamicModule | Promise<DynamicModule> | ForwardReference,
  ): DynamicModule {
    return {
      providers: [MigrationGeneratorService],
      imports: [appModule],
      module: MigrationGeneratorModule,
    };
  }
}
