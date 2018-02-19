import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';
import IBaseClass from '../../../shared/models/BaseModel';

export default class BaseClass extends Typegoose implements IBaseClass
{
    /*
    @prop()
    _id: string; // TODO: Ist this secure? Will this fugg stuff?
    //turns out it will. any work around?
*/
    @prop()
    Created:Date;

    @prop()
    Modified:Date;

    constructor( props?: any ){
        super();
        if (props) Object.assign(this, props);
    }

    parent:()=>{}
    
}