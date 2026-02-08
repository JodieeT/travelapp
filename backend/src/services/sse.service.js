/**
 * SSE 服务：维护连接并广播价格更新
 */
const clients = new Set();

function sendEvent(res, event, data) {
    if (res.writableEnded) return;
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
}

exports.subscribe = (res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    clients.add(res);
    sendEvent(res, 'connected', { message: 'connected', ts: Date.now() });

    res.on('close', () => {
        clients.delete(res);
    });
};

exports.broadcastPriceUpdate = (payload) => {
    const data = { type: 'price_update', ...payload, ts: Date.now() };
    for (const res of clients) {
        try {
            sendEvent(res, 'price_update', data);
        } catch (e) {
            clients.delete(res);
        }
    }
};
