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

async function buildBaseImage(debugEnabled: boolean) {
  try {
    console.log(`Building base image...`);

    await execAsync(
      `eval $(minikube docker-env) && DOCKER_SCAN_SUGGEST=false docker build -f infrastructure/local/Dockerfile.prebuild -t service-prebuild:latest .`
    );

    console.log(`Base image build successful ✅`);
  } catch (error) {
    if (debugEnabled) {
      console.error(JSON.stringify(error, null, 2));
    }
    throw new Error('Error while building microservices');
  }
}

async function build(services: string[], debugEnabled: boolean) {
  try {
    await Promise.all(
      services.map(async (service: string) => {
        console.log(`Building ${service}...`);

        await execAsync(
          `nx run api-${service}:build && eval $(minikube docker-env) && DOCKER_SCAN_SUGGEST=false docker build -f apps/api/${service}/Dockerfile.local --build-arg BASE_IMAGE=service-prebuild:latest -t ${service}:latest .`
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
          `helm upgrade --install ${service} infrastructure/charts/node-service --set version=latest --set image=${service} --set environment=local --set service.name=${service}`
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

  await buildBaseImage(debugEnabled)
  await build(services, debugEnabled);
  await deploy(services, debugEnabled);
}

export async function deployService(service: string, debugEnabled: boolean) {
  const services: string[] = await getServiceList(debugEnabled);

  if (!services.includes(service)) {
    throw new Error('This service does not exist.');
  }

  await buildBaseImage(debugEnabled)
  await build([service], debugEnabled);
  await deploy([service], debugEnabled);
}
