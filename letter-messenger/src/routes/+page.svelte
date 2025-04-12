<script lang="ts">
    // 로그인 상태에 따라 다른 내용을 보여주기 위한 예시 변수
    let isLoggedIn = false;
  </script>
  
  <svelte:head>
    <title>편지 메신저 - 따뜻한 디지털 편지</title>
  </svelte:head>
  
  <section class="hero">
    <div class="hero-content">
      <h1>아날로그 감성의 <br />디지털 편지 서비스</h1>
      <p>소중한 마음을 담아 특별한 순간에 전달하세요</p>
      
      {#if isLoggedIn}
        <div class="cta-buttons">
          <a href="/write" class="cta-button primary">편지 쓰기</a>
          <a href="/inbox" class="cta-button secondary">받은 편지함</a>
        </div>
      {:else}
        <div class="cta-buttons">
          <a href="/login" class="cta-button primary">로그인</a>
          <a href="/register" class="cta-button secondary">회원가입</a>
        </div>
      {/if}
    </div>
    <div class="hero-image">
      <div class="letter-image"></div>
    </div>
  </section>
  
  <section class="features">
    <h2>편지 메신저의 특별한 기능</h2>
    
    <div class="feature-grid">
      <div class="feature-card">
        <div class="feature-icon">✉️</div>
        <h3>다양한 편지지</h3>
        <p>여러 디자인의 편지지와 스티커로 개성 있는 편지를 작성하세요.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">🕒</div>
        <h3>예약 발송</h3>
        <p>특별한 날에 맞춰 편지가 도착하도록 예약 발송할 수 있습니다.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">🖼️</div>
        <h3>사진 첨부</h3>
        <p>소중한 추억이 담긴 사진 한 장을 편지에 첨부할 수 있습니다.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">🔔</div>
        <h3>실시간 알림</h3>
        <p>새로운 편지가 도착하면 실시간으로 알려드립니다.</p>
      </div>
    </div>
  </section>
  
  <style>
    .hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 2rem 0 4rem 0;
    }
    
    .hero-content {
      flex: 1;
    }
    
    .hero h1 {
      font-size: 2.5rem;
      line-height: 1.2;
      margin-bottom: 1rem;
      color: var(--text-color);
    }
    
    .hero p {
      font-size: 1.2rem;
      color: var(--dark-gray);
      margin-bottom: 2rem;
    }
    
    .cta-buttons {
      display: flex;
      gap: 1rem;
    }
    
    .cta-button {
      padding: 0.75rem 1.5rem;
      border-radius: var(--border-radius);
      font-weight: 600;
      text-align: center;
      transition: all 0.2s;
    }
    
    .cta-button.primary {
      background-color: var(--primary-color);
      color: white;
    }
    
    .cta-button.primary:hover {
      background-color: var(--secondary-color);
    }
    
    .cta-button.secondary {
      background-color: white;
      color: var(--primary-color);
      border: 1px solid var(--primary-color);
    }
    
    .cta-button.secondary:hover {
      background-color: var(--light-gray);
    }
    
    .hero-image {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .letter-image {
      width: 300px;
      height: 300px;
      background-color: #f1f3f5;
      border-radius: 8px;
      position: relative;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .letter-image::before {
      content: "";
      position: absolute;
      width: 250px;
      height: 150px;
      background-color: white;
      top: 75px;
      left: 25px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }
    
    .letter-image::after {
      content: "";
      position: absolute;
      width: 200px;
      height: 10px;
      background-color: var(--medium-gray);
      top: 100px;
      left: 50px;
      border-radius: 5px;
      box-shadow: 0 30px 0 var(--medium-gray), 0 60px 0 var(--medium-gray);
    }
    
    .features {
      padding: 2rem 0;
    }
    
    .features h2 {
      text-align: center;
      margin-bottom: 3rem;
      font-size: 2rem;
      color: var(--text-color);
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }
    
    .feature-card {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s;
      text-align: center;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
    }
    
    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .feature-card h3 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }
    
    .feature-card p {
      color: var(--dark-gray);
      font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
      .hero {
        flex-direction: column;
        text-align: center;
      }
      
      .hero-content {
        margin-bottom: 2rem;
      }
      
      .cta-buttons {
        justify-content: center;
      }
    }
  </style>