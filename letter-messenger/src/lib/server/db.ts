import { Db, MongoClient } from "mongodb";
import { MONGODB_URI } from "$env/static/private";

let client: MongoClient;
let db: Db;

// 환경변수에서 데이터베이스 이름 가져오기 또는 기본값 사용
const DB_NAME = 'momentmail';

export async function connectToDatabase() {
    if (db) return db;

    try {
        if (!client) {
            // 환경변수가 없으면 기본 연결 문자열 사용
            const connectionString = MONGODB_URI || 'mongodb://momuser:mompwd@localhost:27017/momentmail';
            client = new MongoClient(connectionString);
            await client.connect();
            console.log('MongoDB 연결 성공');
        }

        db = client.db(DB_NAME);
        return db;
    } catch (error) {
        console.error('MongoDB 연결 실패:', error);
        throw error;
    }
}

export async function closeConnection() {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log('MongoDB 연결 종료');
    }
}
