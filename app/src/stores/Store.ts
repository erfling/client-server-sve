import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import IDeal from '../../../shared/models/IDeal';
import IPlayer from '../../../shared/models/IPlayer';
import IRole from '../../../shared/models/IRole';

export default interface ApplicationStore{
    GameData?: {
        [index:string]:any,
        Game?: IGame[],
        Team?: ITeam[],
        SelectedTeam?: ITeam,
        SelectedRole: IRole,
        Player?: IPlayer[],
        CurrentPlayer?: ITeam,
        CurrentGame?: IGame,
        Dashboard: any,
        ReceivedProposedDeals: IDeal[];
        SentProposedDeals: IDeal[];
        PendingDealOffer: IDeal;
        RejectedDealOffer: IDeal;
        AcceptedDealOffer: IDeal;
        StateContent:any;
        DaysAbove2: number;
        //temp testing value
        EnvironmentalHealth: number;
        BottomBarVisible: false;
        CompletionStatus: {NumTeams:  number, TeamsCompleted: string[] }
    };
    //export type SheetData   
    Application?: {
        Loading: boolean;
        DashboardUpdating:boolean;
        Submitting: boolean;
        SocketConnected: boolean;
        Round2Won: boolean;
        RequiresRefresh: boolean;
        AdminMessage: string;
        NeedsReconnect: boolean;
    }
    form: any;
    Route?: any;
}