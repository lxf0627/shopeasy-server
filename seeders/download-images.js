/**
 * Download real product images from Unsplash direct URLs
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../../client/public/images/products');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Direct Unsplash photo URLs (verified working)
const products = [
  { slug: 'iphone15promax', urls: [
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1606041011875-5693eb5a4cda?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1591337676887-a217bee66b40?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=800&fit=crop',
  ]},
  { slug: 'galaxys24ultra', urls: [
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop',
  ]},
  { slug: 'airpodspro2', urls: [
    'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1629367492855-718d1b0e2e46?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1588423771073-b8917e6a7f51?w=800&h=800&fit=crop',
  ]},
  { slug: 'huaweimate60', urls: [
    'https://images.unsplash.com/photo-1598532214854-7e68b40e5e24?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1567581931413-408d8e48e341?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1555774698-097394d3b8d8?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1583394838231-476393c9a4a2?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=800&fit=crop',
  ]},
  { slug: 'xiaomi14ultra', urls: [
    'https://images.unsplash.com/photo-1601784551446-20c9bf04b20e?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1571127103416-41b3e4276f7d?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1606041011875-5693eb5a4cda?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=800&fit=crop',
  ]},
  { slug: 'macbookpro14', urls: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1537498425277-c283d32ef9db?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop',
  ]},
  { slug: 'thinkpadx1', urls: [
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1537498425277-c283d32ef9db?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop',
  ]},
  { slug: 'ipadair', urls: [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1585790050230-5aa27556ba42?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=800&fit=crop',
  ]},
  { slug: 'dellxps15', urls: [
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1537498425277-c283d32ef9db?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop',
  ]},
  { slug: 'logitechmx3s', urls: [
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1563206767-5b18f3b5c634?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=800&fit=crop',
  ]},
  { slug: 'dysonv15', urls: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85f7e6?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f7e6?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&h=800&fit=crop',
  ]},
  { slug: 'mitv65', urls: [
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=800&fit=crop',
  ]},
  { slug: 'haidishao', urls: [
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop',
  ]},
  { slug: 'philipsairfryer', urls: [
    'https://images.unsplash.com/photo-1585475182685-3e9f9e0a0a2b?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1585475182685-3e9f9e0a0a2b?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop',
  ]},
  { slug: 'nikeairmax270', urls: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1600269112345-f6e1f10e4bd8?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&h=800&fit=crop',
  ]},
  { slug: 'uniqudown', urls: [
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&h=800&fit=crop',
  ]},
  { slug: 'adidasultrab', urls: [
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop',
  ]},
  { slug: 'levis501', urls: [
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1582571310254-51e41b59f694?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=800&fit=crop',
  ]},
  { slug: 'nutsbox', urls: [
    'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=800&h=800&fit=crop',
  ]},
  { slug: 'nongfu', urls: [
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=800&fit=crop',
  ]},
  { slug: 'yunnanbaiyao', urls: [
    'https://images.unsplash.com/photo-1585435465945-b46f4c0b5a5f?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1585435465945-b46f4c0b5a5f?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=800&fit=crop',
  ]},
  { slug: 'mengniu', urls: [
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=800&fit=crop',
  ]},
  { slug: 'jsbook', urls: [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop',
  ]},
  { slug: 'deliset', urls: [
    'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800&h=800&fit=crop',
  ]},
  { slug: 'cleancode', urls: [
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop',
  ]},
  { slug: 'muji_notebook', urls: [
    'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&h=800&fit=crop',
  ]},
];

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }, timeout: 15000 }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 303) {
        download(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(filepath);
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
      file.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  let total = 0;
  let failed = 0;

  for (const product of products) {
    const dir = path.join(outDir, product.slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    for (let i = 0; i < product.urls.length; i++) {
      const filename = i === 0 ? 'main.jpg' : `${i + 1}.jpg`;
      const filepath = path.join(dir, filename);

      try {
        await download(product.urls[i], filepath);
        const stats = fs.statSync(filepath);
        if (stats.size < 1000) {
          fs.unlinkSync(filepath);
          failed++;
        } else {
          total++;
          process.stdout.write(`\r  ✅ ${total} | ${product.slug}/${filename} (${(stats.size/1024).toFixed(0)}KB)        `);
        }
      } catch (err) {
        failed++;
      }
      await sleep(100);
    }
  }

  console.log(`\n\n📊 Done! Downloaded: ${total}, Failed: ${failed}`);
}

main().catch(console.error);
