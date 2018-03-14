import IRole from "../../../shared/models/IRole";
import { prop, arrayProp, Typegoose, ModelType, InstanceType, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import BaseClass from "./BaseModel";
import {RoleName} from '../../../shared/models/RoleName';
import { RoleRatingCategories } from "../../../shared/models/RoleRatingCategories";


export class Role extends BaseClass implements IRole
{

    @prop({default: "Role"})
    CLASS_NAME: string;

    @prop({enum:RoleName})
    Name:RoleName;

    @prop()
    RoleTradeRatings:{ [R in RoleRatingCategories]: {Value: null|1|2|3, AgreementStatus: -1|0|1 }};
}

export const RoleModel = new Role().getModelForClass( Role, { existingMongoose: mongoose } )