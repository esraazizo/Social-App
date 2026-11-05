export type NotificationType = 'like_post' | 'comment_post' | 'reply_comment' | 'follow_user';
export type NotificationEntityType = 'post' | 'comment' | 'user';

export interface NotificationUser {
  _id: string;
  name: string;
  photo: string;
}

export interface NotificationEntity {
  _id: string;
  unavailable?: boolean;
  content?: string;
}

export interface NotificationInterface {
  _id: string;
  recipient: NotificationUser;
  actor: NotificationUser;
  type: NotificationType;
  entityType: NotificationEntityType;
  entityId: string;
  isRead: boolean;
  createdAt: string; 
  entity: NotificationEntity;
}
