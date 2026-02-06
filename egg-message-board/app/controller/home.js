const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = '这是蛋花的留言板后台接口';
  }
}

module.exports = HomeController;
