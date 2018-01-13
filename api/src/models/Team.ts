import { prop, arrayProp, Typegoose, ModelType, InstanceType, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import BaseClass from './BaseModel'
import ITeam from '../../../shared/models/ITeam';
import IPlayer from '../../../shared/models/IPlayer';
import { Player } from './Player';

export class Team 
  extends BaseClass 
  implements ITeam{
    
    @prop()
    Location?: string;
  
    @prop()
    Name: string;

    @prop()
    Slug:string;

    @prop()
    SheetId:string;
    
    @arrayProp({ itemsRef: Player })
    Players:  Ref<IPlayer>[] | IPlayer[];
  
  }

  export const TeamModel = new Team().getModelForClass( Team, { existingMongoose: mongoose } )
  