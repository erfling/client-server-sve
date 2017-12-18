import { prop, arrayProp, Typegoose, ModelType, InstanceType, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import BaseClass from './BaseModel'

export class Team extends BaseClass {
    
    @prop()
    Location?: string;
  
    @prop()
    Name: string;

    @prop()
    Slug:string;
  
  }

  export const TeamModel = new Team().getModelForClass( Team, { existingMongoose: mongoose } )
  