import { authStore, type User } from '$lib/stores/authStore';
import { goto } from '$app/navigation';

/**
 * 로그인 함수
 * @param email 사용자 이메일
 * @param password 사용자 비밀번호
 * @returns 로그인 결과 객체
 */
export async function login(email: string, password: string) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // 인증 스토어에 사용자 정보 저장
            authStore.setUser(data.user as User);
            return { success: true, message: data.message };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('로그인 오류:', error);
        return { 
            success: false, 
            message: '로그인 중 오류가 발생했습니다. 나중에 다시 시도해주세요.'
        };
    }
}

/**
 * 회원가입 함수
 * @param email 사용자 이메일
 * @param password 사용자 비밀번호
 * @param nickname 사용자 닉네임
 * @returns 회원가입 결과 객체
 */
export async function register(email: string, password: string, nickname: string) {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, nickname })
        });

        const data = await response.json();
        return { 
            success: response.ok, 
            message: data.message,
            userId: data.userId
        };
    } catch (error) {
        console.error('회원가입 오류:', error);
        return { 
            success: false, 
            message: '회원가입 중 오류가 발생했습니다. 나중에 다시 시도해주세요.'
        };
    }
}

/**
 * 로그아웃 함수
 */
export async function logout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST'
        });

        if (response.ok) {
            // 인증 스토어에서 사용자 정보 제거
            authStore.clearUser();
            // 로그인 페이지로 이동
            goto('/login');
            return { success: true };
        } else {
            const data = await response.json();
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('로그아웃 오류:', error);
        return { 
            success: false, 
            message: '로그아웃 중 오류가 발생했습니다.'
        };
    }
}

/**
 * 사용자 인증 상태 확인 함수
 */
export async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/me');
        
        if (response.ok) {
            const data = await response.json();
            authStore.setUser(data.user);
            return true;
        } else {
            authStore.clearUser();
            return false;
        }
    } catch (error) {
        console.error('인증 상태 확인 오류:', error);
        authStore.clearUser();
        return false;
    }
}
