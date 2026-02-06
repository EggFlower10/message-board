<!-- pc端 -->
<template>
  <div class="pc-guide">
    <div class="guide-content">
      <h1>请在手机端浏览</h1>
      <van-button type="primary" @click="goBack" class="back-btn">返回</van-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.pc-guide {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
}

.guide-content {
  text-align: center;
  padding: 2rem;
  background-color: #fff;
  border-radius: 0.2667rem;
  box-shadow: 0 0 0.2667rem rgba(0,0,0,0.1);
}

h1 {
  font-size: 1.0667rem;
  margin-bottom: 0.5333rem;
  color: #333;
}

p {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 1.0667rem;
}

.back-btn {
  width: 8rem;
}
</style>