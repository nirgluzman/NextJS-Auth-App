import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: [true, 'username is missing or invalid'] },
  email: {
    type: String,
    unique: true,
    required: [true, 'email is missing or invalid'],
    match: [/\S+@\S+\.\S+/, 'invalid email address'],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'password is missing or does not meet the complexity requirements'],
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  emailVerified: { type: Boolean, default: false },
  verifyEmailToken: { type: String, default: undefined }, // hashed userId
  verifyEmailTokenExpiry: { type: Date, default: undefined },
  forgotPasswordToken: { type: String, default: undefined },
  forgotPasswordTokemExpiry: { type: Date, default: undefined },

  // single refresh token for single device login scenario; login from another device triggers a token refresh.
  // to enable multiple device login, refreshToken should be an array to store multiple tokens per each device.
  // https://github.com/gitdagray/refresh_token_rotation/blob/main/controllers/refreshTokenController.js
  refreshToken: { type: String, default: undefined },
});

// create a Mongoose model for the user data using the schema defined above
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
