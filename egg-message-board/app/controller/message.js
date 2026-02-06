'use strict';

const { Controller } = require('egg');

class MessageController extends Controller {
    /**获取留言列表（分页） */
    async getMessageList() {
        const { ctx, app } = this;
        try {
            const { currentPage = 1, pageSize = 10 } = ctx.query;
            const pageNum = parseInt(currentPage);
            const pageSizeNum = parseInt(pageSize);

            // 分页查询
            const { count, rows } = await app.model.Message.findAndCountAll({
                limit: pageSizeNum,
                offset: (pageNum - 1) * pageSizeNum,
                order: [['id', 'DESC']],
            });

            // 遍历留言列表
            const list = rows.map(item => {
                const data = item.dataValues;
                const timestamp = new Date(data.created_at).getTime();
                return {
                    ...data,
                    timestamp: timestamp
                };
            });
            ctx.body = {
                code: 200,
                data: {
                    list: list,
                    totalCount: count,
                },
                msg: '获取留言列表成功',
            };
        } catch (error) {
            console.error('获取留言列表失败：', error);
            ctx.body = {
                code: 500,
                data: null,
                msg: '获取留言列表失败',
            };
        }
    }

    /** 2. 发布新留言*/
    async publishMessage() {
        const { ctx, app } = this;
        try {
            const { nickname, content, avatar, location, deviceId } = ctx.request.body;

            if (!nickname || !content) {
                ctx.body = {
                    code: 400,
                    data: null,
                    msg: '昵称和留言内容不能为空',
                };
                return;
            }
            if (!deviceId) {
                return ctx.body = {
                    code: 400,
                    msg: '设备标识不能为空',
                    data: null
                };
            }
            // 限流
            const now = Date.now();
            const oneMinute = 60 * 1000;
            const maxCount = 3;

            // 初始化该设备的缓存（若不存在）
            if (!app.messageLimitCache[deviceId]) {
                app.messageLimitCache[deviceId] = [];
            }
            const timestamps = app.messageLimitCache[deviceId];

            // 过滤掉1分钟前的过期记录
            const validTimestamps = timestamps.filter(ts => ts > now - oneMinute);
            // 更新缓存（只保留有效记录）
            app.messageLimitCache[deviceId] = validTimestamps;
            // 检查是否超过限流阈值
            if (validTimestamps.length >= maxCount) {
                ctx.body = {
                    code: 429,
                    msg: `每分钟最多发布${maxCount}条留言，请1分钟后再试`,
                    data: null
                };
                return;
            }
            // 添加当前时间戳到缓存
            app.messageLimitCache[deviceId].push(now);

            const publishTime = new Date();
            const result = await ctx.model.Message.create({
                nickname,
                content,
                avatar,
                location,
                like_count: 0,
                created_at: publishTime,
            });
            ctx.body = {
                code: 200,
                msg: '发布成功',
                data: {
                    ...result.dataValues,
                    timestamp: publishTime.getTime(),
                },
            };
        } catch (error) {
            console.error('发布留言失败：', error);
            ctx.body = {
                code: 500,
                data: null,
                msg: '留言发布失败',
            };
        }
    }

    /**3. 点赞/取消点赞*/
    async likeMessage() {
        const { ctx, app } = this;
        try {
            const { id } = ctx.params;
            const messageId = parseInt(id);
            if (isNaN(messageId)) {
                ctx.body = {
                    code: 400,
                    data: null,
                    msg: '无效的留言ID',
                };
                return;
            }

            const message = await app.model.Message.findByPk(messageId);
            if (!message) {
                ctx.body = {
                    code: 404,
                    data: null,
                    msg: '留言不存在',
                };
                return;
            }

            await message.update({
                like_count: message.like_count + 1,
            });

            const { is_liked, ...messageData } = message.dataValues;
            ctx.body = {
                code: 200,
                data: {
                    ...messageData,
                    timestamp: new Date().getTime()
                },
                msg: '点赞成功',
            };
        } catch (error) {
            console.error('点赞操作失败：', error);
            ctx.body = {
                code: 500,
                data: null,
                msg: '点赞操作失败',
            };
        }
    }

    /** 4. 取消点赞（DELETE请求）- 仅减少点赞数 */
    async cancelLikeMessage() {
        const { ctx, app } = this;
        try {
            const { id } = ctx.params;
            const messageId = parseInt(id);

            if (isNaN(messageId)) {
                ctx.body = {
                    code: 400,
                    data: null,
                    msg: '无效的留言ID',
                };
                return;
            }

            const message = await app.model.Message.findByPk(messageId);
            if (!message) {
                ctx.body = {
                    code: 404,
                    data: null,
                    msg: '留言不存在',
                };
                return;
            }

            await message.update({
                like_count: Math.max(0, message.like_count - 1),
            });
            const { is_liked, ...messageData } = message.dataValues;
            ctx.body = {
                code: 200,
                data: {
                    ...messageData,
                    timestamp: new Date().getTime()
                },
                msg: '取消点赞成功',
            };
        } catch (error) {
            console.error('取消点赞操作失败：', error);
            ctx.body = {
                code: 500,
                data: null,
                msg: '取消点赞操作失败',
            };
        }
    }

}

module.exports = MessageController;