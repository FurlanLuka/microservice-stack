import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { format } from '@sqltools/formatter/lib/sqlFormatter';

/**
 * Taken from https://github.com/typeorm/typeorm/blob/master/src/commands/MigrationGenerateCommand.ts
 */

@Injectable()
export class MigrationGeneratorService {
  constructor(private dataSource: DataSource) {}

  public async generateMigration(serviceName: string): Promise<void> {
    const upSqls: string[] = [];
    const downSqls: string[] = [];
    const sqlInMemory = await this.dataSource.driver
      .createSchemaBuilder()
      .log();

    sqlInMemory.upQueries.forEach((upQuery) => {
      upQuery.query = this.prettifyQuery(upQuery.query);
    });
    sqlInMemory.downQueries.forEach((downQuery) => {
      downQuery.query = this.prettifyQuery(downQuery.query);
    });

    sqlInMemory.upQueries.forEach((upQuery) => {
      upSqls.push(
        '        await queryRunner.query(`' +
          upQuery.query.replace(new RegExp('`', 'g'), '\\`') +
          '`' +
          this.queryParams(upQuery.parameters) +
          ');',
      );
    });
    sqlInMemory.downQueries.forEach((downQuery) => {
      downSqls.push(
        '        await queryRunner.query(`' +
          downQuery.query.replace(new RegExp('`', 'g'), '\\`') +
          '`' +
          this.queryParams(downQuery.parameters) +
          ');',
      );
    });

    const fileContent = this.getTemplate(
      serviceName,
      Date.now(),
      upSqls,
      downSqls,
    );

    console.log('_______START-MIGRATION-CODE_______');
    console.log(fileContent);
    console.log('_______END-MIGRATION-CODE_______');
  }

  private queryParams(parameters: unknown[] | undefined): string {
    if (!parameters || !parameters.length) {
      return '';
    }

    return `, ${JSON.stringify(parameters)}`;
  }

  private prettifyQuery(query: string): string {
    const formattedQuery = format(query, { indent: '    ' });
    return '\n' + formattedQuery.replace(/^/gm, '            ') + '\n        ';
  }

  private getTemplate(
    name: string,
    timestamp: number,
    upSqls: string[],
    downSqls: string[],
  ): string {
    const migrationName = `${this.formatServiceName(name)}${timestamp}`;

    return `import { MigrationInterface, QueryRunner } from "typeorm";

export class ${migrationName} implements MigrationInterface {
name = '${migrationName}'

public async up(queryRunner: QueryRunner): Promise<void> {
${upSqls.join(`
`)}
}

public async down(queryRunner: QueryRunner): Promise<void> {
${downSqls.join(`
`)}
}

}
`;
  }

  private formatServiceName(serviceName: string): string {
    const nameParts: string[] = serviceName.split('-');

    const capitalizedNameParts = nameParts.map(
      (part) => part.charAt(0).toUpperCase() + part.slice(1),
    );

    return capitalizedNameParts.join('');
  }
}
