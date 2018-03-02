import IBaseClass from "./BaseModel";
import { RoleName } from "./RoleName";
import { RoleRatingCategories } from "./RoleRatingCategories";


export default interface IRole extends IBaseClass {
    Name:RoleName;

    RoleTradeRatings:{ [R in RoleRatingCategories]: null|1|2|3 };
}