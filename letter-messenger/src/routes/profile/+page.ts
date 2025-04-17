/**
 * 프로필 페이지 서버 데이터 로드
 * 
 * 프로필 페이지에 필요한 데이터를 미리 로드합니다.
 * SvelteKit의 load 함수를 사용하여 SSR 또는 클라이언트 사이드에서 데이터를 가져옵니다.
 */

import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, depends, cookies }) => {
  // 의존성 트래킹 - 이 함수가 다시 실행되어야 하는 경우를 알려줌
  depends('app:profile');
  
  try {
    // 인증 토큰 확인
    const authToken = cookies.get('auth_token');
    
    if (!authToken) {
      // 로그인되지 않은 경우 로그인 페이지로 리디렉션
      throw redirect(302, '/login?redirectTo=/profile');
    }
    
    // 인증 상태 확인
    const authResponse = await fetch('/api/auth/me');
    if (!authResponse.ok) {
      // 로그인되지 않은 경우 로그인 페이지로 리디렉션
      throw redirect(302, '/login?redirectTo=/profile');
    }
    
    // 인증이 확인되면 프로필 데이터 가져오기 시도
    try {
      const profileResponse = await fetch('/api/profile');
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        return {
          profile: profileData
        };
      }
    } catch (err) {
      console.error('프로필 로드 오류:', err);
    }
    
    // 프로필 데이터를 가져오지 못했지만 인증은 성공한 경우
    return {
      profile: null
    };
  } catch (error) {
    // 리디렉션이 아닌 다른 오류인 경우
    if (error instanceof Response) {
      throw error;
    }
    return {
      error: '프로필 데이터를 불러오는 중 오류가 발생했습니다.'
    };
  }
};
