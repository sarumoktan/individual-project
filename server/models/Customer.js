import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const CustomerSchema = new mongoose.Schema(
    {    
        email: { type: String, required: true, unique: true, index: true },
        username: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        position: { type: String, required: true, default: "customer" } 
    },
    { timestamps: true }
);

CustomerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

CustomerSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Customer = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

export default Customer;
