import request from '@/utils/request.js'
import operate from '@/common/operate.js'

const req = request({
	baseUrl: 'http://10.0.0.148:9901'
});

//全局定义请求头
export default {
	// 请求样式
	userLogin: (data) => req.post('/user/login', data),
	searchSchool: (name) => req.get('/school?name=' + name),
	userRegister: (data) => req.post('/user/reg', data),
	getUpload: (name, suffix) => req.get('/upload?name=' + name + '&suffix=' + suffix),
	putUpload: (url, header, data) => req.put(url, data, {
		header: header
	}),
	delUpload: (url) => req.delete('/upload', {
		url: url
	}),
	putAvatar: (data) => req.put('/user/avatar', data),
	postPost: (data) => req.post('/post', data),
	getSchoolPost: (schoolId, page, size) => req.get(`/school/${schoolId}/post?page=${page}&size=${size}`),
	getPost: (postId) => req.get('/post/' + postId),
	postComment: (postId, data) => req.post(`/post/${postId}/comment`, data),
	getComment: (postId, page, size) => req.get(`/post/${postId}/comment?page=${page}&size=${size}`),
	getCategory: () => req.get('/category'),
	getPostSchoolCategory: (schoolId, categoryId, page, size) => req.get(
		`/school/${schoolId}/post/category/${categoryId}?page=${page}&size=${size}`),
	getHomeSearch: (params) => req.get(
		`/school/${params.schoolId}/post/liketitle?page=${params.page}&size=${params.size}&title=${params.title}`),
	addPostSupporter: (postId, userId) => req.post(`/post/${postId}/supporter`, {
		userId: userId
	}),
	getPostByUserId: (userId, page, size) => req.get(`/user/${userId}/post?page=${page}&size=${size}`),
	deleteSupporter: (postId, userId) => req.delete(`/post/${postId}/supporter`, {
		userId: userId
	}),
	getPostSupporter: (postId, page, size) => req.get(`/post/${postId}/supporter?page=${page}&size=${size}`),
	setPostSupporter: (postId, userId, status) => req.put(`/post/${postId}/supporter`, {
		userId: userId,
		status: status
	}),
	getUserSupporterPost: (userId) => req.get(`/user/${userId}/supporter`),
}