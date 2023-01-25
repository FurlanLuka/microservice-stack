import { Controller, Get } from "@nestjs/common";
import { <%= capitalName %>Service } from "./<%= name %>.service";

@Controller('v1/<%= name %>')
export class <%= capitalName %>Controller {

  constructor(private <%= name %>Service: <%= capitalName %>Service) {}

  @Get()
  public hello(): string {
    return this.<%= name %>Service.hello();
  }
}