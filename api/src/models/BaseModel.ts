import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';
import IBaseClass from '../../../shared/models/BaseModel';

export default class BaseClass 
    extends Typegoose
    implements IBaseClass
    {
    @prop()
    Created:Date;

    @prop()
    Modified:Date;

    constructor( props?: any ){
        super();
        if(props){
            Object.assign(this, props);
        }
    }
    
}