import IBaseClass from './BaseModel';
import ITeam from './Team';
import IRole from './Role';
import {  Ref } from 'typegoose';

export enum Role{
    BANKER = "Banker",
    ENERGY = "Energy",
    HEALTH = "Health",
    NGO    = "NGO"
}
export default interface IPlayer extends IBaseClass {
    Role: Role;
    getSheetRangeByRole(): string;
}  