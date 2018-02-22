import { prop, arrayProp, Typegoose, ModelType, InstanceType, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import BaseClass from './BaseModel';
import INation from '../../../shared/models/INation';
import { Nation } from './Nation';
import ITradeOption from '../../../shared/models/ITradeOption';

export class TradeOption extends BaseClass implements ITradeOption
{
    @prop()
    FromNationId: string;

    @prop()
    ToNationId: string;

    @prop()
    Message: string;
}

export const TradeOptionModel = new TradeOption().getModelForClass( TradeOption, { existingMongoose: mongoose } )
  