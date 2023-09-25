import mongoose from 'mongoose';
const connectionString = process.env.DATABASE_CONNECTION_STRING.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
try {
    await mongoose.connect(connectionString);
    console.log('Successfully connected to database.');
}
catch (error) {
    console.log('Error connecting to database.');
}
export default mongoose;
