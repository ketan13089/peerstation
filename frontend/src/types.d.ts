// src/types.d.ts

export interface User {
  id: string;
  name: string;
  email: string;
  stars: number;
  level?: string; // Added level field
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  upvotes: number;
  replies: Comment[];
  canEdit?: boolean; // Indicates if the current user can edit this comment
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  upvotes: number;
  comments: Comment[];
  canEdit?: boolean; // Indicates if the current user can edit this thread
}

export interface ThreadListResponse {
  threads: Thread[];
  total: number;
  page: number;
  limit: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  stars: number;
  level: string;
}
