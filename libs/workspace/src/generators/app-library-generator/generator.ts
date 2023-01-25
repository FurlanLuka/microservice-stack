import {
  GeneratorCallback,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { AppLibraryGeneratorSchema } from './schema';
import { libraryGenerator } from '../library-generator/generator';

export default async function appLibraryGenerator(
  tree: Tree,
  { applicationName, libraryName }: AppLibraryGeneratorSchema
): Promise<GeneratorCallback> {
  const config = readProjectConfiguration(tree, applicationName);

  if (config.projectType !== 'application') {
    throw new Error('Selected application does not exist.');
  }

  return libraryGenerator(tree, {
    libraryName: libraryName,
    libraryType: 'API',
    projectName: applicationName.replace('api-', ''),
  });
}
