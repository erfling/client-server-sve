import { TradeOption } from './../../api/src/models/TradeOption';
import ITradeOption from './ITradeOption';
import {  Ref } from 'typegoose';
import IBaseClass from './BaseModel';

export default interface INation extends IBaseClass{
    Name: string;
    SellsTo: string;
    BuysFrom: string;
    Description:string;
    Tech: string;
    Content?: any;
    TradeOptions: Ref<TradeOption>[] | ITradeOption[];
}