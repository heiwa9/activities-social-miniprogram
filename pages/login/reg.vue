<template>
	<view class="register">
		<div class="avatar">
			<img :src="avatarUrl" alt="avatar" mode="aspectFill" @click="handleAvatarClick" />
		</div>

		<input type="text" class="input" placeholder="校区" v-model="keyword" @input="handleInput" />
		<ul v-if="showList">
			<li v-for="item in list" :key="item.id" @click="handleSelect(item)">
				{{ item.name }}
			</li>
		</ul>

		<input type="text" placeholder="电子邮件" class="input" v-model="email"></input>
		<input type="text" placeholder="用户名" class="input" v-model="name"></input>
		<input type="password" placeholder="密码" class="input" v-model="pwd1"></input>
		<input type="password" placeholder="确认密码" class="input" v-model="pwd2"></input>
		<button class="btn" @click="register">注册</button>
	</view>
</template>

<script>
	import file from '@/utils/file.js'
	export default {
		components: {},
		data() {
			return {
				avatarUrl: '/static/profile.png', // 头像图片地址
				keyword: '',
				list: [],
				showList: false,
				email: "",
				name: "",
				pwd1: "",
				pwd2: "",
				school_id: "",
			}
		},
		methods: {
			chooseImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						this.avatarUrl = res.tempFilePaths[0]
					},
				})
			},
			register() {
				if (this.pwd1 == this.pwd2 && this.school_id != "" && this.pwd1 != "") {
					this.$api.userRegister({
						avatar: this.avatarUrl,
						email: this.email,
						name: this.name,
						password: this.pwd1,
						school_id: this.school_id
					}).then((res) => {
						uni.showToast({
							title: "注册成功",
							duration: 1000,
						});
						setInterval(function() {
							uni.redirectTo({
								url: '/pages/login/login',
							});
						}, 1000)
					})
				} else {
					uni.showToast({
						title: '密码不一致',
						icon: 'none',
						duration: 2000,
					});
				}
			},
			async handleInput() {
				if (!this.keyword) {
					this.list = [];
					this.showList = false;
					return;
				}
				this.$api.searchSchool(this.keyword).then((res) => {
					this.list = res.schools
					this.showList = true;
				})
			},
			handleSelect(item) {
				this.keyword = item.name;
				this.school_id = item.id;
				this.showList = false;
			},
			handleAvatarClick() {
				// uni.showToast({
				// 	icon:"error",
				// 	title:"注册后再修改"
				// })
				uni.chooseImage({
					count: 1,
					success: (res) => {
						file.imageUploader(res.tempFiles[0]).then((url) => {
							this.avatarUrl = url
						}).catch((err) => {
							console.log(err)
						})
					},
				})
			},
		},
	}
</script>

<style lang="scss">
	.register {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 50px;

		.avatar {
			position: relative;
			display: inline-block;
			width: 140px;
			height: 140px;
			margin-bottom: 30px;

			img {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}

		.input {
			width: 75%;
			height: 28px;
			padding: 12px;
			font-size: 16px;
			border: none;
			border-radius: 8px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.16);
			margin-bottom: 20px;
		}

		ul {
			list-style: none;
			margin: 0;
			margin-bottom: 30px;
			padding: 0;
			border: 1px solid #ccc;
			border-radius: 4px;
			max-height: 200px;
			overflow-y: auto;
			width: 80%;

			li {
				height: 40px;
				line-height: 40px;
				padding: 0 10px;
				font-size: 12px;
				cursor: pointer;
				transition: background-color 0.3s ease;

				&:hover {
					background-color: #f5f5f5;
				}
			}
		}

		.btn {
			width: 80%;
			height: 50px;
			border-radius: 25px;
			background-color: #007aff;
			color: #fff;
			font-size: 16px;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>