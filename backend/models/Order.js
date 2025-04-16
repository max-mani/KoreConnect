import mongoose  from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderNumber: String,
    customerName: String,
    email: String,
    paymentStatus: String,
    status: String,
    items: [
        { name: String, price: Number }
    ],
    totalAmount: Number
});

const Order = mongoose.model("Order", OrderSchema, "order");
export default Order;
