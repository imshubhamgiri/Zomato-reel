import mongoose from 'mongoose';

type DbState = 'disconnected' | 'connected' | 'connecting' | 'disconnecting';

const readyStateMap: Record<number, DbState> = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

export const getDbHealth = (): { state: DbState; readyState: number; isConnected: boolean } => {
  const readyState = mongoose.connection.readyState;
  const state = readyStateMap[readyState] ?? 'disconnected';

  return {
    state,
    readyState,
    isConnected: readyState === 1,
  };
};

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
      throw new Error('MONGO_URL environment variable is not defined');
    }

    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    throw error;
  }
};
