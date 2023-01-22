import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import applicationGenerator from './generator';
import { ApplicationGeneratorSchema } from './schema';

const defaultSchema: ApplicationGeneratorSchema = {
  applicationName: 'test',
  includeDatabase: true,
  includeQueue: true,
};

describe('Application generate generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should generate application and default libraries', async () => {
    await applicationGenerator(tree, defaultSchema);

    const applicationConfig = readProjectConfiguration(
      tree,
      `api-${defaultSchema.applicationName}`
    );

    const constantsConfig = readProjectConfiguration(
      tree,
      `api-${defaultSchema.applicationName}-constants`
    );

    const dtoConfig = readProjectConfiguration(
      tree,
      `api-${defaultSchema.applicationName}-data-transfer-objects`
    );

    expect(applicationConfig).toBeDefined();
    expect(constantsConfig).toBeDefined();
    expect(dtoConfig).toBeDefined();

    expect(applicationConfig.tags).toStrictEqual([
      `scope:api:lib:util`,
      `scope:api:lib:${defaultSchema.applicationName}`,
    ]);

    expect(
      tree.exists(`apps/api/${defaultSchema.applicationName}/src/main.ts`)
    ).toBeTruthy();

    expect(
      tree.exists(`apps/api/${defaultSchema.applicationName}/src/migrations.ts`)
    ).toBeTruthy();

    expect(
      tree.exists(`apps/api/${defaultSchema.applicationName}/src/app.module.ts`)
    ).toBeTruthy();

    expect(
      tree.exists(`apps/api/${defaultSchema.applicationName}/.env`)
    ).toBeTruthy();

    expect(
      tree.exists(
        `libs/api/${defaultSchema.applicationName}/constants/src/index.ts`
      )
    ).toBeTruthy();

    expect(
      tree.exists(
        `libs/api/${defaultSchema.applicationName}/data-transfer-objects/src/types.ts`
      )
    ).toBeTruthy();

    expect(
      tree.exists(
        `libs/api/${defaultSchema.applicationName}/data-transfer-objects/src/index.ts`
      )
    ).toBeTruthy();

    const projectConfiguration = readProjectConfiguration(
      tree,
      `api-${defaultSchema.applicationName}`
    );

    expect(projectConfiguration.targets['generate-migrations']).toBeDefined();
  });
});
