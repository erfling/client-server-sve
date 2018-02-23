import BaseClass from "./BaseModel";
import IDeal from "../../../shared/models/IDeal";
import ITradeOption from "../../../shared/models/ITradeOption";
import { TradeOption } from './TradeOption';
import { Typegoose, prop, Ref } from 'typegoose';
import * as mongoose from 'mongoose';

export class Deal extends BaseClass implements IDeal {
    
    @prop({required: true, ref: TradeOption})
    TradeOption: Ref<TradeOption> | ITradeOption;

    @prop()
    from: string;

    @prop()
    to: string;
    
    @prop()
    text: string;
    
    @prop()
    accept?: boolean;
    
}

export const DealModel = new Deal().getModelForClass( Deal, { existingMongoose: mongoose } )
