<!-- 手机端 -->
<template>
  <div class="container">
    <!-- 头部区域 -->
    <div class="header">
      <div class="title">蛋花的留言版</div>
      <p class="subtitle">这里是蛋花的留言板，认识蛋花的宝贝们都可以在这里留下你们的留言哦</p>
      <p class="tip">蛋花寄语</p>
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
    v-model="currentPage" 
    :page-size="pageSize" 
    :total-items="totalCount" 
    :page-count="totalPage" 
    :show-page-size="5"
    force-ellipses
    @change="handlePageChange" 
    @prev-click="handlePrevClick" 
    @next-click="handleNextClick" 
    prev-text="<"
    next-text=">"
    class="pagination"
    active-color="#1677ff"
    disabled-color="#ccc"
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
                accept="image/jpg,image/jpeg,image/png" 
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
              v-model="username"
              placeholder="请输入你的昵称（1-15个字符）"
              :border="false"
              class="form-input"
              :rules="[{ required: true, message: '请输入昵称' }, { max: 15, message: '昵称不能超过15个字符' }]"
            />
          </div>

          <!-- 留言内容输入 -->
          <div class="form-group">
            <label class="form-label required form-label2">留言内容</label>
            <van-field
              v-model="content"
              type="textarea"
              maxlength="200"
              placeholder="想说点什么？（1-200个字符）"
              required
              :border="false"
              class="form-textarea"
              rows="4"
              :rules="[{ required: true, message: '请输入留言内容' }, { max: 200, message: '留言内容不能超过200个字符' }]"
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
import { ref, onMounted,computed} from 'vue'
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
// 接口配置
const request = axios.create({
  baseURL: 'http://772f420.r10.cpolar.top/api',
  timeout: 300000
})
// 定义存储key
const LIKE_STORAGE_KEY = 'message_liked_ids';

// 读取本地存储的点赞ID
const getLikedIds = () => {
  const likedStr = localStorage.getItem(LIKE_STORAGE_KEY);
  return likedStr ? JSON.parse(likedStr) : [];
};

// 保存点赞ID列表到本地
const saveLikedIds = (likedIds) => {
  localStorage.setItem(LIKE_STORAGE_KEY, JSON.stringify(likedIds));
};

// 检查某条留言是否被点赞
const isLiked = (id) => {
  const likedIds = getLikedIds();
  return likedIds.includes(id);
};
const router = useRouter()

// 响应拦截器处理错误
request.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error
    if (response) {
      const errorMsg = response.data?.message || '操作失败'
      showFailToast(errorMsg)
      
      if (response.status === 422 && response.data?.errors) {
        const firstError = response.data.errors[0]
        showFailToast(`${firstError.field}：${firstError.message}`)
      }
    } else {
      showFailToast('网络错误，请检查连接')
    }
    return Promise.reject(error)
  }
)

// 响应式数据
const totalCount = ref(0) 
const pageSize = ref(10)
const currentPage = ref(1) 
const showPublishPopup = ref(false)
const username = ref('')
const content = ref('')
const address = ref('')
const avatarUrl = ref('') 
const messageList = ref([]) 
let uploadFile = null; // 保存上传的头像文件
const publishBtnDisabled = ref(false)
// 高德地图KEY
const AMAP_KEY = 'e8ceb40d167f5967b950afcc8bb2ecff';

// 封装友好时间格式
const formatRelativeTime = (isoTime) => {
  const publishTime = new Date(isoTime);
  const now = new Date(); 
  const diff = now - publishTime; 

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  if (diff < minute) {
    return '刚刚';
  }else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes}分钟前`;
  }else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours}小时前`;
  }else {
    const month = publishTime.getMonth() + 1; 
    const day = publishTime.getDate();
    const hour = publishTime.getHours().toString().padStart(2, '0'); 
    const minute = publishTime.getMinutes().toString().padStart(2, '0');
    return `${month}月${day}日 ${hour}:${minute}`;
  }
};

// 自动获取地理位置
const getGeolocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('当前浏览器不支持地理位置获取');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ lat: latitude, lng: longitude });
      },
      (error) => {
        let errorMsg = '获取位置失败';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = '您拒绝了位置权限请求';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = '位置信息不可用';
            break;
          case error.TIMEOUT:
            errorMsg = '获取位置超时';
            break;
          case error.UNKNOWN_ERROR:
            errorMsg = '未知错误';
            break;
        }
        reject(errorMsg);
      },
      {
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 300000 
      }
    );
  });
};

const getAddressByGeo = async (lat, lng) => {
  try {
    const res = await axios.get('https://restapi.amap.com/v3/geocode/regeo', {
      params: {
        location: `${lng},${lat}`, 
        key: AMAP_KEY,
        extensions: 'base',
        batch: false,
        roadlevel: 0
      }
    });

    if (res.data.status === '1' && res.data.regeocode) {
      const { province, city } = res.data.regeocode.addressComponent;
      const finalCity = city === province ? '' : city;
      const addressText = `${province}${finalCity}`.replace('市', '').replace('省', '');
      return addressText || '未知位置';
    } else {
      return '未知位置';
    }
  } catch (error) {
    console.error('逆地理编码失败：', error);
    return '未知位置';
  }
};

// 获取地址
const getAddress = async () => {
  try {
    showLoadingToast({ message: '正在获取位置...', forbidClick: true });
    const { lat, lng } = await getGeolocation();
    const addressText = await getAddressByGeo(lat, lng);
    address.value = addressText;
    closeToast();
    return addressText;
  } catch (error) {
    closeToast();
    showFailToast(`${error}，将使用默认地址`);
    address.value = '未知位置';
    return address.value;
  }
};
// 计算总页数
const totalPage = computed(() => {
  return Math.ceil(totalCount.value / pageSize.value) || 1
})
// 加载留言列表
const loadMessageList = async (targetPage) => {
  if (targetPage < 1 || targetPage > totalPage.value) return
  
  currentPage.value = targetPage
  try {
    const res = await request.get('/messages/list', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value
      }
    })
    
    console.log('留言列表接口返回：', res.data)
    if (res.data) {
      messageList.value = res.data.messages.map(item => ({
        id: item.id,
        nickname: item.username,
        content: item.content,
        location: item.address,
        time: formatRelativeTime(item.created_at),
        like_count: item.like_count,
        is_liked: isLiked(item.id), 
        avatar: item.avatar || item.User?.AvatarUrl || defaultAvatar2
      }));
      totalCount.value = res.data.total;
    }
  }catch (error) {
    console.log('加载留言列表失败：', error)
    showFailToast('加载留言列表失败，请稍后重试')
    messageList.value = [
    ]
    totalCount.value = 0
  }
}

// 上一页点击事件
const handlePrevClick = () => {
  if (currentPage.value > 1) {
    loadMessageList(currentPage.value - 1) 
  }
};

// 下一页点击事件
const handleNextClick = () => {
  if (currentPage.value < totalPage.value) {
    loadMessageList(currentPage.value + 1) 
  }
};

//页码点击事件
const handlePageChange = (value) => {
  loadMessageList(value)
};


// 点赞功能 
const handleLike = async (id) => {
  const item = messageList.value.find(item => item.id === id)
  if (!item) return

  try {
    if (item.is_liked) {
      // 取消点赞 
      await request.delete(`/messages/${id}/like`)
      item.like_count -= 1

      const likedIds = getLikedIds().filter(likedId => likedId !== id);
      saveLikedIds(likedIds);
    } else {
      // 点赞 
      await request.put(`/messages/${id}/like`)
      item.like_count += 1
      
      const likedIds = getLikedIds();
      if (!likedIds.includes(id)) {
        likedIds.push(id);
        saveLikedIds(likedIds);
      }
    }
    // 切换点赞状态
    item.is_liked = !item.is_liked
    showSuccessToast(item.is_liked ? '点赞成功' : '取消点赞成功')
  } catch (error) {
    console.error('点赞操作失败：', error)
    showFailToast('操作失败，请稍后重试')
  }
}

// 触发文件选择框
const triggerFileInput = () => {
  document.querySelector('.file-input').click()
}

// 处理头像上传预览
const handleAvatarUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    showFailToast('仅支持jpg/jpeg/png格式的图片！');
    return;
  }
  
  if (file.size > 10 * 1024 * 1024) {
    showFailToast('头像不能超过10M！');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    avatarUrl.value = e.target.result;
  };
  reader.readAsDataURL(file);
  uploadFile = file; 
  e.target.value = ''; 
};

// 发布留言
const handlePublish = async () => {
if (publishBtnDisabled.value) {
  showFailToast('每分钟最多发布3条留言，请1分钟后再试');
  return;
}
  if (!username.value.trim()) {
    showFailToast('请输入你的昵称！');
    return;
  }
  if (username.value.length > 15) {
    showFailToast('昵称不能超过15个字符！');
    return;
  }
  if (!content.value.trim()) {
    showFailToast('请输入留言内容！');
    return;
  }
  if (content.value.length > 200) {
    showFailToast('留言内容不能超过200个字符！');
    return;
  }


  await getAddress();

  showLoadingToast({ message: '提交中...', forbidClick: true });
  try {

    const formData = new FormData();
    formData.append('username', username.value.trim());
    formData.append('content', content.value.trim());
    formData.append('address', address.value.trim()); 
    
    if (uploadFile) {
      formData.append('avatar', uploadFile);
    }

    const res = await request.post('/messages/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      }
    });

    if (res.status === 201) {
      showSuccessToast('留言发布成功！');
      showPublishPopup.value = false;
      username.value = '';
      content.value = '';
      avatarUrl.value = '';
      uploadFile = null;
      
      loadMessageList();
    }
  } catch (error) {
  if (error.response?.data?.code === 429) {
    console.error('每分钟最多发布3条留言：', error);
    // 禁用按钮1分钟
    publishBtnDisabled.value = true;
    setTimeout(() => {
      publishBtnDisabled.value = false;
    }, 60 * 1000);
    showFailToast('每分钟最多发布3条留言，请1分钟后再试');
  }else {
    console.error('发布留言失败：', error);
    showFailToast('留言发布失败，请稍后重试');
  }
  }finally {
    closeToast();
  }
};

onMounted(() => {
  loadMessageList()
  
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
/* 省略号样式优化 */
::v-deep .van-pagination__ellipsis {
  color: #999;
  margin: 0 0.05rem;
}
</style>