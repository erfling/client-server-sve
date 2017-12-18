import { prop, arrayProp, Typegoose, ModelType, InstanceType, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import BaseClass from './BaseModel'
import { Team } from './Team';

//TODO: find out how to save nested teams, not just their refs. Possibly with pre method: https://github.com/szokodiakos/typegoose#pre

export class Game extends BaseClass {
    @prop()
    Location?: string;
  
    @prop()
    Slug: string;

    @arrayProp({ itemsRef: Team })
    Teams: Ref<Team>[];

  }


  export const GameModel = new Game().getModelForClass( Game, { existingMongoose: mongoose } )
  