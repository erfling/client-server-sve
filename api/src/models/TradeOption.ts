import { prop, arrayProp, Typegoose, ModelType, InstanceType, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import BaseClass from './BaseModel';
import INation from '../../../shared/models/INation';
import { Nation } from './Nation';

export class TradeOption extends BaseClass
{
    @prop({ ref: Nation })
    FromNation: Ref<Nation> | INation;

    @prop({ ref: Nation })
    ToNation: Ref<Nation> | INation;

    @prop()
    Message: string;
  }

  export const TradeOptionModel = new TradeOption().getModelForClass( TradeOption, { existingMongoose: mongoose } )
  