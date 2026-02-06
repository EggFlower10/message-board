const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs');
const { nanoid } = require('nanoid');

class UploadController extends Controller {
    async avatar() {
        const { ctx } = this;
        try {
            //获取上传的文件
            const file = ctx.request.files[0];
            if (!file) {
                ctx.body = { code: 400, msg: '请选择要上传的图片' };
                return;
            }

            //生成唯一文件名
            const ext = path.extname(file.filename);
            const fileName = `${nanoid(10)}${ext}`;

            //确保保存目录存在
            const uploadDir = path.join(this.app.config.baseDir, 'app/public/uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            //复制文件到目标目录
            const targetPath = path.join(uploadDir, fileName);
            const readStream = fs.createReadStream(file.filepath);
            const writeStream = fs.createWriteStream(targetPath);
            await new Promise((resolve, reject) => {
                readStream.pipe(writeStream);
                readStream.on('end', resolve);
                readStream.on('error', reject);
            });

            //生成图片访问URL
            const baseUrl = `http://53e1b575.r16.cpolar.top/uploads/`;
            const avatarUrl = baseUrl + fileName;

            ctx.body = {
                code: 200,
                msg: '上传成功',
                data: { avatarUrl },
            };
        } catch (err) {
            console.error('头像上传失败：', err);
            ctx.body = {
                code: 500,
                msg: '头像上传失败',
                data: null,
            };
        } finally {
            if (ctx.request.files && ctx.request.files.length) {
                for (const f of ctx.request.files) {
                    fs.unlinkSync(f.filepath);
                }
            }
        }
    }
}

module.exports = UploadController;