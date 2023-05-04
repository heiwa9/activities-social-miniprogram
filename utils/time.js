// Param timestamp { DataTime:Number }
function time2feel(tsInput) {
	let minute = 1000 * 60;
	let hour = minute * 60;
	let day = hour * 24;
	let week = day * 7;
	let month = day * 30;

	let _date = new Date(tsInput);
	let tsDiff = (new Date()).getTime() - tsInput/1000;
	let minC = tsDiff / minute;
	let hourC = tsDiff / hour;
	let dayC = tsDiff / day;
	let weekC = tsDiff / week;
	let monthC = tsDiff / month;

	if (monthC >= 1 && monthC < 4) {
		return parseInt(monthC) + "月前";
	} else if (weekC >= 1 && weekC < 4) {
		return parseInt(weekC) + "周前";
	} else if (dayC >= 1 && dayC < 7) {
		return parseInt(dayC) + "天前";
	} else if (hourC >= 1 && hourC < 24) {
		return parseInt(hourC) + "小时前";
	} else if (minC >= 1 && minC < 60) {
		return parseInt(minC) + "分钟前";
	} else if ((tsDiff >= 0) && (tsDiff <= minute)) {
		// 时间差大于0并且小于1分钟
		return "刚刚";
	}
	return _date.toLocaleString('sv-SE')
}

export default{
	time2feel
}