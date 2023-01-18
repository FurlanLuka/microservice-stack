import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function getServiceList(debugEnabled: boolean): Promise<string[]> {
  try {
    const { stdout } = await execAsync('ls apps/api');

    const services = stdout
      .split(/\r?\n/)
      .filter((service) => service.length > 0);

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

async function build(services: string[], debugEnabled: boolean) {
  try {
    await Promise.all(
      services.map(async (service: string) => {
        console.log(`Building ${service}...`);

        await execAsync(
          `eval $(minikube docker-env) DOCKER_SCAN_SUGGEST=false docker build -f apps/api/${service}/Dockerfile.local -t ${service}:latest .`
        );

        console.log(`${service} build successful ✅`);
      })
    );
  } catch (error) {
    if (debugEnabled) {
      console.error(JSON.stringify(error, null, 2));
    }
    throw new Error('Error while building microservices');
  }
}

async function deploy(services: string[], debugEnabled: boolean) {
  try {
    await Promise.all(
      services.map(async (service: string) => {
        console.log(`Deploying ${service}...`);

        await execAsync(
          `helm upgrade --install ${service} infrastructure/charts/node-service --set tag=latest --set image=${service} --set --set environment=local --set service.name=${service}`
        );

        console.log(`${service} deployed ✅`);
      })
    );
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Error while deploying microservices');
  }
}

export async function deployServices(debugEnabled: boolean) {
  const services: string[] = await getServiceList(debugEnabled);

  await build(services, debugEnabled);
  await deploy(services, debugEnabled);
}

export async function deployService(service: string, debugEnabled: boolean) {
  const services: string[] = await getServiceList(debugEnabled);

  if (!services.includes(service)) {
    throw new Error('This service does not exist.');
  }

  await build([service], debugEnabled);
  await deploy([service], debugEnabled);
}
