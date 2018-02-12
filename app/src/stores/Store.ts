import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import IPlayer from '../../../shared/models/IPlayer';

export default interface ApplicationStore{
    GameData?: {
        [index:string]:any,
        Game?: IGame[],
        Team?: ITeam[],
        SelectedTeam?: ITeam,
        SelectedRole?: string
        Player?: IPlayer[],
        CurrentPlayer?: IPlayer & {CurrentRole: string},
        CurrentGame?: IGame,
        Dashboard: any,

        //temp testing value
        EnvironmentalHealth: number
    };
    //export type SheetData   
    Application?: {
        Loading: boolean,
        DashboardUpdating:boolean,
        Submitting: boolean
    }
    form: any;
    Route?: any;
}