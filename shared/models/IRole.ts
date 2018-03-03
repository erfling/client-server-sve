import IBaseClass from "./BaseModel";
import { RoleName } from "./RoleName";
import { RoleRatingCategories } from "./RoleRatingCategories";


export default interface IRole extends IBaseClass {
    Name:RoleName;

    RoleTradeRatings:{ [R in RoleRatingCategories]: {Value: null|1|2|3, AgreementStatus: -1|0|1 }};
}