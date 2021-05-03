import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "src/auth/guards/gql-auth.guard";
import { User } from "./user.model";
import { UserService } from "./user.service";
import { CurrentUser } from "../../auth/current-user.decorator";
import { AddRoleUserInput, CreateUserInput } from "./user.inputs";
import { GqlRoleGuard } from "src/auth/guards/gql-role.guard";

@Resolver(() => User)
export class UserResolver {
  constructor (private userService: UserService) {}

  @Query(()  => User)
  @UseGuards(GqlAuthGuard)
  public currentUser (@CurrentUser() user: User): User {
    return user;
  }

  @Mutation(() => User)
  public createUser (
    @Args('payload') payload: CreateUserInput,
  ) {
    return this.userService.createUser(payload);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard, GqlRoleGuard(["UPDATE_USER_ROLE"]))
  public addRoleToUser (
    @Args('payload') payload: AddRoleUserInput,
  ) {
    return this.userService.addRoleToUser(payload.user, payload.role);
  }
}
