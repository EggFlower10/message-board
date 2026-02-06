'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // 启用跨域插件
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  // 启用 Sequelize（MySQL ORM）
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
};