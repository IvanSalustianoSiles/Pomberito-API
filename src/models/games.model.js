import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { messagesModel } from "./messages.model.js";
import { roundsModel } from "./rounds.model.js";
mongoose.pluralize(null);

const gamesCollection = "games";

const gameSchema = new mongoose.Schema({
  start_date: { type: Date, default: new Date() },
  end_date: { type: Date },
  players: { 
    type: [{
      nickname: { type: String },
      land: { type: String }
    }],
    default: []
  },
  rounds: {
    type: [{ _id: mongoose.Schema.Types.ObjectId }],
    ref: "rounds",
    default: []
  },
  status: { type: Boolean, default: true },
  duration: { type: Number, default: 0 },
  winner: { type: String, default: "<pending>" },
  messages: {
    type: [{ _id: mongoose.Schema.Types.ObjectId }],
    ref: "messages",
    default: []
  },
  cards_for_player: { type: Number, default: 5 }
});

gameSchema.pre("find", function () {
  this.populate({ path: "messages._id", model:  messagesModel });
  this.populate({ path: "rounds._id", model: roundsModel });
});

gameSchema.plugin(mongoosePaginate);

export const gamesModel = mongoose.model(gamesCollection, gameSchema);

