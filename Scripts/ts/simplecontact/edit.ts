$infoblk = $("#infoblk");

$(document).on("click", "#btnSave", function () {	
	if (validSimpleContactForm()) {
		let model: ISimpleContact = {
			Id:0,
			Name: $("#Name").val() as string,
			Email: $("#Email").val() as string,
			Phone: $("#Phone").val() as string,
			Message: $("#Message").val() as string
		};
		$.ajax({
			//contentType: 'application/json; charset=utf-8',
			type: "POST",
			url: "/SimpleContact/Edit",
			data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(),model},
			success: function (data) {
				if (data) {
					//console.log("data:", data);
					showMsg("msgblk", data.msg, "warning",8000,4000);					
				}
			},
			dataType: "json"
		});
	}
});

function validSimpleContactForm():boolean {
	let msg: string = "";

	if ($("#Name").val() === "") { $("#Name").addClass("focus"); msg += `${namerequiredtxt} <br>`; }
	if ($("#Phone").val() === "") { $("#Phone").addClass("focus"); msg += $("#Phone").data("val-required") + `<br>`; }
	if ($("#Message").val() === "") { $("#Message").addClass("focus"); msg += $("#Message").data("val-required") + `<br>`; }
	if ($("#Email").val() === "") {
		$("#Email").addClass("focus");
		msg += $("#Email").data("val-email") + `<br>`;
	} else if (!validateEmail($("#Email").val() as string)) {
		$("#Email").addClass("focus");
		msg += `${emailformaterr}`;
	}
	if (msg !== "") {		
		showMsg("errblk", msg, "danger");
		$(".focus").first().trigger("focus");
	}

	return msg === "";
}

$(function () {
	//initModals();
	$("#Name").trigger("focus");
});