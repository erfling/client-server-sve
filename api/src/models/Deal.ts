import BaseClass from "./BaseModel";
import IDeal from "../../../shared/models/IDeal";
import ITradeOption from "../../../shared/models/ITradeOption";
import { TradeOption } from './TradeOption';
import { Typegoose, prop, Ref } from 'typegoose';
import * as mongoose from 'mongoose';

export class Deal extends BaseClass implements IDeal {
    
    @prop({ref: TradeOption})
    TradeOption: Ref<TradeOption> | ITradeOption;

    @prop()
    FromTeamSlug: string;

    @prop()
    ToTeamSlug: string;

    @prop()
    FromNationName: string;

    @prop()
    ToNationName: string;
    
    @prop()
    Accept?: boolean;
    
}

export const DealModel = new Deal().getModelForClass( Deal, { existingMongoose: mongoose } )
