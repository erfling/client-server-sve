import { TradeOption } from './../../api/src/models/TradeOption';
import { Ref } from 'typegoose';
import ITradeOption from './ITradeOption';

export default interface IDeal {
    TradeOption: Ref<TradeOption> | ITradeOption;
    FromTeamSlug: string;
    FromNationName: string;
    ToTeamSlug?: string;
    ToNationName?: string;
    Accept?: boolean;
}