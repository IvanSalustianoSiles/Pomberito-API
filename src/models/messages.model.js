import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.pluralize(null);

const messagesCollection = "messages";

const messageSchema = new mongoose.Schema({
  date: { type: Date },
  user: { type: String },
  game: { type: mongoose.Schema.Types.ObjectId, ref: "games" }
});

messageSchema.plugin(mongoosePaginate);

export const messagesModel = mongoose.model(messagesCollection, messageSchema);

