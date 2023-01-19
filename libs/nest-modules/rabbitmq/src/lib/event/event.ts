export class Event<T> {
  constructor(
    public routingKey: string,
    public version: number,
    public isSensitive?: boolean
  ) {}

  public getRoutingKey(): string {
    return `${this.routingKey}.v${this.version}`;
  }
}
