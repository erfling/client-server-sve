import { Schema, model } from 'mongoose';
import {Role} from '../../../shared/models/Player';

interface impPlayer{
    Created: Date | any;
    Modified : Date | any;
    Slug: String | any;
    Location: String | any;
    Role: String | any;
    PlayingAs: String | any;
}
var PlayerSchema = new Schema({
    Created:{
        type: Date,
        default: Date.now
    },

    Modified:{
        type: Date,
        default: Date.now
    },

    Slug:{
        type: String,
        default:'',
        required :true,
        unique: true,
        trim: true
    },

    Location: {
        type: String
    },

    Role: {
        type:String,
        validate: {
            validator: ( role: string ) => {
                return role in Role;
            }
        }
    },

    PlayingAs: {
        type:String,
        validate: {
            validator: ( role: string ) => {
                return role in Role;
            }
        },
        default: () => {
            return this.Role;
        }
    }

});

export default model('Game', PlayerSchema);