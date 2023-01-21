import { GeneratorCallback, Tree } from '@nrwl/devkit';
import { UtilLibraryGeneratorSchema } from './schema';
import { libraryGenerator } from '../library-generator/generator';

export default async function utilLibraryGenerator(
  tree: Tree,
  { utilName }: UtilLibraryGeneratorSchema
): Promise<GeneratorCallback> {
  return libraryGenerator(tree, {
    libraryName: utilName,
    libraryType: 'UTIL',
    projectName: 'utils',
  });
}
