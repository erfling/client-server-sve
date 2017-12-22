import { prop, arrayProp, Typegoose, ModelType, InstanceType, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import BaseClass from './BaseModel'
import { Team } from './Team';
import IGame from '../../../shared/models/Game';
import ITeam from '../../../shared/models/Team';

//TODO: find out how to save nested teams, not just their refs. Possibly with pre method: https://github.com/szokodiakos/typegoose#pre

export class Game 
  extends BaseClass 
  implements IGame{
    @prop()
    Location?: string;
  
    @prop()
    Slug: string;

    @arrayProp({ itemsRef: Team })
    Teams:  Ref<ITeam>[] | ITeam[];

  }


  export const GameModel = new Game().getModelForClass( Game, { existingMongoose: mongoose } )
  