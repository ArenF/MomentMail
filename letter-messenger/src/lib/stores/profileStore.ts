/**
 * 프로필 스토어
 *
 * 프로필 데이터를 관리하고 API와 통신하는 스토어 구현
 */

import { writable } from 'svelte/store';
import type { ProfileData, ProfileUpdateRequest, ProfileResponse } from '$lib/types/profile';

// 기본 프로필 데이터
const defaultProfile: ProfileData = {
	userId: '',
	nickname: '',
	profileImageUrl: '/images/default-profile.png',
	statusMessage: '편지로 마음을 전해요',
	friendCode: '',
	stats: {
		receivedLetters: 0,
		sentLetters: 0,
		totalLetters: 0
	},
	updatedAt: new Date()
};

// 프로필 스토어 생성 함수
function createProfileStore() {
	const { subscribe, set, update } = writable<ProfileData>(defaultProfile);

	return {
		subscribe,
		/**
		 * 프로필 데이터 로드
		 * API에서 현재 사용자의 프로필 정보를 가져옵니다.
		 */
		load: async (): Promise<ProfileData> => {
			try {
				console.log('프로필 데이터 로드 시도');
				const response = await fetch('/api/profile', {
					method: 'GET',
					credentials: 'include', // 쿠키 포함 요청
					headers: {
						'Cache-Control': 'no-cache'
					}
				});

				if (response.ok) {
					const profileData = await response.json();
					console.log('프로필 데이터 로드 성공:', profileData.nickname);
					set(profileData);
					return profileData;
				} else {
					const errorData = await response.json();
					console.error(`프로필 로드 실패: ${response.status} - ${errorData.message || '알 수 없는 오류'}`);
					
					// 401 인증 오류의 경우 로그아웃 상태로 처리 요청
					if (response.status === 401) {
						const event = new CustomEvent('auth:expired');
						window.dispatchEvent(event);
					}
					
					throw new Error(errorData.message || '프로필을 가져올 수 없습니다.');
				}
			} catch (error) {
				console.error('프로필 로드 중 오류 발생:', error);
				throw error; // 오류를 상위로 전파하여 적절한 처리가 가능하게 함
			}
		},

		/**
		 * 프로필 업데이트
		 * @param updateData 업데이트할 프로필 데이터
		 */
		update: async (updateData: ProfileUpdateRequest): Promise<ProfileResponse> => {
			try {
				console.log('프로필 업데이트 시도:', updateData);
				const response = await fetch('/api/profile', {
					method: 'PUT',
					credentials: 'include', // 쿠키 포함 요청
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(updateData)
				});

				const result = await response.json();

				if (response.ok) {
					console.log('프로필 업데이트 성공:', result.profile);
					// 성공적으로 업데이트된 경우 스토어 상태 갱신
					update((profile) => ({ ...profile, ...result.profile }));
					return { success: true, message: result.message, profile: result.profile };
				} else {
					console.error(`프로필 업데이트 실패: ${response.status} - ${result.message || '알 수 없는 오류'}`);
					
					// 401 인증 오류의 경우 로그아웃 상태로 처리 요청
					if (response.status === 401) {
						const event = new CustomEvent('auth:expired');
						window.dispatchEvent(event);
					}
					
					return { success: false, message: result.message };
				}
			} catch (error) {
				console.error('프로필 업데이트 중 오류 발생:', error);
				return {
					success: false,
					message: '프로필 업데이트 중 오류가 발생했습니다. 나중에 다시 시도해주세요.'
				};
			}
		},

		/**
		 * 프로필 스토어 초기화
		 */
		reset: () => set(defaultProfile)
	};
}

// 프로필 스토어 인스턴스 생성 및 내보내기
export const profileStore = createProfileStore();
