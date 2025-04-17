
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { login } from '$lib/utils/auth';
  import { authStore } from '$lib/stores/authStore';

  let email = '';
  let password = '';
  let error = '';
  let loading = false;
  let redirectTo = '/';

  onMount(() => {
    // URL에서 redirectTo 쿼리 파라미터 가져오기
    const unsubscribeParams = page.subscribe(({ url }) => {
      redirectTo = url.searchParams.get('redirectTo') || '/';
    });

    // 이미 로그인되어 있으면 메인 페이지 또는 리디렉션 URL로 이동
    const unsubscribeAuth = authStore.subscribe(state => {
      if (state.isAuthenticated) {
        goto(redirectTo);
      }
    });
    
    return () => {
      unsubscribeParams();
      unsubscribeAuth();
    };
  });

  async function handleSubmit() {
    error = '';
    
    // 기본적인 유효성 검사
    if (!email || !password) {
      error = '이메일과 비밀번호를 모두 입력해주세요.';
      return;
    }

    // 로그인 API 호출
    loading = true;
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // 리디렉션 URL로 이동
        goto(redirectTo);
      } else {
        error = result.message;
      }
    } catch (err) {
      error = '로그인 중 오류가 발생했습니다. 나중에 다시 시도해주세요.';
      console.error('로그인 오류:', err);
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>로그인 - 편지 메신저</title>
</svelte:head>

<div class="auth-container">
  <div class="auth-card">
    <h1>로그인</h1>
    
    <form on:submit|preventDefault={handleSubmit}>
      {#if error}
        <div class="error-message">{error}</div>
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
      
      <button type="submit" class="submit-button" disabled={loading}>
        {loading ? '로그인 중...' : '로그인'}
      </button>
      
      <div class="auth-links">
        <a href="/forgot-password">비밀번호를 잊으셨나요?</a>
        <a href="/register">계정이 없으신가요? 회원가입</a>
      </div>
      
      <div class="social-login">
        <p>또는</p>
        <button type="button" class="google-button" disabled={loading}>
          Google로 로그인
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
