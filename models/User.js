import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
},
{
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            delete ret._id;
            delete ret.password;
        },
        virtuals: true,
    },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();

    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

userSchema.index({ id: 1, email: 1 });  // Para no utilizar el _id de MongoDB por seguridad

const User = mongoose.model('User', userSchema);

export default User;
