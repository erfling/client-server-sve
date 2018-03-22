import BaseClass from "./BaseModel";
import IDeal from "../../../shared/models/IDeal";
import ITradeOption from "../../../shared/models/ITradeOption";
import { TradeOption } from './TradeOption';
import { Typegoose, prop, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import value from "*.json";

export class Deal extends BaseClass implements IDeal {    

    @prop({default: "Team"})
    CLASS_NAME:string;

    @prop({ref: TradeOption})
    TradeOption?: Ref<TradeOption> | ITradeOption;

    @prop()
    FromTeamSlug: string;

    @prop()
    ToTeamSlug: string;

    @prop()
    FromNationName: string;

    @prop({default: 10})
    Value: number;

    @prop()
    ToNationName: string;
    
    @prop()
    Accept?: boolean;

    @prop()
    Rescinded: boolean;

    @prop()
    CanAccept: boolean;

    @prop()
    Message: string;

    @prop()
    TransferFromTeamSlug?: string;

    @prop()
    TransferFromNationName?: string;

    @prop()
    TransferToTeamSlug?: string;

    @prop()
    TransferToNationName?: string;
    
}

export const DealModel = new Deal().getModelForClass( Deal, { existingMongoose: mongoose } )
