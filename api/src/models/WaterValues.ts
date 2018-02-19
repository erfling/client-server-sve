import { prop, arrayProp, Typegoose, ModelType, InstanceType, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import BaseClass from './BaseModel'
import ITeam from '../../../shared/models/ITeam';
import IPlayer from '../../../shared/models/IPlayer';
import { Player } from './Player';

export class WaterValues extends BaseClass
{
    @prop()
    Government: string;

    @prop()
    Industry: string;

    @prop()
    Healthcare: string;

    @prop()
    Agriculture: string;
  
  }

  export const WaterValuesModel = new WaterValues().getModelForClass( WaterValues, { existingMongoose: mongoose } )
  