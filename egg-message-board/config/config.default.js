/* eslint valid-jsdoc: "off" */
'use strict';
const path = require('path');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  config.keys = appInfo.name + '_1769850371471_1280';
  // 跨域配置
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  // MySQL 配置（
  config.sequelize = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'danhua_message_board',
    username: 'root',
    password: '123456',
    define: {
      underscored: true,
      timestamps: true,
    },
    timezone: '+08:00',
  };

  // 端口配置
  config.cluster = {
    listen: {
      port: 9981,
      hostname: '0.0.0.0',
    },
  };

  // 关闭 CSRF
  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.middleware = [];


  const userConfig = {
    // myAppName: 'egg',
  };
  config.bodyParser = {
    jsonLimit: '10mb',
    formLimit: '10mb',
  };

  // 文件上传
  config.multipart = {
    mode: 'file',
    fileSize: '10mb',
    fileExtensions: ['.jpg', '.jpeg', '.png', '.gif'],
  };

  // 静态资源配置
  config.static = {
    prefix: '/uploads/',
    dir: path.join(appInfo.baseDir, 'app/public/uploads'),
  };

  return {
    ...config,
    ...userConfig,
  };
};
