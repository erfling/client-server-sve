import IBaseClass from './BaseModel';
import ITeam from './ITeam';
import IRole from './Role';
import {  Ref } from 'typegoose';

export enum Role{
    PRIVATE = "PRIVATE",
    ENERGY = "Energy",
    HEALTH = "Health",
    NGO    = "NGO",
    GOVERNMENT    = "GOVERNMENT"

}
export default interface IPlayer extends IBaseClass {
    Role: Role;
    getSheetRangeByRole(): string;
}  