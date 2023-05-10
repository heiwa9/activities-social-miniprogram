# 方便您的同时，请五星、收藏，让好的东西照亮更多深渊中负重前行的代码人。
# 创作不易，在您方便之际，赞赏作者，我们会更有动力继续下去。

# 简介
ljs-pagination，分页插件。简洁、美观的移动端分页插件。

### 使用 uni_modules 安装（推荐）
使用 uni_modules 方式安装组件库，可以直接通过插件市场导入，通过右键菜单快速更新组件，不需要引用、注册，直接在页面中使用 ljs-pagination组件。

### 快速应用
```
<template>
	<view class="content">
		<ljs-pagination
			:total="table.total"
			:pageNum.sync="table.pageNum"
			:pageSize="table.pageSize"
			@num-change="numF">
		</ljs-pagination>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				table: {
					pageNum: 1,
					pageSize: 5,
					total: 72,
					data: []
				}
			}
		},
		onLoad() {
		},
		methods: {
			// 分页 - 页码变化
			numF(num) {
				this.table.pageNum = num;
			},
		}
	}
</script>
```
### 参数

 参数  | 类型| 必填项 | 默认值 | 说明
 ---- | ----- | ------ | ------  | ------ 
 total | Number | √ |  | 总条数
 pageNum | Number | √ |  | 当前页，支持.sync
 pageSize | Number | × |  5 | 每页条数
activeColor | String | × |  #004799 | 被选中页码的样式

### 方法

 参数  | 类型| 解释
 ---- | ----- | ------ 
 @num-change| Function | 页码变化的回调函数，(num) => {}

# 贡献代码
龙九山。有任何问题，请在平台留言，在手头宽裕得情况下，我会尽快修复问题。