import RedisClient from 'ioredis';

export class Connection {
  private client: RedisClient;

  constructor(connectionUrl: string, private keyPrefix: string | undefined) {
    this.client = new RedisClient(connectionUrl);
  }

  public getClient(): RedisClient {
    return this.client;
  }
}
