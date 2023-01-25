import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function setupCluster(debugEnabled: boolean) {
  try {
    console.log('Deleting old cluster...');
    await execAsync('minikube delete');
    console.log('Cluster deleted ✅');

    console.log('Setting up fresh cluster...');
    await execAsync('minikube start');
    console.log('Cluster created ✅');

    console.log('Setting up helm repositories...');
    await execAsync('helm repo add datadog https://helm.datadoghq.com');
    await execAsync('helm repo add bitnami https://charts.bitnami.com/bitnami');
    await execAsync('helm repo update');

    console.log('Starting RabbitMQ...');
    await execAsync(
      `helm install rabbitmq -f infrastructure/local/rabbitmq-values.yml bitnami/rabbitmq`
    );
    console.log('RabbitMQ Started ✅');

    console.log('Starting PostgresSQL...');
    await execAsync(
      `helm install postgresql -f infrastructure/local/postgresql-values.yml bitnami/postgresql`
    );
    console.log('PostgreSQL Started ✅');

    console.log('Starting Redis');
    await execAsync(
      `helm install redis -f infrastructure/local/redis-values.yml bitnami/redis`
    );
    console.log('Redis Started ✅');
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Issue while setting up cluster, is your docker running?');
  }
}
