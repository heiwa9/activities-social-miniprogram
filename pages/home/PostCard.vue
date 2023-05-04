<template>
  <div class="post-card" @click="goToDetail">
    <div class="post-title">{{ post.title }}</div>
    <div class="post-content">{{ post.content }}</div>
    <div class="post-footer">
      <div class="post-author">
        <img class="author-avatar" :src="post.author.avatar" />
        <div class="author-name">{{ post.author.name }}</div>
        <div class="post-time">{{ post.time }}</div>
      </div>
      <div class="post-support">
        <div class="support-count">{{ post.supports.length }}</div>
        <div class="supporters">
          <img
            class="supporter-avatar"
            v-for="(supporter, index) in post.supports.slice(0, 4)"
            :key="index"
            :src="supporter.avatar"
          />
          <uni-icon class="uni-icon-likefill"></uni-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  methods: {
    goToDetail() {
      uni.navigateTo({
        url: `/pages/post-detail/post-detail?id=${this.post.id}`,
      });
    },
  },
};
</script>
<style scoped>
.post-card {
  margin: 20rpx;
  padding-bottom: 20rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.post-card:hover {
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2);
}

.post-title {
  font-size: 34rpx;
  color: #333;
  margin-bottom: 10rpx;
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.post-content {
  font-size: 30rpx;
  color: #666;
  margin: 20rpx;
  line-height: 1.5;
}

.post-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28rpx;
  color: #999;
  padding: 20rpx;
  border-top: 1rpx solid #eee;
}

.post-author {
  display: flex;
  align-items: center;
}

.author-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}

.author-name {
  font-weight: bold;
  color: #333;
}

.post-support {
  display: flex;
  align-items: center;
}

.support-count {
  margin-right: 10rpx;
}

.supporters {
  display: flex;
  align-items: center;
  margin-right: 10rpx;
}

.supporter-avatar {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  margin-right: -10rpx;
  border: 2rpx solid #fff;
}

.uni-icon {
  font-size: 36rpx;
  margin-left: 10rpx;
  color: #999;
}

.uni-icon-likefill {
  color: #ff4444;
}

</style>