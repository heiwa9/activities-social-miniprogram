export default {
	data() {
		return {
			yuNum: 0, // 剩余多少页
			showList: [], // 显示的页码
			pageNumAll: 0, // 总页数
		}
	},
	props: {
		// 总条数
		total: Number,
		// 当前页，支持.sync
		pageNum: Number,
		// 每页条数
		pageSize: {
			type: Number,
			default: 5
		},
		// 被选中页码的样式
		activeColor: {
			type: String,
			default: '#004799'
		},
	},
	watch: {
	    pageNum() {
			this.showList = this.getShowPagesList();
		}
	},
	created() {
		this.init();
	},
	methods: {
		// 页码变化
		numChange(num) {
			let pageNum = this.pageNum;
			if (num === '-') {
				if (pageNum === 1) {
					return;
				} else {
					pageNum--;
				}
			} else if (num === '+') {
				if (pageNum === this.pageNumAll) {
					return;
				} else {
					pageNum++;
				}
			} else {
				pageNum = num;
			}
			if (num !== '...') {
				this.$emit('update:pageNum', pageNum);
				this.$emit('num-change', pageNum);
			}
		},
		init() {
			this.pageNumAll = Math.ceil(this.total/this.pageSize);
			this.showList = this.getShowPagesList();
		},
		// 获取需要显示的页的数字集合
		getShowPagesList() {
			const showList = [];
			this.yuNum = this.pageNumAll - this.pageNum + 1;
			if (this.pageNumAll <= 7) {
				for (let i = 1; i <= this.pageNumAll; i++) {
					showList.push(i);
				}
			} else {
				let temp1 = true;
				let temp2 = true;
				for (let i = 1; i <= this.pageNumAll; i++) {
					if (
						(this.pageNum - 2 >= 1?(i >= this.pageNum - 2 && i <= this.pageNum + 2):(i <= 5)) ||
						(this.pageNum + 2 <= this.pageNumAll?(i >= this.pageNum - 2 && i <= this.pageNum + 2):(i >= this.pageNumAll - 4)) ||
						i <= 1 ||
						i >= this.pageNumAll
					) {
						showList.push(i);
					} else if (i > 1 && i < this.pageNum - 2) {
						if (temp1) {
							showList.push('...');
						}
						temp1 = false;
					} else if (i > this.pageNum + 2 && i < this.pageNumAll) {
						if (temp2) {
							showList.push('...');
						}
						temp2 = false;
					}
				}
			}
			return showList;
		}
	}
}
