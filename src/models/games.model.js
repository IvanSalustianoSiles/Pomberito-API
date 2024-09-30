import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.pluralize(null);

const gamesCollection = "games";

const gameSchema = new mongoose.Schema({
  startDate: { type: Date },
  endDate: { type: Date },
  players: [
    {
        email: { type: String, ref: "users" }
    }
  ],
  roundNumber: { type: Number, default: 1 },
  status: { type: Boolean, default: true },
  duration: { type: Number, default: 0 },
  winner: { type: String, default: "<pending>" },
  messages: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "messages"
    }
  ]
});

gameSchema.plugin(mongoosePaginate);

export const gamesModel = mongoose.model(gamesCollection, gameSchema);

