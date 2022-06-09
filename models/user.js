import mongoose from 'mongoose';


const Schema = mongoose.Schema;

// const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  username: { type: String, unique : true, required : true },
  names: {
    first: String,
    second: String
  },
  chatId: { type: Number, unique : true, required : true },

  pik: {
    uid: { type: String },
    token: { type: String },
    expires: { type: Date },
  },
  currentCommand:{
    name: String,
    args: [String]
  }
  
});



export default mongoose.model('User', UserSchema);

