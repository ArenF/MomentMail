import { json } from "@sveltejs/kit";
import bcrypt from 'bcrypt';
import { connectToDatabase } from "$lib/server/db";
import { generateFriendCode } from "$lib/utils/friendCode";
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email, password, nickname } = await request.json();

        // 유효성 검증
        if (!email || !password || !nickname) {
            return json({ success: false, message: '모든 필드를 입력해주세요.' }, { status: 400 });
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return json({ success: false, message: '유효한 이메일 주소를 입력해주세요.' }, { status: 400 });
        }

        // 비밀번호 길이 검증
        if (password.length < 6) {
            return json({ success: false, message: '비밀번호는 최소 6자 이상이어야 합니다.' }, { status: 400 });
        }

        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        // 이메일 중복 확인
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return json({ success: false, message: '이미 사용 중인 이메일입니다.' }, { status: 409 });
        }

        // 닉네임 중복 확인
        const existingNickname = await usersCollection.findOne({ 'profile.nickname': nickname });
        if (existingNickname) {
            return json({ success: false, message: '이미 사용 중인 닉네임입니다.' }, { status: 409 });
        }

        // 비밀번호 해싱 (await 추가)
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // 친구 코드 생성
        const friendCode = generateFriendCode();

        // 사용자 생성
        const newUser = {
            email,
            password_hash,
            auth_provider: 'email',
            auth_provider_id: null,
            is_admin: false,
            created_at: new Date(),
            last_login: null,
            is_active: true,
            profile: {
                nickname,
                profile_image_url: null,
                status_message: '',
                friend_code: friendCode,
                updated_at: new Date(),
            },
            settings: {
                notification_preferences: {
                    letter_received: true,
                    friend_request: true,
                    system: true,
                },
                privacy_settings: {
                    show_profile: true,
                    allow_friend_requests: true,
                },
                theme_preference: 'light',
            }
        };

        const result = await usersCollection.insertOne(newUser);

        return json({
            success: true,
            message: '회원가입이 완료되었습니다.',
            userId: result.insertedId
        }, { status: 201 });
    } catch (error) {
        console.error('회원가입 오류:', error);
        return json({
            success: false,
            message: '서버 오류가 발생했습니다. 나중에 다시 시도해주세요.',
        }, { status: 500 });
    }
}
