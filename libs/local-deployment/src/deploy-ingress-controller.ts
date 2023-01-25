import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function enableIngressController(debugEnabled: boolean) {
  try {
    console.log('Enabling ingress controller...');
    await execAsync('minikube addons enable ingress');
    console.log('Ingress controller enabled ✅');
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Error while enabling ingress controller');
  }
}

export async function deployIngressController(debugEnabled: boolean) {
  try {
    console.log('Installing ingress controller');
    await execAsync(
      'helm upgrade --install ingress infrastructure/charts/ingress-controller --values infrastructure/ingress-values.yaml --set environment=local'
    );
    console.log('Installing ingress controller deployed ✅');
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Error while deploying ingress controller');
  }
}

