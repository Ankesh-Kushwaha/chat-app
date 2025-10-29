import mongoose, { type AnyArray } from 'mongoose';

const connectToDataBase = async () => {
  try {
    const res = await mongoose.connect(process.env.DATABASE_URL as string);
    if (res) {
      console.log("DataBase connected successfully");
    }
  }
  catch (err:any) {
    console.error("error while connecting to dataBase", err.message);
  }
}

export default connectToDataBase;