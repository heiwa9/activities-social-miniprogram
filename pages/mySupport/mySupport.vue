<template>
	<view>
		<view v-if="posts">
			<post-list :posts="posts"></post-list>
		</view>
		<view v-else class="container">
			<view class="message">赶紧去发布一条内容吧！</view>
		</view>
	</view>
</template>

<script>
	import postList from "@/components/postList.vue"

	export default {
		components: {
			postList
		},
		data() {
			return {
				posts: [],
			}
		},
		onShow() {
			let user = uni.getStorageSync("mine");
			this.$api.getUserSupporterPost(user.id).then((res) => {
				this.posts = res.list
			})
		},
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50vh;
		/* 设置容器高度为视口高度 */
	}

	.message {
		color: gray;
		text-align: center;
		margin: auto;
		/* 垂直居中 */
	}
</style>