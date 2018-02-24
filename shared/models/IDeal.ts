import { TradeOption } from './../../api/src/models/TradeOption';
import { Ref } from 'typegoose';
import ITradeOption from './ITradeOption';
import IBaseClass from './BaseModel';

export default interface IDeal extends IBaseClass{
    TradeOption: Ref<TradeOption> | ITradeOption;
    FromTeamSlug: string;
    FromNationName: string;
    ToTeamSlug?: string;
    ToNationName?: string;
    Accept?: boolean;
}