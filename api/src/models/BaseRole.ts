import IRole from "../../../shared/models/IRole";
import { prop, arrayProp, Typegoose, ModelType, InstanceType, Ref } from 'typegoose';
import BaseClass from "./BaseModel";


export class BaseRole extends BaseClass implements IRole
{
    @prop({enum:RoleName})
    Name:RoleName;

    RoleTradeRatings:{ [R in RoleName]: 1|2|3|4|5 };
}
