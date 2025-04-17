/**
 * 프로필 이미지 업로드 API 엔드포인트
 * 
 * 사용자 프로필 이미지를 업로드하고 저장하는 API 구현
 */

import { error, json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { RequestHandler } from './$types';

/**
 * 프로필 이미지 업로드 핸들러
 */
export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    // 세션에서 사용자 ID 가져오기
    const userId = locals.userId;
    if (!userId) {
      console.error('이미지 업로드 실패: 인증되지 않은 사용자');
      throw error(401, '로그인이 필요합니다. 다시 로그인해주세요.');
    }
    
    console.log(`이미지 업로드 시도: 사용자 ID ${userId}`);


    // multipart/form-data 요청 파싱
    const formData = await request.formData();
    const profileImage = formData.get('profileImage') as File;

    if (!profileImage) {
      throw error(400, '이미지 파일이 제공되지 않았습니다.');
    }

    // 파일 확장자 및 MIME 타입 확인
    const fileExtension = profileImage.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      throw error(400, '지원되지 않는 파일 형식입니다. JPG, PNG, GIF, WEBP 파일만 허용됩니다.');
    }

    if (!allowedMimeTypes.includes(profileImage.type)) {
      throw error(400, '지원되지 않는 이미지 형식입니다.');
    }

    // 파일 크기 제한 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (profileImage.size > maxSize) {
      throw error(400, '이미지 크기가 너무 큽니다. 최대 5MB까지 허용됩니다.');
    }

    // 이미지 파일 저장
    // 1. 저장 디렉토리 경로 생성
    const staticDir = path.resolve('static');
    const uploadsDir = path.join(staticDir, 'uploads', 'profiles');

    // 2. 디렉토리 존재 확인 및 생성
    try {
      await fs.promises.mkdir(uploadsDir, { recursive: true });
    } catch (mkdirErr) {
      console.error('디렉토리 생성 오류:', mkdirErr);
      throw error(500, '이미지 저장을 위한 디렉토리를 생성할 수 없습니다.');
    }

    // 3. 파일명 생성 (고유 ID + 확장자)
    const fileName = `${userId}-${uuidv4()}.${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);

    // 4. 파일 저장
    const arrayBuffer = await profileImage.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await fs.promises.writeFile(filePath, buffer);

    // 5. 웹에서 접근 가능한 URL 경로 반환
    const imageUrl = `/uploads/profiles/${fileName}`;

    return json({
      success: true,
      message: '이미지가 성공적으로 업로드되었습니다.',
      imageUrl
    });
  } catch (err) {
    console.error('이미지 업로드 오류:', err);
    
    if (err instanceof Response) {
      throw err;
    }
    
    throw error(500, '이미지를 업로드하는 중 오류가 발생했습니다.');
  }
};
