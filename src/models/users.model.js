import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.pluralize(null);

const usersCollection = "users";

const userSchema = new mongoose.Schema({
  nickname: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  email: { type: String, required: true },
  phone_number: { type: String, default: "No specified" },
  description: { type: String, default: "No specified" },
  age: { type: Number, default: NaN },
  profile_pic: { type: String, default: "None" },
  last_connection: { type: Date },
  active: { type: Boolean, default: true },
  played_games: { type: Number, default: 0 },
  won_games: { type: Number, default: 0 },
  history: { type: [{ game: mongoose.Schema.Types.ObjectId }], default: [] }
});

userSchema.plugin(mongoosePaginate);

export const usersModel = mongoose.model(usersCollection, userSchema);

