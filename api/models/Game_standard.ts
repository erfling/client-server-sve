import { Schema, model } from 'mongoose';

var GameSchema = new Schema({
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

    Teams: [{
      type: Schema.Types.ObjectId,
      ref: 'Team'
    }]

});

export default model('Game', GameSchema);
