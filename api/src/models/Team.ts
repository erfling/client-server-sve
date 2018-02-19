import { WaterValues } from './WaterValues';
import { prop, arrayProp, Typegoose, ModelType, InstanceType, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import BaseClass from './BaseModel'
import ITeam from '../../../shared/models/ITeam';
import IPlayer from '../../../shared/models/IPlayer';
import { Player } from './Player';

export class Team extends BaseClass implements ITeam
{
    @prop({default: "Team"})
    CLASS_NAME:string;

    @prop({default: "teams"})
    REST_URL:string;

    @prop()
    Location?: string;
  
    @prop()
    Name: string;

    @prop()
    Slug:string;

    @prop()
    SheetId:string;
    
    @arrayProp({ itemsRef: Player })
    Players:  Ref<IPlayer>[] | IPlayer[];

    @prop()
    CurrentRole: string;

    @prop()
    government: string;

    @prop()
    industry: string;

    @prop()
    healthcare: string;

    @prop()
    agriculture: string;

  }

  export const TeamModel = new Team().getModelForClass( Team, { existingMongoose: mongoose } )
  