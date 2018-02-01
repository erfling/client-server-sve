import { prop, arrayProp, Typegoose, ModelType, InstanceType, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import BaseClass from './BaseModel'
import { Team } from './Team';
import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';

//TODO: find out how to save nested teams, not just their refs. Possibly with pre method: https://github.com/szokodiakos/typegoose#pre

export class Game 
  extends BaseClass 
  implements IGame{
    
    @prop({default: "Game"})
    CLASS_NAME:string;
    
    @prop({default: "games"})
    REST_URL:string;

    @prop()
    Location?: string;
  
    @prop()
    Slug: string;

    @prop()
    Name: string;

    @arrayProp({ itemsRef: Team })
    Teams:  Ref<ITeam>[] | ITeam[];

  }


  export const GameModel = new Game().getModelForClass( Game, { existingMongoose: mongoose } )
  