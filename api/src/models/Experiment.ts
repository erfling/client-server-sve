import BaseClass from "./BaseModel";
import { Typegoose, prop, Ref } from 'typegoose';
import * as mongoose from 'mongoose';

export class PlatformExperiment extends BaseClass {
    
    @prop()
    SystemicPoint: string;
   
    @prop()
    Decision: string;

    @prop()
    Hypothesis: string;

    @prop()
    Experiment: string;

    @prop()
    GameId: string;
    
}

export const PlatformExperimentModel = new PlatformExperiment().getModelForClass( PlatformExperiment, { existingMongoose: mongoose } )
