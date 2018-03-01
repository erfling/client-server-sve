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
    Australia?: { [C in CriteriaName]: 1|2|3|4|5|6|7|8|9|10 };

    @prop()
    Bangladesh?: { [C in CriteriaName]: 1|2|3|4|5|6|7|8|9|10 };

    @prop()
    China?: { [C in CriteriaName]: 1|2|3|4|5|6|7|8|9|10 };

    @prop()
    India?: { [C in CriteriaName]: 1|2|3|4|5|6|7|8|9|10 };

    @prop()
    Japan?: { [C in CriteriaName]: 1|2|3|4|5|6|7|8|9|10 };

    @prop()
    Vietnam?: { [C in CriteriaName]: 1|2|3|4|5|6|7|8|9|10 };
    
}

export const DealModel = new Ratings().getModelForClass( Ratings, { existingMongoose: mongoose } )