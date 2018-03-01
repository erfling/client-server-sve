import IBaseClass from './BaseModel';
import ITeam from './ITeam';
import IRole from './IRole';
import {  Ref } from 'typegoose';
import { RoleName } from './RoleName';


export default interface IPlayer extends IBaseClass {
    Role?:RoleName;
    getSheetRangeByRole?():string;
    SheetRange?:string;
    Name?:string;
    IsSelected?: boolean;
    TeamId?:string;
    SelectedRole?:string;
}  