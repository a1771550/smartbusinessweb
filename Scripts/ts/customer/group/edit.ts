$infoblk = $("#infoblk");

$(document).on("click", "#btnSave", function () {
	let $cgname = $("#txtName");
	CustomerGroup = { Id:$("#cgId").val(), cgName: $cgname.val(), Remark: $("#txtRemark").val(), cusCodes:$("#cusCodes").val() } as ICustomerGroup;
	if (CustomerGroup.cgName) {
		openWaitingModal();
		$.ajax({
			type: "POST",
			url: "",
			data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(),CustomerGroup },
			success: function (data) {
				closeWaitingModal();
				if (data) window.location.href = "/CustomerGroup/Index";
			},
			dataType: "json"
		});
	} else {
		$cgname.trigger("focus").next("span").text(namerequiredtxt);
	}
	
});
$(function () {
	forcustomergroup = true;	
	setFullPage();	
	triggerMenu(1, 4);
	initModals();
});