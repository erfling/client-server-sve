import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import IPlayer from '../../../shared/models/IPlayer';

export default interface ApplicationStore{
    GameData?: {
        Game?: IGame[],
        Team?: ITeam[],
        SelectedTeam?: ITeam;
        Player?: IPlayer[];
        CurrentPlayer?: IPlayer
    };
    //export type SheetData   
    Application?: {
        Loading: boolean
    }
    Route?: any;
}