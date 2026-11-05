export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  author?: string;
  type: 'script' | 'style' | 'hybrid';
  script_content?: string;
  style_content?: string;
  script_path?: string;
  style_path?: string;
  manifest_content?: string;
  isBuiltIn?: boolean;
}

export interface SponsorSegment {
  start: number; // in seconds
  end: number;
  category: 'sponsor' | 'intro' | 'outro' | 'selfpromo' | 'interaction';
  description: string;
}

export interface VideoItem {
  id: string;
  title: string;
  uploaderName: string;
  uploaderAvatar: string;
  uploaderVerified: boolean;
  views: number;
  uploadedDate: string;
  duration: number; // in seconds
  thumbnail: string;
  description: string;
  likes: number;
  dislikes: number;
  category: string;
  videoUrl: string;
  sponsorSegments?: SponsorSegment[];
  tags: string[];
}

export interface PipedInstance {
  name: string;
  url: string;
  api: string;
  ping: number;
  status: 'active' | 'degraded' | 'offline';
  location: string;
}

export interface HotkeyInfo {
  key: string;
  description: string;
  category: 'Воспроизведение' | 'Навигация' | 'Звук' | 'Экран';
}
