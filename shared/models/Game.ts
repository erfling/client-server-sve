import IBaseClass from './BaseModel';
import ITeam from './Team';
import {  Ref } from 'typegoose';

export default interface IGame extends IBaseClass {
    
    Location?: string;
  
    Slug?: string;

    Teams?: Ref<ITeam>[] | ITeam[];
  }  