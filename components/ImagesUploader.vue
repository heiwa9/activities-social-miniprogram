<template>
	<view>
		<view class="content_wrapper">
			<view class="image_wrapper" :key="index" v-for="(url, index) in images">
				<icon v-if="tool" @click.stop="deleteImage(index)" type="clear" size="18" class="deleteIcon"></icon>
				<image @click="showImage(images,index)" class="photo-img" :key="index" :src="url"></image>
			</view>
			<view v-if="tool " class="photo-img-wrapper" @click="handleselectFile">
				<image class="add-img" src="@/static/fileadd.svg"></image>
				<view class="add-desc">上传图片</view>
			</view>
		</view>
	</view>
</template>

<script>
	import file from '@/utils/file.js'
	export default { //来自父组件的值
		props: {
			tool: {
				type: Boolean,
				default: true
			},
			images: {
				type: Array,
				default: () => []
			},
			osspath: {
				type: String,
				default: "/"
			}
		},
		methods: {
			//选择图片
			handleselectFile() {
				uni.hideKeyboard()
				this.choseImage();
			},
			choseImage() {
				// 任务详情上传图片
				uni.showActionSheet({
					itemList: ['拍照', '相册'],
					success: res => {
						let index = res.tapIndex;
						if (index === 0) {
							//#ifdef MP-WEIXIN
							uni.authorize({
								scope: 'scope.camera',
								success: () => {
									uni.chooseImage({
										sourceType: ['camera'],
										success: res => {
											let tempFiles = res.tempFiles;
											this.uploadFilesTask(tempFiles);
										}
									});
								}
							});
							//#endif
							//#ifdef APP-PLUS || H5
							uni.chooseImage({
								sourceType: ['camera'],
								success: res => {
									let tempFiles = res.tempFiles;
									this.uploadFilesTask(tempFiles);
								}
							});
							//#endif
						} else {
							uni.chooseImage({
								sourceType: ['album'],
								success: res => {
									let tempFiles = res.tempFiles;
									this.uploadFilesTask(tempFiles);
								}
							});
						}
					}
				});
			},
			uploadFilesTask(images) {
				uni.showLoading({
					title: '上传中...'
				})
				for (let i in images) {
					file.imageUploader(this.osspath, images[i]).then((url) => {
						this.$emit('uploadImage',url)
					}).catch((err) => {
						console.log(err)
					})
				}
				uni.hideLoading();
			},
			//删除图片
			deleteImage(index) {
				uni.showModal({
					title: '提示',
					content: '确定删除?',
					success: (res) => {
						if (res.confirm) {
							file.imageUpoladerDel(this.osspath, this.images[index]).then((res) => {
								this.$emit('delImage',index)
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			// 预览
			showImage(src, index) {
				uni.previewImage({
					urls: this.pictures,
					current: index
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content_wrapper {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;


		.image_wrapper {
			margin-right: 20rpx;
			position: relative;

			.photo-img {
				// padding: 10upx;
				width: 150upx;
				height: 150upx;
			}

			.deleteIcon {
				position: absolute;
				z-index: 99;
				overflow: hidden;
				top: -10rpx;
				right: -10rpx;
			}
		}

		.photo-img-wrapper {
			width: 150upx;
			height: 150upx;
			background: rgba(0, 0, 0, 0.02);
			border: 1upx solid rgba(0, 0, 0, 0.15);
			box-sizing: border-box;
			border-radius: 5px 5px 5px 5px;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
			flex-direction: column;

			.add-img {
				width: 68upx;
				height: 68upx;
				color: #0081ff;
			}

			.add-desc {
				color: rgba(0, 0, 0, 0.65);
				font-size: 28upx;
				font-family: PingFangSC-regular;
			}
		}
	}
</style>