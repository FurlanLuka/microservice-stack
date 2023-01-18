import util from 'util';
import chalk from 'chalk';
import clear from 'clear';
import { exec } from 'child_process';
import { program } from 'commander';
import { readFileSync } from 'fs';

const execAsync = util.promisify(exec);

function loadMicroserviceStackConfiguration() {
  const configuration = readFileSync('microservice-stack.json');

  return JSON.parse(configuration.toString());
}

async function checkRequirements() {
  try {
    await execAsync('minikube');
  } catch {
    throw new Error('Minikube is required');
  }

  try {
    await execAsync('eval $(minikube -u minikube docker-env)');
    await execAsync('docker info');
  } catch {
    throw new Error('Docker is required');
  }

  try {
    await execAsync('helm');
  } catch {
    throw new Error('Helm is required');
  }

  try {
    await execAsync('kubectl');
  } catch {
    throw new Error('Kubectl is required');
  }
}

async function setupCluster(configuration, debugEnabled) {
  try {
    console.log('Deleting old cluster...');
    await execAsync('minikube delete');
    console.log('Cluster deleted ✅');

    console.log('Setting up fresh cluster...');
    await execAsync('minikube start');
    console.log('Cluster created ✅');

    console.log('Setting up deployments...');
    await execAsync('helm repo add datadog https://helm.datadoghq.com');
    await execAsync('helm repo add bitnami https://charts.bitnami.com/bitnami');
    await execAsync('helm repo update');

    if (configuration.includeQueue) {
      console.log('Starting RabbitMQ...');
      await execAsync(
        `helm install rabbitmq -f local/helm/rmq-values.yml bitnami/rabbitmq`
      );
      console.log('RabbitMQ Started ✅');
    }

    if (configuration.includeDatabase) {
      console.log('Starting PostgresSQL...');
      await execAsync(
        `helm install postgresql -f local/helm/pg-values.yml bitnami/postgresql`
      );
      console.log('PostgreSQL Started ✅');
    }

    if (configuration.includeRedis) {
      console.log('Starting Redis');
      await execAsync(
        `helm install redis -f local/helm/redis-values.yml bitnami/redis`
      );
      console.log('Redis Started ✅');
    }
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Issue while setting up cluster, is your docker running?');
  }
}

async function getServices(debugEnabled) {
  try {
    const { stdout } = await execAsync('ls ../apps/api');

    const services = stdout
      .split(/\r?\n/)
      .filter((service) => service.length > 0 && !service.includes('-ui'));

    if (debugEnabled) {
      console.log('Microservices ', services);
    }

    return services;
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Error while listing microservices');
  }
}

async function buildServices(services, debugEnabled) {
  try {
    const buildCommands = [];

    for (let i = 0; i < services.length; i++) {
      const service = services[i];

      buildCommands.push(
        `cd ../ && DOCKER_SCAN_SUGGEST=false docker build -f apps/api/${service}/Dockerfile.local -t ${service}:latest . && cd ./local`
      );
    }

    console.log(
      `Building ${
        services.length === 1 ? 'service' : 'services'
      }...(this might take a while)`
    );

    if (debugEnabled) {
      console.log(
        `eval $(minikube docker-env) ${buildCommands
          .map((command) => `&& ${command}`)
          .join(' ')}`
      );
    }

    await execAsync(
      `eval $(minikube docker-env) ${buildCommands
        .map((command) => `&& ${command}`)
        .join(' ')}`
    );

    console.log('Build successful ✅');
  } catch (error) {
    if (debugEnabled) {
      console.error(JSON.stringify(error, null, 2));
    }
    throw new Error('Error while building microservices');
  }
}

async function deployServices(services, debugEnabled) {
  try {
    for (let i = 0; i < services.length; i++) {
      const service = services[i];

      console.log(`Deploying ${service}...`);

      await execAsync(
        `cd .. && helm upgrade --install ${service} charts/node-service --set tag=latest --set image=${service} --set local=true --set environment=local --set service=${service}`
      );
      console.log(`${service} deployed ✅`);
    }
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Error while deploying microservices');
  }
}

async function deployIngressController(install = true, debugEnabled) {
  try {
    console.log('Enabling ingress controller...');
    if (install) {
      await execAsync('minikube addons enable ingress');
      await sleep(20000);
      console.log('Ingress controller enabled ✅');
    }

    console.log('Installing ingress controller');
    await execAsync(
      'helm upgrade --install ingress ../charts/ingress-controller --set local=true'
    );
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Error while deploying ingress controller');
  }
}

async function cleanup(debugEnabled) {
  try {
    console.log('Cleaning up...');
    await execAsync('eval $(minikube -u minikube docker-env)');
    console.log('Cleaned up ✅');
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Issue while setting up docker, is your docker running?');
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

program
  .command('install')
  .alias('i')
  .option('-d, --debug')
  .action(async ({ debug = true }) => {
    clear();

    console.log(
      chalk.inverse.bold('Starting local microservice deployment...')
    );

    try {
      const configuration = loadMicroserviceStackConfiguration();

      await checkRequirements();
      await setupCluster(configuration, debug);
      const microservices = await getServices(debug);
      await buildServices(microservices, debug);
      await deployServices(microservices, debug);
      await deployIngressController(true, debug);
    } catch (error) {
      console.log(chalk.red.bold(error.message));
    }
  });

program
  .command('update')
  .alias('u')
  .requiredOption('-s, --service <service>', 'service that should be upgraded')
  .option('-d, --debug')
  .action(async ({ service, debug = true }) => {
    clear();

    console.log(
      chalk.inverse.bold('Starting local microservice deployment...')
    );

    if (service === 'ingress') {
      await deployIngressController(false, debug);

      return;
    }

    try {
      await buildServices([service], debug);
      await deployServices([service], debug);
    } catch (error) {
      console.log(chalk.red.bold(error.message));
    }
  });

program.parse();
