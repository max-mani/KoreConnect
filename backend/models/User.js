import mongoose from "mongoose";

// Create a schema for cart items
const cartItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: String,
  imageUrl: String,
  quantity: {
    type: Number,
    default: 1,
    min: 1
  }
}, { _id: false }); // Don't create additional IDs for cart items

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: true
  },
  cart: {
    type: [cartItemSchema],
    default: []
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export as ES Module
const User = mongoose.model('User', userSchema);
export default User;