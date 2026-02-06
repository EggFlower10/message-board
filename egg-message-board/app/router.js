/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.get('/api/message/list', controller.message.getMessageList); // 获取列表
  router.post('/api/message/publish', controller.message.publishMessage); // 发布留言
  router.put('/api/messages/:id/like', controller.message.likeMessage);    // 点赞路由
  router.delete('/api/messages/:id/like', controller.message.cancelLikeMessage); // 取消点赞路由
  // 头像上传接口
  router.post('/api/upload/avatar', controller.upload.avatar);

};
