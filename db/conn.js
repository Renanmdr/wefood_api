import mongoose from "mongoose";
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS


async function main(){
    await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.mnufb6f.mongodb.net/wefood?retryWrites=true&w=majority&appName=Cluster0`)
    console.log('conectou ao mongoose! ')
}

main().catch((err) => console.log(err))

export { mongoose }