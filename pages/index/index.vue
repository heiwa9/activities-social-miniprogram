<template>
	<view class="form">
		<view class="form-item">
			<text class="form-label">标题</text>
			<input class="form-input" type="text" placeholder="请输入标题" v-model="title" />
		</view>
		<view class="form-item">
			<text class="form-label">内容</text>
			<textarea class="form-textarea" placeholder="请输入内容" v-model="content"></textarea>
		</view>
		<view class="form-item">
			<text class="form-label">时间</text>
			<date-time-picker @onCancel="onCancel" @onConfirm="onConfirm" :start="start" :end="end" :select="select">
				<text class="title">{{ select }}</text>
			</date-time-picker>
		</view>
		<view class="form-item">
			<text class="form-label">地点</text>
			<input class="form-input" type="text" placeholder="请输入地址" v-model="address" />
		</view>
		<view class="form-item">
			<text class="form-label">人数</text>
			<input class="form-input" type="number" placeholder="请输入人数" v-model.number="number" />
		</view>
		<view class="form-item">
			<text class="form-label">上传</text>
			<images-uploader :images="images" :osspath="osspath"></images-uploader>
		</view>
		<view class="form-item">
			<button class="submit-button" @click="submitForm">提交</button>
		</view>
	</view>
</template>

<script>
	import DateTimePicker from "@/components/DateTimePicker.vue"
	import ImagesUploader from "@/components/ImagesUploader.vue"
	export default {
		components: {
			DateTimePicker,
			ImagesUploader,
		},
		data() {
			return {
				images: [],
				osspath:"post/picture",
				title: '',
				content: '',
				number: 0,
				address: '',
				start: (new Date).toLocaleString('sv-SE', {
					timeZone: 'Asia/Shanghai'
				}),
				end: "2050-12-31 23:59:59",
				select: (new Date).toLocaleString('sv-SE', {
					timeZone: 'Asia/Shanghai'
				}),
			}
		},
		methods: {
			submitForm() {
				let user = uni.getStorageSync("mine");
				console.log(this.images)
				this.$api.postPost({
					userId: user.id,
					schoolId: user.school_id,
					title: this.title,
					content: this.content,
					meetingTime: (new Date(this.select)).getTime() * 1000,
					meetingAddress: this.address,
					num: this.number,
					pictures: this.images.toLocaleString(),
				}).then((res) => {
					console.log(res)
				})
			},
			onCancel(e) {
				console.log(e);
			},
			onConfirm(e) {
				this.select = e.dateValue;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.form {
		display: flex;
		flex-direction: column;
		padding: 20px;

		.form-item {
			margin-bottom: 20px;
			display: flex;
			flex-direction: column;

			.form-label {
				margin-bottom: 8px;
				font-size: 16px;
				font-weight: bold;
			}

			.form-input,
			.form-textarea {
				border: 1px solid #ddd;
				padding: 10px;
				font-size: 16px;
			}

			.form-textarea {
				box-sizing: border-box;
				width: 100%;
				padding: 10px;
				border: 1px solid #ccc;
				height: 150px;
			}

			.submit-button {
				width: 100%;
				background-color: seagreen;
				color: #fff;
				border: none;
				font-size: 16px;
				border-radius: 4px;
				cursor: pointer;
			}
		}
	}
</style>