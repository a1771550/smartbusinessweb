$infoblk = $("#infoblk");
let ptmode = 0;


$(document).on("click", ".btnDelete", function () {
	let _token = $("input[name=__RequestVerificationToken]").val();
	let id = parseInt($(this).data("id"));
	$.fancyConfirm({
		title: "",
		message: confirmremovetxt,
		shownobtn: true,
		okButton: oktxt,
		noButton: canceltxt,
		callback: function (value) {
			if (value) {
				$.ajax({
					type: "POST",
					url: "/PaymentTypes/Delete",
					data: { Id: id, __RequestVerificationToken: _token },
					success: function (data) {
						if (data.msg)
							window.location.reload();
					},
					dataType: "json"
				});
			}
		}
	});
});

$(document).on("click", "#btnAdd", function () {
	ptmode = 0;
	openPaymentTypeModal(0);
});
$(document).on("click", ".btnEdit", function () {
	ptmode = 1;
	let id = $(this).data("id");
	let $tr = $(this).parent("td").parent("tr");
	let charge = Number($(this).data("charge"));
	openPaymentTypeModal(charge);
	genPaytype(id, $tr);
	fillForm();
});

function genPaytype(Id, $tr) {
	PayType = {
        Id: Id,
        pmtCode: $tr.data("code"),
        pmtName: $tr.find(".name").html(),
		pmtDescription: "",
		pmtServiceChargePercent: Number($tr.find(".servicecharge").data("servicecharge")),
        pmtIsCash: $tr.find(".cash").data("iscash") == "True",
        pmtIsActive: $tr.find(".status").data("status")=="True",		
		serviceChargeDisplay: "",
    } as IPaymentType;
	console.log("PayType:", PayType);
}

function fillForm() {
	$("#pmtName").val(PayType.pmtName);
	$("#pmtServiceCharge").val(PayType.pmtServiceChargePercent??0);
	let iscash = PayType.pmtIsCash;
	let active = PayType.pmtIsActive;
	if (iscash) {
		$("#pmtIsCash1").prop("checked", true);
	} else {
		$("#pmtIsCash2").prop("checked", true);
	}
	if (active) {
		$("#pmtIsActive1").prop("checked", true);
	} else {
		$("#pmtIsActive2").prop("checked", true);
	}
}

function checkIfDuplicatedPayTypeName(pmtname) {
	let duplicated = false;
	$("#tblPay tbody tr").each(function (i, e) {
		let _name = $(this).find(".name").html();
		if (_name === pmtname) {
			duplicated = true;
			return false;
		}
	});
	return duplicated;
}

$(function () {
	initModals();
	setFullPage();
	triggerMenu(0, 1);	
});