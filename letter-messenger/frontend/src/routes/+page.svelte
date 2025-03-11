<script>
  import { onMount } from 'svelte';
  
  let backendStatus = '연결 확인 중...';
  
  onMount(async () => {
    try {
      const response = await fetch('http://localhost:3000/');
      const data = await response.text();
      backendStatus = `백엔드 연결 성공: ${data}`;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      backendStatus = `백엔드 연결 실패: ${errorMsg}`;
    }
  });
</script>

<main>
  <h1>편지형 메신저 웹사이트</h1>
  <p>GitHub Codespace에서 개발 환경 테스트 중</p>
  <div class="status-box">
    <p>{backendStatus}</p>
  </div>
</main>

<style>
  main {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  h1 {
    color: #4f46e5;
  }
  
  .status-box {
    margin-top: 2rem;
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: #f3f4f6;
    border: 1px solid #e5e7eb;
  }
</style>