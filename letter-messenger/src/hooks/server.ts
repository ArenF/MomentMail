/**
 * SvelteKit 서버 훅
 * 
 * MongoDB 연결 및 서버 초기화 로직
 */

import { building } from '$app/environment';
import { connectToDatabase, disconnectFromDatabase } from '$lib/db/mongo';
import { error, type Handle } from '@sveltejs/kit';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

// 서버가 빌드 중이 아닐 때만 MongoDB 연결
if (!building) {
  console.log('서버 초기화 중...');
  
  // 서버 시작 시 MongoDB 연결
  connectToDatabase()
    .then(() => {
      console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
      console.error('데이터베이스 연결 실패:', err);
    });

  // 프로세스 종료 시 연결 해제
  const handleShutdown = async () => {
    console.log('서버 종료 중...');
    await disconnectFromDatabase();
    process.exit(0);
  };

  // SIGINT, SIGTERM 시그널에 대한 핸들러 등록
  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);
}

/**
 * SvelteKit 요청 핸들러
 */
export const handle: Handle = async ({ event, resolve }) => {
  try {
    // 여기에 각 요청에 대한 추가 처리 로직 구현
    // 예: 인증 상태 확인, 사용자 정보 로드 등
    
    // 요청 처리 계속 진행
    return await resolve(event);
  } catch (e) {
    console.error('요청 처리 중 오류 발생:', e);
    throw error(500, '서버 오류가 발생했습니다');
  }
};
