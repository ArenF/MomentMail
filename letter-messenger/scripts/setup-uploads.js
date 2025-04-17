/**
 * 업로드 디렉토리 초기화 스크립트
 * 
 * 이 스크립트는 이미지 업로드를 위한 디렉토리 구조를 생성합니다.
 * npm run setup 명령어로 실행할 수 있습니다.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES 모듈에서 __dirname 대안 구현
// 현재 파일의 경로를 구한 후 디렉토리 경로 가져오기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 필요한 디렉토리 경로
const STATIC_DIR = path.join(__dirname, '..', 'static');
const UPLOADS_DIR = path.join(STATIC_DIR, 'uploads');
const PROFILE_UPLOADS_DIR = path.join(UPLOADS_DIR, 'profiles');

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

// 기본 이미지 생성 함수
function createDefaultProfileImage() {
  const DEFAULT_PROFILE_PATH = path.join(STATIC_DIR, 'images');
  const DEFAULT_PROFILE_IMAGE = path.join(DEFAULT_PROFILE_PATH, 'default-profile.png');
  
  // 기본 이미지 디렉토리 생성
  createDirectoryIfNotExists(DEFAULT_PROFILE_PATH);
  
  // 기본 이미지 파일이 없으면 빈 파일 생성 (실제로는 이미지 파일을 직접 넣어야 함)
  if (!fs.existsSync(DEFAULT_PROFILE_IMAGE)) {
    try {
      // 참고: 실제 프로젝트에서는 실제 이미지 파일을 복사해야 함
      // 여기서는 빈 파일만 생성
      fs.writeFileSync(DEFAULT_PROFILE_IMAGE, '');
      console.log(`✅ 기본 프로필 이미지 생성 완료: ${DEFAULT_PROFILE_IMAGE}`);
      console.log('⚠️ 주의: 실제 이미지 파일을 이 경로에 복사해야 합니다!');
    } catch (err) {
      console.error(`❌ 기본 프로필 이미지 생성 실패: ${DEFAULT_PROFILE_IMAGE}`, err);
    }
  } else {
    console.log(`ℹ️ 기본 프로필 이미지가 이미 존재함: ${DEFAULT_PROFILE_IMAGE}`);
  }
}

// 메인 실행 함수
function setupUploadDirectories() {
  console.log('📁 업로드 디렉토리 초기화 중...');
  
  // static 디렉토리 생성
  createDirectoryIfNotExists(STATIC_DIR);
  
  // uploads 디렉토리 생성
  createDirectoryIfNotExists(UPLOADS_DIR);
  
  // profiles 디렉토리 생성
  createDirectoryIfNotExists(PROFILE_UPLOADS_DIR);
  
  // 기본 이미지 생성
  createDefaultProfileImage();
  
  console.log('✅ 업로드 디렉토리 초기화 완료!');
}

// 스크립트 실행
setupUploadDirectories();
