import IBaseClass from './BaseModel'
import {  Ref } from 'typegoose';
import INation from './INation';
import { Nation } from '../../api/src/models/Nation'

export default interface ITradeOption extends IBaseClass {    
    FromNationId: string;
    ToNationId: string;
    Message: string;
}