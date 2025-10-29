import mongoose, {} from 'mongoose';
const connectToDataBase = async () => {
    try {
        const res = await mongoose.connect(process.env.DATABASE_URL);
        if (res) {
            console.log("DataBase connected successfully");
        }
    }
    catch (err) {
        console.error("error while connecting to dataBase", err.message);
    }
};
export default connectToDataBase;
//# sourceMappingURL=config.js.map