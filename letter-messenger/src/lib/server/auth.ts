import { redirect, error } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from './db';
import { ObjectId } from 'mongodb';
import { JWT_SECRET } from '$env/static/private';

// JWT 비밀키
const jwtSecret = JWT_SECRET || 'your_jwt_secret_key_here_change_in_production';

/**
 * 인증 토큰을 검증하고 사용자 정보를 반환하는 함수
 */
export async function validateToken(token: string) {
    try {
        // 토큰 검증
        const decoded = jwt.verify(token, jwtSecret) as { userId: string };
        
        // 데이터베이스에서 사용자 조회
        const db = await connectToDatabase();
        const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
        
        if (!user) {
            return null;
        }
        
        return {
            id: user._id.toString(),
            email: user.email,
            nickname: user.profile.nickname,
            isAdmin: user.is_admin
        };
    } catch (err) {
        return null;
    }
}

/**
 * 보호된 라우트를 위한 인증 함수
 * load 함수에서 사용
 */
export async function requireAuth({ cookies, url }: { cookies: any, url: URL }) {
    const token = cookies.get('auth_token');
    
    if (!token) {
        // 로그인 페이지로 리디렉션, 원래 URL을 redirectTo 쿼리 파라미터로 전달
        throw redirect(302, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
    }
    
    const user = await validateToken(token);
    
    if (!user) {
        // 인증 실패 시 쿠키 제거 후 로그인 페이지로 리디렉션
        cookies.delete('auth_token', { path: '/' });
        throw redirect(302, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
    }
    
    return user;
}

/**
 * API 엔드포인트용 인증 미들웨어
 */
export async function authenticateRequest(cookies: any) {
    const token = cookies.get('auth_token');
    
    if (!token) {
        throw error(401, '인증되지 않은 요청');
    }
    
    const user = await validateToken(token);
    
    if (!user) {
        throw error(401, '유효하지 않은 인증 토큰');
    }
    
    return user;
}

/**
 * 관리자 권한이 필요한 라우트를 위한 인증 함수
 */
export async function requireAdmin({ cookies, url }: { cookies: any, url: URL }) {
    const user = await requireAuth({ cookies, url });
    
    if (!user.isAdmin) {
        throw error(403, '관리자 권한이 필요합니다');
    }
    
    return user;
}
