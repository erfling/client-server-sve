import { TradeOption } from './../../api/src/models/TradeOption';
import {Ref} from 'typegoose';
import ITradeOption from './ITradeOption';

export default interface IDeal {
    TradeOption: Ref<TradeOption> | ITradeOption;
    from: string;
    to: string;
    accept?: boolean;
}