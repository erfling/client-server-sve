import { prop, arrayProp, Typegoose, ModelType, InstanceType, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import BaseClass from './BaseModel'
import ITeam from '../../../shared/models/Team';

export class Team 
  extends BaseClass 
  implements ITeam{
    
    @prop()
    Location?: string;
  
    @prop()
    Name: string;

    @prop()
    Slug:string;
  
  }

  export const TeamModel = new Team().getModelForClass( Team, { existingMongoose: mongoose } )
  