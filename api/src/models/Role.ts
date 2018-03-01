import IRole from "../../../shared/models/IRole";
import { prop, arrayProp, Typegoose, ModelType, InstanceType, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import BaseClass from "./BaseModel";
import {RoleName} from '../../../shared/models/RoleName';


export class Role extends BaseClass implements IRole
{
    @prop({enum:RoleName})
    Name:RoleName;

    @prop()
    RoleTradeRatings:{ [R in RoleName]: 1|2|3|4|5 };
}

export const RoleModel = new Role().getModelForClass( Role, { existingMongoose: mongoose } )