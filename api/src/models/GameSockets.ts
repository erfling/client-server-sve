/**
 * Defines sockets for players to submit and receive game info
 */
import IGame from '../../../shared/models/Game';
import ITeam from '../../../shared/models/Team';
import IPlayer from '../../../shared/models/Player';



class GameSockets {

    initPlayer(p:IPlayer):void{
        this.submitter = p;
    }

    /**Identity for payload typesafety */
    payload<T> (payload:T):T  {
        return payload;
    }

    submitter: IPlayer;
    sheetRange: string;
    //socketServer: 

    submitToSheet<T>(thing:T):void {
        return;
    }




}