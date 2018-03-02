import IRole from "../../../shared/models/IRole";
import { prop, arrayProp, Typegoose, ModelType, InstanceType, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import BaseClass from "./BaseModel";
import {RoleName} from '../../../shared/models/RoleName';
import { RoleRatingCategories } from "../../../shared/models/RoleRatingCategories";


export class Role extends BaseClass implements IRole
{
    @prop({enum:RoleName})
    Name:RoleName;

    @prop()
    RoleTradeRatings:{ [R in RoleRatingCategories]: null|1|2|3 };
}

export const RoleModel = new Role().getModelForClass( Role, { existingMongoose: mongoose } )