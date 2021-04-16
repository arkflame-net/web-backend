import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { Role, RoleDocument } from './role.model';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  public query (payload: any): Promise<Role> {
    return this.roleModel.findOne(payload).exec();
  }

  public queryAll (payload: any): Promise<Role[]> {
    return this.roleModel.find(payload).exec();
  }

  public getAll (): Promise<Role[]> {
    return this.queryAll({});
  }

  public getByID (id: string): Promise<Role | undefined> {
    return this.roleModel.findById(id).exec();
  }

  public createRole (name: string, color: string, background: string, permissions: string[]) {
    const role = new this.roleModel({
      name, color, background, permissions
    });

    return role.save();
  }
}
