const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const config = require('../src/config');
const { db, save } = require('../src/models/db');

async function seed() {
  console.log('Seeding database...');

  // Clear all data
  for (const key of Object.keys(db)) {
    db[key] = [];
  }

  // ===== Users =====
  const password = await bcrypt.hash('123456', config.saltRounds);
  db.users = [
    { id: 1, username: 'admin', password, nickname: '管理员', role: 'admin', email: 'admin@shopeasy.com', phone: '13800000000', avatar: '', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, username: 'buyer1', password, nickname: '张三', role: 'user', email: 'zhangsan@test.com', phone: '13800000001', avatar: '', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 3, username: 'buyer2', password, nickname: '李四', role: 'user', email: 'lisi@test.com', phone: '13800000002', avatar: '', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 4, username: 'disabled_user', password, nickname: '已禁用用户', role: 'user', email: '', phone: '', avatar: '', status: 'disabled', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];
  console.log('Users created');

  // ===== Categories =====
  db.categories = [
    { id: 1, name: '手机数码', icon: '📱', sortOrder: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, name: '电脑办公', icon: '💻', sortOrder: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 3, name: '家用电器', icon: '🏠', sortOrder: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 4, name: '服装鞋包', icon: '👕', sortOrder: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 5, name: '食品饮料', icon: '🍜', sortOrder: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 6, name: '图书文具', icon: '📚', sortOrder: 6, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];
  console.log('Categories created');

  // ===== Products =====
  const now = new Date().toISOString();
  function imgs(slug) {
    const dir = path.join(__dirname, '../../client/public/images/products', slug);
    const arr = [];
    // Add main.jpg first
    if (fs.existsSync(path.join(dir, 'main.jpg'))) arr.push(`/images/products/${slug}/main.jpg`);
    // Add numbered images
    for (let i = 2; i <= 6; i++) {
      const f = `${i}.jpg`;
      if (fs.existsSync(path.join(dir, f))) arr.push(`/images/products/${slug}/${f}`);
    }
    // Fallback if no images found
    if (arr.length === 0) arr.push('/images/no-image.svg');
    return JSON.stringify(arr);
  }

  db.products = [
    // 手机数码 (5)
    { id: 1, name: 'iPhone 15 Pro Max', description: '苹果最新旗舰手机，A17 Pro芯片，钛金属边框，48MP主摄像头，USB-C接口', price: 9999, originalPrice: 10999, stock: 100, categoryId: 1, images: imgs('iphone15promax'), salesCount: 2580, rating: 4.8, status: 'on', hasSpec: true, specGroups: JSON.stringify([{ name: '内存', values: ['256GB', '512GB', '1TB'] }, { name: '颜色', values: ['原色钛金属', '蓝色钛金属', '白色钛金属'] }]), createdAt: now, updatedAt: now },
    { id: 2, name: 'Samsung Galaxy S24 Ultra', description: '三星Galaxy AI手机，S Pen内置，2亿像素摄像头，钛金属边框', price: 8999, originalPrice: 9999, stock: 80, categoryId: 1, images: imgs('galaxys24ultra'), salesCount: 1320, rating: 4.7, status: 'on', hasSpec: true, specGroups: JSON.stringify([{ name: '内存', values: ['256GB', '512GB'] }, { name: '颜色', values: ['钛灰色', '钛黑色', '钛紫色'] }]), createdAt: now, updatedAt: now },
    { id: 3, name: 'AirPods Pro 2', description: '主动降噪，自适应透明模式，USB-C充电，个性化空间音频', price: 1799, originalPrice: 1999, stock: 200, categoryId: 1, images: imgs('airpodspro2'), salesCount: 3760, rating: 4.8, status: 'on', hasSpec: false, specGroups: '[]', createdAt: now, updatedAt: now },
    { id: 4, name: 'HUAWEI Mate 60 Pro', description: '华为旗舰手机，麒麟芯片，卫星通信，XMAGE影像系统', price: 6999, originalPrice: 7999, stock: 60, categoryId: 1, images: imgs('huaweimate60'), salesCount: 1890, rating: 4.6, status: 'on', hasSpec: true, specGroups: JSON.stringify([{ name: '内存', values: ['256GB', '512GB'] }, { name: '颜色', values: ['雅川青', '白沙银', '南糯紫'] }]), createdAt: now, updatedAt: now },
    { id: 5, name: 'Xiaomi 14 Ultra', description: '小米影像旗舰，徕卡光学，骁龙8 Gen3，5000mAh电池', price: 5999, originalPrice: 6499, stock: 120, categoryId: 1, images: imgs('xiaomi14ultra'), salesCount: 980, rating: 4.5, status: 'on', hasSpec: false, specGroups: '[]', createdAt: now, updatedAt: now },

    // 电脑办公 (5)
    { id: 6, name: 'MacBook Pro 14英寸', description: 'M3 Pro芯片，18GB内存，512GB固态硬盘，Liquid Retina XDR显示屏', price: 14999, originalPrice: 16999, stock: 50, categoryId: 2, images: imgs('macbookpro14'), salesCount: 1210, rating: 4.9, status: 'on', hasSpec: true, specGroups: JSON.stringify([{ name: '芯片', values: ['M3 Pro', 'M3 Max'] }, { name: '颜色', values: ['深空黑色', '银色'] }]), createdAt: now, updatedAt: now },
    { id: 7, name: 'ThinkPad X1 Carbon', description: '联想商务轻薄本，i7-1365U处理器，16GB内存，2.8K OLED屏', price: 8999, originalPrice: 10999, stock: 60, categoryId: 2, images: imgs('thinkpadx1'), salesCount: 650, rating: 4.6, status: 'on', hasSpec: false, specGroups: '[]', createdAt: now, updatedAt: now },
    { id: 8, name: 'iPad Air', description: 'M1芯片，10.9英寸，256GB，支持Apple Pencil和妙控键盘', price: 5499, originalPrice: 5999, stock: 90, categoryId: 2, images: imgs('ipadair'), salesCount: 1430, rating: 4.7, status: 'on', hasSpec: true, specGroups: JSON.stringify([{ name: '容量', values: ['128GB', '256GB', '512GB'] }, { name: '颜色', values: ['星光色', '紫色', '蓝色'] }]), createdAt: now, updatedAt: now },
    { id: 9, name: 'Dell XPS 15', description: '戴尔旗舰笔记本，i7-13700H，RTX 4060，3.5K OLED触控屏', price: 11999, originalPrice: 13999, stock: 35, categoryId: 2, images: imgs('dellxps15'), salesCount: 320, rating: 4.5, status: 'on', hasSpec: false, specGroups: '[]', createdAt: now, updatedAt: now },
    { id: 10, name: 'Logitech MX Master 3S', description: '罗技旗舰鼠标，电磁滚轮，8K DPI，安静点击，多设备切换', price: 699, originalPrice: 899, stock: 300, categoryId: 2, images: imgs('logitechmx3s'), salesCount: 2100, rating: 4.8, status: 'on', hasSpec: false, specGroups: '[]', createdAt: now, updatedAt: now },

    // 家用电器 (4)
    { id: 11, name: 'Dyson V15 Detect', description: '戴森旗舰吸尘器，激光检测灰尘，智能吸力调节，60分钟续航', price: 4990, originalPrice: 5990, stock: 200, categoryId: 3, images: imgs('dysonv15'), salesCount: 1420, rating: 4.5, status: 'on', hasSpec: false, specGroups: '[]', createdAt: now, updatedAt: now },
    { id: 12, name: '小米电视 65英寸', description: '4K OLED，120Hz刷新率，杜比全景声，HDMI 2.1', price: 3999, originalPrice: 5999, stock: 150, categoryId: 3, images: imgs('mitv65'), salesCount: 2680, rating: 4.4, status: 'on', hasSpec: false, specGroups: '[]', createdAt: now, updatedAt: now },
    { id: 13, name: '海底捞自热火锅', description: '番茄牛腩味，自热方便，15分钟即食，正宗川味', price: 39.90, originalPrice: 49.90, stock: 500, categoryId: 3, images: imgs('haidishao'), salesCount: 8500, rating: 4.3, status: 'on', hasSpec: false, specGroups: '[]', createdAt: now, updatedAt: now },
    { id: 14, name: '飞利浦空气炸锅', description: '不用油炸，4.1L大容量，360°循环加热，14种烹饪模式', price: 499, originalPrice: 699, stock: 180, categoryId: 3, images: imgs('philipsairfryer'), salesCount: 3200, rating: 4.6, status: 'on', hasSpec: false, specGroups: '[]', createdAt: now, updatedAt: now },

    // 服装鞋包 (4)
    { id: 15, name: 'Nike Air Max 270', description: '经典气垫跑鞋，舒适透气，Max Air气垫单元，日常百搭', price: 899, originalPrice: 1099, stock: 300, categoryId: 4, images: imgs('nikeairmax270'), salesCount: 4200, rating: 4.6, status: 'on', hasSpec: true, specGroups: JSON.stringify([{ name: '颜色', values: ['经典黑白', '灰橙配色', '全黑'] }, { name: '尺码', values: ['40', '41', '42', '43', '44'] }]), createdAt: now, updatedAt: now },
    { id: 16, name: '优衣库轻薄羽绒服', description: '高品质白鸭绒，轻薄保暖，可收纳便携，多色可选', price: 599, originalPrice: 799, stock: 500, categoryId: 4, images: imgs('uniqudown'), salesCount: 3950, rating: 4.3, status: 'on', hasSpec: true, specGroups: JSON.stringify([{ name: '颜色', values: ['黑色', '藏青色', '灰色'] }, { name: '尺码', values: ['S', 'M', 'L', 'XL', 'XXL'] }]), createdAt: now, updatedAt: now },
    { id: 17, name: 'Adidas Ultraboost', description: 'BOOST中底科技，Primeknit鞋面，Continental马牌橡胶外底', price: 999, originalPrice: 1299, stock: 200, categoryId: 4, images: imgs('adidasultrab'), salesCount: 1800, rating: 4.5, status: 'on', hasSpec: true, specGroups: JSON.stringify([{ name: '颜色', values: ['经典白', '全黑', '灰蓝'] }, { name: '尺码', values: ['40', '41', '42', '43', '44'] }]), createdAt: now, updatedAt: now },
    { id: 18, name: "Levi's 501 牛仔裤", description: '经典直筒版型，100%棉，纽扣门襟，美式经典风格', price: 599, originalPrice: 799, stock: 250, categoryId: 4, images: imgs('levis501'), salesCount: 1500, rating: 4.4, status: 'on', hasSpec: true, specGroups: JSON.stringify([{ name: '颜色', values: ['深蓝', '浅蓝', '黑色'] }, { name: '尺码', values: ['29', '30', '31', '32', '33', '34'] }]), createdAt: now, updatedAt: now },

    // 食品饮料 (4)
    { id: 19, name: '三只松鼠坚果礼盒', description: '8袋装，含核桃、腰果、巴旦木、夏威夷果等，年货送礼佳品', price: 128, originalPrice: 199, stock: 1000, categoryId: 5, images: imgs('nutsbox'), salesCount: 12500, rating: 4.5, status: 'on', hasSpec: false, specGroups: '[]', createdAt: now, updatedAt: now },
    { id: 20, name: '农夫山泉矿泉水 24瓶', description: '天然弱碱性水，550ml×24瓶，源自千岛湖深层地下水', price: 39.90, originalPrice: 48.00, stock: 2000, categoryId: 5, images: imgs('nongfu'), salesCount: 18900, rating: 4.7, status: 'on', hasSpec: false, specGroups: '[]', createdAt: now, updatedAt: now },
    { id: 21, name: '云南白药牙膏套装', description: '留兰香型180g×3支，经典护龈，清新口气', price: 69.90, originalPrice: 89.90, stock: 800, categoryId: 5, images: imgs('yunnanbaiyao'), salesCount: 6200, rating: 4.6, status: 'on', hasSpec: false, specGroups: '[]', createdAt: now, updatedAt: now },
    { id: 22, name: '蒙牛纯牛奶 250ml×24', description: '全脂灭菌乳，优质奶源，营养丰富，整箱装', price: 59.90, originalPrice: 72.00, stock: 1500, categoryId: 5, images: imgs('mengniu'), salesCount: 9800, rating: 4.5, status: 'on', hasSpec: false, specGroups: '[]', createdAt: now, updatedAt: now },

    // 图书文具 (4)
    { id: 23, name: 'JavaScript高级程序设计(第4版)', description: '前端开发经典书籍（红宝书），涵盖ES6+新特性，全面深入', price: 89, originalPrice: 129, stock: 400, categoryId: 6, images: imgs('jsbook'), salesCount: 8100, rating: 4.9, status: 'on', hasSpec: false, specGroups: '[]', createdAt: now, updatedAt: now },
    { id: 24, name: '得力文具套装12件', description: '中性笔、笔记本、文件夹、尺子、橡皮等12件套，开学必备', price: 49.90, originalPrice: 69.90, stock: 800, categoryId: 6, images: imgs('deliset'), salesCount: 5800, rating: 4.4, status: 'on', hasSpec: false, specGroups: '[]', createdAt: now, updatedAt: now },
    { id: 25, name: 'Clean Code 代码整洁之道', description: 'Robert C. Martin著，程序员必读经典，代码质量提升指南', price: 69, originalPrice: 99, stock: 300, categoryId: 6, images: imgs('cleancode'), salesCount: 4200, rating: 4.8, status: 'on', hasSpec: false, specGroups: '[]', createdAt: now, updatedAt: now },
    { id: 26, name: 'MUJI 无印良品笔记本', description: 'A5空白本，6mm方格，80页，极简设计，书写顺滑', price: 25, originalPrice: 35, stock: 600, categoryId: 6, images: imgs('muji_notebook'), salesCount: 3500, rating: 4.5, status: 'on', hasSpec: false, specGroups: '[]', createdAt: now, updatedAt: now },
  ];
  console.log('Products created:', db.products.length);

  // ===== Product SKUs =====
  db.productSkus = [
    // iPhone 15 Pro Max: 内存 × 颜色 = 9
    { id: 1, productId: 1, specs: { '内存': '256GB', '颜色': '原色钛金属' }, specText: '256GB / 原色钛金属', price: 9999, originalPrice: 10999, stock: 30, image: '', createdAt: now, updatedAt: now },
    { id: 2, productId: 1, specs: { '内存': '256GB', '颜色': '蓝色钛金属' }, specText: '256GB / 蓝色钛金属', price: 9999, originalPrice: 10999, stock: 25, image: '', createdAt: now, updatedAt: now },
    { id: 3, productId: 1, specs: { '内存': '256GB', '颜色': '白色钛金属' }, specText: '256GB / 白色钛金属', price: 9999, originalPrice: 10999, stock: 20, image: '', createdAt: now, updatedAt: now },
    { id: 4, productId: 1, specs: { '内存': '512GB', '颜色': '原色钛金属' }, specText: '512GB / 原色钛金属', price: 11999, originalPrice: 12999, stock: 15, image: '', createdAt: now, updatedAt: now },
    { id: 5, productId: 1, specs: { '内存': '512GB', '颜色': '蓝色钛金属' }, specText: '512GB / 蓝色钛金属', price: 11999, originalPrice: 12999, stock: 10, image: '', createdAt: now, updatedAt: now },
    { id: 6, productId: 1, specs: { '内存': '512GB', '颜色': '白色钛金属' }, specText: '512GB / 白色钛金属', price: 11999, originalPrice: 12999, stock: 8, image: '', createdAt: now, updatedAt: now },
    { id: 7, productId: 1, specs: { '内存': '1TB', '颜色': '原色钛金属' }, specText: '1TB / 原色钛金属', price: 13999, originalPrice: 14999, stock: 5, image: '', createdAt: now, updatedAt: now },
    { id: 8, productId: 1, specs: { '内存': '1TB', '颜色': '蓝色钛金属' }, specText: '1TB / 蓝色钛金属', price: 13999, originalPrice: 14999, stock: 3, image: '', createdAt: now, updatedAt: now },
    { id: 9, productId: 1, specs: { '内存': '1TB', '颜色': '白色钛金属' }, specText: '1TB / 白色钛金属', price: 13999, originalPrice: 14999, stock: 2, image: '', createdAt: now, updatedAt: now },
    // Galaxy S24 Ultra: 内存 × 颜色 = 6
    { id: 10, productId: 2, specs: { '内存': '256GB', '颜色': '钛灰色' }, specText: '256GB / 钛灰色', price: 8999, originalPrice: 9999, stock: 25, image: '', createdAt: now, updatedAt: now },
    { id: 11, productId: 2, specs: { '内存': '256GB', '颜色': '钛黑色' }, specText: '256GB / 钛黑色', price: 8999, originalPrice: 9999, stock: 20, image: '', createdAt: now, updatedAt: now },
    { id: 12, productId: 2, specs: { '内存': '256GB', '颜色': '钛紫色' }, specText: '256GB / 钛紫色', price: 8999, originalPrice: 9999, stock: 15, image: '', createdAt: now, updatedAt: now },
    { id: 13, productId: 2, specs: { '内存': '512GB', '颜色': '钛灰色' }, specText: '512GB / 钛灰色', price: 10999, originalPrice: 11999, stock: 10, image: '', createdAt: now, updatedAt: now },
    { id: 14, productId: 2, specs: { '内存': '512GB', '颜色': '钛黑色' }, specText: '512GB / 钛黑色', price: 10999, originalPrice: 11999, stock: 8, image: '', createdAt: now, updatedAt: now },
    { id: 15, productId: 2, specs: { '内存': '512GB', '颜色': '钛紫色' }, specText: '512GB / 钛紫色', price: 10999, originalPrice: 11999, stock: 5, image: '', createdAt: now, updatedAt: now },
    // HUAWEI Mate 60 Pro: 内存 × 颜色 = 6
    { id: 16, productId: 4, specs: { '内存': '256GB', '颜色': '雅川青' }, specText: '256GB / 雅川青', price: 6999, originalPrice: 7999, stock: 20, image: '', createdAt: now, updatedAt: now },
    { id: 17, productId: 4, specs: { '内存': '256GB', '颜色': '白沙银' }, specText: '256GB / 白沙银', price: 6999, originalPrice: 7999, stock: 18, image: '', createdAt: now, updatedAt: now },
    { id: 18, productId: 4, specs: { '内存': '256GB', '颜色': '南糯紫' }, specText: '256GB / 南糯紫', price: 6999, originalPrice: 7999, stock: 12, image: '', createdAt: now, updatedAt: now },
    { id: 19, productId: 4, specs: { '内存': '512GB', '颜色': '雅川青' }, specText: '512GB / 雅川青', price: 7999, originalPrice: 8999, stock: 8, image: '', createdAt: now, updatedAt: now },
    { id: 20, productId: 4, specs: { '内存': '512GB', '颜色': '白沙银' }, specText: '512GB / 白沙银', price: 7999, originalPrice: 8999, stock: 6, image: '', createdAt: now, updatedAt: now },
    { id: 21, productId: 4, specs: { '内存': '512GB', '颜色': '南糯紫' }, specText: '512GB / 南糯紫', price: 7999, originalPrice: 8999, stock: 4, image: '', createdAt: now, updatedAt: now },
    // MacBook Pro: 芯片 × 颜色 = 4
    { id: 22, productId: 6, specs: { '芯片': 'M3 Pro', '颜色': '深空黑色' }, specText: 'M3 Pro / 深空黑色', price: 14999, originalPrice: 16999, stock: 20, image: '', createdAt: now, updatedAt: now },
    { id: 23, productId: 6, specs: { '芯片': 'M3 Pro', '颜色': '银色' }, specText: 'M3 Pro / 银色', price: 14999, originalPrice: 16999, stock: 18, image: '', createdAt: now, updatedAt: now },
    { id: 24, productId: 6, specs: { '芯片': 'M3 Max', '颜色': '深空黑色' }, specText: 'M3 Max / 深空黑色', price: 19999, originalPrice: 21999, stock: 8, image: '', createdAt: now, updatedAt: now },
    { id: 25, productId: 6, specs: { '芯片': 'M3 Max', '颜色': '银色' }, specText: 'M3 Max / 银色', price: 19999, originalPrice: 21999, stock: 6, image: '', createdAt: now, updatedAt: now },
    // iPad Air: 容量 × 颜色 = 9
    { id: 26, productId: 8, specs: { '容量': '128GB', '颜色': '星光色' }, specText: '128GB / 星光色', price: 5499, originalPrice: 5999, stock: 25, image: '', createdAt: now, updatedAt: now },
    { id: 27, productId: 8, specs: { '容量': '128GB', '颜色': '紫色' }, specText: '128GB / 紫色', price: 5499, originalPrice: 5999, stock: 20, image: '', createdAt: now, updatedAt: now },
    { id: 28, productId: 8, specs: { '容量': '128GB', '颜色': '蓝色' }, specText: '128GB / 蓝色', price: 5499, originalPrice: 5999, stock: 18, image: '', createdAt: now, updatedAt: now },
    { id: 29, productId: 8, specs: { '容量': '256GB', '颜色': '星光色' }, specText: '256GB / 星光色', price: 6499, originalPrice: 6999, stock: 15, image: '', createdAt: now, updatedAt: now },
    { id: 30, productId: 8, specs: { '容量': '256GB', '颜色': '紫色' }, specText: '256GB / 紫色', price: 6499, originalPrice: 6999, stock: 12, image: '', createdAt: now, updatedAt: now },
    { id: 31, productId: 8, specs: { '容量': '256GB', '颜色': '蓝色' }, specText: '256GB / 蓝色', price: 6499, originalPrice: 6999, stock: 10, image: '', createdAt: now, updatedAt: now },
    { id: 32, productId: 8, specs: { '容量': '512GB', '颜色': '星光色' }, specText: '512GB / 星光色', price: 7999, originalPrice: 8499, stock: 8, image: '', createdAt: now, updatedAt: now },
    { id: 33, productId: 8, specs: { '容量': '512GB', '颜色': '紫色' }, specText: '512GB / 紫色', price: 7999, originalPrice: 8499, stock: 5, image: '', createdAt: now, updatedAt: now },
    { id: 34, productId: 8, specs: { '容量': '512GB', '颜色': '蓝色' }, specText: '512GB / 蓝色', price: 7999, originalPrice: 8499, stock: 3, image: '', createdAt: now, updatedAt: now },
    // Nike Air Max 270: 颜色 × 尺码 = 15
    { id: 35, productId: 15, specs: { '颜色': '经典黑白', '尺码': '40' }, specText: '经典黑白 / 40', price: 899, originalPrice: 1099, stock: 20, image: '', createdAt: now, updatedAt: now },
    { id: 36, productId: 15, specs: { '颜色': '经典黑白', '尺码': '41' }, specText: '经典黑白 / 41', price: 899, originalPrice: 1099, stock: 25, image: '', createdAt: now, updatedAt: now },
    { id: 37, productId: 15, specs: { '颜色': '经典黑白', '尺码': '42' }, specText: '经典黑白 / 42', price: 899, originalPrice: 1099, stock: 30, image: '', createdAt: now, updatedAt: now },
    { id: 38, productId: 15, specs: { '颜色': '经典黑白', '尺码': '43' }, specText: '经典黑白 / 43', price: 899, originalPrice: 1099, stock: 20, image: '', createdAt: now, updatedAt: now },
    { id: 39, productId: 15, specs: { '颜色': '经典黑白', '尺码': '44' }, specText: '经典黑白 / 44', price: 899, originalPrice: 1099, stock: 15, image: '', createdAt: now, updatedAt: now },
    { id: 40, productId: 15, specs: { '颜色': '灰橙配色', '尺码': '40' }, specText: '灰橙配色 / 40', price: 899, originalPrice: 1099, stock: 18, image: '', createdAt: now, updatedAt: now },
    { id: 41, productId: 15, specs: { '颜色': '灰橙配色', '尺码': '41' }, specText: '灰橙配色 / 41', price: 899, originalPrice: 1099, stock: 22, image: '', createdAt: now, updatedAt: now },
    { id: 42, productId: 15, specs: { '颜色': '灰橙配色', '尺码': '42' }, specText: '灰橙配色 / 42', price: 899, originalPrice: 1099, stock: 28, image: '', createdAt: now, updatedAt: now },
    { id: 43, productId: 15, specs: { '颜色': '灰橙配色', '尺码': '43' }, specText: '灰橙配色 / 43', price: 899, originalPrice: 1099, stock: 18, image: '', createdAt: now, updatedAt: now },
    { id: 44, productId: 15, specs: { '颜色': '灰橙配色', '尺码': '44' }, specText: '灰橙配色 / 44', price: 899, originalPrice: 1099, stock: 12, image: '', createdAt: now, updatedAt: now },
    { id: 45, productId: 15, specs: { '颜色': '全黑', '尺码': '40' }, specText: '全黑 / 40', price: 899, originalPrice: 1099, stock: 20, image: '', createdAt: now, updatedAt: now },
    { id: 46, productId: 15, specs: { '颜色': '全黑', '尺码': '41' }, specText: '全黑 / 41', price: 899, originalPrice: 1099, stock: 25, image: '', createdAt: now, updatedAt: now },
    { id: 47, productId: 15, specs: { '颜色': '全黑', '尺码': '42' }, specText: '全黑 / 42', price: 899, originalPrice: 1099, stock: 30, image: '', createdAt: now, updatedAt: now },
    { id: 48, productId: 15, specs: { '颜色': '全黑', '尺码': '43' }, specText: '全黑 / 43', price: 899, originalPrice: 1099, stock: 20, image: '', createdAt: now, updatedAt: now },
    { id: 49, productId: 15, specs: { '颜色': '全黑', '尺码': '44' }, specText: '全黑 / 44', price: 899, originalPrice: 1099, stock: 15, image: '', createdAt: now, updatedAt: now },
    // 优衣库羽绒服: 颜色 × 尺码 = 15
    { id: 50, productId: 16, specs: { '颜色': '黑色', '尺码': 'S' }, specText: '黑色 / S', price: 599, originalPrice: 799, stock: 30, image: '', createdAt: now, updatedAt: now },
    { id: 51, productId: 16, specs: { '颜色': '黑色', '尺码': 'M' }, specText: '黑色 / M', price: 599, originalPrice: 799, stock: 40, image: '', createdAt: now, updatedAt: now },
    { id: 52, productId: 16, specs: { '颜色': '黑色', '尺码': 'L' }, specText: '黑色 / L', price: 599, originalPrice: 799, stock: 35, image: '', createdAt: now, updatedAt: now },
    { id: 53, productId: 16, specs: { '颜色': '黑色', '尺码': 'XL' }, specText: '黑色 / XL', price: 599, originalPrice: 799, stock: 25, image: '', createdAt: now, updatedAt: now },
    { id: 54, productId: 16, specs: { '颜色': '黑色', '尺码': 'XXL' }, specText: '黑色 / XXL', price: 599, originalPrice: 799, stock: 15, image: '', createdAt: now, updatedAt: now },
    { id: 55, productId: 16, specs: { '颜色': '藏青色', '尺码': 'S' }, specText: '藏青色 / S', price: 599, originalPrice: 799, stock: 25, image: '', createdAt: now, updatedAt: now },
    { id: 56, productId: 16, specs: { '颜色': '藏青色', '尺码': 'M' }, specText: '藏青色 / M', price: 599, originalPrice: 799, stock: 35, image: '', createdAt: now, updatedAt: now },
    { id: 57, productId: 16, specs: { '颜色': '藏青色', '尺码': 'L' }, specText: '藏青色 / L', price: 599, originalPrice: 799, stock: 30, image: '', createdAt: now, updatedAt: now },
    { id: 58, productId: 16, specs: { '颜色': '藏青色', '尺码': 'XL' }, specText: '藏青色 / XL', price: 599, originalPrice: 799, stock: 20, image: '', createdAt: now, updatedAt: now },
    { id: 59, productId: 16, specs: { '颜色': '藏青色', '尺码': 'XXL' }, specText: '藏青色 / XXL', price: 599, originalPrice: 799, stock: 12, image: '', createdAt: now, updatedAt: now },
    { id: 60, productId: 16, specs: { '颜色': '灰色', '尺码': 'S' }, specText: '灰色 / S', price: 599, originalPrice: 799, stock: 20, image: '', createdAt: now, updatedAt: now },
    { id: 61, productId: 16, specs: { '颜色': '灰色', '尺码': 'M' }, specText: '灰色 / M', price: 599, originalPrice: 799, stock: 30, image: '', createdAt: now, updatedAt: now },
    { id: 62, productId: 16, specs: { '颜色': '灰色', '尺码': 'L' }, specText: '灰色 / L', price: 599, originalPrice: 799, stock: 28, image: '', createdAt: now, updatedAt: now },
    { id: 63, productId: 16, specs: { '颜色': '灰色', '尺码': 'XL' }, specText: '灰色 / XL', price: 599, originalPrice: 799, stock: 18, image: '', createdAt: now, updatedAt: now },
    { id: 64, productId: 16, specs: { '颜色': '灰色', '尺码': 'XXL' }, specText: '灰色 / XXL', price: 599, originalPrice: 799, stock: 10, image: '', createdAt: now, updatedAt: now },
    // Adidas Ultraboost: 颜色 × 尺码 = 15
    { id: 65, productId: 17, specs: { '颜色': '经典白', '尺码': '40' }, specText: '经典白 / 40', price: 999, originalPrice: 1299, stock: 15, image: '', createdAt: now, updatedAt: now },
    { id: 66, productId: 17, specs: { '颜色': '经典白', '尺码': '41' }, specText: '经典白 / 41', price: 999, originalPrice: 1299, stock: 20, image: '', createdAt: now, updatedAt: now },
    { id: 67, productId: 17, specs: { '颜色': '经典白', '尺码': '42' }, specText: '经典白 / 42', price: 999, originalPrice: 1299, stock: 25, image: '', createdAt: now, updatedAt: now },
    { id: 68, productId: 17, specs: { '颜色': '经典白', '尺码': '43' }, specText: '经典白 / 43', price: 999, originalPrice: 1299, stock: 18, image: '', createdAt: now, updatedAt: now },
    { id: 69, productId: 17, specs: { '颜色': '经典白', '尺码': '44' }, specText: '经典白 / 44', price: 999, originalPrice: 1299, stock: 12, image: '', createdAt: now, updatedAt: now },
    { id: 70, productId: 17, specs: { '颜色': '全黑', '尺码': '40' }, specText: '全黑 / 40', price: 999, originalPrice: 1299, stock: 15, image: '', createdAt: now, updatedAt: now },
    { id: 71, productId: 17, specs: { '颜色': '全黑', '尺码': '41' }, specText: '全黑 / 41', price: 999, originalPrice: 1299, stock: 20, image: '', createdAt: now, updatedAt: now },
    { id: 72, productId: 17, specs: { '颜色': '全黑', '尺码': '42' }, specText: '全黑 / 42', price: 999, originalPrice: 1299, stock: 25, image: '', createdAt: now, updatedAt: now },
    { id: 73, productId: 17, specs: { '颜色': '全黑', '尺码': '43' }, specText: '全黑 / 43', price: 999, originalPrice: 1299, stock: 18, image: '', createdAt: now, updatedAt: now },
    { id: 74, productId: 17, specs: { '颜色': '全黑', '尺码': '44' }, specText: '全黑 / 44', price: 999, originalPrice: 1299, stock: 12, image: '', createdAt: now, updatedAt: now },
    { id: 75, productId: 17, specs: { '颜色': '灰蓝', '尺码': '40' }, specText: '灰蓝 / 40', price: 999, originalPrice: 1299, stock: 12, image: '', createdAt: now, updatedAt: now },
    { id: 76, productId: 17, specs: { '颜色': '灰蓝', '尺码': '41' }, specText: '灰蓝 / 41', price: 999, originalPrice: 1299, stock: 18, image: '', createdAt: now, updatedAt: now },
    { id: 77, productId: 17, specs: { '颜色': '灰蓝', '尺码': '42' }, specText: '灰蓝 / 42', price: 999, originalPrice: 1299, stock: 22, image: '', createdAt: now, updatedAt: now },
    { id: 78, productId: 17, specs: { '颜色': '灰蓝', '尺码': '43' }, specText: '灰蓝 / 43', price: 999, originalPrice: 1299, stock: 15, image: '', createdAt: now, updatedAt: now },
    { id: 79, productId: 17, specs: { '颜色': '灰蓝', '尺码': '44' }, specText: '灰蓝 / 44', price: 999, originalPrice: 1299, stock: 10, image: '', createdAt: now, updatedAt: now },
    // Levi's 501: 颜色 × 尺码 = 18
    { id: 80, productId: 18, specs: { '颜色': '深蓝', '尺码': '29' }, specText: '深蓝 / 29', price: 599, originalPrice: 799, stock: 15, image: '', createdAt: now, updatedAt: now },
    { id: 81, productId: 18, specs: { '颜色': '深蓝', '尺码': '30' }, specText: '深蓝 / 30', price: 599, originalPrice: 799, stock: 20, image: '', createdAt: now, updatedAt: now },
    { id: 82, productId: 18, specs: { '颜色': '深蓝', '尺码': '31' }, specText: '深蓝 / 31', price: 599, originalPrice: 799, stock: 25, image: '', createdAt: now, updatedAt: now },
    { id: 83, productId: 18, specs: { '颜色': '深蓝', '尺码': '32' }, specText: '深蓝 / 32', price: 599, originalPrice: 799, stock: 30, image: '', createdAt: now, updatedAt: now },
    { id: 84, productId: 18, specs: { '颜色': '深蓝', '尺码': '33' }, specText: '深蓝 / 33', price: 599, originalPrice: 799, stock: 20, image: '', createdAt: now, updatedAt: now },
    { id: 85, productId: 18, specs: { '颜色': '深蓝', '尺码': '34' }, specText: '深蓝 / 34', price: 599, originalPrice: 799, stock: 15, image: '', createdAt: now, updatedAt: now },
    { id: 86, productId: 18, specs: { '颜色': '浅蓝', '尺码': '29' }, specText: '浅蓝 / 29', price: 599, originalPrice: 799, stock: 12, image: '', createdAt: now, updatedAt: now },
    { id: 87, productId: 18, specs: { '颜色': '浅蓝', '尺码': '30' }, specText: '浅蓝 / 30', price: 599, originalPrice: 799, stock: 18, image: '', createdAt: now, updatedAt: now },
    { id: 88, productId: 18, specs: { '颜色': '浅蓝', '尺码': '31' }, specText: '浅蓝 / 31', price: 599, originalPrice: 799, stock: 22, image: '', createdAt: now, updatedAt: now },
    { id: 89, productId: 18, specs: { '颜色': '浅蓝', '尺码': '32' }, specText: '浅蓝 / 32', price: 599, originalPrice: 799, stock: 25, image: '', createdAt: now, updatedAt: now },
    { id: 90, productId: 18, specs: { '颜色': '浅蓝', '尺码': '33' }, specText: '浅蓝 / 33', price: 599, originalPrice: 799, stock: 18, image: '', createdAt: now, updatedAt: now },
    { id: 91, productId: 18, specs: { '颜色': '浅蓝', '尺码': '34' }, specText: '浅蓝 / 34', price: 599, originalPrice: 799, stock: 12, image: '', createdAt: now, updatedAt: now },
    { id: 92, productId: 18, specs: { '颜色': '黑色', '尺码': '29' }, specText: '黑色 / 29', price: 599, originalPrice: 799, stock: 10, image: '', createdAt: now, updatedAt: now },
    { id: 93, productId: 18, specs: { '颜色': '黑色', '尺码': '30' }, specText: '黑色 / 30', price: 599, originalPrice: 799, stock: 15, image: '', createdAt: now, updatedAt: now },
    { id: 94, productId: 18, specs: { '颜色': '黑色', '尺码': '31' }, specText: '黑色 / 31', price: 599, originalPrice: 799, stock: 20, image: '', createdAt: now, updatedAt: now },
    { id: 95, productId: 18, specs: { '颜色': '黑色', '尺码': '32' }, specText: '黑色 / 32', price: 599, originalPrice: 799, stock: 22, image: '', createdAt: now, updatedAt: now },
    { id: 96, productId: 18, specs: { '颜色': '黑色', '尺码': '33' }, specText: '黑色 / 33', price: 599, originalPrice: 799, stock: 15, image: '', createdAt: now, updatedAt: now },
    { id: 97, productId: 18, specs: { '颜色': '黑色', '尺码': '34' }, specText: '黑色 / 34', price: 599, originalPrice: 799, stock: 10, image: '', createdAt: now, updatedAt: now },
  ];
  console.log('SKUs created:', db.productSkus.length);

  // ===== Addresses =====
  db.addresses = [
    { id: 1, userId: 2, name: '张三', phone: '13800000001', province: '北京市', city: '北京市', district: '朝阳区', detail: '三里屯路1号太古里北区', isDefault: true, createdAt: now, updatedAt: now },
    { id: 2, userId: 2, name: '张三(公司)', phone: '13800000001', province: '北京市', city: '北京市', district: '海淀区', detail: '中关村大街1号理想国际大厦', isDefault: false, createdAt: now, updatedAt: now },
    { id: 3, userId: 3, name: '李四', phone: '13800000002', province: '上海市', city: '上海市', district: '浦东新区', detail: '陆家嘴环路1000号恒生银行大厦', isDefault: true, createdAt: now, updatedAt: now },
  ];
  console.log('Addresses created');

  // ===== Orders (various statuses) =====
  const addr1 = { name: '张三', phone: '13800000001', province: '北京市', city: '北京市', district: '朝阳区', detail: '三里屯路1号太古里北区' };
  const addr3 = { name: '李四', phone: '13800000002', province: '上海市', city: '上海市', district: '浦东新区', detail: '陆家嘴环路1000号恒生银行大厦' };

  db.orders = [
    { id: 1, orderNo: 'ORD20240101001', userId: 2, totalAmount: 9999.00, status: 'pending', addressSnapshot: JSON.stringify(addr1), remark: '', couponId: null, createdAt: '2024-01-01T10:00:00.000Z', updatedAt: '2024-01-01T10:00:00.000Z' },
    { id: 2, orderNo: 'ORD20240102001', userId: 2, totalAmount: 14999.00, status: 'paid', addressSnapshot: JSON.stringify(addr1), remark: '', couponId: null, payTime: '2024-01-02T10:00:00.000Z', createdAt: '2024-01-02T10:00:00.000Z', updatedAt: '2024-01-02T10:00:00.000Z' },
    { id: 3, orderNo: 'ORD20240103001', userId: 3, totalAmount: 899.00, status: 'shipped', addressSnapshot: JSON.stringify(addr3), remark: '', couponId: null, payTime: '2024-01-03T10:00:00.000Z', shipTime: '2024-01-04T10:00:00.000Z', createdAt: '2024-01-03T10:00:00.000Z', updatedAt: '2024-01-04T10:00:00.000Z' },
    { id: 4, orderNo: 'ORD20240104001', userId: 2, totalAmount: 128.00, status: 'completed', addressSnapshot: JSON.stringify(addr1), remark: '', couponId: null, payTime: '2024-01-04T10:00:00.000Z', shipTime: '2024-01-05T10:00:00.000Z', receiveTime: '2024-01-07T10:00:00.000Z', createdAt: '2024-01-04T10:00:00.000Z', updatedAt: '2024-01-07T10:00:00.000Z' },
    { id: 5, orderNo: 'ORD20240105001', userId: 3, totalAmount: 599.00, status: 'cancelled', addressSnapshot: JSON.stringify(addr3), remark: '', couponId: null, createdAt: '2024-01-05T10:00:00.000Z', updatedAt: '2024-01-05T10:00:00.000Z' },
    { id: 6, orderNo: 'ORD20240106001', userId: 2, totalAmount: 4990.00, status: 'refunding', addressSnapshot: JSON.stringify(addr1), remark: '申请退款', couponId: null, payTime: '2024-01-06T10:00:00.000Z', createdAt: '2024-01-06T10:00:00.000Z', updatedAt: '2024-01-06T10:00:00.000Z' },
  ];
  console.log('Orders created');

  // ===== Order Items =====
  db.orderItems = [
    { id: 1, orderId: 1, productId: 1, skuId: 1, quantity: 1, price: 9999.00, productName: 'iPhone 15 Pro Max', productImage: '/images/products/iphone15promax.svg', specText: '256GB / 原色钛金属' },
    { id: 2, orderId: 2, productId: 6, skuId: 22, quantity: 1, price: 14999.00, productName: 'MacBook Pro 14英寸', productImage: '/images/products/macbookpro14.svg', specText: 'M3 Pro / 深空黑色' },
    { id: 3, orderId: 3, productId: 15, skuId: 37, quantity: 1, price: 899.00, productName: 'Nike Air Max 270', productImage: '/images/products/nikeairmax270.svg', specText: '经典黑白 / 42' },
    { id: 4, orderId: 4, productId: 19, skuId: null, quantity: 1, price: 128.00, productName: '三只松鼠坚果礼盒', productImage: '/images/products/nutsbox.svg', specText: '' },
    { id: 5, orderId: 5, productId: 16, skuId: 51, quantity: 1, price: 599.00, productName: '优衣库轻薄羽绒服', productImage: '/images/products/uniqudown.svg', specText: '黑色 / M' },
    { id: 6, orderId: 6, productId: 11, skuId: null, quantity: 1, price: 4990.00, productName: 'Dyson V15 Detect', productImage: '/images/products/dysonv15.svg', specText: '' },
  ];
  console.log('Order items created');

  // ===== Payments =====
  db.payments = [
    { id: 1, orderId: 2, method: 'alipay', amount: 14999.00, status: 'success', paidAt: '2024-01-02T10:00:00.000Z', createdAt: now, updatedAt: now },
    { id: 2, orderId: 4, method: 'wechat', amount: 128.00, status: 'success', paidAt: '2024-01-04T10:00:00.000Z', createdAt: now, updatedAt: now },
  ];
  console.log('Payments created');

  // ===== Reviews =====
  db.reviews = [
    { id: 1, userId: 2, productId: 19, orderId: 4, rating: 5, content: '坚果很新鲜，种类丰富，包装精美，送人自用都不错！', images: '[]', createdAt: '2024-01-08T10:00:00.000Z', updatedAt: now },
    { id: 2, userId: 3, productId: 1, orderId: null, rating: 4, content: '手机很好用，拍照效果棒，就是价格有点贵', images: '[]', createdAt: '2024-01-09T10:00:00.000Z', updatedAt: now },
    { id: 3, userId: 2, productId: 6, orderId: null, rating: 5, content: 'M3 Pro芯片性能强劲，续航给力，屏幕素质一流', images: '[]', createdAt: '2024-01-10T10:00:00.000Z', updatedAt: now },
    { id: 4, userId: 3, productId: 15, orderId: 3, rating: 5, content: '鞋子很舒服，气垫软弹，日常穿很百搭，尺码标准', images: '[]', createdAt: '2024-01-11T10:00:00.000Z', updatedAt: now },
    { id: 5, userId: 2, productId: 23, orderId: null, rating: 5, content: '前端必读书籍，内容全面深入，第4版更新了很多ES6+内容', images: '[]', createdAt: '2024-01-12T10:00:00.000Z', updatedAt: now },
    { id: 6, userId: 3, productId: 11, orderId: null, rating: 4, content: '吸力很强，激光照灰尘很直观，就是有点重', images: '[]', createdAt: '2024-01-13T10:00:00.000Z', updatedAt: now },
  ];
  console.log('Reviews created');

  // ===== Favorites =====
  db.favorites = [
    { id: 1, userId: 2, productId: 1, createdAt: now, updatedAt: now },
    { id: 2, userId: 2, productId: 6, createdAt: now, updatedAt: now },
    { id: 3, userId: 2, productId: 15, createdAt: now, updatedAt: now },
    { id: 4, userId: 2, productId: 23, createdAt: now, updatedAt: now },
    { id: 5, userId: 3, productId: 1, createdAt: now, updatedAt: now },
    { id: 6, userId: 3, productId: 11, createdAt: now, updatedAt: now },
    { id: 7, userId: 3, productId: 16, createdAt: now, updatedAt: now },
    { id: 8, userId: 3, productId: 19, createdAt: now, updatedAt: now },
  ];
  console.log('Favorites created');

  // Cart items (empty for fresh start)
  db.cartItems = [];

  save();

  console.log('\n✅ Seed complete!');
  console.log(`\n📊 Data summary:`);
  console.log(`  Users: ${db.users.length}`);
  console.log(`  Categories: ${db.categories.length}`);
  console.log(`  Products: ${db.products.length} (${db.products.filter(p=>p.hasSpec).length} with specs)`);
  console.log(`  SKUs: ${db.productSkus.length}`);
  console.log(`  Orders: ${db.orders.length} (covering all statuses)`);
  console.log(`  Reviews: ${db.reviews.length}`);
  console.log(`  Favorites: ${db.favorites.length}`);
  console.log('\nTest accounts:');
  console.log('  Admin:   admin / 123456');
  console.log('  User 1:  buyer1 / 123456 (张三)');
  console.log('  User 2:  buyer2 / 123456 (李四)');
  console.log('  Disabled: disabled_user / 123456');
}

seed().catch((err) => { console.error(err); process.exit(1); });
