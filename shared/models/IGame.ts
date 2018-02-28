import IBaseClass from './BaseModel';
import ITeam from './ITeam';
import {  Ref } from 'typegoose';

export default interface IGame extends IBaseClass {    
    Location?: string;  
    Name? :string;
    Slug?: string;
    Teams?: Ref<ITeam>[] | ITeam[];
    SheetId?:string;
    IsSelected?:boolean;
    NumberOfTeams?: number;
    SourceSheetId?: string
    DatePlayed: Date;
    State: string;
    IsCurrentGame:boolean;
  }  