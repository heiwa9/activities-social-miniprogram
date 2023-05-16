<template>
	<view class="container">
		<view v-for="sp in suppoters" :key="sp.id"
			:class="['supporter', { 'green-bg': sp.Access == 0, 'red-bg': sp.Access == 1 }]" @tap="setStatus(sp)">
			<image :src="sp.UserAvatar"></image>
			<view class="supporter-info">
				<view class="UserName">{{ sp.UserName }}</view>
				<view class="CreatedTime">
					{{ (new Date(sp.CreatedTime)).toLocaleString('sv-SE', { timeZone: 'Asia/Shanghai' }) }}
				</view>
			</view>
			<view class="Access">{{ sp.Access ? '拒绝' : '通过' }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				postId: "",
				puser: "",
				suppoters: []
			};
		},
		onShow() {
			// #ifdef H5
			this.postId = this.$route.query.id
			this.puser = this.$route.query.puser
			// #endif
			// #ifdef MP-WEIXIN
			// 获取当前页面对象
			const pages = getCurrentPages()
			const currentPage = pages[pages.length - 1]
			// 从页面对象中获取参数
			this.postId = currentPage.options.id
			this.puser = currentPage.options.puser
			// #endif
			this.$api.getPostSupporter(this.postId, 1, 10).then((res) => {
				this.suppoters = res.list
			})
		},
		methods: {
			setStatus(sp) {
				let user = uni.getStorageSync("mine")
				console.log(user.id,this.puser)
				if (user.id != this.puser) {
					console.log('非自己发的贴无法进行筛选')
					return
				}
				this.$api.setPostSupporter(this.postId, sp.UserId, !sp.Access ? 1 : 0).then((res) => {
					this.suppoters.forEach((e, i) => {
						if (e.Id == sp.Id) {
							e.Access = !e.Access
							this.$set(this.suppoters, i, e)
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.green-bg {
		background-color: lightgreen;
	}

	.red-bg {
		background-color: lightcoral;
	}

	.supporter {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;

		image {
			width: 50px;
			height: 50px;
			margin-right: 10px;
			border-radius: 50%;
			object-fit: cover;
		}

		.supporter-info {
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			margin: 0px 120upx 0upx 10upx;
		}

		.UserName {
			font-weight: bold;
			margin-bottom: 5px;
		}

		.CreatedTime {
			color: gray;
			font-size: 12px;
		}

		.Access {
			font-weight: bold;
			text-transform: uppercase;
		}
	}
</style>