import mongoose from 'mongoose';

const { MONGO_URI } = process.env;

const connectToDatabase = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }
    await mongoose.connect(MONGO_URI);
    console.log('Connected to database');
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error connecting to database: ${error.message}`);
    } else {
      console.error(`Unknown error: ${error}`);
    }
  }
};

export default connectToDatabase;
