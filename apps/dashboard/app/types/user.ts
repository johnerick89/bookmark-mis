export interface User {
  id: string;
  email: string;
  name?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  _count?: {
    bookmarks?: number;
  };
}

export type UserProfile = User;
