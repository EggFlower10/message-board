'use strict';

module.exports = app => {
    // 1. 全局限流缓存：key=设备ID，value=发布时间戳数组
    app.messageLimitCache = {};

    // 2. 定时清理过期数据（每30秒执行一次）
    setInterval(() => {
        const now = Date.now();
        const oneMinute = 60 * 1000;
        // 遍历所有设备ID，清理1分钟前的记录
        for (const deviceId in app.messageLimitCache) {
            const timestamps = app.messageLimitCache[deviceId];
            // 过滤出1分钟内的记录，覆盖原数组
            app.messageLimitCache[deviceId] = timestamps.filter(ts => ts > now - oneMinute);
            // 若数组为空，删除该设备ID，节省内存
            if (app.messageLimitCache[deviceId].length === 0) {
                delete app.messageLimitCache[deviceId];
            }
        }
        console.log('限流缓存清理完成，当前缓存设备数：', Object.keys(app.messageLimitCache).length);
    }, 30 * 1000); // 30秒清理一次
};