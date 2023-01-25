import { Module } from "@nestjs/common";
import { <%= capitalName %>Controller } from "./<%= name %>.controller";
import { <%= capitalName %>Service } from "./<%= name %>.service";

@Module({
  controllers: [<%= capitalName %>Controller],
  providers: [<%= capitalName %>Service],
})
export class <%= capitalName %>Module {}