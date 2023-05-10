<template>
	<view class="pagination">
		<view class="pagination-box" :style="'width: '+ (Number(showList.length)*55 + 80) +'rpx'">
			
			<!-- #ifdef MP-WEIXIN -->
			<view @click="numChange('-')" class="ico q" :class="pageNum === 1?'no':''"></view>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<image @click="numChange('-')" class="ico" :class="pageNum === 1?'no':''" :src="require('../../images/ico_pagination_q.png')"></image>
			<!-- #endif -->
			<view class="number" :style="'width: '+ Number(showList.length)*55 +'rpx'">
				<text 
					@click="pageNum !== num?numChange(num):()=>{}"
					class="item"
					:style="{color: pageNum === num?activeColor:'#666', fontWeight: 600}"
					v-for="(num, i) in showList" :key="i">{{num}}
				</text>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view @click="numChange('+')" class="ico h" :class="pageNum === pageNumAll?'no':''"></view>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<image @click="numChange('+')" class="ico" :class="pageNum === pageNumAll?'no':''" :src="require('../../images/ico_pagination_h.png')"></image>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	import index from './index.js'
	export default index
</script>

<style lang="scss" scoped>
	@import "./index.scss";
</style>
