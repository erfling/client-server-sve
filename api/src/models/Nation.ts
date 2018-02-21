import { prop, arrayProp, Typegoose, ModelType, InstanceType, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import BaseClass from './BaseModel'
import ITeam from '../../../shared/models/ITeam';
import IPlayer from '../../../shared/models/IPlayer';
import { Player } from './Player';

interface NationShape{
    Name: string;
    SellsTo: string;
    BuysFrom: string;
    Description:string;
    Tech: string;
}

export class Nation extends BaseClass implements NationShape
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

  }

  export const NationModel = new Nation().getModelForClass( Nation, { existingMongoose: mongoose } )
  