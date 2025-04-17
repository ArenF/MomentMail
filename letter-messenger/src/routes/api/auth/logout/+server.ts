import { json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
    // 인증 쿠키 삭제
    cookies.delete('auth_token', { path: '/' });
    
    return json({
        success: true,
        message: '로그아웃 되었습니다.'
    });
}
