<template>
	<view class="post-detail">
		<view class="comment-header">
			<img class="comment-avatar" :src="post.userAvatar" alt="avatar">
			<view>
				<view class="comment-author">{{ post.userName }}</view>
				<view class="comment-time">{{ ts(post.createTime) }}</view>
			</view>
		</view>
		<view class="post-content">
			<h1 class="post-title">{{ post.title }}</h1>
			<p>{{ post.content }}</p>
			<image v-if="post.pictures" v-for="(src,index) in pictures" :key="index" :src="src" mode="aspectFill"
				@click="showPreview(pictures,index)">
			</image>
			<p>时间：{{ (new Date(post.meetingTime/1000)).toLocaleString('sv-SE', { timeZone: 'Asia/Shanghai' }) }}</p>
			<p>地点：{{ post.meetingAddress }}</p>
		</view>
		<view class="supporters-list">
			<view class="supporters-heard">
				<view class="supporters-title">{{ post.supporters && post.supporters.length > 0 ? '参加者：' : '暂无参加者' }}</view>
				<view class="break" v-if="post.supporters" @tap="checkSupporter">点击查看</view>
			</view>
			<view class="supporters">
				<view class="supporter" v-for="supporter in post.supporters" :key="supporter.id">
					<img class="supporter-avatar" :src="supporter.avatar" alt="supporter-avatar">
				</view>
			</view>
		</view>
		<view class="post-support">
			<button class="support-btn" @click="supportPost">
				<view class="support-btn-text">{{ supported ? '已加入' : '加入' }}</view>
			</button>
		</view>
		<view class="comment-form">
			<textarea class="comment-input" placeholder="写点评论吧……" v-model="newComment"></textarea>
			<view class="comment-header" @click="postComment">
				<image class="comment-img" src="@/static/send.svg"></image>
				<view class="comment-desc">发表评论</view>
			</view>
		</view>
		<view class="post-comments">
			<h2 class="comments-title" v-if="post.comments && post.comments.total">{{post.comments.total}}条留言：</h2>
			<h2 class="comments-title" v-else>暂无留言</h2>
			<view v-if="post.comments && post.comments.list">
				<view class="comment" v-for="comment in post.comments.list" :key="comment.id">
					<view class="comment-header">
						<img class="comment-avatar" :src="comment.userAvatar" alt="avatar">
						<view>
							<view class="comment-author">{{ comment.userName }}</view>
							<view class="comment-time">{{ ts(comment.createdTime) }}</view>
						</view>
					</view>
					<view class="comment-content">{{ comment.content }}</view>
				</view>
			</view>
			<view class="page-pagination">
				<pagination v-if="page.total" :total="page.total" :pageNum.sync="page.current" :pageSize="page.size"
					@num-change="getCommentToPage">
				</pagination>
			</view>
		</view>
	</view>
</template>
<script>
	import time from '@/utils/time.js'
	import Pagination from '@/uni_modules/ljs-pagination/components/ljs-pagination/ljs-pagination.vue'
	export default {
		components: {
			Pagination,
		},
		data() {
			return {
				ts: time.time2feel,
				post: {},
				pictures: [],
				supported: false,
				newComment: '',
				page: {
					total: 0, //总页数
					size: 5, //每页条数
					current: 1 //默认当前页
				},
				show: false,
				user: {}
			}
		},
		watch: {},
		onLoad() {
			// #ifdef H5
			this.post.id = this.$route.query.id
			// #endif
			// #ifdef MP-WEIXIN
			// 获取当前页面对象
			const pages = getCurrentPages()
			const currentPage = pages[pages.length - 1]
			// 从页面对象中获取参数
			this.post.id = currentPage.options.id
			// #endif

			this.$api.getPost(this.post.id).then((res) => {
				this.post = res
				this.pictures = res.pictures.split(',')
				this.post?.supporters.forEach((res) => {
					if (res.userId == this.user.id) {
						this.supported = true
					}
				})
			})
			this.getCommentToPage();
			this.user = uni.getStorageSync("mine");
		},
		methods: {
			checkSupporter() {
				uni.navigateTo({
					url: `/pages/suppoter/suppoter?id=${this.post.id}&puser=${this.post.userId}`
				})
			},
			supportPost() {
				this.supported = !this.supported
				if (this.supported) {
					this.$api.addPostSupporter(this.post.id, this.user.id).then((res) => {
						this.post.supporters.push({
							id: this.post.supporters.length + 1,
							avatar: this.user.avatar
						})
					})
				} else {
					this.$api.deleteSupporter(this.post.id, this.user.id).then((res) => {
						this.post.supporters.pop()
					})
				}
			},
			postComment() {
				if (this.newComment.trim()) {
					let user = uni.getStorageSync("mine");

					this.$api.postComment(this.post.id, {
						userId: user.id,
						postId: this.post.id,
						content: this.newComment
					}).then((res) => {
						if (res.status) {
							this.post.comments.list.push({
								userId: user.id,
								userName: user.name,
								userAvatar: user.avatar,
								content: this.newComment,
								createdTime: (new Date()).getTime() * 1000,
							})
							this.$set(this.post, "comments", this.post.comments)
						}
					})
					this.newComment = ''
				}
			},
			getCommentToPage() {
				this.$api.getComment(this.post.id, this.page.current, this.page.size).then((res) => {
					this.$set(this.post, "comments", res)
					this.$set(this.page, "total", res.total)
				})
			},
			showPreview(src, index) {
				uni.previewImage({
					urls: this.pictures,
					current: index
				})
			}
		}
	}
</script>

<style lang="scss">
	.post-detail {
		padding: 20px;

		.comment-header {
			display: flex;
			align-items: center;
			margin-bottom: 10px;

			.comment-avatar {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				margin-right: 10px;
			}

			.comment-author {
				font-size: 16px;
				font-weight: bold;
				margin-right: 10px;
			}

			.comment-time {
				font-size: 12px;
				color: #666;
			}
		}

		.post-title {
			font-size: 24px;
			font-weight: bold;
			margin-bottom: 20px;
		}

		.post-content {
			margin-bottom: 20px;
		}

		.post-support {
			text-align: center;
			margin-bottom: 20px;

			.support-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 10px;
				border: 1px solid #ccc;
				border-radius: 5px;
				background-color: #fff;
				cursor: pointer;

				.uni-icon-likefill {
					font-size: 24px;
					margin-right: 5px;
					color: #ff5b5c;
				}

				.support-btn-text {
					font-size: 16px;
					color: #666;
				}

				&:hover {
					background-color: #f9f9f9;
				}
			}
		}

		.supporters-list {
			margin-bottom: 20px;

			.supporters-heard {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.supporters-title {
					font-size: 18px;
					font-weight: bold;
					margin-right: 10px;
				}

				.break {
					color: blue;
				}
			}

			.supporters {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				margin: auto;

				.supporter {
					margin-right: 10px;
					margin-bottom: 10px;

					.supporter-avatar {
						width: 40px;
						height: 40px;
						border-radius: 50%;
					}
				}
			}
		}

		.post-comments {
			padding-top: 50upx;
			margin-bottom: 20px;

			.comments-title {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 10px;
			}

			.comment {
				margin-bottom: 20px;

				.comment-header {
					display: flex;
					align-items: center;
					margin-bottom: 10px;

					.comment-avatar {
						width: 40px;
						height: 40px;
						border-radius: 50%;
						margin-right: 10px;
					}

					.comment-author {
						font-size: 16px;
						font-weight: bold;
						margin-right: 10px;
					}

					.comment-time {
						font-size: 12px;
						color: #666;
					}
				}

				.comment-content {
					font-size: 16px;
				}
			}
		}

		.comment-form {
			position: relative;
			border-radius: 0 0 20upx 0;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.16);

			textarea.comment-input {
				height: 260upx;
				width: 100%;
				border: none;
				resize: none;
				font-size: 28rpx;
				color: #666;
				padding: 10rpx;
				box-sizing: border-box;
			}

			.comment-header {
				position: absolute;
				bottom: -20upx;
				right: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 80rpx;
				width: 200rpx;
				background-color: seagreen;
				color: #fff;
				font-size: 30rpx;
				cursor: pointer;
				border-radius: 20upx 0 20upx 0;
				transition: background-color 0.2s ease;

				&:hover {
					background-color: #00a388;
				}

				.comment-img {
					width: 30rpx;
					height: 30rpx;
					margin-right: 10rpx;
				}
			}
		}

		.page-pagination {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
		}
	}
</style>