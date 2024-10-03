import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.pluralize(null);

const messagesCollection = "messages";

const messageSchema = new mongoose.Schema({
  date: { type: Date, default: new Date() },
  uid: { type: mongoose.Schema.Types.ObjectId },
  nickname: { type: String },
  body: { type: String },
  game: { type: mongoose.Schema.Types.ObjectId }
});

messageSchema.plugin(mongoosePaginate);

export const messagesModel = mongoose.model(messagesCollection, messageSchema);

