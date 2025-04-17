import { writable } from 'svelte/store';

// 사용자 타입 정의
export interface User {
    id: string;
    email: string;
    nickname: string;
    isAdmin: boolean;
}

// 인증 상태 타입 정의
interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
}

// 초기 인증 상태
const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: true
};

// 인증 상태 스토어 생성
const createAuthStore = () => {
    const { subscribe, set, update } = writable<AuthState>(initialState);

    return {
        subscribe,
        // 사용자 로그인
        setUser: (user: User) => update(state => ({ ...state, isAuthenticated: true, user, loading: false })),
        // 로그아웃
        clearUser: () => update(state => ({ ...state, isAuthenticated: false, user: null, loading: false })),
        // 로딩 상태 변경
        setLoading: (loading: boolean) => update(state => ({ ...state, loading })),
        // 초기 상태로 리셋
        reset: () => set(initialState)
    };
};

// 인증 스토어 인스턴스 생성 및 내보내기
export const authStore = createAuthStore();
