import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "src/auth/guards/gql-auth.guard";
import { Role } from "./role.model";
import { RoleService } from "./role.service";
import { User } from "../user/user.model";
import { CurrentUser } from "../../auth/current-user.decorator";
import { CreateRoleInput } from "./role.inputs";
import { GqlRoleGuard } from "src/auth/guards/gql-role.guard";

@Resolver(() => Role)
export class RoleResolver {
  constructor (private roleService: RoleService) {}

  @Query(()  => [Role])
  @UseGuards(GqlAuthGuard)
  public fetchAllRoles (@CurrentUser() user: User): Promise<Role[]> {
    return this.roleService.getAll();
  }

  @Mutation(() => Role)
  @UseGuards(GqlAuthGuard, GqlRoleGuard(["CREATE_ROLE"]))
  public createRole (
    @Args("payload") payload: CreateRoleInput,
  ) {
    return this.roleService.createRole(payload.name, payload.color, payload.background, payload.permissions);
  }
}
