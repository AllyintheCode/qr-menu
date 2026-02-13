import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  discountPrice: Number,
  description: {
    type: String,
  },
  image: String,

  // 🔥 BUNU ƏLAVƏ ET
  imagePublicId: {
    type: String,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
