import { prop, arrayProp, Typegoose, ModelType, InstanceType, Ref, instanceMethod, staticMethod } from 'typegoose';
import * as mongoose from 'mongoose';
import BaseClass from './BaseModel'
import { Team } from './Team';
import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import IPlayer from '../../../shared/models/IPlayer';
import IRole from '../../../shared/models/IRole';


//TODO: find out how to save nested teams, not just their refs. Possibly with pre method: https://github.com/szokodiakos/typegoose#pre
export class Player extends BaseClass implements IPlayer
{
    @prop({default: "Player"})
    CLASS_NAME:string;

    @prop({default: "players"})
    REST_URL:string;


    @prop()
    Slug: string;

    @prop()
    Name: string;

    @prop()
    Role:RoleName;

    @prop()
    SheetRange:string;
  }

  export const PlayerModel = new Player().getModelForClass( Player, { existingMongoose: mongoose } )