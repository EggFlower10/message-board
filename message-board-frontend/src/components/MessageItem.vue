<template>
  <div class="message-item">
    <img :src="item.avatar" class="avatar" alt="头像" />
    <div class="content">
      <div class="nickname">{{ item.nickname }}</div>
      <div class="text">{{ item.content }}</div>
      <div class="meta">
        <span class="location">{{ item.location }}</span>
        <span class="time">{{ item.time }}</span>
      </div>
    </div>
    <div class="like-btn" @click="$emit('like', item.id)">
      <span :class="['like-count', item.isLiked ? 'liked' : '']">{{ item.likeCount }}</span>
      <span :class="['like-icon', item.isLiked ? 'liked' : '']"><svg class="like-icon1" aria-hidden="true">
  <use xlink:href="#icon-good"></use>
</svg></span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.message-item {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
}

.avatar {
    margin-left: 17px;
    margin-top: 24px;
margin-right: 14px;
  left: 32px;
top: 24px;
width: 62px;
height: 60px;
opacity: 1;
border-radius: 1000px;
/* background: url(https://img.js.design/assets/img/69779dc6d3013295f86eb87d.png#5bc01a844abeaaf5af796e119858abcd); */

  border: 1px solid rgba(0, 0, 0, 1);
}

.content {
  flex: 1;
}

.nickname {
  margin-bottom: 21px;
  font-size: 26px;
font-weight: 400;
letter-spacing: 0px;
line-height: 35.67px;
color: rgba(51, 51, 51, 1);
text-align: left;
vertical-align: top;
margin-top: 34px;
}

.text {
font-size: 28px;
font-weight: 400;
letter-spacing: 0px;
line-height: 38.42px;
color: rgba(51, 51, 51, 1);
text-align: left;
vertical-align: top;
  margin-bottom: 20px;
}

.meta {
  display: flex;
  gap: 0.4rem; 
  font-size: 22px;
font-weight: 400;
letter-spacing: 0px;
line-height: 30.18px;
color: rgba(153, 153, 153, 1);
text-align: left;
vertical-align: top;
margin-bottom: 23px;
}

.like-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.like-count {
  font-size: 26px;
font-weight: 400;
letter-spacing: 0px;
line-height: 35.67px;
color: rgba(153, 153, 153, 1);
text-align: left;
vertical-align: top;
}

/* .like-icon {
  width: 20.89px;
height: 24.42px;
} */
.like-icon1 {
    width: 0.37853rem;
    height: 0.46rem;
    margin-left: 10px;
    color:rgba(255, 87, 51, 1);;
}
.liked {
 color: rgba(255, 87, 51, 1);
 fill:rgba(255, 87, 51, 1);
}
</style>