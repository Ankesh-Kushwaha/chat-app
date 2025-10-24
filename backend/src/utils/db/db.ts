import mongoose from 'mongoose';

export const databaseConnection = async () => {
  try {
    const connect = await mongoose.connect(process.env.DATABASE_URL as string);
    if (connect) {
      console.log('database connected successfully');
    }
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      console.error('database connection got failed', err.message);
    } else {
      console.error('database connection got failed', err);
    }
  }
}

