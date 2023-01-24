import {
  generateFiles,
  getWorkspaceLayout,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { TypeormMigrationGeneratorSchema } from './schema';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'node:path';

interface NormalizedSchema extends TypeormMigrationGeneratorSchema {
  serviceRoot: string;
}

function normalizeOptions(
  tree: Tree,
  options: TypeormMigrationGeneratorSchema
): NormalizedSchema {
  const serviceRoot = `${
    getWorkspaceLayout(tree).appsDir
  }/api/${options.applicationName.replace('api-', '')}`;

  return {
    ...options,
    serviceRoot,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema): void {
  const templateOptions = {
    ...options,
    offsetFromRoot: offsetFromRoot(options.serviceRoot),
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.serviceRoot,
    templateOptions
  );
}

const MIGRATION_START_OUTPUT = '_______START-MIGRATION-CODE_______';
const MIGRATION_END_OUTPUT = '_______END-MIGRATION-CODE_______';

export default async function (
  tree: Tree,
  options: TypeormMigrationGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);

  const execute = promisify(exec);

  const { stdout } = await execute(
    `npx nx run ${normalizedOptions.applicationName}:generate-migrations`,
    { maxBuffer: 1024 * 5000 }
  );

  const migrationCode: string = stdout
    .split(MIGRATION_START_OUTPUT)[1]
    .split(MIGRATION_END_OUTPUT)[0];

  const migrationName: string = (<RegExpMatchArray>(
    migrationCode.match(/(?<=name = ').*?(?=')/gs)
  ))[0];

  const migrationsDirectory = `${normalizedOptions.serviceRoot}/src/migrations`;

  tree.write(`${migrationsDirectory}/${migrationName}.ts`, migrationCode);

  const migrations = tree
    .children(migrationsDirectory)
    .map((migrationFile) => migrationFile.slice(0, -3));

  tree.delete(`${normalizedOptions.serviceRoot}/src/migrations.ts`);

  addFiles(tree, {
    ...normalizedOptions,
    migrations,
  });
}
