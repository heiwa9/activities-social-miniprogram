<template>
	<view class="container">
		<view class="login-container">
			<view class="avatar-container">
				<image class="avatar" :src="avatar" mode="aspectFill"></image>
			</view>
			<form class="login-form">
				<view class="form-item">
					<input class="input-box" type="text" placeholder="电子邮件" v-model="email" @blur="setAvatar" />
				</view>
				<view class="form-item">
					<input class="input-box" type="password" placeholder="密码" v-model="password" />
				</view>
				<view class="form-item">
					<text class="register-link" @click="goToRegister">还没有账号？立即注册</text>
				</view>
				<view class="form-item form-checkbox">
					<checkbox class="checkbox" v-model="rememberMe" color="#2d8cf0" @click="handleChange" checked />
					<text class="checkbox-text">记住我</text>
				</view>
				<view class="form-item">
					<button class="login-button" @click="login">登录</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatar: '/static/profile.png',
				email: '',
				password: '',
				rememberMe: true
			};
		},
		mounted() {
			let user = uni.getStorageSync("mine");
			if (user) {
				if (user.remember) {
					this.email = user.email;
					this.password = user.password;
				}
			}
		},
		methods: {
			async fetchAutocomplete() {
				this.autocompleteList = [1, 2];
			},
			setAvatar() {
				let user = uni.getStorageSync("mine");
				if (user) {
					if (user.email == this.email) {
						this.avatar = user.avatar
					}
				}
			},
			login() {
				// 登录逻辑
				this.$api.userLogin({
					email: this.email,
					password: this.password
				}).then((res) => {
					if (res.token != "") {
						let user = res.user_info
						user.password = this.password
						user.remember = this.rememberMe
						uni.setStorageSync('token', res.token);
						uni.setStorageSync('mine', user)
						uni.reLaunch({
							url: '/pages/home/home'
						});
					};
				});
			},
			goToRegister() {
				uni.navigateTo({
					url: '/pages/login/reg'
				})
			},
			handleChange() {
				this.rememberMe = !this.rememberMe
				console.log(this.rememberMe)
			}
		}
	};
</script>

<style lang="scss">
	.container {
		display: flex;
		justify-content: center;
		align-items: center;

		.login-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 80%;
			margin: 13% 0% 13% 0%;
			max-width: 400px;
			border-radius: 40px 40px 40px 40px;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
			backdrop-filter: blur(5px);
			
			.login-container::before {
			  content: '';
			  position: absolute;
			  top: 0;
			  left: 0;
			  width: 100%;
			  height: 100%;
			  background-color: rgba(255, 255, 255, 0.5); /* 半透明白色 */
			  z-index: -1;
			}

			.avatar-container {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin: 30px;

				.avatar {
					margin: 20px;
					width: 140px;
					height: 140px;
					border-radius: 50%;
					background-color: #eee;
					outline: 4px solid darkgray;
					box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
				}
			}

			.login-form {
				width: 90%;
				max-width: 400px;

				.form-item {
					margin-bottom: 20px;

					.input-box {
						height: 28px;
						padding: 12px;
						font-size: 16px;
						border: none;
						border-radius: 8px;
						box-shadow: 0 2px 4px rgba(0, 0, 0, 0.16);
					}

					.form-checkbox {
						display: flex;
						align-items: center;

						.checkbox {
							margin-right: 10px;
						}

						.checkbox-text {
							font-size: 14px;
						}
					}

					.login-button {
						width: 80%;
						height: 50px;
						border-radius: 25px;
						background-color: seagreen;
						color: #fff;
						font-size: 16px;
						display: flex;
						justify-content: center;
						align-items: center;
					}

					.register-link {
						color: darkgreen;
						font-size: 14px;
						cursor: pointer;
					}
				}
			}
		}
	}
</style>