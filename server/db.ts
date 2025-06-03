import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error(
    "MONGODB_URI must be set. Please provide your MongoDB connection string.",
  );
}

const connectDB = async () => {
  try {
    // Use the new MongoDB Atlas connection string with correct credentials
    const mongoUri = process.env.MONGODB_URI || 
      'mongodb+srv://thetrailblazermavericks:hDJhpltxhedQuz2b@cluster0.pchognl.mongodb.net/citi-training?retryWrites=true&w=majority&appName=Cluster0';
    
    console.log('Attempting to connect to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('MongoDB Atlas connection error:', error);
    
    // Fallback to local MongoDB if Atlas fails
    try {
      console.log('Attempting to connect to local MongoDB...');
      await mongoose.connect('mongodb://localhost:27017/citi-training');
      console.log('Local MongoDB connected successfully');
    } catch (localError) {
      console.error('Local MongoDB connection failed:', localError);
      console.log('Starting with in-memory storage instead');
      // Don't exit - let the app continue with MemStorage
    }
  }
};

export default connectDB;