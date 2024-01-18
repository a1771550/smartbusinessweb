$(document).on("change", "#drpLang", function (e) {
	//e.preventDefault();
	//e.stopPropagation();
	let lang = $(this).val();
	$.ajax({
		type: "POST",
		url: "/Home/ChangeCurrentCulture",
		data: {Id:lang},
		dataType: "json"
	});
});
//$(function () {
//	let lang = $("#drpLang").data("culture");
//	$("#drpLang").val(lang);
//});