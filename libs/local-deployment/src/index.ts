import * as chalk from 'chalk';
import { program } from 'commander';
import { checkRequirements } from './check-deployment-requirements';
import { setupCluster } from './setup-cluster';
import { deployService, deployServices } from './deploy-services';
import { deployIngressController } from './deploy-ingress-controller';

program
  .command('install')
  .alias('i')
  .option('-d, --debug')
  .action(async ({ debug = false }) => {
    console.log(
      chalk.bold('Starting local microservice deployment...')
    );

    try {
      await checkRequirements();
      await setupCluster(debug);
      await deployServices(debug);
      await deployIngressController(debug);
    } catch (error) {
      console.log(chalk.bold.red(error.message));
    }
  });

program
  .command('update')
  .alias('u')
  .requiredOption('-s, --service <service>', 'service that should be upgraded')
  .option('-d, --debug')
  .action(async ({ service, debug = false }) => {
    console.log(
      chalk.bold('Starting local microservice deployment...')
    );

    try {
      await checkRequirements();
      await deployService(service, debug);
      await deployIngressController(debug);
    } catch (error) {
      console.log(chalk.bold.red(error.message));
    }
  });

program.parse();
