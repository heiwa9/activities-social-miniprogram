<template>
	<view>
		<!-- 帖子内容 -->
		<view class="post">
			<view class="post-header">
				<img class="avatar" :src="post.userAvatar" alt="Avatar" />
				<view class="post-info">
					<view class="post-author">{{ post.userName }}</view>
					<view class="post-time">{{ t2f(post.createTime) }}</view>
				</view>
			</view>
			<h1 class="post-title">{{ post.title }}</h1>
			<view class="post-content">
				<!-- 帖子内容显示 -->
				<p>{{ post.content }}</p>
				<image v-if="post.pictures" v-for="(src,index) in pictures" :key="index" :src="src" mode="aspectFill"
					@click="showPreview(pictures,index)">
				</image>
				<p>时间：{{ (new Date(post.meetingTime/1000)).toLocaleString('sv-SE', { timeZone: 'Asia/Shanghai' }) }}</p>
				<p v-if="post.meetingAddress">地点：{{ post.meetingAddress }}</p>
			</view>


			<view class="supporters-list">
				<view class="supporters-heard">
					<view class="supporters-title">{{ post.supporterCount > 0 ? '共'+post.supporterCount+'人参加：' : '暂无参加者' }}</view>
					<view class="break" v-if="post.supporters" @tap="checkSupporter">点击查看</view>
				</view>
				<view class="supporters">
					<view class="supporter" v-for="supporter in post.supporters" :key="supporter.id">
						<img class="supporter-avatar" :src="supporter.avatar" alt="supporter-avatar">
					</view>
				</view>
				<view class="support-btn" @click="supportPost">{{ supported ? '已加入' : '加入' }}</view>
			</view>

			<!-- 评论区 -->
			<view v-if="post.comments" class="comments">
				<view class="comment-title">{{ post.comments && post.comments.total ? '共'+post.comments.total+'条回复：':'暂无回复' }}
				</view>
				<view v-for="(comment,idx1) in post.comments.list" :key="comment.id" class="comment">
					<!-- 评论内容 -->
					<view class="comment-header">
						<img class="avatar" :src="comment.userAvatar" alt="Avatar" />
						<view class="comment-info">
							<view class="comment-author">{{ comment.userName }}</view>
							<view class="comment-time">{{ t2f(comment.createdTime) }}</view>
						</view>
						<image v-if="comment.userId == user.id" class="comment-del-icon" src="@/static/delete.svg" @tap="delComment(comment,idx1)"></image>
					</view>
					<view class="comment-content">
						{{ comment.content }}
					</view>

					<!-- 楼中楼回复 -->
					<view class="replies">
						<view v-for="(reply,idx2) in comment.replies" :key="reply.id" class="reply">
							<!-- 回复内容 -->
							<view class="reply-header">
								<img class="avatar" :src="reply.userAvatar" alt="Avatar" />
								<view class="reply-info">
									<view class="reply-author">{{ reply.userName }}</view>
									<view class="reply-time">{{ t2f(reply.createTime)  }}</view>
								</view>
								<image v-if="reply.userId == user.id" class="reply-del-icon" src="@/static/delete.svg" @tap="delReply(reply,idx1,idx2)"></image>
							</view>
							<view class="reply-content">
								{{ reply.content }}
							</view>
						</view>
					</view>

					<!-- 添加楼中楼回复的输入框 -->
					<view v-if="comment.showReplyInput" class="add-reply">
						<input v-model="comment.newReplyContent" type="text" placeholder="添加回复..." />
						<view class="reply-btn" @click="addReply(comment)">发送</view>
					</view>

					<!-- 回复按钮 -->
					<view class="reply-button">
						<image v-if="!comment.showReplyInput" @click="toggleReplyInput(comment)" src="@/static/msg.svg"></image>	
					</view>
				</view>
			</view>
			<view v-else>
				<view class="comment-title">暂无回复</view>
			</view>

			<view class="add-comment">
				<textarea class="comment-input" placeholder="写点评论吧……" v-model="newCommentContent"></textarea>
				<view class="comment-header" @click="postComment">
					<image class="comment-img" src="@/static/send.svg"></image>
					<view class="comment-desc">发表评论</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import time from '@/utils/time.js'

	export default {
		data() {
			return {
				t2f: time.time2feel,
				supported: false,
				showCommentInput: true,
				user: {},
				post: {},
				pictures: [],
				page: {
					total: 0, //总页数
					size: 5, //每页条数
					current: 1 //默认当前页
				},
				newCommentContent: "",
				comments: [],
			};
		},
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

			this.user = uni.getStorageSync("mine");
			this.$api.getPost(this.post.id).then((res) => {
				this.post = res
				this.pictures = res.pictures.split(',')
				this.post?.supporters.forEach((res) => {
					if (res.userId == this.user.id) {
						this.supported = true
					}
				})
			})
			this.getCommentToPage()
		},
		methods: {
			addComment() {
				const comment = {
					id: this.comments.length + 1,
					userAvatar: "current-user-avatar.jpg",
					userName: "Current User",
					content: this.newCommentContent,
					timestamp: new Date().toLocaleString(),
					replies: [],
					showReplyInput: false,
					newReplyContent: ""
				};
				this.comments.push(comment);
				this.newCommentContent = "";
			},
			toggleReplyInput(comment) {
				comment.showReplyInput = !comment.showReplyInput;
				if (!comment.showReplyInput) {
					comment.newReplyContent = "";
				}
			},
			addReply(comment) {
				this.$api.postReply({
					postId: this.post.id,
					commentId: comment.id,
					data: {
						userId: this.user.id,
						commentId: comment.id,
						content: comment.newReplyContent
					}
				}).then((res) => {
					res.userName = this.user.name
					res.userAvatar = this.user.avatar
					if(!comment.replies){
						comment.replies = []
					}
					comment.replies.push(res);
					comment.showReplyInput = false;
					comment.newReplyContent = "";
				})
			},
			delReply(reply,idx1,idx2){
				this.$api.delReply({
					id: reply.id,
					postId: this.post.id,
					commentId: reply.commentId,
				}).then((res)=>{
					this.post.comments.list[idx1].replies.splice(idx2,1)
				})
			},
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
				if (this.newCommentContent.trim()) {
					this.$api.postComment(this.post.id, {
						userId: this.user.id,
						postId: this.post.id,
						content: this.newCommentContent
					}).then((res) => {
						if (res.status) {
							if(!this.post.comments.list){
								this.post.comments.list = []
							}
							this.post.comments.list.push({
								userId: this.user.id,
								userName: this.user.name,
								userAvatar: this.user.avatar,
								content: this.newCommentContent,
								createdTime: (new Date()).getTime() * 1000,
							})
							this.newCommentContent = ''
						}
					})
					
				}
			},
			delComment(comment,index){
				this.$api.delComment({
					id: comment.id,
					postId: comment.postId
				}).then((res)=>{
					this.post.comments.list.splice(index,1)
				})
			},
			getCommentToPage() {
				this.$api.getComment(this.post.id, this.page.current, this.page.size).then((res) => {
					res.list?.forEach(item => {
						item.showReplyInput = false
						item.newReplyContent = ''
					});
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
	};
</script>

<style scoped lang="scss">
	.post {
		padding: 30upx;

		.post-header {
			display: flex;
			align-items: center;
			margin-bottom: 8px;

			.avatar {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				margin-right: 12px;
			}

			.post-info {
				.post-author {
					font-weight: bold;
				}

				.post-time {
					color: gray;
					font-size: 12px;
				}
			}
		}

		.post-title {
			font-size: 24px;
			font-weight: bold;
			margin-bottom: 20upx;
		}

		.post-content {
			margin-bottom: 20upx;
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
			}

			.break {
				color: blue;
				margin: 0upx 20upx 0upx 0upx;
			}
		}

		.supporters {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			margin: auto;

			.supporter {
				display: flex;
				align-items: center;

				.supporter-avatar {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					margin-right: -50upx;
				}
			}
		}

		.support-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 200upx;
			height: 200upx;
			border-radius: 50%;
			color: gray;
			cursor: pointer;
			margin: auto;
			border: 1px solid gray;
			box-shadow: 0 2upx 4upx rgba(0, 0, 0, 0.9);

			&:hover {
				background-color: #f9f9f9;
			}
		}

	}

	.add-comment {
		width: 97%;
		position: relative;
		border-radius: 0 0 20upx 0;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.16);
		margin: auto;

		textarea.comment-input {
			height: 200upx;
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
			bottom: 0;
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

	.comments {

		.comment-title {
			font-size: 18px;
			font-weight: bold;
			margin-bottom: 10upx;
		}

		.comment {
			background-color: #fff;
			padding: 10px;
			margin-bottom: 10px;

			.comment-header {
				display: flex;
				align-items: center;
				margin-bottom: 8px;

				.avatar {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					margin-right: 12px;
				}

				.comment-info {
					.comment-author {
						font-weight: bold;
					}

					.comment-time {
						color: gray;
						font-size: 12px;
					}
				}
				
				.comment-del-icon{
					width: 60upx;
					height: 60upx;
					margin-left: auto;
				}
			}

			.comment-content {
				font-size: 14px;
				line-height: 1.3;
				margin-bottom: 8px;
			}

			.replies {
				margin-left: 52px;

				.reply {
					background-color: #f0f0f0;
					padding: 8px;
					margin-bottom: 6px;

					.reply-header {
						display: flex;
						align-items: center;
						margin-bottom: 4px;

						.avatar {
							width: 32px;
							height: 32px;
							border-radius: 50%;
							margin-right: 8px;
						}

						.reply-info {
							.reply-author {
								font-weight: bold;
							}

							.reply-time {
								color: gray;
								font-size: 12px;
							}
						}
						
						.reply-del-icon{
							width: 60upx;
							height: 60upx;
							margin-left: auto;
						}
						
					}

					.reply-content {
						font-size: 12px;
						line-height: 1.2;
					}
				}
			}

			.add-reply {
				position: relative;
				display: flex;
				align-items: center;
				margin-top: 10px;

				input {
					flex: 1;
					padding: 6px;
					border: 1px solid #ccc;
					border-radius: 4px;
					margin-right: 6px;
				}

				.reply-btn {
					position: absolute;
					right: 20upx;
					padding: 9upx 24upx;
					background-color: #007bff;
					color: #fff;
					border: none;
					border-radius: 4px;
					cursor: pointer;
				}
			}

			.reply-button {
				width: 60upx;
				height: 60upx;
				image{
					width: 60upx;
					height: 60upx;
				}
				margin-left: auto;
			}
		}
	}
</style>