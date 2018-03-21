import IBaseClass from './BaseModel';
import ITeam from './ITeam';
import {  Ref } from 'typegoose';
import { Ratings } from '../../api/src/models/Ratings';
import IRatings from './IRatings';

export default interface IGame extends IBaseClass {    
    Location?: string;  
    Name? :string;
    Slug?: string;
    Teams?: Ref<ITeam>[] | ITeam[];
    TeamRatings?: Ratings | IRatings;
    SheetId?:string;
    IsSelected?:boolean;
    NumberOfTeams?: number;
    SourceSheetId?: string
    DatePlayed: Date;
    State: string;
    IsCurrentGame:boolean;
    SubmissionsByRound: string[][];
  }  