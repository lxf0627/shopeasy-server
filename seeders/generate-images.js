/**
 * Generate realistic product SVG images
 * Each product gets 1-6 images with product-like styling
 */
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../../client/public/images/products');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Product image configs
const products = [
  // 手机数码
  { slug: 'iphone15promax', name: 'iPhone 15 Pro Max', brand: 'Apple', color: '#1a1a2e', accent: '#4361ee', count: 6 },
  { slug: 'galaxys24ultra', name: 'Galaxy S24 Ultra', brand: 'Samsung', color: '#1b1b2f', accent: '#6c63ff', count: 6 },
  { slug: 'airpodspro2', name: 'AirPods Pro 2', brand: 'Apple', color: '#f5f5f7', accent: '#1d1d1f', count: 6 },
  { slug: 'huaweimate60', name: 'HUAWEI Mate 60 Pro', brand: 'HUAWEI', color: '#0f0f0f', accent: '#cf0a2c', count: 6 },
  { slug: 'xiaomi14ultra', name: 'Xiaomi 14 Ultra', brand: 'Xiaomi', color: '#1a1a1a', accent: '#ff6900', count: 6 },

  // 电脑办公
  { slug: 'macbookpro14', name: 'MacBook Pro 14"', brand: 'Apple', color: '#2d2d2d', accent: '#a3a3a3', count: 6 },
  { slug: 'thinkpadx1', name: 'ThinkPad X1 Carbon', brand: 'Lenovo', color: '#1a1a1a', accent: '#e2231a', count: 6 },
  { slug: 'ipadair', name: 'iPad Air', brand: 'Apple', color: '#f5f5f7', accent: '#1d1d1f', count: 6 },
  { slug: 'dellxps15', name: 'Dell XPS 15', brand: 'Dell', color: '#1a1a2e', accent: '#007db8', count: 6 },
  { slug: 'logitechmx3s', name: 'MX Master 3S', brand: 'Logitech', color: '#2d2d2d', accent: '#00b4d8', count: 4 },

  // 家用电器
  { slug: 'dysonv15', name: 'Dyson V15 Detect', brand: 'Dyson', color: '#6a0dad', accent: '#f72585', count: 6 },
  { slug: 'mitv65', name: '小米电视 65"', brand: 'Xiaomi', color: '#1a1a1a', accent: '#ff6900', count: 6 },
  { slug: 'haidishao', name: '海底捞自热火锅', brand: '海底捞', color: '#d32f2f', accent: '#ffcdd2', count: 4 },
  { slug: 'philipsairfryer', name: '飞利浦空气炸锅', brand: 'Philips', color: '#1a1a1a', accent: '#0b5ed7', count: 5 },

  // 服装鞋包
  { slug: 'nikeairmax270', name: 'Nike Air Max 270', brand: 'Nike', color: '#1a1a1a', accent: '#f97316', count: 6 },
  { slug: 'uniqudown', name: '优衣库轻薄羽绒服', brand: 'UNIQLO', color: '#1a365d', accent: '#e53e3e', count: 6 },
  { slug: 'adidasultrab', name: 'Adidas Ultraboost', brand: 'Adidas', color: '#1a1a1a', accent: '#2563eb', count: 5 },
  { slug: 'levis501', name: "Levi's 501 牛仔裤", brand: "Levi's", color: '#1e3a5f', accent: '#dc2626', count: 5 },

  // 食品饮料
  { slug: 'nutsbox', name: '三只松鼠坚果礼盒', brand: '三只松鼠', color: '#e65100', accent: '#fff3e0', count: 6 },
  { slug: 'nongfu', name: '农夫山泉 24瓶', brand: '农夫山泉', color: '#1565c0', accent: '#e53935', count: 4 },
  { slug: 'yunnanbaiyao', name: '云南白药牙膏套装', brand: '云南白药', color: '#1a1a1a', accent: '#d32f2f', count: 4 },
  { slug: 'mengniu', name: '蒙牛纯牛奶 250ml×24', brand: '蒙牛', color: '#1565c0', accent: '#ffffff', count: 4 },

  // 图书文具
  { slug: 'jsbook', name: 'JavaScript高级程序设计', brand: '人民邮电出版社', color: '#b71c1c', accent: '#ffcdd2', count: 6 },
  { slug: 'deliset', name: '得力文具套装12件', brand: '得力', color: '#00695c', accent: '#b2dfdb', count: 5 },
  { slug: 'cleancode', name: 'Clean Code 代码整洁之道', brand: '人民邮电出版社', color: '#1a237e', accent: '#c5cae9', count: 4 },
  { slug: 'muji_notebook', name: 'MUJI 无印良品笔记本', brand: 'MUJI', color: '#f5f5f5', accent: '#424242', count: 4 },
];

const labels = ['正面', '背面', '侧面', '细节', '使用场景', '包装'];

function genImage(slug, name, brand, color, accent, idx, label) {
  const isLightBg = color === '#f5f5f7' || color === '#f5f5f5' || color === '#fff3e0' || color === '#b2dfdb' || color === '#c5cae9' || color === '#ffcdd2';
  const textColor = isLightBg ? '#1a1a1a' : '#ffffff';
  const subColor = isLightBg ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.6)';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:${accent};stop-opacity:0.8"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="40%">
      <stop offset="0%" style="stop-color:${accent};stop-opacity:0.3"/>
      <stop offset="100%" style="stop-color:${color};stop-opacity:0"/>
    </radialGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.3)"/>
    </filter>
  </defs>
  <rect width="800" height="800" fill="url(#bg)" rx="16"/>
  <rect width="800" height="800" fill="url(#glow)" rx="16"/>
  <!-- Product area -->
  <rect x="150" y="180" width="500" height="400" rx="20" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
  <!-- Brand -->
  <text x="400" y="340" text-anchor="middle" fill="${textColor}" font-size="36" font-family="Arial,sans-serif" font-weight="700" letter-spacing="4">${brand}</text>
  <!-- Product name -->
  <text x="400" y="395" text-anchor="middle" fill="${subColor}" font-size="22" font-family="Arial,sans-serif" font-weight="400">${name}</text>
  <!-- Label badge -->
  <rect x="340" y="520" width="120" height="36" rx="18" fill="rgba(255,255,255,0.15)"/>
  <text x="400" y="544" text-anchor="middle" fill="${textColor}" font-size="15" font-family="Arial,sans-serif" opacity="0.8">${label}</text>
  <!-- Image number -->
  <circle cx="720" cy="60" r="22" fill="rgba(255,255,255,0.12)"/>
  <text x="720" y="66" text-anchor="middle" fill="${textColor}" font-size="14" font-family="Arial,sans-serif" opacity="0.6">${idx + 1}/${products.find(p=>p.slug===slug)?.count || 6}</text>
  <!-- Bottom line -->
  <rect x="300" y="650" width="200" height="2" rx="1" fill="rgba(255,255,255,0.15)"/>
  <text x="400" y="690" text-anchor="middle" fill="${subColor}" font-size="13" font-family="Arial,sans-serif" letter-spacing="2">SHOP EASY</text>
</svg>`;
}

let total = 0;
for (const p of products) {
  for (let i = 0; i < p.count; i++) {
    const label = labels[i] || `图${i + 1}`;
    const svg = genImage(p.slug, p.name, p.brand, p.color, p.accent, i, label);
    const filename = i === 0 ? `${p.slug}.svg` : `${p.slug}-${i + 1}.svg`;
    fs.writeFileSync(path.join(outDir, filename), svg);
    total++;
  }
}

console.log(`Generated ${total} product images in ${outDir}`);
