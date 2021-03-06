export enum ActionTypeStates {
    INPROGRESS = "_INPROGRESS",
    SUCCESS = "_SUCCESS",
    FAIL = "_FAIL"
  }
  
  enum ActionTypeKeys {
    SIGNIN_INPROGRESS = "SIGNIN_INPROGRESS",
    SIGNIN_SUCCESS = "SIGNIN_SUCCESS",
    SIGNIN_FAIL = "SIGNIN_FAIL",
    SIGNOUT_INPROGRESS = "SIGNOUT_INPROGRESS",
    SIGNOUT_SUCCESS = "SIGNOUT_SUCCESS",
    SIGNOUT_FAIL = "SIGNOUT_FAIL",
    LOAD_GAMES = "LOAD_GAMES",
    LOAD_TEAMS = "LOAD_TEAMS",
  }
  
  export default ActionTypeKeys;