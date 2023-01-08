import { readProjectConfiguration, Tree } from '@nrwl/devkit';
import { AppLibraryGeneratorSchema } from './schema';
import { libraryGenerator } from '../library-generator/generator';

export default async function appLibraryGenerator(
  tree: Tree,
  { appName, libraryName }: AppLibraryGeneratorSchema
): Promise<void> {
  const config = readProjectConfiguration(tree, appName);

  if (config.projectType !== 'application') {
    throw new Error('Selected application does not exist.');
  }

  await libraryGenerator(tree, {
    libraryName: libraryName,
    libraryType: 'API',
    projectName: appName.replace('api-', ''),
  });
}
