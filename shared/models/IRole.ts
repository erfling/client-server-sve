import IBaseClass from "./BaseModel";
import { RoleName } from "./RoleName";


export default interface IRole extends IBaseClass {
    Name:RoleName;

    RoleTradeRatings:{ [R in RoleName]: 1|2|3|4|5 };
}