import { Injectable } from '@nestjs/common';
import { ConfigService } from '@microservice-stack/nest-config';
import { ConfigVariables } from '@<%= organisationName %>/api/<%= name %>/constants';
   
@Injectable()
export class <%= capitalName %>Service {
  constructor(private configService: ConfigService) {}

  public hello(): string {
    return this.configService.get<string>(ConfigVariables.REQUIRED_ENVIRONMENT_VARIABLE);
  }
}
