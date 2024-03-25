import mongoose from "mongoose";
// const DB_USER = process.env.DB_USER
// const DB_PASS = process.env.DB_PASS
const MONGO_URL = process.env.MONGO_URL


async function main(){
    await mongoose.connect(`${MONGO_URL}`)
    console.log('conectou ao mongoose! ')
}

main().catch((err) => console.log(err))

export { mongoose }