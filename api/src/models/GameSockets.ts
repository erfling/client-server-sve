/**
 * Defines sockets for players to submit and receive game info
 */
import IGame from '../../../shared/models/IGame';
import ITeam from '../../../shared/models/ITeam';
import IPlayer from '../../../shared/models/IPlayer';



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