<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { checkAuthStatus, logout } from '$lib/utils/auth';
  import { authStore } from '$lib/stores/authStore';
  
  let isLoggedIn = false;
  let user = null;
  let loading = true;
  
  // 인증 상태 구독
  authStore.subscribe(state => {
    isLoggedIn = state.isAuthenticated;
    user = state.user;
    loading = state.loading;
  });
  
  // 컴포넌트 마운트 시 인증 상태 확인
  onMount(async () => {
    await checkAuthStatus();
    
    // 인증 토큰 만료 이벤트 리스너 등록
    const handleAuthExpired = () => {
      console.log('인증 토큰이 만료되었습니다. 다시 로그인이 필요합니다.');
      logout();
      // 토스트 메시지나 알림 표시 가능
      alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
    };
    
    window.addEventListener('auth:expired', handleAuthExpired);
    
    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  });
  
  // 로그아웃 핸들러
  async function handleLogout() {
    await logout();
  }
</script>

<div class="app">
  <header>
    <div class="logo">
      <a href="/">
        <h1>편지 메신저</h1>
      </a>
    </div>
    
    <nav>
      <ul class="nav-links">
        <li><a href="/">홈</a></li>
        
        {#if isLoggedIn}
          <li><a href="/write">편지쓰기</a></li>
          <li><a href="/inbox">받은편지함</a></li>
          <li><a href="/sent">보낸편지함</a></li>
        {/if}
      </ul>
      
      <ul class="auth-links">
        {#if loading}
          <li><span class="loading">로딩 중...</span></li>
        {:else if isLoggedIn}
          <li class="user-info">
            <a href="/profile">
              {user?.nickname || '프로필'}
            </a>
          </li>
          <li>
            <button on:click={handleLogout} class="logout-button">로그아웃</button>
          </li>
        {:else}
          <li><a href="/login" class="login-button">로그인</a></li>
          <li><a href="/register" class="register-button">회원가입</a></li>
        {/if}
      </ul>
    </nav>
  </header>

  <main>
    <slot />
  </main>

  <footer>
    <p>&copy; 2025 편지 메신저 서비스</p>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
  }

  .logo h1 {
    font-size: 1.5rem;
    color: #495057;
    margin: 0;
  }
  
  .logo a {
    text-decoration: none;
  }

  nav {
    display: flex;
    gap: 2rem;
  }

  nav ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 1.5rem;
    align-items: center;
  }

  nav a {
    text-decoration: none;
    color: #495057;
    font-weight: 500;
    padding: 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  nav a:hover {
    background-color: #e9ecef;
  }
  
  .loading {
    color: #6c757d;
    font-size: 0.9rem;
  }
  
  .user-info a {
    font-weight: 600;
    color: var(--primary-color, #4299e1);
  }
  
  .logout-button {
    background: none;
    border: none;
    color: #e53e3e;
    cursor: pointer;
    font-weight: 500;
    padding: 0.5rem;
    border-radius: 4px;
  }
  
  .logout-button:hover {
    background-color: #fff5f5;
  }
  
  .login-button, .register-button {
    padding: 0.5rem 1rem;
  }
  
  .login-button {
    color: var(--primary-color, #4299e1);
  }
  
  .register-button {
    background-color: var(--primary-color, #4299e1);
    color: white;
    border-radius: 4px;
  }
  
  .register-button:hover {
    background-color: var(--primary-dark, #3182ce);
  }

  main {
    flex: 1;
    padding: 2rem;
  }

  footer {
    padding: 1rem;
    text-align: center;
    background-color: #f8f9fa;
    border-top: 1px solid #e9ecef;
    color: #6c757d;
  }
</style>
