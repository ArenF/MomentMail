<!--
  프로필 카드 컴포넌트
  
  명함 스타일의 SVG 기반 프로필 카드를 렌더링합니다.
  프로필 이미지, 이름, 상태 메시지 및 통계 정보를 표시합니다.
-->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { ProfileData } from '$lib/types/profile';
  
  // 프로필 데이터 props
  export let profileData: ProfileData;
  export let editable = true; // 편집 버튼 표시 여부
  
  // SVG 뷰박스 크기
  let width = 480;
  let height = 250;
  
  // 사용자 핸들 생성 (@ + 닉네임 소문자)
  $: userHandle = '@' + profileData.nickname.toLowerCase().replace(/\s/g, '_');
  
  // 카드 요소에 대한 애니메이션 효과
  let isHovered = false;
  
  // 이벤트 디스패처 생성
  const dispatch = createEventDispatcher<{
    edit: void;
    copyFriendCode: string;
  }>();
  
  // 마우스 이벤트 핸들러
  function handleMouseEnter() {
    isHovered = true;
  }
  
  function handleMouseLeave() {
    isHovered = false;
  }
  
  // 친구 코드 복사 핸들러
  function copyFriendCode() {
    dispatch('copyFriendCode', profileData.friendCode);
  }
  
  // 편집 버튼 클릭 핸들러
  function handleEdit() {
    dispatch('edit');
  }
</script>

<div 
  class="profile-card-container"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  role="presentation"
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" class:hovered={isHovered}>
    <!-- 카드 배경 정의 -->
    <defs>
      <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f8f9fa" />
        <stop offset="100%" stop-color="#e9ecef" />
      </linearGradient>
      <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.2" />
      </filter>
      <clipPath id="profileClip">
        <circle cx="90" cy="85" r="50" />
      </clipPath>
      <linearGradient id="statsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#339af0" />
        <stop offset="100%" stop-color="#74c0fc" />
      </linearGradient>
    </defs>
    
    <!-- 메인 카드 배경 -->
    <rect x="10" y="10" width="460" height="230" rx="15" ry="15" 
          fill="url(#cardGradient)" filter="url(#cardShadow)" class="card-bg" />
    
    <!-- 디자인 요소 - 상단 패턴 -->
    <path d="M10,25 Q60,5 110,25 T210,25 T310,25 T410,25 T470,25 V10 H10 Z" fill="#748ffc" opacity="0.7" />
    
    <!-- 프로필 이미지 영역 -->
    <circle cx="90" cy="85" r="52" fill="#fff" stroke="#dee2e6" stroke-width="2" />
    <image 
      href={profileData.profileImageUrl || '/images/default-profile.png'} 
      x="40" y="35" width="100" height="100" 
      clip-path="url(#profileClip)"
      class="profile-image"
    />
    
    <!-- 사용자 이름 -->
    <text x="170" y="70" font-size="24" font-weight="bold" fill="#343a40" class="profile-name">{profileData.nickname}</text>
    <text x="170" y="95" font-size="14" fill="#6c757d">{userHandle}</text>
    
    <!-- 상태 메시지 -->
    <text x="170" y="120" font-size="14" fill="#495057" font-style="italic" class="status-message">"{profileData.statusMessage || '편지로 마음을 전해요'}"</text>
    
    <!-- 구분선 -->
    <line x1="30" y1="150" x2="450" y2="150" stroke="#dee2e6" stroke-width="1.5" />
    
    <!-- 통계 박스들 -->
    <g transform="translate(30, 180)">
      <!-- 받은 편지 -->
      <rect x="0" y="-20" width="130" height="60" rx="8" ry="8" fill="#f1f3f5" stroke="#e9ecef" stroke-width="1" class="stat-box stat-received" />
      <text x="65" y="0" font-size="12" fill="#6c757d" text-anchor="middle">받은 편지</text>
      <text x="65" y="25" font-size="20" font-weight="bold" fill="#343a40" text-anchor="middle">{profileData.stats.receivedLetters}</text>
      
      <!-- 보낸 편지 -->
      <rect x="145" y="-20" width="130" height="60" rx="8" ry="8" fill="#f1f3f5" stroke="#e9ecef" stroke-width="1" class="stat-box stat-sent" />
      <text x="210" y="0" font-size="12" fill="#6c757d" text-anchor="middle">보낸 편지</text>
      <text x="210" y="25" font-size="20" font-weight="bold" fill="#343a40" text-anchor="middle">{profileData.stats.sentLetters}</text>
      
      <!-- 총합 -->
      <rect x="290" y="-20" width="130" height="60" rx="8" ry="8" fill="url(#statsGradient)" stroke="#e9ecef" stroke-width="1" class="stat-box stat-total" />
      <text x="355" y="0" font-size="12" fill="#fff" text-anchor="middle">총 편지</text>
      <text x="355" y="25" font-size="20" font-weight="bold" fill="#fff" text-anchor="middle">{profileData.stats.totalLetters}</text>
    </g>
    
    <!-- 장식 요소 - 편지 아이콘 -->
    <g transform="translate(425, 40)" class="mail-icon">
      <rect x="0" y="0" width="25" height="20" fill="#748ffc" rx="2" ry="2" />
      <path d="M0,0 L12.5,10 L25,0" fill="none" stroke="#fff" stroke-width="1.5" />
    </g>
    
    <!-- 친구 코드 표시 -->
    <g transform="translate(425, 75)" class="friend-code" on:click={copyFriendCode} on:keydown={(e) => e.key === 'Enter' && copyFriendCode()} role="button" tabindex="0">
      <text x="0" y="0" font-size="10" fill="#adb5bd" text-anchor="end">친구 코드</text>
      <text x="0" y="15" font-size="12" font-weight="bold" fill="#495057" text-anchor="end" class="code-text">{profileData.friendCode}</text>
    </g>
  </svg>
  
  <!-- 편집 버튼 (조건부 렌더링) -->
  {#if editable}
    <button class="edit-button" class:visible={isHovered} on:click={handleEdit}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
      편집하기
    </button>
  {/if}
</div>

<style>
  .profile-card-container {
    position: relative;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    font-family: 'Noto Sans KR', sans-serif;
  }
  
  svg {
    width: 100%;
    height: auto;
    transition: transform 0.3s ease;
  }
  
  svg.hovered {
    transform: translateY(-5px);
  }
  
  .card-bg {
    transition: fill 0.3s ease;
  }
  
  .profile-image {
    transition: transform 0.3s ease;
  }
  
  svg.hovered .profile-image {
    transform: scale(1.05);
  }
  
  .stat-box {
    transition: transform 0.3s ease, fill 0.3s ease;
  }
  
  svg.hovered .stat-box {
    transform: translateY(-3px);
  }
  
  svg.hovered .stat-received {
    transition-delay: 0.05s;
  }
  
  svg.hovered .stat-sent {
    transition-delay: 0.1s;
  }
  
  svg.hovered .stat-total {
    transition-delay: 0.15s;
  }
  
  .mail-icon {
    transition: transform 0.3s ease;
  }
  
  svg.hovered .mail-icon {
    transform: rotate(5deg);
  }
  
  .friend-code {
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  
  .friend-code:hover .code-text {
    fill: #339af0;
  }
  
  .friend-code:active {
    transform: scale(0.98);
  }
  
  .profile-name, .status-message {
    transition: fill 0.3s ease;
  }
  
  .edit-button {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: #748ffc;
    color: white;
    padding: 8px 12px;
    border-radius: 20px;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    border: none;
    cursor: pointer;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s ease, transform 0.3s ease, background-color 0.2s ease;
  }
  
  .edit-button.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .edit-button:hover {
    background-color: #5c7cfa;
  }
  
  .edit-button:active {
    transform: translateY(1px);
  }
</style>
