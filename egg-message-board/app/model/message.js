'use strict';

module.exports = app => {
    const { BIGINT, STRING, INTEGER, BOOLEAN, DATE } = app.Sequelize;

    const Message = app.model.define('message', {
        id: {
            type: BIGINT,
            primaryKey: true,
            autoIncrement: true,
            comment: '主键ID',
        },
        avatar: {
            type: STRING(255),
            defaultValue: 'http://53e1b575.r16.cpolar.top/uploads/default-avatar.jpg',
            comment: '头像地址',
        },
        nickname: {
            type: STRING(50),
            allowNull: false,
            comment: '昵称',
        },
        content: {
            type: STRING(1000),
            allowNull: false,
            comment: '留言内容',
        },
        location: {
            type: STRING(100),
            defaultValue: '未知位置',
            comment: '位置',
        },
        time: {
            type: STRING(20),
            defaultValue: '刚刚',
            comment: '发布时间文案',
        },
        like_count: {
            type: INTEGER,
            defaultValue: 0,
            comment: '点赞数',
        },
        // is_liked: {
        //     type: BOOLEAN,
        //     defaultValue: false,
        //     comment: '是否点赞',
        // },
        created_at: {
            type: DATE,
            defaultValue: app.Sequelize.NOW,
            comment: '创建时间',
        },
        updated_at: {
            type: DATE,
            defaultValue: app.Sequelize.NOW,
            comment: '更新时间',
        },
    }, {
        tableName: 'danhua_message',
        comment: '留言表',
    });

    return Message;
};