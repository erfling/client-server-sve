import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';

export default class BaseClass extends Typegoose{
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