import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import utilLibraryGenerator from './generator';
import { UtilLibraryGeneratorSchema } from './schema';

const defaultSchema: UtilLibraryGeneratorSchema = {
  utilName: 'test',
  organisationName: 'microservice-stack',
};

describe('Util library generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should generate util type lib', async () => {
    await utilLibraryGenerator(tree, defaultSchema);

    const config = readProjectConfiguration(
      tree,
      `api-utils-${defaultSchema.utilName}`
    );

    expect(config).toBeDefined();

    expect(config.tags).toStrictEqual([
      `scope:api:lib:util:${defaultSchema.utilName}`,
      `scope:api:lib:util`,
    ]);

    expect(
      tree.exists(
        `libs/api/utils/${defaultSchema.utilName}/src/index.ts`
      )
    ).toBeTruthy();

    expect(
      tree.children(
        `libs/api/utils/${defaultSchema.utilName}/src`
      ).length
    ).toStrictEqual(1);
  });
});
