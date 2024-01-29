import mongoose from "mongoose";
const pictureSchema = new mongoose.Schema({
  pic: {
    filename: String,
    url: String,
  },
});
export default mongoose.model("File", pictureSchema);
