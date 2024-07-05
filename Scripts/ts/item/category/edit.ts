$infoblk = $("#infoblk");
editmode = Number($("#Id").val()) > 0;

$(document).on("change", ".catname", function () {
	const catname = $(this).val() as string;
	if (catname !== "") {
		$(".catname").each(function (i, e) {
			if ($(e).val() === "") $(e).val(catname);
		});
	}
});

function validCatForm(): boolean {
	let msg: string = "";
	let $name = $("#catName");
	if ($name.val() == "") {
		msg += namerequiredtxt + "<br>";
		$name.addClass("focus");
	}
	let $dorder = $("#displayOrder");
	if ($dorder.val() == "") {
		msg += `${$infoblk.data("displayorderrequiredtxt")}<br>`;
		$dorder.addClass("focus");
	}
	if (msg !== "") {
		$.fancyConfirm({
			title: "",
			message: msg,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$(".focus").first().trigger("focus");
				}
			},
		});
	}
	return msg === "";
}

$(document).on("click", "#btnSaveCat", function () {
	fillInCategory();
	if (validCatForm()) {
		// console.log("here");
		//console.log(ItemCategory);
		//return;
		openWaitingModal();
		$.ajax({
			//contentType: 'application/json; charset=utf-8',
			type: "POST",
			url: "/Category/Edit",
			data: {
				__RequestVerificationToken: $(
					"input[name=__RequestVerificationToken]"
				).val(),
				model: Category,
			},
			success: function (data) {
				if (data == "") {
					window.location.href = "/Category/Index";
				}
			},
			dataType: "json",
		});
	}
});

$(function () {
	setFullPage();
	initModals();
	triggerMenuByCls("menuitem", 7);
	$("#catName").trigger("focus");
});
