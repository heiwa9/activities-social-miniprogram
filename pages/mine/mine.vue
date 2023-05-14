<template>
	<view class="container">
		<view class="avatar-container">
			<image class="avatar" :src="avatar" mode="aspectFill" @tap="handleAvatarClick"></image>
			<view class="edit-avatar">修改头像</view>
		</view>
		<view class="info">
			<view class="username">{{ username }}</view>
			<view class="email">{{ school }}</view>
			<view class="email">{{ email }}</view>
		</view>
		<view class="column_container">
			<view class="column" @tap="myPush">我的发布</view>
			<view class="column" @tap="myJoin">我的加入</view>
			<view class="column" @tap="closeAccount">注销账号</view>
			<view class="column" @tap="logout">退出登录</view>
		</view>
	</view>
</template>

<script>
	import file from '@/utils/file.js'
	export default {
		components: {},
		data() {
			return {
				userid: "",
				username: "",
				email: "",
				avatar: "/static/profile.png",
				school: "",
				images: [],
			};
		},
		mounted() {
			// 在页面加载时获取用户信息，可以从本地存储或后端接口获取
			let user = uni.getStorageSync("mine");
			this.userid = user.id
			this.username = user.name;
			this.email = user.email;
			this.avatar = user.avatar;
			this.school = user.school_name;
		},
		methods: {
			myPush(){
				uni.navigateTo({
					url:'/pages/myPush/myPush'
				})
			},
			myJoin(){
				uni.navigateTo({
					url:'/pages/mySupport/mySupport'
				})
			},
			closeAccount(){
				
			},
			logout() {
				// uni.clearStorage();
				// 退出登录，可以清除本地存储或后端的登录状态
				uni.showToast({
					title: "退出登录成功",
					icon: "success",
				});
				uni.reLaunch({
					url: "/pages/login/login",
				});
			},
			handleAvatarClick() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						file.imageUploader("user/avatar", res.tempFiles[0]).then((url) => {
							this.$api.putAvatar({
								id: this.userid,
								avatar: url,
								old_avatar: this.avatar
							}).then(() => {
								this.avatar = url
							})
						}).catch((err) => {
							console.log(err)
						})
					},
				})
			},
		},
	};
</script>

<style lang="scss">
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.avatar-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: 30px;

			.avatar {
				width: 140px;
				height: 140px;
				border-radius: 25px;
				background-color: #eee;
				outline: 4px solid darkgray;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
			}

			.edit-avatar {
				width: 100%;
				background-color: gray;
				color: #fff;
				border: none;
				outline: none;
				font-size: 14px;
				text-align: center;
				transform: translateY(-100%);
				padding: 2px 0px 2px 0px;
				border-radius: 0px 0px 50px 50px;
			}
		}

		.info {
			text-align: center;

			.username {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 10px;
			}

			.email {
				color: #999;
			}

			.link {
				color: darkgreen;
				font-size: 14px;
				cursor: pointer;
			}
		}

		.column_container {
			justify-content: center;
			margin: 80upx 0 80upx 0;
		}

		.column {
			padding: 20upx 140upx 20upx 140upx;
			margin: 10upx 10upx 10upx 10upx;
			color: whitesmoke;
			background-color: darkgray;
			border-radius: 0upx 30upx 0upx 30upx;
			&:hover{
				background-color: seagreen;
			}
		}
	}
</style>