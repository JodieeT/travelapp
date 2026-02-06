/**
 * 后端 API 测试脚本（需先启动服务: npm run dev 或 node src/server.js）
 * 运行: node scripts/test-api.js
 */
const BASE = 'http://localhost:3000/api';

async function request(method, path, body, token) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(BASE + path, opts);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch (_) { data = text; }
  return { status: res.status, data };
}

async function main() {
  console.log('=== 1. 公开接口（无需登录） ===');
  let r = await request('GET', '/banners');
  console.log('GET /api/banners', r.status, r.data);

  r = await request('GET', '/hotels?page=1&limit=5');
  console.log('GET /api/hotels', r.status, Array.isArray(r.data?.list) ? `list.length=${r.data.list.length}` : r.data);

  console.log('\n=== 2. 注册商户 ===');
  r = await request('POST', '/auth/register', { username: 'test_merchant_' + Date.now(), password: '123456', role: 'merchant' });
  if (r.status !== 200) { console.log('register fail', r); return; }
  const merchantToken = r.data.token;
  console.log('注册成功', r.data.user?.username);

  console.log('\n=== 3. 商户：创建酒店 ===');
  r = await request('POST', '/merchant/hotels', {
    name_cn: '测试酒店',
    name_en: 'Test Hotel',
    city: '上海',
    address: '浦东新区XX路1号',
    star_level: 4,
    open_date: '2020-01-01',
    rooms: [{ type_name: '大床房', base_price: 299 }, { type_name: '双床房', base_price: 399 }]
  }, merchantToken);
  if (r.status !== 201) { console.log('create hotel fail', r); return; }
  const hotelId = r.data.id;
  console.log('创建酒店成功 id=', hotelId);

  console.log('\n=== 4. 商户：我的酒店列表 ===');
  r = await request('GET', '/merchant/hotels', null, merchantToken);
  console.log('GET /api/merchant/hotels', r.status, r.data?.length ?? r.data);

  console.log('\n=== 5. 商户：提交审核 ===');
  r = await request('POST', `/merchant/hotels/${hotelId}/submit`, null, merchantToken);
  console.log('POST submit', r.status, r.data?.status);

  console.log('\n=== 6. 注册管理员并登录 ===');
  r = await request('POST', '/auth/register', { username: 'test_admin_' + Date.now(), password: '123456', role: 'admin' });
  const adminToken = r.status === 200 ? r.data.token : null;
  if (adminToken) console.log('管理员注册/登录成功', r.data.user?.username);
  if (!adminToken) {
    r = await request('POST', '/auth/login', { username: 'test_admin_1', password: '123456' });
    if (r.status !== 200) { console.log('无管理员账号，跳过审核测试。可先注册 role: admin 再测'); }
  }
  if (adminToken || r.data?.token) {
    const token = adminToken || r.data.token;
    console.log('\n=== 7. 管理员：待审核列表 ===');
    r = await request('GET', '/admin/hotels?status=pending', null, token);
    console.log('GET /api/admin/hotels?status=pending', r.status, r.data?.list?.length ?? r.data);

    console.log('\n=== 8. 管理员：审核通过 ===');
    r = await request('POST', `/admin/hotels/${hotelId}/approve`, null, token);
    console.log('POST approve', r.status, r.data?.status);

    console.log('\n=== 9. 公开：酒店列表（应有刚通过的） ===');
    r = await request('GET', '/hotels?city=上海');
    console.log('GET /api/hotels', r.status, r.data?.list?.length ?? r.data);

    console.log('\n=== 10. 公开：酒店详情 ===');
    r = await request('GET', `/hotels/${hotelId}`);
    console.log('GET /api/hotels/:id', r.status, r.data?.name_cn, 'Rooms:', r.data?.Rooms?.length);

    console.log('\n=== 11. 管理员：下线与恢复 ===');
    r = await request('POST', `/admin/hotels/${hotelId}/offline`, null, token);
    console.log('POST offline', r.status, r.data?.status);
    r = await request('POST', `/admin/hotels/${hotelId}/restore`, null, token);
    console.log('POST restore', r.status, r.data?.status);
  }

  console.log('\n=== 测试完成 ===');
}

main().catch(e => console.error(e));
