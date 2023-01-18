import { exec } from 'child_process';
import { promisify } from 'util';
import { sleep } from './utils';

const execAsync = promisify(exec);

export async function deployIngressController(debugEnabled: boolean) {
  try {
    console.log('Enabling ingress controller...');
    await execAsync('minikube addons enable ingress');
    await sleep(20000);
    console.log('Ingress controller enabled ✅');

    console.log('Installing ingress controller');
    await execAsync(
      'helm upgrade --install ingress infrastructure/charts/ingress-controller --values infrastructure/ingress-values.yaml --set environment=local'
    );
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Error while deploying ingress controller');
  }
}

