export default interface IBaseClass{
    [key:string]: any;

    IsSelected?: boolean;
    Created?: Date;
    Modified?: Date;  
    //_id?: string;
    idx?: number;
    CLASS_NAME?:string;
    REST_URL?:string;
}