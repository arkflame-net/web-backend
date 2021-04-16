import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';
import { RoleService } from "../roles/role.service";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly roleService: RoleService,
  ) {}

  public getByID (id: string, populate = true): Promise<User | undefined> {
    return this.userModel.findOne({ _id: id }).populate("roles").exec();
  }

  public getRawByID (id: string): Promise<User | undefined> {
    return this.userModel.findOne({ _id: id }).exec();
  }

  public getByEmail(email: string, populate = true): Promise<User | undefined> {
    return this.userModel.findOne({ email: email.toLowerCase() }).populate("roles").exec();
  }

  public updateUser (userID, payload, populate = true): Promise<User> {
    return this.userModel.findByIdAndUpdate(userID, payload).populate("roles").exec();
  }

  public createUser (payload): Promise<User> {
    const user = new this.userModel(payload);
    return user.save();
  }

  public async addRoleToUser (userID, roleID): Promise<User> {
    const user = await this.getRawByID(userID);
    const role = await this.roleService.getByID(roleID);

    if (user == null || role == null) {
      throw new BadRequestException(
        (user ? "ROLE" : "ID") + " with this ID doesn't exist",
        (user ? "ROLE" : "USER") + "_NOT_FOUND"
      );
    }

    else if (user.roles.includes(roleID)) {
      throw new BadRequestException(
        "This user (" + user.username + ") already have this role (" + role.name + ")",
        "USER_ALREDY_HAVE_ROLE"
      );
    }

    return this.updateUser(user._id, { roles: [ ...user.roles, role._id ] });
  }
}
