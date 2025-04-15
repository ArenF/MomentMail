/**
 * MongoDB 연결 및 데이터베이스 관리 모듈
 * 
 * SvelteKit 서버 측에서 MongoDB에 연결하고 컬렉션에 접근하는 기능 제공
 */

import { MongoClient, ServerApiVersion, Db, Collection } from 'mongodb';
import type { 
  UserDocument, 
  LetterDocument, 
  NotificationDocument, 
  TemplateDocument,
  StickerDocument 
} from '../types/database';

// 환경 변수에서 MongoDB 연결 URI를 가져옴
const mongoUri = process.env.DATABASE_URL || 'mongodb://momuser:mompwd@localhost:27017/momentmail';

// MongoDB 클라이언트 옵션
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
};

// 싱글톤 인스턴스를 위한 클라이언트 및 데이터베이스 객체
let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * MongoDB 클라이언트에 연결
 * 이미 연결되어 있다면 기존 연결을 재사용
 */
export async function connectToDatabase(): Promise<Db> {
  // 이미 연결되어 있는 경우 기존 DB 인스턴스 반환
  if (db) {
    return db;
  }

  try {
    // 클라이언트가 없으면 새로 생성
    if (!client) {
      client = new MongoClient(mongoUri, options);
    }

    // 연결 수립
    await client.connect();
    
    // Admin 명령으로 연결 확인
    await client.db('admin').command({ ping: 1 });
    console.log('MongoDB에 성공적으로 연결되었습니다!');
    
    // 데이터베이스 인스턴스 저장
    db = client.db('momentmail');
    
    return db;
  } catch (error) {
    console.error('MongoDB 연결 오류:', error);
    throw error;
  }
}

/**
 * 데이터베이스 연결 종료
 * 애플리케이션 종료 시 호출
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB 연결이 종료되었습니다.');
  }
}

/**
 * 컬렉션 접근 헬퍼 함수들
 */

// 사용자 컬렉션
export async function getUsersCollection(): Promise<Collection<UserDocument>> {
  const db = await connectToDatabase();
  return db.collection<UserDocument>('users');
}

// 편지 컬렉션
export async function getLettersCollection(): Promise<Collection<LetterDocument>> {
  const db = await connectToDatabase();
  return db.collection<LetterDocument>('letters');
}

// 알림 컬렉션
export async function getNotificationsCollection(): Promise<Collection<NotificationDocument>> {
  const db = await connectToDatabase();
  return db.collection<NotificationDocument>('notifications');
}

// 편지지 템플릿 컬렉션
export async function getTemplatesCollection(): Promise<Collection<TemplateDocument>> {
  const db = await connectToDatabase();
  return db.collection<TemplateDocument>('templates');
}

// 스티커 컬렉션
export async function getStickersCollection(): Promise<Collection<StickerDocument>> {
  const db = await connectToDatabase();
  return db.collection<StickerDocument>('stickers');
}
