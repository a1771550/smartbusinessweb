$(document).on("change", "#drpLang", function (e) {
	//e.preventDefault();
	//e.stopPropagation();
	let lang = $(this).val();
	let url = "/Home/ChangeCurrentCulture/" + lang;
	console.log("url:" + url);
	window.location.href = url;
	//$.ajax({
	//	type: "POST",
	//	url: "/Home/ChangeCurrentCulture",
	//	data: {Id:lang},
	//	dataType: "json"
	//});
});
//$(function () {
//	let lang = $("#drpLang").data("culture");
//	$("#drpLang").val(lang);
//});