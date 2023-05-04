<template>
	<view class="datetime-picker" @click.stop="show">
		<slot />
		<view class="dt-mask" :class="{'show':pipkerShowFlag}" @click.stop="hide" @touchmove.stop.prevent
			catchtouchmove="true"></view>
		<view class="dt-content" :class="{'show':pipkerShowFlag}" @touchmove.stop.prevent catchtouchmove="true">
			<view class="dt-hd">
				<view class="dt-hd-btn" @click.stop="onCancel">取消</view>
				<view class="dt-hd-btn" :style="{'color':themeColor}" @click.stop="onConfirm">确定</view>
			</view>
			<view class="dt-wrapper">
				<picker-view :indicator-style="indicatorStyle" :value="selectedValue" @change="wrapperChange">
					<picker-view-column>
						<view class="dt-item" v-for="(item,index) in years" :key="index">{{item}}年</view>
					</picker-view-column>
					<picker-view-column>
						<view class="dt-item" v-for="(item,index) in months" :key="index">{{item}}月</view>
					</picker-view-column>
					<picker-view-column>
						<view class="dt-item" v-for="(item,index) in days" :key="index">{{item}}日</view>
					</picker-view-column>
					<picker-view-column>
						<view class="dt-item" v-for="(item,index) in hours" :key="index">{{item}}时</view>
					</picker-view-column>
					<picker-view-column>
						<view class="dt-item" v-for="(item,index) in minutes" :key="index">{{item}}分</view>
					</picker-view-column>
					<picker-view-column>
						<view class="dt-item" v-for="(item,index) in seconds" :key="index">{{item}}秒</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			themeColor: {
				type: String,
				default () {
					return "#6ba1ff"
				}
			},
			select: {
				type: String,
				default () {
					return (new Date()).toLocaleString('sv-SE', {
						timeZone: 'Asia/Shanghai'
					});
				}
			},
			start: {
				type: String,
				default () {
					return "1980-01-01 00:00:00"
				}
			},
			end: {
				type: String,
				default () {
					return "2100-12-31 23:59:59"
				}
			}
		},
		data() {
			return {
				pipkerShowFlag: false,
				indicatorStyle: `height: ${uni.upx2px(88)}px;`,

				selectedValue: [0, 0, 0, 0, 0, 0],

				years: [],
				months: [],
				days: [],

				hours: [],
				minutes: [],
				seconds: []
			}
		},
		watch: {
			select: function(newVal, oldVal) {
				this.init();
			},
			start: function(newVal, oldVal) {
				this.init();
			},
			end: function(newVal, oldVal) {
				this.init();
			}
		},
		created() {
			this.init();
		},
		methods: {
			init() {
				if (this.propsCheck()) {
					return;
				}
				this.getYears();
				this.getMonths(this.select);
				this.getDays(this.select);
				this.getHours(this.select)
				this.getMinutes(this.select)
				this.getSeconds(this.select)
				this.setPickerValue(this.select);
			},
			/**
			 * props值校验
			 */
			propsCheck() {
				let flag = false;
				let start = (new Date(this.start)).getTime();
				let end = (new Date(this.end)).getTime();
				let now = (new Date(this.select)).getTime();

				if (isNaN(start) || isNaN(end) || isNaN(now)) {
					flag = true;
				}
				if (start > end || now > end || now < start) {
					flag = true;
				}

				if (flag) {
					uni.showToast({
						title: "选择器参数错误",
						icon: "none"
					})
				}
				return flag;
			},
			nf(val) {
				let n = Number(val)
				if (n > 9) {
					return String(n);
				}
				return "0" + n;
			},
			show() {
				this.pipkerShowFlag = true;
			},
			hide() {
				this.pipkerShowFlag = false;
			},
			onCancel() {
				this.pipkerShowFlag = false;
				this.$emit("onCancel", {
					dateValue: this.getDateValue(this.selectedValue),
					dateValueIndex: this.selectedValue
				});
			},
			onConfirm() {
				this.pipkerShowFlag = false;
				this.$emit("onConfirm", {
					dateValue: this.getDateValue(this.selectedValue),
					dateValueIndex: this.selectedValue
				});
			},

			/**
			 * picker change时间触发
			 * @param {Object} e
			 */
			wrapperChange(e) {
				let detailValue = e.detail.value;
				let getSelectDay = () => {
					return new Date(this.years[detailValue[0]], this.months[detailValue[1]] - 1, this.days[detailValue[
					2]], this.hours[detailValue[3]], this.minutes[detailValue[4]], this.seconds[detailValue[5]]).toLocaleString(
					'sv-SE', {
						timeZone: 'Asia/Shanghai'
					});
				}
				let selectedDate = getSelectDay();

				if (this.selectedValue[0] != detailValue[0]) {
					this.getMonths(selectedDate);
					selectedDate = getSelectDay();
					this.getDays(selectedDate);
					selectedDate = getSelectDay();
					this.getHours(selectedDate);
					selectedDate = getSelectDay();
					this.getMinutes(selectedDate);
					selectedDate = getSelectDay();
					this.getSeconds(selectedDate);
				}
				if (this.selectedValue[1] != detailValue[1]) {
					this.getDays(selectedDate);
					selectedDate = getSelectDay();
					this.getHours(selectedDate);
					selectedDate = getSelectDay();
					this.getMinutes(selectedDate);
					selectedDate = getSelectDay();
					this.getSeconds(selectedDate);
				}
				if (this.selectedValue[2] != detailValue[2]) {
					this.getHours(selectedDate);
					selectedDate = getSelectDay();
					this.getMinutes(selectedDate);
					selectedDate = getSelectDay();
					this.getSeconds(selectedDate);
				}
				if (this.selectedValue[3] != detailValue[3]) {
					this.getMinutes(selectedDate);
					selectedDate = getSelectDay();
					this.getSeconds(selectedDate);
				}
				if (this.selectedValue[4] != detailValue[4]) {
					this.getSeconds(selectedDate);
				}
				this.selectedValue = detailValue;
			},
			/**
			 * 获取年
			 */
			getYears() {
				let years = []
				for (let i = this.start.slice(0, 4); i <= this.end.slice(0, 4); i++) {
					years.push(i);
				}
				this.years = years
			},
			/**
			 * 获取月
			 * @param {Date} select 当前选中的日期（判断当前年有多少个月）
			 */
			getMonths(select) {
				let startYear = this.start.slice(0, 4);
				let endYear = this.end.slice(0, 4);

				let s = 1;
				let e = 12;
				let newMonths = [];
				if (startYear == select.slice(0, 4)) {
					s = this.start.slice(5, 7);
				}
				if (endYear == select.slice(0, 4)) {
					e = this.end.slice(5, 7);
				}
				for (let i = s; i <= e; i++) {
					newMonths.push(this.nf(i));
				}
				this.months = newMonths;
			},
			/**
			 * 获取日
			 * @param {Date} select 当前选中的日期（判断当前年月有多少个日）
			 */
			getDays(select) {
				let startYearMonth = this.start.slice(0, 7);
				let endYearMonth = this.end.slice(0, 7);
				let nowYearMouth = select.toLocaleString('sv-SE', {
					timeZone: 'Asia/Shanghai'
				}).slice(0, 7);
				let s = 1;
				let e = new Date(select.slice(0, 4), select.slice(5, 7) - 1, 0).getDate();;

				let days = [];
				if (startYearMonth == nowYearMouth) {
					s = this.start.slice(8, 10);
				}
				if (endYearMonth == nowYearMouth) {
					e = this.end.slice(8, 10);
				}
				for (let i = s; i <= e; i++) {
					days.push(this.nf(i));
				}
				this.days = days;
			},
			getHours(select) {
				let s = 0;
				let e = 24;
				let hours = []
				if (this.start.slice(0, 10) == select.slice(0, 10)) {
					s = this.start.slice(11, 13);
				}
				if (this.end.slice(0, 10) == select.slice(0, 10)) {
					e = this.end.slice(11, 13);
				}
				for (let i = s; i < e; i++) {
					hours.push(this.nf(i));
				}
				this.hours = hours;
			},
			getMinutes(select) {
				let s = 0;
				let e = 60;
				let minutes = [];
				if (this.start.slice(0, 10) >= select.slice(0, 10) && this.start.slice(11, 13) >= select.slice(11, 13)) {
					s = this.start.slice(14, 16);
				}
				if (this.end.slice(0, 10) <= select.slice(0, 10) && this.end.slice(11, 13) <= select.slice(11, 13)) {
					e = this.end.slice(14, 16);
				}
				for (let i = s; i < e; i++) {
					minutes.push(this.nf(i))
				}
				this.minutes = minutes;
			},
			getSeconds(select) {
				let s = 0;
				let e = 60;
				let seconds = [];
				if (this.start.slice(0, 10) >= select.slice(0, 10)) {
					if (this.start.slice(11, 13) >= select.slice(11, 13) && this.start.slice(14, 16) >= select.slice(14, 16)) {
						s = this.start.slice(17, 19);
					}
				}
				if (this.end.slice(0, 10) >= select.slice(0, 10)) {
					if (this.end.slice(11, 13) <= select.slice(11, 13) && this.end.slice(14, 16) <= select.slice(14, 16)) {
						e = this.end.slice(17, 19);
					}
				}
				for (let i = s; i < e; i++) {
					seconds.push(this.nf(i))
				}
				this.seconds = seconds;
			},
			setPickerValue(d) {
				let showArray = [0, 0, 0, 0, 0, 0];
				this.years.forEach((el, index) => {
					if (d.slice(0, 4) == el) {
						showArray[0] = index;
						return false;
					}
				})
				this.months.forEach((el, index) => {
					if (d.slice(5, 7) == el) {
						showArray[1] = index;
						return false;
					}
				})
				this.days.forEach((el, index) => {
					if (d.slice(8, 10) == el) {
						showArray[2] = index;
						return false;
					}
				})
				this.hours.forEach((el, index) => {
					if (d.slice(11, 13) == el) {
						showArray[3] = index;
						return false;
					}
				})
				this.minutes.forEach((el, index) => {
					if (d.slice(14, 16) == el) {
						showArray[4] = index;
						return false;
					}
				})
				this.seconds.forEach((el, index) => {
					if (d.slice(17, 19) == el) {
						showArray[5] = index;
						return false;
					}
				})
				this.$nextTick(() => {
					this.selectedValue = showArray;
				})
			},
			getDateValue(pikerValue) {
				let select_time =
					`${this.years[pikerValue[0]]}-${this.months[pikerValue[1]]}-${this.days[pikerValue[2]]} ${this.hours[pikerValue[3]]}:${this.minutes[pikerValue[4]]}:${this.seconds[pikerValue[5]]}`
				return select_time
			}
		}
	}
</script>

<style lang="scss">
	.datetime-picker {
		position: relative;
		z-index: 888;

		.dt-mask {
			position: fixed;
			z-index: 1000;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.6);
			visibility: hidden;
			opacity: 0;
			transition: all 0.3s ease;
		}

		.dt-mask.show {
			visibility: visible;
			opacity: 1;
		}

		.dt-content {
			position: fixed;
			z-index: 1001;
			bottom: 0;
			right: 0;
			width: 100%;
			transition: all 0.3s ease;
			transform: translateY(100%);

			.dt-hd {
				height: 88upx;
				background-color: #FFFFFF;
				border-bottom: 1px solid #e5e5e5;
				padding: 0 40upx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.dt-hd-btn {
					color: #888;
					font-size: 17px;
				}
			}

			.dt-wrapper {
				height: 480upx;
				width: 100%;
				background-color: #FFFFFF;

				.dt-item {
					text-align: center;
					width: 100%;
					height: 88upx;
					line-height: 88upx;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 30upx;
				}
			}
		}

		.dt-content.show {
			transform: translateY(0);
		}

		picker-view-column {
			height: 480rpx !important;
		}
	}
</style>