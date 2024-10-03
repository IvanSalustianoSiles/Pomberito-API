import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.pluralize(null);

const roundsCollection = "rounds";

const roundSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ["pulperia", "ofrenda"],
    default: "pulperia"
  },
  round_number: { type: Number, default: 1 },
  players: {
    type: [{
      uid: { type: mongoose.Schema.Types.ObjectId },
      cards: { type: [{
        suit: { type: String },
        number: { type: Number }
      }]}
    }],
    default: []
  },
  deals: { 
    type: [{
      suit: { type: String }, 
      number: { type: Number },
      owner: { type: mongoose.Schema.Types.ObjectId }
    }]
  },
  leftCards: {
    type: [{
      suit: { type: String }, 
      number: { type: Number },
      owner: { type: mongoose.Schema.Types.ObjectId }
    }]
  },
  preference: { 
    type: String, 
    enum: ["none", "tabaco", "faca", "vino", "guita"],
    default: "none"
  }
});

roundSchema.plugin(mongoosePaginate);

export const roundsModel = mongoose.model(roundsCollection, roundSchema);

