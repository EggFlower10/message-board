<!-- s手机端 -->
<template>
  <div class="container">
    <!-- 头部区域 -->
    <div class="header">
      <div class="title">蛋糕的留言版</div>
      <p class="subtitle">这里是蛋糕的留言板，认识蛋糕的宝贝们都可以在这里留下你们的留言哦</p>
      <p class="tip">蛋糕寄语</p>
    </div>

    <!-- 留言总数 -->
    <div class="comment-count">全部评论({{ totalCount }})</div>

    <!-- 留言列表 -->
    <div class="message-list">
      <MessageItem 
        v-for="(item, index) in messageList" 
        :key="item.id" 
        :item="item" 
        @like="handleLike"
      />
    </div>

    <!-- 分页组件 -->
    <van-pagination
      v-model:current="currentPage"
      :total-items="totalCount"
      :items-per-page="pageSize"
      @change="handlePageChange"
      prev-text="<" 
      next-text=">" 
      class="pagination"
    />

    <!-- 底部输入框 -->
    <div class="bottom-input">
      <svg class="icon-bi" aria-hidden="true">
        <use xlink:href="#icon-bi"></use>
      </svg>
      <input 
        type="text" 
        placeholder="我来踩踩哦..." 
        @click="showPublishPopup = true"
        class="input-field"
      />
    </div>

    <!-- 发布弹窗 -->
    <van-popup 
      v-model:show="showPublishPopup" 
      position="bottom" 
      :style="{ width: '753px', height: '579px' }"
      class="publish-popup"
      :overlay="false" 
      :close-on-overlay-click="false" 
    >
      <!-- 弹窗内容容器 -->
       <div class="popup-content">
        <!-- 弹窗头部 -->
        <div class="popup-header">
          <div style="display: flex;">
          <van-icon name="arrow-left" @click="showPublishPopup = false" class="back-icon" />
          <div class="header-back" @click="showPublishPopup = false">返回</div>
          </div>
          <div class="header-title">请留言</div>
          <van-icon name="cross" @click="showPublishPopup = false" class="close-icon" />
        </div>
        <div class="publish-form">
          <!-- 头像上传区域 -->
          <div class="form-group">
            <label class="form-label">头像</label>
            <div class="avatar-upload">
              <div class="avatar-wrapper" @click="triggerFileInput">
                <img 
                  :src="avatarUrl || defaultAvatar" 
                  class="avatar-preview" 
                  alt="头像"
                />
              </div>
              <!-- 隐藏的文件上传输入框 -->
              <input 
                type="file" 
                accept="image/*" 
                class="file-input"
                @change="handleAvatarUpload"
              />
              <p class="avatar-tip">建议尺寸200*200，最多1张，单个图片不超过10M</p>
            </div>
          </div>

          <!-- 昵称输入 -->
          <div class="form-group">
            <label class="form-label required">昵称</label>
            <van-field
              v-model="nickname"
              placeholder="请输入你的昵称"
              :border="false"
              class="form-input"
            />
          </div>

          <!-- 留言内容输入 -->
          <div class="form-group">
            <label class="form-label required form-label2">留言内容</label>
            <van-field
              v-model="content"
              type="textarea"
              maxlength="200"
              placeholder="想说点什么？"
              required
              :border="false"
              class="form-textarea"
              rows="4"
            />
          </div>

          <!-- 提交按钮 -->
          <van-button 
            type="primary" 
            @click="handlePublish" 
            block
            class="submit-btn"
            :style="{ 
              background: '#1677ff', 
              border: 'none', 
              borderRadius: '8px', 
              height: '50px', 
              lineHeight: '50px',
              fontSize: '16px'
            }"
          >
            提交留言
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MessageItem from '../components/MessageItem.vue'
import { useRouter } from 'vue-router'
import defaultAvatar from '../assets/image/touxiang.png' 
import defaultAvatar2 from '../assets/image/image-tx.png'
import { 
  showToast, 
  showFailToast, 
  showSuccessToast, 
  showLoadingToast, 
  closeToast       
} from 'vant';
import axios from 'axios'

const router = useRouter()

// 接口
const request = axios.create({
  baseURL: 'http://localhost:9981',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

const totalCount = ref(0) 
const pageSize = ref(4)
const currentPage = ref(1) 
const showPublishPopup = ref(false)
const nickname = ref('')
const content = ref('')
const avatarUrl = ref('') 
const messageList = ref([]) 

// 加载留言列表
const loadMessageList = async () => {
  try {
    const res = await request.get('/api/message/list', {
      params: {
        currentPage: currentPage.value,
        pageSize: pageSize.value
      }
    })
    if (res.data.code === 200) {
      messageList.value = res.data.data.list
      totalCount.value = res.data.data.totalCount
    }
  } catch (error) {
    // console.error('加载留言列表失败：', error)
    // showFailToast('加载留言失败，请稍后重试');
    messageList.value = [
      {
        id: 1,
        avatar:defaultAvatar2,
        nickname: '斯巴拉西蛋糕',
        content: '功能不错',
        location: '广东佛山',
        time: '24分钟前',
        likeCount: 142,
        isLiked: true
      },
      {
        id: 2,
        avatar: defaultAvatar2,
        nickname: '斯巴拉西蛋糕',
        content: '功能不错',
        location: '广东佛山',
        time: '01月27日 09:00',
        likeCount: 142,
        isLiked: false
      },
      {
        id: 3,
        avatar: defaultAvatar2,
        nickname: '斯巴拉西蛋糕',
        content: '功能不错',
        location: '广东佛山',
        time: '01月27日 09:00',
        likeCount: 142,
        isLiked: false
      },
      {
        id: 4,
        avatar: defaultAvatar2,
        nickname: '斯巴拉西蛋糕',
        content: '功能不错',
        location: '广东佛山',
        time: '01月27日 09:00',
        likeCount: 142,
        isLiked: false
      },
      {
        id: 5,
        avatar: defaultAvatar2,
        nickname: '斯巴拉西蛋糕',
        content: '功能不错',
        location: '广东佛山',
        time: '01月27日 09:00',
        likeCount: 142,
        isLiked: false
      }
    ]
    totalCount.value = 220
  }
}

// 分页切换
const handlePageChange = (page) => {
  currentPage.value = page
  loadMessageList()
}

// 点赞功能（调用接口）
const handleLike = async (id) => {
  const item = messageList.value.find(item => item.id === id)
  if (!item) return

  try {
    // 调用点赞接口
    const res = await request.post('/api/message/like', {
      id,
      isLiked: item.is_liked || item.isLiked 
    })
    if (res.data.code === 200) {
      item.likeCount = item.isLiked ? item.likeCount - 1 : item.likeCount + 1
      item.isLiked = !item.isLiked
    }
  } catch (error) {
    console.error('点赞失败：', error)
    showFailToast('点赞失败，请稍后重试')
  }
}

// 触发文件选择框
const triggerFileInput = () => {
  document.querySelector('.file-input').click()
}

// 处理头像上传
const handleAvatarUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showFailToast('请选择图片格式的文件！');
    return;
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    showFailToast('头像大小不能超过10M！请选择更小的图片');
    return;
  }


  showLoadingToast({
    message: '图片压缩中...',
    forbidClick: true,
    duration: 0
  });

  const img = new Image();
  img.onload = function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const maxWH = 800;
    let w = img.width;
    let h = img.height;
    if (w > maxWH || h > maxWH) {
      const ratio = Math.min(maxWH / w, maxWH / h);
      w = w * ratio;
      h = h * ratio;
    }
    
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);
    
    let quality = 0.8;
    let base64 = canvas.toDataURL('image/jpeg', quality);
    
    while (base64.length > 1024 * 1024 && quality > 0.1) {
      quality -= 0.1; //
      base64 = canvas.toDataURL('image/jpeg', quality);
    }

    avatarUrl.value = base64;
    URL.revokeObjectURL(img.src);
    closeToast();
    showSuccessToast('头像压缩完成！');
  };

  img.onerror = () => {
    closeToast();
    showFailToast('图片加载失败，请重新选择');
  };

  img.src = URL.createObjectURL(file);
  e.target.value = '';
};

// 发布留言
const handlePublish = async () => {
  if (!nickname.value.trim()) {
    showFailToast('请输入你的昵称！');
    return;
  }
  if (!content.value.trim()) {
    showFailToast('请输入留言内容！');
    return;
  }

  try {
    showLoadingToast({
      message: '提交中...',
      forbidClick: true,
      duration: 0
    });

    // 调用发布接口
    const res = await request.post('/api/message/publish', {
      nickname: nickname.value.trim(),
      content: content.value.trim(),
      avatar: avatarUrl.value || defaultAvatar
    });

    closeToast();
    if (res.data.code === 200) {
      showSuccessToast('留言发布成功！');
      showPublishPopup.value = false;
      nickname.value = '';
      content.value = '';
      avatarUrl.value = '';
      loadMessageList();
    } else {
      showFailToast(res.data.msg || '发布失败，请重试');
    }
  } catch (error) {
    closeToast();
    console.error('发布错误：', error);
    if (error.response?.status === 413) {
      showFailToast('头像压缩后体积仍过大，请换一张更小的图片');
    } else if (error.message.includes('Network Error')) {
      showFailToast('网络错误，请检查后端是否启动');
    } else {
      showFailToast('发布失败：' + (error.message || '未知错误'));
    }
  }
};


onMounted(() => {
  loadMessageList()
  // 设备检测逻辑（可选保留）
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  if (!isMobile) router.push('/pc-guide')
})
</script>

<style scoped>
.container {
  padding: 0.5333rem;
  min-height: 100vh;
  background-color: #fff;
}

.header {
  text-align: center;
  margin-bottom: 44px;
}

.title {
  font-size: 33px;
  margin-bottom: 53px;
}

.subtitle {
  font-size: 36px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 49.39px;
  color: rgba(51, 51, 51, 1);
  text-align: left;
  margin-bottom: 26px;
}

.tip {
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 30.18px;
  color: rgba(153, 153, 153, 1);
  text-align: left;
  vertical-align: top;
}

.comment-count {
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 38.42px;
  color: rgba(51, 51, 51, 1);
  text-align: left;
  vertical-align: top;
}

.message-list {
  margin-bottom: 32px;
}

.pagination {
  margin-bottom: 1.6rem;
}

.bottom-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 43px 31px 45px 31px; 
  border-top: 1px solid #eee;
  background: rgba(255, 255, 255, 1);
  display: flex;
}
.icon-bi{
  width: 25.53px;
  height: 27.01px;
  fill:  rgba(153, 153, 153, 1);
  position: absolute;
  top: 39%;
  left: 7%;
}
.input-field {
  padding: 0 60px; 
  border: 1px solid #eee;
  width: 690px;
  height: 61px;
  border-radius: 35px 35px 35px 35px;
  background: rgba(245, 245, 245, 1);
  font-size: 24px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 32.93px;
  color: rgba(51, 51, 51, 1);
  text-align: left;
  vertical-align: top;
}

.publish-popup {
  padding: 0 !important;
  background: transparent !important;
  bottom: auto !important;
  top: 56% !important;
}

.popup-content {
  width: 753px;
  height: 579px;
  opacity: 1;
  border-radius: 25px 25px 0 0;
  background: rgba(255, 255, 255, 1);
  overflow: hidden; 
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 40px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
}

.back-icon, .close-icon {
  font-size: 25px;
  color: #666;
}

.header-title {
font-size: 22px;
font-weight: 400;
letter-spacing: 0px;
line-height: 22px;
color: rgba(50, 50, 51, 1);
}
.header-back{
font-size: 22px;
font-weight: 400;
letter-spacing: 0px;
line-height: 0.3467rem;
color: rgba(150, 151, 153, 1);
text-align: left;
vertical-align: top;
}
.publish-form {
  padding: 20px;
  height: calc(100% - 60px);
  box-sizing: border-box;
  overflow-y: auto; 
}


.form-group {
  margin-bottom: 20px;
  display: flex;
}

.form-label {
  margin-bottom: 8px;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 31.86px;
  color: rgba(0, 0, 0, 1);
  text-align: left;
  vertical-align: top;
  margin-left: 70px;
}
.form-label2{
  margin-left: 30px;
}


.required::after {
  content: '*';
  color: #FF4D4F;
  margin-left: 4px;
}


.avatar-upload {
  display: flex;
  flex-direction: column;
  margin-left: 31px;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  background: #f8f8f8;
  margin-bottom: 8px;
  object-fit: cover;
}

.avatar-wrapper {
  position: relative;
  cursor: pointer;
}


.file-input {
  display: none;
}

.avatar-tip {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 16px;
  color: rgba(150, 151, 153, 1);
}


.form-input, .form-textarea {
  font-size: 14px;
  color: #333;
  width: 482px;
  height: 41px;
  opacity: 1;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(229, 229, 229, 1);
  margin-left: 18px;
}
.form-textarea{
  height: 258px;
}

.submit-btn {
  margin-top: 30px;
}

::v-deep .custom-toast {
  background: rgba(0, 0, 0, 0.7) !important;
  color: #fff !important;
  border-radius: 8px !important;
  padding: 12px 16px !important;
  font-size: 16px !important;
}

::v-deep .van-pagination__item {
  width: 0.53rem;
  height: 0.53rem;
  border-radius: 0.02rem;
  background: rgba(255, 255, 255, 1);
  font-size: 0.29rem;
  font-weight: 400;
  line-height: 0.26rem;
  color: rgba(50, 50, 51, 1);
  border: 0.01rem solid rgba(220, 222, 224, 1);
  margin: 0 0.02rem !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

::v-deep .van-pagination {
  justify-content: center;
  margin: auto;
  margin-bottom: 2rem;
  display: flex;
}

::v-deep .van-pagination__items {
  display: flex;
  justify-content: center; 
  align-items: center;    
}

::v-deep .van-pagination__item--active {
  border-radius: 0.02rem;
  background: rgba(25, 137, 250, 1);
  color: rgba(255, 255, 255, 1);
  border:0.01rem solid rgba(25, 137, 250, 1);
}

::v-deep .van-pagination__item:not(.van-pagination__item--active):not(:disabled):hover {
  border-radius: 0.02rem;
  background: rgba(25, 137, 250, 1);
  color: rgba(255, 255, 255, 1);
  border:0.01rem solid rgba(25, 137, 250, 1);
}

</style>