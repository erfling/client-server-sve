import { CriteriaName } from "./CriteriaName";

export default interface IRatings{
    Australia?: { [C in CriteriaName]: 1|2|3|4|5|6|7|8|9|10 };
    Bangladesh?: { [C in CriteriaName]: 1|2|3|4|5|6|7|8|9|10 };
    China?: { [C in CriteriaName]: 1|2|3|4|5|6|7|8|9|10 };
    India?: { [C in CriteriaName]: 1|2|3|4|5|6|7|8|9|10 };
    Japan?: { [C in CriteriaName]: 1|2|3|4|5|6|7|8|9|10 };
    Vietnam?: { [C in CriteriaName]: 1|2|3|4|5|6|7|8|9|10 };
}