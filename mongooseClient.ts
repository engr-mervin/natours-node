import mongoose from 'mongoose';

const connectionString = process.env.DATABASE_CONNECTION_STRING!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!
);

try {
  await mongoose.connect(connectionString);
} catch (error) {}

export default mongoose;
