import BaseClass from "./BaseModel";
import IDeal from "../../../shared/models/IDeal";
import ITradeOption from "../../../shared/models/ITradeOption";
import { TradeOption } from './TradeOption';
import { Typegoose, prop, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import IRatings from "../../../shared/models/IRatings";

export class Ratings extends BaseClass implements IRatings {
    
    @prop()
    Australia?: number;

    @prop()
    Bangladesh?: number;

    @prop()
    China?: number;

    @prop()
    India?: number;

    @prop()
    Japan?: number;

    @prop()
    Vietnam?: number
    
}

export const DealModel = new Ratings().getModelForClass( Ratings, { existingMongoose: mongoose } )