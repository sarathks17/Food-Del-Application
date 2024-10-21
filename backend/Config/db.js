import mongoose from "mongoose";


export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://sarathkumar93622:tomato123@tomato.jxtpn.mongodb.net/tomato').then(()=> console.log('DataBase is connected'))
}
