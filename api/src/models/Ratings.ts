import BaseClass from "./BaseModel";
import IDeal from "../../../shared/models/IDeal";
import ITradeOption from "../../../shared/models/ITradeOption";
import { TradeOption } from './TradeOption';
import { Typegoose, prop, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import IRatings from "../../../shared/models/IRatings";
import { CriteriaName } from "../../../shared/models/CriteriaName";


export class Ratings extends BaseClass implements IRatings {
    
    @prop()
    Australia:{ [C in CriteriaName]: number } | {numVotes: number};

    @prop()
    Bangladesh: { [C in CriteriaName]: number } | {numVotes: number};

    @prop()
    China: { [C in CriteriaName]: number } | {numVotes: number};

    @prop()
    India: { [C in CriteriaName]: number } | {numVotes: number};

    @prop()
    Japan: { [C in CriteriaName]: number } | {numVotes: number};

    @prop()
    Vietnam: { [C in CriteriaName]: number } | {numVotes: number};
    
}

export const RatingsModel = new Ratings().getModelForClass( Ratings, { existingMongoose: mongoose } )