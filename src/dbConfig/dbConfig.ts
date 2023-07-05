import mongoose from 'mongoose';

const { MONGO_URI } = process.env;

export function connectToDatabase() {
  try {
    const dbConnection = mongoose.createConnection(MONGO_URI!);
    console.log('Connected to database');

    return dbConnection;
  } catch (error) {
    console.log('Error connecting to database');
    console.error(error);
  }
}
