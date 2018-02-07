import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';
import IBaseClass from '../../../shared/models/BaseModel';

export default class BaseClass extends Typegoose implements IBaseClass
{
    @prop()
    _Id: string; // TODO: Ist this secure? Will this fugg stuff?

    @prop()
    Created:Date;

    @prop()
    Modified:Date;

    constructor( props?: any ){
        super();
        if (props) Object.assign(this, props);
    }
    
}