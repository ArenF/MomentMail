<script lang="ts">
    import '../app.css';
  </script>
  
  <div class="app">
    <header>
      <div class="logo">
        <h1>편지 메신저</h1>
      </div>
      <nav>
        <ul>
          <li><a href="/">홈</a></li>
          <li><a href="/write">편지쓰기</a></li>
          <li><a href="/inbox">받은편지함</a></li>
          <li><a href="/profile">프로필</a></li>
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
  
    nav ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 1.5rem;
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