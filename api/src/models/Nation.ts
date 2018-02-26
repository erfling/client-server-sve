import { prop, arrayProp, Typegoose, ModelType, InstanceType, Ref, instanceMethod } from 'typegoose';
import * as mongoose from 'mongoose';
import BaseClass from './BaseModel'
import ITeam from '../../../shared/models/ITeam';
import IPlayer from '../../../shared/models/IPlayer';
import INation from '../../../shared/models/INation';
import { Player } from './Player';
import { TradeOption } from './TradeOption';
import GoogleSheets from '../models/GoogleSheets'

export class Nation extends BaseClass //implements INation
{
    @prop({default: "Nation"})
    CLASS_NAME:string;

    @prop({default: "nations"})
    REST_URL:string;
  
    @prop({required: true})
    Name: string;

    @prop()
    SellsTo:string;

    @prop()
    BuysFrom:string;
    
    @prop()
    Description: string;

    @prop({required: true})
    Tech: string;

    @prop()
    TradeOptions: Ref<TradeOption>[];
  }

  export const NationModel = new Nation().getModelForClass( Nation, { existingMongoose: mongoose } )
  