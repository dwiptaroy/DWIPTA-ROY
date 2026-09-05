import { SampleImage } from '../types';

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'portrait',
    nameEn: 'Model Portrait',
    nameBn: 'পোর্ট্রেট ছবি',
    category: 'portrait',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'product',
    nameEn: 'Nike Sneaker',
    nameBn: 'জুতো / প্রোডাক্ট',
    category: 'product',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'pet',
    nameEn: 'Golden Retriever',
    nameBn: 'পোষা কুকুর',
    category: 'pet',
    thumbnailUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'car',
    nameEn: 'Sports Car',
    nameBn: 'স্পোর্টস কার',
    category: 'car',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  },
];

export const PRESET_COLORS = [
  { label: 'Pure White (Amazon/Shopify)', value: '#FFFFFF', border: true },
  { label: 'Studio Off-White', value: '#F3F4F6' },
  { label: 'Soft Slate', value: '#E2E8F0' },
  { label: 'Neutral Gray', value: '#9CA3AF' },
  { label: 'Charcoal Dark', value: '#1F2937' },
  { label: 'Pitch Black', value: '#0A0A0A' },
  { label: 'Passport Studio Blue', value: '#0284C7' },
  { label: 'Royal Navy', value: '#1E3A8A' },
  { label: 'Emerald Studio', value: '#059669' },
  { label: 'Crimson Red', value: '#DC2626' },
  { label: 'Pastel Warm Peach', value: '#FED7AA' },
  { label: 'Pastel Lavender', value: '#E9D5FF' },
  { label: 'Pastel Mint', value: '#CCFBF1' },
  { label: 'Golden Honey', value: '#FDE68A' },
];

export const PRESET_GRADIENTS = [
  { label: 'Studio Soft Light', value: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
  { label: 'Sunset Horizon', value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)' },
  { label: 'Modern Slate', value: 'linear-gradient(135deg, #334155 0%, #0f172a 100%)' },
  { label: 'Warm Peach Glow', value: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' },
  { label: 'Ocean Breeze', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { label: 'Aura Violet', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { label: 'Fresh Citrus', value: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
  { label: 'Cyber Dark Mesh', value: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)' },
];

export const PRESET_BACKGROUND_IMAGES = [
  {
    id: 'studio',
    label: 'Clean Photo Studio',
    url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80',
    thumb: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=200&q=70',
  },
  {
    id: 'office',
    label: 'Modern Work Office',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    thumb: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=70',
  },
  {
    id: 'cafe',
    label: 'Cozy Cafe Interior',
    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80',
    thumb: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=200&q=70',
  },
  {
    id: 'nature',
    label: 'Lush Botanical Garden',
    url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80',
    thumb: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=200&q=70',
  },
  {
    id: 'city',
    label: 'Blurred City Sunset',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80',
    thumb: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=200&q=70',
  },
  {
    id: 'wood',
    label: 'Wood Tabletop Surface',
    url: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1000&q=80',
    thumb: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=200&q=70',
  },
];
