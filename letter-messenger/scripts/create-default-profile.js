/**
 * 기본 프로필 이미지 생성 스크립트
 * 
 * 이 스크립트는 기본 프로필 이미지를 생성합니다.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES 모듈에서 __dirname 대안 구현
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 이미지 저장 경로
const IMAGES_DIR = path.join(__dirname, '..', 'static', 'images');
const DEFAULT_PROFILE_PATH = path.join(IMAGES_DIR, 'default-profile.png');

// Base64로 인코딩된 간단한 프로필 이미지 (원형 + 사용자 아이콘)
// 실제 프로젝트에서는 더 좋은 이미지를 사용하는 것이 좋습니다.
const BASE64_IMAGE = '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';

// 디렉토리 생성 함수
function createDirectoryIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ 디렉토리 생성 완료: ${dirPath}`);
    } catch (err) {
      console.error(`❌ 디렉토리 생성 실패: ${dirPath}`, err);
      throw err;
    }
  } else {
    console.log(`ℹ️ 디렉토리가 이미 존재함: ${dirPath}`);
  }
}

// 메인 실행 함수
function createDefaultProfileImage() {
  console.log('🖼️ 기본 프로필 이미지 생성 중...');
  
  // 이미지 디렉토리 생성
  createDirectoryIfNotExists(IMAGES_DIR);
  
  // Base64 디코딩 및 파일 생성
  const imageBuffer = Buffer.from(BASE64_IMAGE, 'base64');
  
  try {
    fs.writeFileSync(DEFAULT_PROFILE_PATH, imageBuffer);
    console.log(`✅ 기본 프로필 이미지 생성 완료: ${DEFAULT_PROFILE_PATH}`);
  } catch (err) {
    console.error(`❌ 기본 프로필 이미지 생성 실패: ${DEFAULT_PROFILE_PATH}`, err);
  }
}

// 스크립트 실행
createDefaultProfileImage();
