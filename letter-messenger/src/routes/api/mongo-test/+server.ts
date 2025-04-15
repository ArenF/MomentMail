/**
 * MongoDB 연결 테스트 API 엔드포인트
 * 
 * 경로: /api/mongo-test
 * 메서드: GET
 * 설명: MongoDB 연결 상태를 확인하고 기본 컬렉션 정보를 반환
 */

import { connectToDatabase } from '$lib/db/mongo';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    // 데이터베이스에 연결
    const db = await connectToDatabase();
    
    // 컬렉션 목록 조회
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // 각 컬렉션의 문서 수 조회
    const stats = await Promise.all(
      collectionNames.map(async (name) => {
        const count = await db.collection(name).countDocuments();
        return { collection: name, documentCount: count };
      })
    );
    
    // 성공 응답 반환
    return json({
      success: true,
      message: 'MongoDB 연결 성공',
      database: 'momentmail',
      collections: stats,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('MongoDB 연결 테스트 오류:', error);
    
    // 오류 응답 반환
    return json({
      success: false,
      message: 'MongoDB 연결 실패',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date()
    }, { status: 500 });
  }
};
