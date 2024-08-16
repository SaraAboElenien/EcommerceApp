import mongoose from "mongoose";

export const connection = () => {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.DB_URL)
        .then(() => {
            console.log('Connected to MongoDB successfully');
        })
        .catch((err) => {
            console.log('Failed to Connect', err);
        });
}
