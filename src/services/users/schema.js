import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema, model } = mongoose;
const userSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    role: { type: String, enum: ["parent", "Tutor"], default: "parent" },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  const newUser = this;
  const plainPw = newUser.password;

  if (newUser.isModified("password")) {
    const hash = await bcrypt.hash(plainPw, 11);
    newUser.password = hash;
  }

  next();
});
userSchema.methods.toJSON = function () {
  const userDocument = this;
  const userObject = userDocument.toObject();

  delete userObject.password;
  delete userObject.__v;

  return userObject;
};
userSchema.statics.checkCredentials = async function (email, plainPW) {
  const user = await this.findOne({ email });

  if (user) {
    const isMatched = await bcrypt.compare(plainPW, user.password);

    if (isMatched) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export default model("user", userSchema);
