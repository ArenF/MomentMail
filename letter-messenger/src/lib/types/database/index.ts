/**
 * MongoDB 데이터베이스 스키마 타입 정의
 * 
 * 명세서에 정의된 MongoDB 스키마에 맞춘 TypeScript 인터페이스
 */

import { ObjectId } from 'mongodb';

/**
 * 사용자 문서 스키마
 */
export interface UserDocument {
  _id?: ObjectId;
  email: string;
  password_hash: string;
  auth_provider: 'email' | 'google';
  auth_provider_id?: string;
  is_admin: boolean;
  created_at: Date;
  last_login?: Date;
  is_active: boolean;
  profile: {
    nickname: string;
    profile_image_url?: string;
    status_message?: string;
    friend_code: string;
    updated_at: Date;
  };
  settings: {
    notification_preferences: {
      email?: boolean;
      web?: boolean;
    };
    privacy_settings: {
      visibility?: 'public' | 'friends' | 'private';
    };
    theme_preference?: 'light' | 'dark' | 'system';
  };
}

/**
 * 편지 문서 스키마
 */
export interface LetterDocument {
  _id?: ObjectId;
  sender_id: ObjectId;
  recipient_id: ObjectId;
  subject: string;
  content: {
    text: string;
    font_family: string;
    font_size: number;
    color: string;
    alignment: 'left' | 'center' | 'right' | 'justify';
    is_bold: boolean;
    is_italic: boolean;
  };
  template: {
    id: string;
    background_color: string;
    pattern: string;
    border: string;
  };
  stickers?: Array<{
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    z_index: number;
  }>;
  photo?: {
    url: string;
    x: number;
    y: number;
    width: number;
    height: number;
    frame_type: string;
    filter?: string;
  };
  created_at: Date;
  scheduled_delivery_time?: Date;
  delivered_at?: Date;
  is_read: boolean;
  status: 'draft' | 'scheduled' | 'sent' | 'delivered';
}

/**
 * 알림 문서 스키마
 */
export interface NotificationDocument {
  _id?: ObjectId;
  user_id: ObjectId;
  notification_type: 'letter_received' | 'friend_request' | 'system';
  notification_data: any; // 알림 유형에 따라 다양한 데이터 포함
  created_at: Date;
  is_delivered: boolean;
  delivered_at?: Date;
}

/**
 * 편지지 템플릿 문서 스키마
 */
export interface TemplateDocument {
  _id?: ObjectId;
  id: string;
  name: string;
  category: string;
  background_color: string;
  pattern: string;
  border: string;
  is_default: boolean;
  preview_url: string;
}

/**
 * 스티커 문서 스키마
 */
export interface StickerDocument {
  _id?: ObjectId;
  id: string;
  name: string;
  category: string;
  url: string;
  width: number;
  height: number;
}
