/**
 * 移动端API测试脚本
 * 使用方法: node scripts/test-mobile-api.js
 */

const BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

// 颜色输出辅助函数
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
    console.log('\n' + '='.repeat(60));
    log(title, 'cyan');
    console.log('='.repeat(60));
}

function logTest(name) {
    log(`\n📋 测试: ${name}`, 'blue');
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function logInfo(message) {
    log(`ℹ️  ${message}`, 'yellow');
}

// 测试辅助函数
async function testAPI(name, url, options = {}) {
    logTest(name);
    logInfo(`请求: ${options.method || 'GET'} ${url}`);
    
    try {
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        });
        
        const data = await response.json();
        
        if (response.ok) {
            logSuccess(`状态码: ${response.status}`);
            logInfo(`响应数据: ${JSON.stringify(data, null, 2).substring(0, 200)}...`);
            return { success: true, data, status: response.status };
        } else {
            logError(`状态码: ${response.status}`);
            logError(`错误信息: ${JSON.stringify(data)}`);
            return { success: false, data, status: response.status };
        }
    } catch (error) {
        logError(`请求失败: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// 主测试函数
async function runTests() {
    logSection('移动端API测试');
    logInfo(`测试服务器: ${BASE_URL}\n`);

    const results = [];

    // 1. 测试获取Banner列表
    results.push(await testAPI(
        '获取Banner列表',
        `${BASE_URL}/banners`
    ));

    // 2. 测试获取城市列表
    results.push(await testAPI(
        '获取城市列表',
        `${BASE_URL}/cities`
    ));

    // 3. 测试获取标签列表
    results.push(await testAPI(
        '获取标签列表',
        `${BASE_URL}/tags`
    ));

    // 4. 测试酒店列表 - 基础查询
    results.push(await testAPI(
        '酒店列表 - 基础查询',
        `${BASE_URL}/hotels?page=1&limit=10`
    ));

    // 5. 测试酒店列表 - 按城市筛选
    results.push(await testAPI(
        '酒店列表 - 按城市筛选',
        `${BASE_URL}/hotels?city=北京&page=1&limit=10`
    ));

    // 6. 测试酒店列表 - 关键字搜索
    results.push(await testAPI(
        '酒店列表 - 关键字搜索',
        `${BASE_URL}/hotels?keyword=酒店&page=1&limit=10`
    ));

    // 7. 测试酒店列表 - 星级筛选
    results.push(await testAPI(
        '酒店列表 - 星级筛选',
        `${BASE_URL}/hotels?star_level=5&page=1&limit=10`
    ));

    // 8. 测试酒店列表 - 价格区间筛选
    results.push(await testAPI(
        '酒店列表 - 价格区间筛选',
        `${BASE_URL}/hotels?minPrice=100&maxPrice=500&page=1&limit=10`
    ));

    // 9. 测试酒店列表 - 标签筛选（单个）
    results.push(await testAPI(
        '酒店列表 - 标签筛选（单个）',
        `${BASE_URL}/hotels?tags=亲子&page=1&limit=10`
    ));

    // 10. 测试酒店列表 - 标签筛选（多个）
    results.push(await testAPI(
        '酒店列表 - 标签筛选（多个）',
        `${BASE_URL}/hotels?tags=亲子,豪华&page=1&limit=10`
    ));

    // 11. 测试酒店列表 - 组合筛选
    results.push(await testAPI(
        '酒店列表 - 组合筛选（城市+星级+价格）',
        `${BASE_URL}/hotels?city=北京&star_level=5&minPrice=200&maxPrice=1000&page=1&limit=10`
    ));

    // 12. 测试酒店详情 - 基础查询
    const hotelListResult = results[3]; // 使用酒店列表的结果
    if (hotelListResult.success && hotelListResult.data.list && hotelListResult.data.list.length > 0) {
        const hotelId = hotelListResult.data.list[0].id;
        results.push(await testAPI(
            '酒店详情 - 基础查询',
            `${BASE_URL}/hotels/${hotelId}`
        ));

        // 13. 测试酒店详情 - 带日期和间夜数计算总价
        const checkIn = '2025-03-01';
        const checkOut = '2025-03-05';
        const nights = 4;
        results.push(await testAPI(
            '酒店详情 - 带日期和间夜数计算总价',
            `${BASE_URL}/hotels/${hotelId}?check_in=${checkIn}&check_out=${checkOut}&nights=${nights}`
        ));
    } else {
        logError('无法获取酒店ID，跳过酒店详情测试');
    }

    // 14. 测试价格流（SSE）- 仅检查连接
    logTest('价格流（SSE）');
    logInfo('注意: SSE连接需要特殊处理，这里仅检查端点是否存在');
    try {
        const response = await fetch(`${BASE_URL}/prices/stream`, {
            method: 'GET',
            headers: { 'Accept': 'text/event-stream' },
        });
        if (response.ok || response.status === 200) {
            logSuccess('SSE端点可访问');
            results.push({ success: true, status: response.status });
        } else {
            logError(`SSE端点状态码: ${response.status}`);
            results.push({ success: false, status: response.status });
        }
    } catch (error) {
        logError(`SSE测试失败: ${error.message}`);
        results.push({ success: false, error: error.message });
    }

    // 汇总结果
    logSection('测试结果汇总');
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    logInfo(`总计: ${totalCount} 个测试`);
    logSuccess(`通过: ${successCount} 个`);
    logError(`失败: ${totalCount - successCount} 个`);

    if (successCount === totalCount) {
        log('\n🎉 所有测试通过！', 'green');
    } else {
        log('\n⚠️  部分测试失败，请检查上述错误信息', 'yellow');
    }

    return results;
}

// 运行测试
if (typeof fetch === 'undefined') {
    // Node.js 18+ 内置 fetch，如果版本较低需要安装 node-fetch
    logError('当前Node.js版本可能不支持fetch，请使用Node.js 18+或安装node-fetch');
    process.exit(1);
}

runTests()
    .then(() => {
        log('\n测试完成！', 'cyan');
        process.exit(0);
    })
    .catch(error => {
        logError(`测试执行出错: ${error.message}`);
        console.error(error);
        process.exit(1);
    });
