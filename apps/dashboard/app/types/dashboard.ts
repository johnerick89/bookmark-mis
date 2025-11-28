export interface Stats {
  totalBookmarks: number;
  totalTags: number;
  recentBookmarks: number;
}

export interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  subtitle?: string;
}
