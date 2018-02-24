import { prop, arrayProp, Typegoose, ModelType, InstanceType, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import BaseClass from './BaseModel';
import INation from '../../../shared/models/INation';
import { Nation } from './Nation';
import ITradeOption from '../../../shared/models/ITradeOption';

//TODO: refactor nation ids because they are now nation names. Consider whether it would benefit to have both props
export class TradeOption extends BaseClass implements ITradeOption
{
    @prop()
    FromNationId: string;

    @prop()
    FromNationName: string;    
    
    @prop()
    ToNationName: string;

    @prop()
    ToNationId: string;

    @prop()
    Message: string;
}

export const TradeOptionModel = new TradeOption().getModelForClass( TradeOption, { existingMongoose: mongoose } )
  