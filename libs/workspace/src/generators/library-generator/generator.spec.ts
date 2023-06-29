import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { libraryGenerator } from './generator';
import { LibraryGeneratorSchema } from './schema';
const defaultSchema: LibraryGeneratorSchema = {
  libraryName: 'test',
  projectName: 'utils',
  libraryType: 'UTIL',
};

describe('Library generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should generate util type lib', async () => {
    await libraryGenerator(tree, defaultSchema);

    const config = readProjectConfiguration(
      tree,
      `api-${defaultSchema.projectName}-${defaultSchema.libraryName}`
    );

    expect(config).toBeDefined();

    expect(config.tags).toStrictEqual([
      `scope:api:lib:util:${defaultSchema.libraryName}`,
      `scope:api:lib:util`,
    ]);

    expect(
      tree.exists(
        `libs/api/${defaultSchema.projectName}/${defaultSchema.libraryName}/src/index.ts`
      )
    ).toBeTruthy();

    expect(
      tree.children(
        `libs/api/${defaultSchema.projectName}/${defaultSchema.libraryName}/src`
      ).length
    ).toStrictEqual(1);
  });

  it('should generate api type lib', async () => {
    await libraryGenerator(tree, {
      ...defaultSchema,
      libraryType: 'API',
    });

    const config = readProjectConfiguration(
      tree,
      `api-${defaultSchema.projectName}-${defaultSchema.libraryName}`
    );

    expect(config).toBeDefined();

    expect(config.tags).toStrictEqual([
      `scope:api:lib:${defaultSchema.projectName}`,
    ]);

    expect(
      tree.exists(
        `libs/api/${defaultSchema.projectName}/${defaultSchema.libraryName}/src/index.ts`
      )
    ).toBeTruthy();

    expect(
      tree.children(
        `libs/api/${defaultSchema.projectName}/${defaultSchema.libraryName}/src`
      ).length
    ).toStrictEqual(1);
  });
});
