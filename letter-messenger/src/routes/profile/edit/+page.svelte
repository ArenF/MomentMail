<!--
  프로필 편집 페이지
  
  사용자의 프로필 정보를 편집할 수 있는 페이지입니다.
  프로필 이미지, 닉네임, 상태 메시지를 수정할 수 있습니다.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { profileStore } from '$lib/stores/profileStore';
	import { authStore } from '$lib/stores/authStore';
	import EditProfileForm from '$lib/components/profile/EditProfileForm.svelte';
	import type { ProfileData } from '$lib/types/profile';

	// 프로필 데이터 로딩 상태
	let loading = true;
	let error: string | null = null;

	// 인증 확인 및 프로필 로드 함수
	const loadProfile = async () => {
		try {
			// 프로필 데이터 로드
			await profileStore.load();
			loading = false;
		} catch (err) {
			console.error('프로필 로드 오류:', err);
			error = err instanceof Error ? err.message : '프로필을 불러오는 중 오류가 발생했습니다.';
			loading = false;
		}
	};

	// Svelte 라이프사이클 훅
	onMount(() => {
		// 인증 상태 확인
		const unsubscribeAuth = authStore.subscribe((state) => {
			if (!state.loading && !state.isAuthenticated) {
				// 로그인되지 않은 경우 로그인 페이지로 리디렉션
				goto('/login?redirectTo=/profile/edit');
			}
		});

		// 비동기 함수 호출 (별도로 정의)
		loadProfile();

		// 클린업 함수 반환
		return () => {
			unsubscribeAuth();
		};
	});

	// 저장 완료 핸들러
	function handleSaved(event: CustomEvent<ProfileData>) {
		// 저장 성공 후 프로필 페이지로 이동 (약간의 지연으로 성공 메시지 표시)
		setTimeout(() => {
			goto('/profile');
		}, 1500);
	}

	// 취소 핸들러
	function handleCancel() {
		goto('/profile');
	}
</script>

<svelte:head>
	<title>프로필 편집 - 모멘트메일</title>
</svelte:head>

<div class="edit-profile-page">
	<div class="back-link">
		<a href="/profile">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<line x1="19" y1="12" x2="5" y2="12"></line>
				<polyline points="12 19 5 12 12 5"></polyline>
			</svg>
			프로필로 돌아가기
		</a>
	</div>

	{#if loading}
		<div class="loading-container">
			<div class="loading-spinner"></div>
			<p>프로필을 불러오는 중...</p>
		</div>
	{:else if error}
		<div class="error-container">
			<p class="error-message">{error}</p>
			<button class="retry-button" on:click={() => profileStore.load()}>다시 시도</button>
		</div>
	{:else}
		<EditProfileForm profileData={$profileStore} on:saved={handleSaved} on:cancel={handleCancel} />
	{/if}
</div>

<style>
	.edit-profile-page {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.back-link {
		margin-bottom: 2rem;
	}

	.back-link a {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #495057;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	.back-link a:hover {
		color: #748ffc;
	}

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem;
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid #f3f3f3;
		border-top: 3px solid #748ffc;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.error-container {
		background-color: #fff5f5;
		padding: 2rem;
		border-radius: 8px;
		text-align: center;
		border: 1px solid #fee;
	}

	.error-message {
		color: #e03131;
		margin-bottom: 1rem;
	}

	.retry-button {
		background-color: #748ffc;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
	}

	.retry-button:hover {
		background-color: #5c7cfa;
	}
</style>
