
export interface WeddingPhoto {
  id: string;
  url: string;
  type: 'image' | 'video';
  author: string;
  dedication: string;
  timestamp: number;
}

export interface WeddingConfig {
  coupleNames: string;
  date: string;
  venue: string;
  coverImage: string;
}

export enum ViewMode {
  HOME = 'HOME',
  GALLERY = 'GALLERY',
  UPLOAD = 'UPLOAD'
}
