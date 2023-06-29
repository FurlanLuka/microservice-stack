import { GeneratorCallback, Tree } from '@nx/devkit';
import { UtilLibraryGeneratorSchema } from './schema';
import { libraryGenerator } from '../library-generator/generator';

export default async function utilLibraryGenerator(
  tree: Tree,
  { libraryName }: UtilLibraryGeneratorSchema
): Promise<GeneratorCallback> {
  return libraryGenerator(tree, {
    libraryName,
    libraryType: 'UTIL',
    projectName: 'utils',
  });
}
