import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from "./role.model";
import { RoleResolver } from "./role.resolver";
import { RoleService } from "./role.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema
      },
    ])
  ],

  providers: [ RoleResolver, RoleService ],
  exports: [ RoleService ],
})
export class RoleModule {}
