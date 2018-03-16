export enum SocketEvents{
    CONNECT = "connect",
    MESSAGE = "MESSAGE",
    ADMIN_MESSAGE = "ADMIN_MESSAGE",
    HELLO = "HELLO",
    DISCONNECT = "disconnect",
    SUBMIT_TO_SHEET = "SUBMIT_TO_SHEET",
    SIGN_IN = "SIGN_IN",
    SIGN_OUT = "SIGN_OUT",
    SELECT_TEAM = "SELECT_TEAM",
    DASHBOARD_UPDATED = "DASHBOARD_UPDATED",
    DASHBOARD_UPDATED_WIN = "DASHBOARD_UPDATED_WIN",
    UPDATE_TEAM = "UPDATE_TEAM",
    TEAM_UPDATED = "TEAM_UPDATED",
    GAME_STATE_CHANGED = "GAME_STATE_CHANGED",

    UPDATE_YEARS_ABOVE_2 = "UPDATE_YEARS_ABOVE_2",

    // 
    JOIN_ROOM = "JOIN_ROOM",
    ROOM_MESSAGE = "FROM_ROOM_MESSAGE",
    TO_ROOM_MESSAGE = "TO_ROOM_MESSAGE",
    PROPOSE_DEAL = "PROPOSE_DEAL",
    REJECT_DEAL = "REJECT_DEAL",
    ACCEPT_DEAL = "ACCEPT_DEAL",

    DEAL_RESPONSE = "DEAL_RESPONSE",
    DEAL_REJECTED = "DEAL_REJECTED",
    DEAL_ACCEPTED = "DEAL_ACCEPTED",
    PROPOSED_TO = "PROPOSED_TO",
    PROPOSED_BY = "PROPOSED_BY",
    RESPOND_TO_DEAL = "RESPOND_TO_DEAL",

    JOIN_ROLE = "JOIN_ROLE",
    HAS_CONNECTED = "HAS_CONNECTED",

    //International Negotiation Round Events
    SUBMIT_ROLE_RATING = "SUBMIT_ROLE_RATING",
    ROLE_RETURNED = "ROLE_RETURNED",

}