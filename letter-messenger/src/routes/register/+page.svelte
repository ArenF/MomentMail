<script lang="ts">
    let email = '';
    let password = '';
    let confirmPassword = '';
    let nickname = '';
    let error = '';
  
    function handleSubmit() {
      // 기본적인 유효성 검사
      if (!email || !password || !confirmPassword || !nickname) {
        error = '모든 필드를 입력해주세요.';
        return;
      }
  
      if (password !== confirmPassword) {
        error = '비밀번호가 일치하지 않습니다.';
        return;
      }
  
      // 여기에 회원가입 처리 로직 구현
      console.log('회원가입 시도:', { email, password, nickname });
      // 실제 회원가입 로직은 추후 구현
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
        
        <div class="form-group">
          <label for="email">이메일</label>
          <input
            type="email"
            id="email"
            bind:value={email}
            placeholder="example@mail.com"
            required
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
          />
        </div>
        
        <button type="submit" class="submit-button">회원가입</button>
        
        <div class="auth-links">
          <a href="/login">이미 계정이 있으신가요? 로그인</a>
        </div>
        
        <div class="social-login">
          <p>또는</p>
          <button type="button" class="google-button">
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
      color: var(--error-color);
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
    }
    
    .auth-links {
      margin: 1.5rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .auth-links a {
      color: var(--dark-gray);
      font-size: 0.9rem;
      text-align: center;
    }
    
    .auth-links a:hover {
      color: var(--primary-color);
    }
    
    .social-login {
      margin-top: 1rem;
      text-align: center;
    }
    
    .social-login p {
      color: var(--dark-gray);
      margin-bottom: 1rem;
      position: relative;
    }
    
    .social-login p::before,
    .social-login p::after {
      content: "";
      position: absolute;
      width: 40%;
      height: 1px;
      background-color: var(--medium-gray);
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
      color: var(--text-color);
      border: 1px solid var(--medium-gray);
      width: 100%;
    }
    
    .google-button:hover {
      background-color: var(--light-gray);
    }
  </style>