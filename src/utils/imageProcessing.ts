import { BackgroundConfig } from '../types';

/**
 * Intelligent client-side fallback segmentation when WASM/ONNX model is loading or in offline mode
 */
async function fallbackSegmentation(image: HTMLImageElement): Promise<string> {
  const canvas = document.createElement('canvas');
  const w = image.naturalWidth || image.width;
  const h = image.naturalHeight || image.height;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  ctx.drawImage(image, 0, 0, w, h);
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // Sample corner border regions to detect background color profile
  const samplePoints = [
    { x: 5, y: 5 },
    { x: Math.floor(w / 2), y: 5 },
    { x: w - 5, y: 5 },
    { x: 5, y: Math.floor(h / 2) },
    { x: w - 5, y: Math.floor(h / 2) },
    { x: 5, y: h - 5 },
    { x: w - 5, y: h - 5 },
  ];

  const bgColors: [number, number, number][] = [];
  for (const pt of samplePoints) {
    const idx = (pt.y * w + pt.x) * 4;
    bgColors.push([data[idx], data[idx + 1], data[idx + 2]]);
  }

  // Calculate center of image coordinates
  const cx = w / 2;
  const cy = h / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Minimum color distance to any sampled background point
      let minColorDist = 999999;
      for (const [br, bg, bb] of bgColors) {
        const dist = Math.hypot(r - br, g - bg, b - bb);
        if (dist < minColorDist) minColorDist = dist;
      }

      // Distance from center factor (subjects are usually centered)
      const distFromCenter = Math.hypot(x - cx, y - cy) / maxDist;
      const centerBias = Math.max(0, 1 - distFromCenter * 1.3);

      // Contrast / Edge metric
      const edgeConfidence = (minColorDist / 120) * (0.6 + centerBias * 0.4);

      if (edgeConfidence < 0.25) {
        data[idx + 3] = 0; // Transparent
      } else if (edgeConfidence < 0.5) {
        data[idx + 3] = Math.floor(255 * ((edgeConfidence - 0.25) / 0.25));
      }
      // Else keep full alpha
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}

/**
 * Remove background with AI model, falling back gracefully if needed
 */
export async function removeBackgroundAI(
  imageUrl: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  onProgress?.(20);

  try {
    // Dynamically import @imgly/background-removal
    const imgly = await import('@imgly/background-removal');
    onProgress?.(45);

    const blob = await imgly.removeBackground(imageUrl, {
      progress: (_key: string, current: number, total: number) => {
        if (total > 0) {
          const ratio = Math.min(1, current / total);
          onProgress?.(45 + Math.floor(ratio * 50));
        }
      },
    });

    onProgress?.(100);
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn('AI Model initial run failed, switching to high-speed canvas engine:', err);
    onProgress?.(70);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image for processing'));
      img.src = imageUrl;
    });

    onProgress?.(90);
    const resultUrl = await fallbackSegmentation(img);
    onProgress?.(100);
    return resultUrl;
  }
}

/**
 * Composites the cutout with the selected background style & drop shadow
 */
export async function compositeImage(
  cutoutUrl: string,
  originalUrl: string,
  config: BackgroundConfig,
  targetWidth: number,
  targetHeight: number
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');

  ctx.clearRect(0, 0, targetWidth, targetHeight);

  // 1. Draw Background
  if (config.type === 'solid') {
    ctx.fillStyle = config.color;
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  } else if (config.type === 'gradient') {
    const gradient = ctx.createLinearGradient(0, 0, targetWidth, targetHeight);
    if (config.gradient.includes('blue')) {
      gradient.addColorStop(0, '#2563eb');
      gradient.addColorStop(1, '#60a5fa');
    } else if (config.gradient.includes('purple')) {
      gradient.addColorStop(0, '#7c3aed');
      gradient.addColorStop(1, '#ec4899');
    } else if (config.gradient.includes('sunset')) {
      gradient.addColorStop(0, '#f97316');
      gradient.addColorStop(1, '#f43f5e');
    } else if (config.gradient.includes('emerald')) {
      gradient.addColorStop(0, '#059669');
      gradient.addColorStop(1, '#10b981');
    } else {
      gradient.addColorStop(0, '#334155');
      gradient.addColorStop(1, '#0f172a');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  } else if (config.type === 'blur') {
    const origImg = await loadImage(originalUrl);
    ctx.save();
    ctx.filter = `blur(${config.blurAmount}px)`;
    ctx.drawImage(origImg, -20, -20, targetWidth + 40, targetHeight + 40);
    ctx.restore();
  } else if (config.type === 'image' && config.imageUrl) {
    const bgImg = await loadImage(config.imageUrl);
    ctx.drawImage(bgImg, 0, 0, targetWidth, targetHeight);
  }

  // 2. Draw Subject with optional drop shadow
  const cutoutImg = await loadImage(cutoutUrl);
  ctx.save();
  if (config.shadowEnabled) {
    ctx.shadowColor = `rgba(0, 0, 0, ${config.shadowOpacity})`;
    ctx.shadowBlur = config.shadowBlur;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = config.shadowOffsetY;
  }
  ctx.drawImage(cutoutImg, 0, 0, targetWidth, targetHeight);
  ctx.restore();

  return canvas;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}
