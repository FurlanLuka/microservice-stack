import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function checkRequirements() {
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
