import { WaterValues } from './WaterValues';
import { prop, arrayProp, Typegoose, ModelType, InstanceType, Ref, pre } from 'typegoose';
import * as mongoose from 'mongoose';
import BaseClass from './BaseModel'
import ITeam from '../../../shared/models/ITeam';
import IPlayer from '../../../shared/models/IPlayer';
import INation from '../../../shared/models/INation';
import { Player } from './Player';
import { Nation } from './Nation';
import { Deal } from './Deal';
import IDeal from '../../../shared/models/IDeal';
import { RoleName } from '../../../shared/models/RoleName';
import { Role } from './Role';
import { CriteriaName } from '../../../shared/models/CriteriaName';
import { Ratings } from './Ratings';
import IRatings from '../../../shared/models/IRatings';


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

    @prop({ ref: Nation })
    Nation:  Ref<Nation> | INation;

    @prop()
    GameId: string;

    @prop()
    TeamNumber: number;

    @prop()
    GameState: string;

    @arrayProp({itemsRef: Deal})
    DealsProposedBy: Ref<Deal>[] | IDeal[];

    @arrayProp({itemsRef: Deal})
    DealsProposedTo: Ref<Deal>[] | IDeal[];

    @prop({default: { Bangladesh:
      { COMPELLING_EMOTIONAL_CONTENT: 4,
        DEMONSTRATED_SYSTEMIC_IMPACT: 5,
        STRONG_EXECUTIVE_PRESENCE: 6 },
     China:
      { COMPELLING_EMOTIONAL_CONTENT: 7,
        DEMONSTRATED_SYSTEMIC_IMPACT: 8,
        STRONG_EXECUTIVE_PRESENCE: 9 } }})
    Ratings: Ratings | IRatings;

    @prop()
    Roles:{ [R in RoleName]: Role };

  }

  export const TeamModel = new Team().getModelForClass( Team, { existingMongoose: mongoose } )
  