// MongoDB 데이터베이스 초기화 스크립트

// 1. momentmail 데이터베이스 사용자 생성
db.createUser({
  user: "momuser",
  pwd: "mompwd",
  roles: [
    { role: "readWrite", db: "momentmail" },
    { role: "dbAdmin", db: "momentmail" }
  ]
});

// 2. momentmail 데이터베이스 사용
db = db.getSiblingDB("momentmail");

// 3. 필요한 컬렉션 생성
db.createCollection("users");
db.createCollection("letters");
db.createCollection("notifications");
db.createCollection("templates");
db.createCollection("stickers");

// 4. 인덱스 생성
// 사용자 검색을 위한 인덱스
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ "profile.nickname": 1 });
db.users.createIndex({ "profile.friend_code": 1 }, { unique: true });

// 편지 검색을 위한 인덱스
db.letters.createIndex({ sender_id: 1 });
db.letters.createIndex({ recipient_id: 1 });
db.letters.createIndex({ created_at: 1 });
db.letters.createIndex({ scheduled_delivery_time: 1 });
db.letters.createIndex({ status: 1 });

// 알림을 위한 인덱스
db.notifications.createIndex({ user_id: 1 });
db.notifications.createIndex({ created_at: 1 });
db.notifications.createIndex({ is_delivered: 1 });

// 5. 시스템 관리자 계정 추가 (필요시 주석 해제 후 사용)
/*
db.users.insertOne({
  email: "admin@momentmail.com",
  password_hash: "$2b$10$DUMMY_HASH_REPLACE_WITH_REAL_HASH",  // 실제 사용 시 bcrypt로 생성된 해시로 대체
  auth_provider: "email",
  is_admin: true,
  created_at: new Date(),
  last_login: null,
  is_active: true,
  profile: {
    nickname: "시스템 관리자",
    profile_image_url: "",
    status_message: "MomentMail 시스템 관리자입니다",
    friend_code: "ADMIN001",
    updated_at: new Date()
  },
  settings: {
    notification_preferences: { email: true, web: true },
    privacy_settings: { visibility: "private" },
    theme_preference: "light"
  }
});
*/

// 6. 샘플 편지지 템플릿 추가
db.templates.insertMany([
  {
    id: "template001",
    name: "기본 템플릿",
    category: "basic",
    background_color: "#ffffff",
    pattern: "none",
    border: "solid",
    is_default: true,
    preview_url: "/templates/basic.png"
  },
  {
    id: "template002",
    name: "따뜻한 봄",
    category: "season",
    background_color: "#f8ffe6",
    pattern: "spring",
    border: "dashed",
    is_default: false,
    preview_url: "/templates/spring.png"
  },
  {
    id: "template003",
    name: "별이 빛나는 밤",
    category: "special",
    background_color: "#000030",
    pattern: "stars",
    border: "dotted",
    is_default: false,
    preview_url: "/templates/stars.png"
  }
]);

// 7. 샘플 스티커 데이터 추가
db.stickers.insertMany([
  {
    id: "sticker001",
    name: "하트",
    category: "emotion",
    url: "/stickers/heart.png",
    width: 48,
    height: 48
  },
  {
    id: "sticker002",
    name: "별",
    category: "basic",
    url: "/stickers/star.png",
    width: 48,
    height: 48
  },
  {
    id: "sticker003",
    name: "꽃",
    category: "nature",
    url: "/stickers/flower.png",
    width: 48,
    height: 48
  }
]);

print("MongoDB 초기화 완료: momentmail 데이터베이스 및 컬렉션 설정됨");
