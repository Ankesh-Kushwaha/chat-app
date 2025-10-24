import mongoose from 'mongoose';
export const databaseConnection = async () => {
    try {
        const connect = await mongoose.connect(process.env.DATABASE_URL);
        if (connect) {
            console.log('database connected successfully');
        }
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('database connection got failed', err.message);
        }
        else {
            console.error('database connection got failed', err);
        }
    }
};
//# sourceMappingURL=db.js.map