import IBaseClass from './BaseModel'
import {  Ref } from 'typegoose';
import IPlayer from './IPlayer';

export default interface ITeam extends IBaseClass {    
  Location?: string;  
  Name?: string;
  Slug?:string;
  SheetId?: string;
  Players?: Ref<IPlayer>[] | IPlayer[];
  IsSelected?: boolean;
  government: string;
  industry: string;
  healthcare: string;
  agriculture: string;
  GameId: string;
  GameState: number | string;
}  