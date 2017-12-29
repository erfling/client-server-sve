import { createStore, applyMiddleware } from 'Redux';
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'

import IGame from '../../../shared/models/Game';
import ITeam from '../../../shared/models/Team';

export interface ApplicationStore{

    Game?: IGame[];
    Team?: ITeam[];
    //export type SheetData   

}