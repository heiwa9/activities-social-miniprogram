<template>
	<view>
		<view class="post-card" v-for="post in posts" :key="post.id" @click="goToPostDetail(post)">
			<view class="post-header">
				<view class="post-title">{{ post.title }}</view>
				<view class="post-ctime">
					{{ (new Date(post.createTime/1000)).toLocaleString('sv-SE', { timeZone: 'Asia/Shanghai' }) }}
				</view>
			</view>
			<view class="post-content">
				{{ post.content }}
				<images-uploader v-if="post.pictures" :tool="false" :images="post.pictures.split(',')">
				</images-uploader>
			</view>
		
			<view class="post-footer">
				<view class="post-author">
					<image :src="post.userAvatar" mode="aspectFill" class="author-avatar"></image>
					<text class="author-name">{{ post.userName }}</text>
				</view>
				<view class="post-support">
					<text class="support-count">{{ post.supportCount }}</text>
					<view class="supporters">
						<image :src="supporter.avatar" mode="aspectFill" class="supporter-avatar"
							v-for="supporter in post.supporters" :key="supporter.id"></image>
					</view>
					<text class="uni-icon uni-icon-likefill"></text>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
		import ImagesUploader from '@/components/ImagesUploader.vue'
	
	export default {
		name:"postList",
		props:{
			posts:{
				type:Array,
				default:()=>[]
			}
		},
		components:{
			ImagesUploader
		},
		methods:{
			goToPostDetail(post) {
				uni.navigateTo({
					url: `/pages/home/PostDetail?id=${post.id}`
				})
			},
		}
	}
</script>

<style lang="scss">
.post-card {
		width: 100%;
		margin-bottom: 10rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
		overflow: hidden;
		transition: box-shadow 0.2s ease;
	}

	.post-card:hover {
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2);
	}

	.post-header {
		display: flex;
		flex-direction: row;
		padding: 20rpx;
		border-bottom: 1rpx solid #eee;
	}

	.post-title {
		flex: 1;
		color: #333;
		font-size: 34rpx;
	}

	.post-ctime {
		flex: 1;
		font-size: 22rpx;
		max-width: 160upx;
		text-align: right;
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

</style>