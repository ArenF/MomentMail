/**
 * 프로필 API 엔드포인트
 * 
 * 사용자 프로필 데이터를 가져오고 업데이트하는 API 구현
 */

import { error, json } from '@sveltejs/kit';
import { connectToDatabase } from '$lib/server/db';
import { ObjectId } from 'mongodb';
import type { RequestHandler } from './$types';
import type { UserDocument } from '$lib/types/database';
import type { ProfileData, ProfileUpdateRequest } from '$lib/types/profile';

/**
 * 사용자 프로필 정보를 가져오는 GET 핸들러
 */
export const GET: RequestHandler = async ({ locals }) => {
  try {
    // 세션에서 사용자 ID 가져오기
    const userId = locals.userId;
    if (!userId) {
      console.error('프로필 조회 실패: 인증되지 않은 사용자');
      throw error(401, '로그인이 필요합니다. 다시 로그인해주세요.');
    }
    
    console.log(`프로필 조회 시도: 사용자 ID ${userId}`);


    // 데이터베이스 연결
    const db = await connectToDatabase();
    const usersCollection = db.collection<UserDocument>('users');
    const lettersCollection = db.collection('letters');

    // 사용자 정보 조회
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw error(404, '사용자를 찾을 수 없습니다.');
    }

    // 편지 통계 조회
    const receivedLetters = await lettersCollection.countDocuments({ 
      recipient_id: new ObjectId(userId),
      status: { $in: ['sent', 'delivered'] }
    });
    
    const sentLetters = await lettersCollection.countDocuments({ 
      sender_id: new ObjectId(userId),
      status: { $in: ['sent', 'delivered'] }
    });

    // 프로필 데이터 구성
    const profileData: ProfileData = {
      userId: userId,
      nickname: user.profile.nickname,
      profileImageUrl: user.profile.profile_image_url || '/images/default-profile.png',
      statusMessage: user.profile.status_message || '',
      friendCode: user.profile.friend_code,
      stats: {
        receivedLetters,
        sentLetters,
        totalLetters: receivedLetters + sentLetters
      },
      updatedAt: user.profile.updated_at
    };

    return json(profileData);
  } catch (err) {
    console.error('프로필 조회 오류:', err);
    
    if (err instanceof Response) {
      throw err;
    }
    
    throw error(500, '프로필 정보를 가져오는 중 오류가 발생했습니다.');
  }
};

/**
 * 사용자 프로필 정보를 업데이트하는 PUT 핸들러
 */
export const PUT: RequestHandler = async ({ request, locals }) => {
  try {
    // 세션에서 사용자 ID 가져오기
    const userId = locals.userId;
    if (!userId) {
      console.error('프로필 업데이트 실패: 인증되지 않은 사용자');
      throw error(401, '로그인이 필요합니다. 다시 로그인해주세요.');
    }
    
    console.log(`프로필 업데이트 시도: 사용자 ID ${userId}`);


    // 요청 본문 파싱
    const updateData: ProfileUpdateRequest = await request.json();
    
    // 기본 유효성 검사
    if (updateData.nickname !== undefined && updateData.nickname.trim() === '') {
      throw error(400, '닉네임은 비워둘 수 없습니다.');
    }
    
    if (updateData.statusMessage !== undefined && updateData.statusMessage.length > 100) {
      throw error(400, '상태 메시지는 100자를 초과할 수 없습니다.');
    }

    // 데이터베이스 연결
    const db = await connectToDatabase();
    const usersCollection = db.collection<UserDocument>('users');

    // 업데이트할 필드 구성
    const updateFields: any = {};
    
    if (updateData.nickname !== undefined) {
      updateFields['profile.nickname'] = updateData.nickname;
    }
    
    if (updateData.statusMessage !== undefined) {
      updateFields['profile.status_message'] = updateData.statusMessage;
    }
    
    if (updateData.profileImageUrl !== undefined) {
      updateFields['profile.profile_image_url'] = updateData.profileImageUrl;
    }
    
    // 업데이트 시간 설정
    updateFields['profile.updated_at'] = new Date();

    // 사용자 프로필 업데이트
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateFields }
    );

    if (result.modifiedCount === 0) {
      throw error(404, '사용자를 찾을 수 없거나 업데이트에 실패했습니다.');
    }

    // 업데이트된 사용자 정보 조회
    const updatedUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!updatedUser) {
      throw error(404, '업데이트된 사용자 정보를 찾을 수 없습니다.');
    }

    // 편지 통계 조회
    const lettersCollection = db.collection('letters');
    const receivedLetters = await lettersCollection.countDocuments({ 
      recipient_id: new ObjectId(userId),
      status: { $in: ['sent', 'delivered'] }
    });
    
    const sentLetters = await lettersCollection.countDocuments({ 
      sender_id: new ObjectId(userId),
      status: { $in: ['sent', 'delivered'] }
    });

    // 업데이트된 프로필 데이터 구성
    const profileData: ProfileData = {
      userId: userId,
      nickname: updatedUser.profile.nickname,
      profileImageUrl: updatedUser.profile.profile_image_url || '/images/default-profile.png',
      statusMessage: updatedUser.profile.status_message || '',
      friendCode: updatedUser.profile.friend_code,
      stats: {
        receivedLetters,
        sentLetters,
        totalLetters: receivedLetters + sentLetters
      },
      updatedAt: updatedUser.profile.updated_at
    };

    return json({
      success: true,
      message: '프로필이 성공적으로 업데이트되었습니다.',
      profile: profileData
    });
  } catch (err) {
    console.error('프로필 업데이트 오류:', err);
    
    if (err instanceof Response) {
      throw err;
    }
    
    throw error(500, '프로필 정보를 업데이트하는 중 오류가 발생했습니다.');
  }
};
