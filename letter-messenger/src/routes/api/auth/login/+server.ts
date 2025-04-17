import { json } from "@sveltejs/kit";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from "$lib/server/db";
import type { RequestHandler } from './$types';
import { JWT_SECRET } from "$env/static/private";

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { email, password } = await request.json();

        // 유효성 검증
        if (!email || !password) {
            return json({ success: false, message: '이메일과 비밀번호를 모두 입력해주세요.' }, { status: 400 });
        }

        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        // 사용자 찾기
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
        }

        // 비밀번호 확인
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
        }

        // 사용자 계정이 활성화되어 있는지 확인
        if (!user.is_active) {
            return json({ success: false, message: '비활성화된 계정입니다. 관리자에게 문의하세요.' }, { status: 403 });
        }

        // 마지막 로그인 시간 업데이트
        await usersCollection.updateOne(
            { _id: user._id },
            { $set: { last_login: new Date() } }
        );

        // JWT 토큰 생성 (기본 1일 유효)
        const jwtSecret = JWT_SECRET || 'your_jwt_secret_key_here_change_in_production';
        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email,
                isAdmin: user.is_admin
            },
            jwtSecret,
            { expiresIn: '1d' }
        );

        // 쿠키에 토큰 저장 (HttpOnly, SameSite=Strict 보안 설정)
        cookies.set('auth_token', token, {
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 1일 (초 단위)
        });

        // 사용자 기본 정보 반환 (비밀번호 등 민감한 정보 제외)
        return json({
            success: true,
            message: '로그인 성공',
            user: {
                id: user._id,
                email: user.email,
                nickname: user.profile.nickname,
                isAdmin: user.is_admin
            }
        });
    } catch (error) {
        console.error('로그인 오류:', error);
        return json({
            success: false,
            message: '서버 오류가 발생했습니다. 나중에 다시 시도해주세요.',
        }, { status: 500 });
    }
}
