/**
 * SvelteKit 서버 훅
 * 
 * MongoDB 연결 및 서버 초기화 로직
 */

import { building } from '$app/environment';
import { connectToDatabase, disconnectFromDatabase } from '$lib/db/mongo';
import { error, type Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import dotenv from 'dotenv';

// JWT 비밀키
const jwtSecret = JWT_SECRET || 'your_jwt_secret_key_here_change_in_production';

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
    // 쿠키에서 인증 토큰 가져오기
    const authToken = event.cookies.get('auth_token');
    
    if (authToken) {
      try {
        // JWT 검증
        const decoded = jwt.verify(authToken, jwtSecret) as { userId: string };
        
        // 요청 객체에 사용자 ID 설정
        event.locals.userId = decoded.userId;
        console.log(`인증 성공: 사용자 ID ${decoded.userId} 설정됨`);
      } catch (err) {
        // 오류 유형에 따른 상세 로깅
        if (err instanceof jwt.JsonWebTokenError) {
          console.error('잘못된 토큰 형식:', err.message);
        } else if (err instanceof jwt.TokenExpiredError) {
          console.error('토큰 만료됨:', err.message);
        } else if (err instanceof jwt.NotBeforeError) {
          console.error('토큰이 아직 활성화되지 않음:', err.message);
        } else {
          console.error('기타 토큰 검증 오류:', err);
        }
        
        // 토큰이 유효하지 않은 경우 쿠키 삭제
        event.cookies.delete('auth_token', { path: '/' });
      }
    } else {
      console.log('인증 토큰 없음: 비인증 요청');
    }
    
    // 요청 처리 계속 진행
    return await resolve(event);
  } catch (e) {
    console.error('요청 처리 중 오류 발생:', e);
    throw error(500, '서버 오류가 발생했습니다');
  }
};
