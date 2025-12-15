import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nome é obrigatório"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "E-mail é obrigatório"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    password: {
      type: String,
      required: [true, "Senha é obrigatória"],
      select: false, // Não retorna senha por padrão nas queries
    },
    roles: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// Não retorna senha e __v nas respostas JSON
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

const MUser = mongoose.model("User", UserSchema);

export default MUser;
