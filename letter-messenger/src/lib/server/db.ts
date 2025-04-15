import { Db, MongoClient } from "mongodb";
import { MONGODB_URI } from "$env/static/private";

let client:MongoClient;
let db:Db;

export async function connectToDatabase() {
    if (db) return db;

    if (!client) {
        client = new MongoClient(MONGODB_URI);
        await client.connect();
    }

    db = client.db('letter_messenger');
    return db;
}