$(document).on("change", "#drpLang", function (e) {
	//e.preventDefault();
	//e.stopPropagation();
	let lang = $(this).val();
	let url = "/Culture/" + lang;
	console.log("url:" + url);
	window.location.href = url;
});