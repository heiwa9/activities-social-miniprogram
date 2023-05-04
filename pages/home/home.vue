<template>
	<view class="post-list">
		<!-- 搜索框 -->
		<view class="search-bar">
			<input class="search-input" type="text" placeholder="搜索帖子" v-model.trim="search" />
			<view class="search-icon">
				<text class="uni-icon uni-icon-search"></text>
			</view>
		</view>

		<!-- 分类选项卡 -->
		<view class="tab-bar">
			<view class="tab-item" :class="{ active: activeTab === tab.id }" v-for="tab in tabs" :key="tab.id"
				@click="activeTab = tab.id">
				{{ tab.name }}
			</view>
		</view>

		<!-- 帖子列表 -->
		<view class="post-container">
			<view class="post-card" v-for="post in posts" :key="post.id" @click="goToPostDetail(post)">
				<view class="post-header">
					<view class="post-title">{{ post.title }}</view>
					<view class="post-ctime">
						{{ (new Date(post.createTime/1000)).toLocaleString('sv-SE', { timeZone: 'Asia/Shanghai' }) }}
					</view>
				</view>
				<view class="post-content">
					{{ post.content }}
					<images-uploader :tool="false" :images="getImages(post.pictures)"></images-uploader>
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
	</view>
</template>

<script>
	import PostCard from './PostCard.vue'
	import ImagesUploader from '@/components/ImagesUploader.vue'

	export default {
		components: {
			PostCard,
			ImagesUploader
		},
		data() {
			return {
				activeTab: 1,
				tabs: [],
				posts: [],
				search: ''
			}
		},
		mounted() {
			// 模拟从接口获取分类选项卡和帖子数据
			this.tabs = [{
					id: 1,
					name: '全部'
				},
				{
					id: 2,
					name: '生活'
				},
				{
					id: 3,
					name: '旅游'
				},
				{
					id: 4,
					name: '美食'
				},
				{
					id: 5,
					name: '音乐'
				}
			]

			// this.posts = [{
			// 		id: 1,
			// 		title: '今天天气真好',
			// 		content: '今天天气真好，正适合钓鱼。',
			// 		author: {
			// 			name: '小明',
			// 			avatar: 'https://randomuser.me/api/portraits/men/81.jpg'
			// 		},
			// 		createdAt: '2022-04-23 12:23',
			// 		supportCount: 8,
			// 		supporters: [{
			// 				id: 1,
			// 				avatar: 'https://randomuser.me/api/portraits/men/82.jpg'
			// 			},
			// 			{
			// 				id: 2,
			// 				avatar: 'https://randomuser.me/api/portraits/women/75.jpg'
			// 			},
			// 			{
			// 				id: 3,
			// 				avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
			// 			},
			// 			{
			// 				id: 4,
			// 				avatar: 'https://randomuser.me/api/portraits/women/46.jpg'
			// 			},
			// 			{
			// 				id: 5,
			// 				avatar: 'https://randomuser.me/api/portraits/men/31.jpg'
			// 			},
			// 			{
			// 				id: 6,
			// 				avatar: 'https://randomuser.me/api/portraits/women/63.jpg'
			// 			},
			// 			{
			// 				id: 7,
			// 				avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
			// 			},
			// 			{
			// 				id: 8,
			// 				avatar: 'https://randomuser.me/api/portraits/women/26.jpg'
			// 			}
			// 		]
			// 	}
			// ]

			this.getSchoolPost()
		},
		computed: {},
		methods: {
			goToPostDetail(post) {
				uni.navigateTo({
					url: `/pages/home/PostDetail?id=${post.id}`
				})
			},
			getSchoolPost() {
				let user = uni.getStorageSync("mine");

				this.$api.getSchoolPost(user.school_id, 1, 10).then((res) => {
					this.posts = res.list
				})
			},
			getImages(pictures) {
				console.log(pictures.split(','))
				return pictures.split(',')
			}
		}
	}
</script>

<style scoped>
	.post-list {
		padding: 20rpx;
	}

	.search-bar {
		display: flex;
		align-items: center;
		background-color: #f5f5f5;
		border-radius: 30rpx;
		margin-bottom: 20rpx;
		padding: 10rpx 20rpx;
	}

	.search-input {
		flex: 1;
		margin-right: 10rpx;
		border: none;
		outline: none;
		font-size: 30rpx;
		color: #333;
		background-color: transparent;
	}

	.search-icon {
		display: flex;
		align-items: center;
	}

	.search-icon text {
		font-size: 40rpx;
		color: #999;
	}

	.tab-bar {
		display: flex;
		margin-bottom: 20rpx;
	}

	.tab-item {
		flex: 1;
		text-align: center;
		font-size: 32rpx;
		color: #666;
		padding: 20rpx;
		border-radius: 20rpx;
		transition: background-color 0.2s ease;
	}

	.tab-item.active {
		color: #fff;
		background-color: seagreen;
	}

	.post-container {
		display: flex;
		flex-wrap: wrap;
	}

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

	.uni-icon {
		font-size: 36rpx;
		margin-left: 10rpx;
		color: #999;
	}

	.uni-icon-likefill {
		color: #ff4444;
	}
</style>