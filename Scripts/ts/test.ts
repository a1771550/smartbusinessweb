$infoblk = $("#infoblk");
uploadsizelimit = parseInt($infoblk.data("uploadsizelimit"));
uploadsizelimitmb = parseInt($infoblk.data("uploadsizelimitmb"));
//$(document).on("click", "#btnUpload", function (e) {
//	e.preventDefault();
//	let photo = ((HTMLInputElement)$("#wsFile"))[0].files[0];
//	let formData = new FormData();

//	formData.append("photo", photo,);
//	formData.append("__RequestVerificationToken", $('input[name=__RequestVerificationToken]').val() as string);
//	$.ajax({
//		//contentType: 'application/json; charset=utf-8',
//		type: "POST",
//		url: '/Test/UploadsPost',
//		data: formData,
//		success: function (data) {
//			$("#uploadmsg").removeClass("hide").text(data);
//		},
//		dataType: 'json'
//	});
//});

$(function () {
    initModals();
});