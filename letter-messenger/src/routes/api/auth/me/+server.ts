import { json } from "@sveltejs/kit";
import jwt from 'jsonwebtoken';
import { connectToDatabase } from "$lib/server/db";
import { ObjectId } from "mongodb";
import { JWT_SECRET } from "$env/static/private";
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
    try {
        // 쿠키에서 토큰 가져오기
        const token = cookies.get('auth_token');
        
        if (!token) {
            return json({ success: false, message: '인증되지 않음' }, { status: 401 });
        }

        // JWT 토큰 검증
        const jwtSecret = JWT_SECRET || 'your_jwt_secret_key_here_change_in_production';
        const decoded = jwt.verify(token, jwtSecret) as { userId: string };
        
        // 데이터베이스에서 사용자 정보 조회
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');
        
        const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
        
        if (!user) {
            return json({ success: false, message: '사용자를 찾을 수 없음' }, { status: 404 });
        }

        // 사용자 정보 반환 (민감한 정보 제외)
        return json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                nickname: user.profile.nickname,
                isAdmin: user.is_admin,
            }
        });
    } catch (error) {
        console.error('사용자 정보 조회 오류:', error);
        return json({
            success: false,
            message: '인증되지 않음'
        }, { status: 401 });
    }
}
