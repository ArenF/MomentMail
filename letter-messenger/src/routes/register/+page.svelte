
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { register } from '$lib/utils/auth';
  import { authStore } from '$lib/stores/authStore';

  let email = '';
  let password = '';
  let confirmPassword = '';
  let nickname = '';
  let error = '';
  let loading = false;
  let successMessage = '';
  
  onMount(() => {
    // 이미 로그인되어 있으면 메인 페이지로 리디렉션
    const unsubscribe = authStore.subscribe(state => {
      if (state.isAuthenticated) {
        goto('/');
      }
    });
    
    return unsubscribe;
  });

  async function handleSubmit() {
    error = '';
    successMessage = '';
    
    // 기본적인 유효성 검사
    if (!email || !password || !confirmPassword || !nickname) {
      error = '모든 필드를 입력해주세요.';
      return;
    }

    if (password !== confirmPassword) {
      error = '비밀번호가 일치하지 않습니다.';
      return;
    }
    
    if (password.length < 6) {
      error = '비밀번호는 최소 6자 이상이어야 합니다.';
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      error = '유효한 이메일 주소를 입력해주세요.';
      return;
    }

    // 회원가입 API 호출
    loading = true;
    try {
      const result = await register(email, password, nickname);
      
      if (result.success) {
        successMessage = result.message;
        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          goto('/login');
        }, 3000);
      } else {
        error = result.message;
      }
    } catch (err) {
      error = '회원가입 중 오류가 발생했습니다. 나중에 다시 시도해주세요.';
      console.error('회원가입 오류:', err);
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>회원가입 - 편지 메신저</title>
</svelte:head>

<div class="auth-container">
  <div class="auth-card">
    <h1>회원가입</h1>
    
    <form on:submit|preventDefault={handleSubmit}>
      {#if error}
        <div class="error-message">{error}</div>
      {/if}
      
      {#if successMessage}
        <div class="success-message">{successMessage}</div>
      {/if}
      
      <div class="form-group">
        <label for="email">이메일</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          placeholder="example@mail.com"
          required
          disabled={loading}
        />
      </div>
      
      <div class="form-group">
        <label for="nickname">닉네임</label>
        <input
          type="text"
          id="nickname"
          bind:value={nickname}
          placeholder="사용할 닉네임"
          required
          disabled={loading}
        />
      </div>
      
      <div class="form-group">
        <label for="password">비밀번호</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          placeholder="비밀번호를 입력하세요"
          required
          disabled={loading}
        />
      </div>
      
      <div class="form-group">
        <label for="confirmPassword">비밀번호 확인</label>
        <input
          type="password"
          id="confirmPassword"
          bind:value={confirmPassword}
          placeholder="비밀번호를 다시 입력하세요"
          required
          disabled={loading}
        />
      </div>
      
      <button type="submit" class="submit-button" disabled={loading}>
        {loading ? '처리 중...' : '회원가입'}
      </button>
      
      <div class="auth-links">
        <a href="/login">이미 계정이 있으신가요? 로그인</a>
      </div>
      
      <div class="social-login">
        <p>또는</p>
        <button type="button" class="google-button" disabled={loading}>
          Google로 회원가입
        </button>
      </div>
    </form>
  </div>
</div>

<style>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70vh;
  }
  
  .auth-card {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--text-color);
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .error-message {
    background-color: #fff5f5;
    color: var(--error-color, #e53e3e);
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    border: 1px solid #fee;
  }
  
  .success-message {
    background-color: #f0fff4;
    color: var(--success-color, #38a169);
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    border: 1px solid #c6f6d5;
  }
  
  .submit-button {
    width: 100%;
    padding: 0.75rem;
    margin-top: 0.5rem;
    font-size: 1rem;
    background-color: var(--primary-color, #4299e1);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .submit-button:hover:not([disabled]) {
    background-color: var(--primary-dark, #3182ce);
  }
  
  .submit-button:disabled {
    background-color: var(--medium-gray, #cbd5e0);
    cursor: not-allowed;
  }
  
  .auth-links {
    margin: 1.5rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .auth-links a {
    color: var(--dark-gray, #4a5568);
    font-size: 0.9rem;
    text-align: center;
  }
  
  .auth-links a:hover {
    color: var(--primary-color, #4299e1);
  }
  
  .social-login {
    margin-top: 1rem;
    text-align: center;
  }
  
  .social-login p {
    color: var(--dark-gray, #4a5568);
    margin-bottom: 1rem;
    position: relative;
  }
  
  .social-login p::before,
  .social-login p::after {
    content: "";
    position: absolute;
    width: 40%;
    height: 1px;
    background-color: var(--medium-gray, #cbd5e0);
    top: 50%;
  }
  
  .social-login p::before {
    left: 0;
  }
  
  .social-login p::after {
    right: 0;
  }
  
  .google-button {
    background-color: white;
    color: var(--text-color, #1a202c);
    border: 1px solid var(--medium-gray, #cbd5e0);
    width: 100%;
    padding: 0.75rem;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .google-button:hover:not([disabled]) {
    background-color: var(--light-gray, #f7fafc);
  }
  
  .google-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
</style>
