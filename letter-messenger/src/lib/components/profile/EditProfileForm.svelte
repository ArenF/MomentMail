<!--
  프로필 편집 폼 컴포넌트
  
  사용자 프로필 정보를 수정할 수 있는 폼을 제공합니다.
  이름, 상태 메시지, 프로필 이미지를 변경할 수 있습니다.
-->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { ProfileData } from '$lib/types/profile';
  import { profileStore } from '$lib/stores/profileStore';
  
  // 프로필 데이터 props
  export let profileData: ProfileData;
  
  // 폼 입력 상태
  let nickname = profileData.nickname;
  let statusMessage = profileData.statusMessage || '';
  let profileImageUrl = profileData.profileImageUrl;
  let profileImageFile: FileList | null = null;
  let imagePreview = profileImageUrl;
  
  // 폼 상태
  let loading = false;
  let error = '';
  let success = false;
  
  // 이벤트 디스패처 생성
  const dispatch = createEventDispatcher<{
    saved: ProfileData;
    cancel: void;
  }>();
  
  // 이미지 파일 선택 처리
  function handleImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      profileImageFile = input.files;
      
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  
  // 폼 제출 처리
  async function handleSubmit() {
    error = '';
    success = false;
    loading = true;
    
    try {
      // 기본 유효성 검사
      if (!nickname.trim()) {
        error = '닉네임을 입력해주세요.';
        loading = false;
        return;
      }
      
      // 이미지 업로드 처리 (이미지 파일이 있는 경우)
      let newImageUrl = profileImageUrl;
      if (profileImageFile && profileImageFile.length > 0) {
        const formData = new FormData();
        formData.append('profileImage', profileImageFile[0]);
        
        const uploadResponse = await fetch('/api/profile/upload-image', {
          method: 'POST',
          body: formData
        });
        
        if (uploadResponse.ok) {
          const data = await uploadResponse.json();
          newImageUrl = data.imageUrl;
        } else {
          throw new Error('이미지 업로드에 실패했습니다.');
        }
      }
      
      // 프로필 업데이트 요청
      const result = await profileStore.update({
        nickname,
        statusMessage,
        profileImageUrl: newImageUrl
      });
      
      if (result.success && result.profile) {
        success = true;
        // 부모 컴포넌트에 저장 완료 이벤트 발생
        dispatch('saved', result.profile);
      } else {
        error = result.message;
      }
    } catch (err) {
      console.error('프로필 업데이트 오류:', err);
      error = err instanceof Error ? err.message : '프로필 업데이트 중 오류가 발생했습니다.';
    } finally {
      loading = false;
    }
  }
  
  // 취소 처리
  function handleCancel() {
    dispatch('cancel');
  }
</script>

<form class="edit-profile-form" on:submit|preventDefault={handleSubmit}>
  <h2>프로필 편집</h2>
  
  {#if error}
    <div class="error-message">
      <p>{error}</p>
    </div>
  {/if}
  
  {#if success}
    <div class="success-message">
      <p>프로필이 성공적으로 업데이트되었습니다!</p>
    </div>
  {/if}
  
  <div class="form-group">
    <label for="profile-image">프로필 이미지</label>
    <div class="image-upload">
      <div class="image-preview" style="background-image: url('{imagePreview}')">
        <label for="profile-image" class="upload-overlay">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
          <span>이미지 변경</span>
        </label>
      </div>
      <input 
        type="file" 
        id="profile-image" 
        accept="image/*" 
        on:change={handleImageChange} 
        class="file-input"
        disabled={loading}
      />
    </div>
  </div>
  
  <div class="form-group">
    <label for="nickname">닉네임 <span class="required">*</span></label>
    <input
      type="text"
      id="nickname"
      bind:value={nickname}
      required
      minlength="2"
      maxlength="20"
      placeholder="닉네임을 입력하세요"
      disabled={loading}
    />
  </div>
  
  <div class="form-group">
    <label for="status-message">상태 메시지</label>
    <textarea
      id="status-message"
      bind:value={statusMessage}
      maxlength="100"
      placeholder="상태 메시지를 입력하세요 (최대 100자)"
      rows="3"
      disabled={loading}
    ></textarea>
    <div class="char-count">{statusMessage ? statusMessage.length : 0}/100</div>
  </div>
  
  <div class="form-actions">
    <button type="button" class="cancel-button" on:click={handleCancel} disabled={loading}>취소</button>
    <button type="submit" class="save-button" disabled={loading}>
      {#if loading}
        저장 중...
      {:else}
        저장하기
      {/if}
    </button>
  </div>
</form>

<style>
  .edit-profile-form {
    background-color: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #343a40;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #495057;
  }
  
  .required {
    color: #fa5252;
    font-weight: bold;
  }
  
  input[type="text"],
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  
  input[type="text"]:focus,
  textarea:focus {
    border-color: #748ffc;
    outline: none;
    box-shadow: 0 0 0 3px rgba(116, 143, 252, 0.2);
  }
  
  .image-upload {
    position: relative;
    margin-bottom: 1rem;
  }
  
  .image-preview {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    position: relative;
    margin: 0 auto;
    border: 2px solid #dee2e6;
    overflow: hidden;
  }
  
  .upload-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    transition: opacity 0.2s;
    cursor: pointer;
  }
  
  .upload-overlay span {
    margin-top: 0.5rem;
    font-size: 0.875rem;
  }
  
  .image-preview:hover .upload-overlay {
    opacity: 1;
  }
  
  .file-input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
  
  .char-count {
    font-size: 0.8rem;
    color: #868e96;
    text-align: right;
    margin-top: 0.25rem;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .cancel-button,
  .save-button {
    padding: 0.75rem 1.5rem;
    border-radius: 30px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }
  
  .cancel-button {
    background-color: #e9ecef;
    color: #495057;
  }
  
  .cancel-button:hover:not([disabled]) {
    background-color: #dee2e6;
  }
  
  .save-button {
    background-color: #748ffc;
    color: white;
  }
  
  .save-button:hover:not([disabled]) {
    background-color: #5c7cfa;
  }
  
  .save-button:disabled,
  .cancel-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .error-message {
    margin-top: 0;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background-color: #fff5f5;
    border-left: 4px solid #e03131;
    color: #e03131;
    border-radius: 4px;
  }
  
  .error-message p {
    margin: 0;
  }
  
  .success-message {
    margin-top: 0;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background-color: #ebfbee;
    border-left: 4px solid #37b24d;
    color: #2b8a3e;
    border-radius: 4px;
  }
  
  .success-message p {
    margin: 0;
  }
</style>
