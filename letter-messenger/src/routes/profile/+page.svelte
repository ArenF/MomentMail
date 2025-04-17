<!--
  프로필 메인 페이지
  
  사용자의 프로필 정보와 통계를 보여주는 페이지입니다.
  프로필 카드와 추가 기능을 제공합니다.
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { profileStore } from '$lib/stores/profileStore';
  import { authStore } from '$lib/stores/authStore';
  import ProfileCard from '$lib/components/profile/ProfileCard.svelte';
  
  // 프로필 데이터 로딩 상태
  let loading = true;
  let error: string | null = null;
  let copySuccess = false;
  let copyTimeout: ReturnType<typeof setTimeout> | null = null;
  
  // 프로필 데이터 로드 함수
  const loadProfile = async () => {
    try {
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
    const unsubscribeAuth = authStore.subscribe(state => {
      if (!state.loading && !state.isAuthenticated) {
        // 로그인되지 않은 경우 로그인 페이지로 리디렉션
        goto('/login?redirectTo=/profile');
      }
    });
    
    // 비동기 프로필 로드 함수 호출
    loadProfile();
    
    // 클린업 함수 반환
    return () => {
      unsubscribeAuth();
      if (copyTimeout) clearTimeout(copyTimeout);
    };
  });
  
  // 편집 페이지로 이동
  function handleEdit() {
    goto('/profile/edit');
  }
  
  // 친구 코드 복사
  async function handleCopyFriendCode(event: CustomEvent<string>) {
    try {
      await navigator.clipboard.writeText(event.detail);
      copySuccess = true;
      
      // 3초 후 메시지 숨기기
      if (copyTimeout) clearTimeout(copyTimeout);
      copyTimeout = setTimeout(() => {
        copySuccess = false;
      }, 3000);
    } catch (err) {
      console.error('친구 코드 복사 오류:', err);
      error = '친구 코드를 복사하는데 실패했습니다.';
    }
  }
</script>

<svelte:head>
  <title>내 프로필 - 모멘트메일</title>
</svelte:head>

<div class="profile-page">
  <h1>내 프로필</h1>
  
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
    <div class="profile-content">
      <ProfileCard 
        profileData={$profileStore} 
        on:edit={handleEdit}
        on:copyFriendCode={handleCopyFriendCode}
      />
      
      {#if copySuccess}
        <div class="copy-success-notification">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          친구 코드가 클립보드에 복사되었습니다.
        </div>
      {/if}
      
      <div class="profile-actions">
        <button class="action-button edit-profile" on:click={handleEdit}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          프로필 편집
        </button>
        
        <button class="action-button copy-code" on:click={() => handleCopyFriendCode(new CustomEvent('copyFriendCode', { detail: $profileStore.friendCode }))}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          친구 코드 복사
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .profile-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  h1 {
    text-align: center;
    font-size: 1.8rem;
    color: #343a40;
    margin-bottom: 2rem;
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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
  
  .profile-content {
    position: relative;
  }
  
  .copy-success-notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #222;
    color: white;
    padding: 10px 16px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
    z-index: 100;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, 10px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; transform: translate(-50%, 0); }
    to { opacity: 0; transform: translate(-50%, 10px); }
  }
  
  .copy-success-notification svg {
    color: #2ecc71;
  }
  
  .profile-actions {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .action-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 30px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .edit-profile {
    background-color: #748ffc;
    color: white;
  }
  
  .edit-profile:hover {
    background-color: #5c7cfa;
  }
  
  .copy-code {
    background-color: #e9ecef;
    color: #495057;
  }
  
  .copy-code:hover {
    background-color: #dee2e6;
  }
</style>
