import IBaseClass from './BaseModel'
import {  Ref } from 'typegoose';
import IPlayer from './IPlayer';
import INation from './INation';
import { Nation } from '../../api/src/models/Nation'
import IDeal from './IDeal';
import { Deal } from '../../api/src/models/Deal';
import { Role } from '../../api/src/models/Role';
import {RoleName} from './RoleName';
import { Ratings } from '../../api/src/models/Ratings';
import IRatings from './IRatings';

export default interface ITeam extends IBaseClass {    
  Location?: string;  
  Name?: string;
  Slug?:string;
  SheetId?: string;
  SourceSheetId?: string;
  Players?: Ref<IPlayer>[] | IPlayer[];
  IsSelected?: boolean;
  GameId: string;
  GameState: string;
  Nation: Ref<Nation> | INation;
  Ratings: Ratings | IRatings;
  DealsProposedBy:Ref<Deal>[] | IDeal[];
  DealsProposedTo: Ref<Deal>[] | IDeal[];
  Roles:{ [R in RoleName]:Role };
  ChosenHorse: string;
}