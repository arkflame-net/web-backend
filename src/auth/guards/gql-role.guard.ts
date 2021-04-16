import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

function grepPermissions (user) {
  const permissions = [];

  for (const role of user.roles) {
    for (const perm of role.permissions) {
      if (!permissions.includes(perm)) {
        permissions.push(perm);
      }
    }
  }

  return permissions;
}

export function GqlRoleGuard (permissions: string[]): any {
  @Injectable()
  class guard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate (context: ExecutionContext): boolean {
      const ctx = context.getArgByIndex(2);
      const req = ctx.req;
      const user = req.user;

      const userPermissions = grepPermissions(user);

      if (userPermissions.includes("ADMINISTRATOR")) {
        return true;
      }

      for (const perm of permissions) {
        if (!userPermissions.includes(perm)) {
          return false;
        }
      }

      return true;
    }
  }

  return guard;
}
