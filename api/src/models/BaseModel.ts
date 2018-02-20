import { prop, pre, Typegoose, ModelType, InstanceType } from 'typegoose';
import IBaseClass from '../../../shared/models/BaseModel';

@pre<BaseClass>('save', function(next) { // or @pre(this: Car, 'save', ...
    console.log("IN PRE_SAVE METHOD")
    this.Modified = null;
    next();
})


export default class BaseClass extends Typegoose implements IBaseClass
{
    /*
    @prop()
    _id: string; // TODO: Ist this secure? Will this fugg stuff?
    //turns out it will. any work around?
*/
    constructor( props?: any ){
        super();
        if (props) Object.assign(this, props);
    }

    
 
    @prop({default: this.Created || new Date()})
    Created:Date;

    @prop({default: new Date()})
    Modified:Date;
    
}