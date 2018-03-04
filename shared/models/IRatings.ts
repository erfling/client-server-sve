import { CriteriaName } from "./CriteriaName";

export default interface IRatings {
    Australia?: { [C in CriteriaName]: number } | {numVotes: number};
    Bangladesh?: { [C in CriteriaName]: number } | {numVotes: number};
    China?: { [C in CriteriaName]: number } | {numVotes: number};
    India?: { [C in CriteriaName]: number } | {numVotes: number};
    Japan?: { [C in CriteriaName]: number } | {numVotes: number};
    Vietnam?: { [C in CriteriaName]: number } | {numVotes: number};
}