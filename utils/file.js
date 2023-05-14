import api from '@/common/api.js'
import mime from '@/utils/mime.js'

function getFileNameFromPath(path) {
	let idx = path.lastIndexOf("/");
	return path.substr(idx + 1);
}

function getFileMime(suffix) {
	let m = mime.mime[suffix];
	return m ? m : "application/octet-stream"
}

function getFileSuffix(filename) {
	return filename.slice(filename.lastIndexOf("."))
}

function imageUploader(osspath,fileobj) {
	return new Promise((resolve, reject) => {
		// #ifdef MP-WEIXIN
		let suffix = getFileSuffix(fileobj.path)
		let buffer = uni.getFileSystemManager().readFileSync(fileobj.path)
		// #endif
		// #ifdef H5
		let suffix = getFileSuffix(fileobj.name)
		// #endif
		// if(suffix!='.png' || suffix!='.jpg' || suffix != '.jpeg' || suffix != '.gif'){
		// 	uni.showToast({
		// 		icon:'error',
		// 		title:'图片格式错误'
		// 	})
		// 	return
		// }
		api.getUpload(osspath, suffix).then((reply) => {
			// #ifdef MP-WEIXIN
			api.putUpload(reply.url, {
				'content-type': getFileMime(suffix)
			}, buffer).then((result) => {
				resolve(reply.url.slice(0, reply.url.indexOf('?')));
			}).catch((err) => {
				reject(err)
			})
			// #endif
			// #ifdef H5
			fetch(reply.url, {
					method: 'PUT',
					body: fileobj,
					headers: {
						'content-type': getFileMime(suffix)
					},
				})
				.then(result => {
					if (result.status == 200) {
						resolve(reply.url.slice(0, reply.url.indexOf('?')));
					} else {
						reject('接口返回错误');
					}
				})
				.catch(err => {
					reject(err);
				});
			// #endif
		})
	});
}

function imageUpoladerDel(picture) {
	return api.delUpload(picture.split('/').slice(4).join('/'))
}

export default {
	getFileNameFromPath,
	imageUpoladerDel,
	imageUploader,
	getFileSuffix,
	getFileMime,
}