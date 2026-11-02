import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    createdDate: {
        type: String,
        required: true,
    },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
