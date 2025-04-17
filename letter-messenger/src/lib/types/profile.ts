/**
 * 프로필 관련 타입 정의
 */

import { ObjectId } from 'mongodb';

/**
 * 프로필 데이터 인터페이스
 * 사용자 프로필 정보와 통계를 포함합니다.
 */
export interface ProfileData {
  userId: string;
  nickname: string;
  profileImageUrl: string;
  statusMessage: string;
  friendCode: string;
  stats: {
    receivedLetters: number;
    sentLetters: number;
    totalLetters: number;
  };
  updatedAt: Date;
}

/**
 * 프로필 업데이트 요청 인터페이스
 * 프로필 업데이트 시 사용되는 필드들을 정의합니다.
 */
export interface ProfileUpdateRequest {
  nickname?: string;
  statusMessage?: string;
  profileImageUrl?: string;
}

/**
 * 프로필 업데이트 응답 인터페이스
 * 프로필 업데이트 요청에 대한 응답 형식을 정의합니다.
 */
export interface ProfileResponse {
  success: boolean;
  message: string;
  profile?: ProfileData;
}
