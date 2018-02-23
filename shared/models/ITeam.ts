import IBaseClass from './BaseModel'
import {  Ref } from 'typegoose';
import IPlayer from './IPlayer';
import INation from './INation';
import { Nation } from '../../api/src/models/Nation'
import IDeal from './IDeal';
import { Deal } from '../../api/src/models/Deal';
import IRatings from './IRatings';

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
  GameState: string;
  Nation: Ref<Nation> | INation;
  DealsProposedBy: Deal[] | IDeal[];
  DealsProposedTo: Deal[] | IDeal[];
  Ratings: IRatings;
}