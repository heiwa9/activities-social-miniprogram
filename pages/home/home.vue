<template>
	<view class="post-list">
		<!-- 搜索框 -->
		<view class="tabBar">
			<view class="search-bar">
				<input class="search-input" type="text" placeholder="搜索帖子" v-model.trim="search" @input="handleSearch" />
				<view class="search-icon">
					<text class="uni-icon uni-icon-search"></text>
				</view>
			</view>

			<view class="tab-bar" @click="refContent">
				<view class="tab-item" :class="{ active: categoryId === tab.id }" v-for="tab in tabs" :key="tab.id"
					@click="categoryId = tab.id">
					{{ tab.name }}
				</view>
			</view>
		</view>
		<scroll-view scroll-y='true' class="post-container" @scrolltolower='scroll'>
			<postList :posts="posts"></postList>
			<view class="bottom" v-show="bottomOut">已经到底了~</view>
		</scroll-view>
	</view>
</template>

<script>
	import ImagesUploader from '@/components/ImagesUploader.vue'
	import postList from '@/components/postList.vue'

	export default {
		components: {
			ImagesUploader,
			postList
		},
		data() {
			return {
				categoryId: 'chabsl5dfihm4h3fblb0',
				tabs: [],
				posts: [],
				search: '',
				user: {},
				defaultPage: 0,
				bottomOut: false
			}
		},
		onReachBottom() {
			console.log('12341')
		},
		onShow() {
			this.user = uni.getStorageSync("mine");
			this.getCategory()
			this.getSchoolPost()
		},
		methods: {
			async handleSearch(){
				if(this.search === '') return
				const res = await this.$api.getHomeSearch({schoolId:this.user.school_id,page:1,size:10,title:this.search})
				this.posts = res.list
				console.log(res)
			},
			// goToPostDetail(post) {
			// 	uni.navigateTo({
			// 		url: `/pages/home/PostDetail?id=${post.id}`
			// 	})
			// },
			getCategory() {
				this.$api.getCategory().then((res) => {
					uni.setStorageSync("category", res.list)
					this.tabs = res.list
				})
			},
			getSchoolPost() {
				this.$api.getPostSchoolCategory(this.user.school_id, this.categoryId, ++this.defaultPage, 10).then((
					res) => {
					if (res.list === null) {
						this.bottomOut = true
					} else {
						this.posts.push(...res.list)
					}
				})
			},
			// getImages(pictures) {
			// 	return pictures.split(',')
			// },
			refContent() {
				this.defaultPage = 0
				this.posts = []
				console.log(this.categoryId)
				this.$api.getPostSchoolCategory(this.user.school_id,
					this.categoryId, ++this.defaultPage, 10).then((
					res) => {
					this.posts = res.list
				})
				// this.getSchoolPost()
			},
			scroll(e) {
				if (typeof e === 'object') {
					this.getSchoolPost()
				}
			},

		}
	}
</script>

<style scoped>
	.tabBar {
		position: fixed;
		width: calc(100% - 20px);
	}

	.post-list {
		height: calc(100vh - 20px);
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
		height: calc(100% - 100px);
		overflow: auto;
		/* position: relative; */
		margin-top: 100px;
		/* 		display: flex;
		flex-wrap: wrap;
 */
	}


	.uni-icon {
		font-size: 36rpx;
		margin-left: 10rpx;
		color: #999;
	}

	.uni-icon-likefill {
		color: #ff4444;
	}

	.bottom {
		width: 80%;
		padding-top: 10px;
		margin: 20px auto;
		border-top: 1px solid #e3e3e3;
		color: #666;
		text-align: center;
	}
</style>
