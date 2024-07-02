$infoblk = $("#infoblk");
editmode = Number($("#Id").val()) > 0;

function fillInCoupon() {
	Coupon = {Id:Number($("#Id").val()), cpTitle: $("#cpTitle").val() as string, cpPrice: Number($("#cpPrice").val()), cpDiscPc: Number($("#cpDiscPc").val()), JsExpiryDate: $("#cpExpiryDate").val() as string, cpIssuedQty: Number($("#cpIssuedQty").val()), cpDesc: $("#cpDesc").val() as string, cpRemark: $("#cpRemark").val() as string } as ICoupon;
}

function validCPForm(): boolean {
	let msg: string = "";
	let $title = $("#cpTitle");
	if ($title.val() == "") {
		msg += $infoblk.data("titlerequiredtxt") + "<br>";
		$title.addClass("focus");
	}
	let $price = $("#cpPrice");
	if (Number($price.val()) == 0) {
		msg += $infoblk.data("pricerequiredtxt") + "<br>";
		$price.addClass("focus");
	}
	let $issuedqty = $("#cpIssuedQty");
	if (Number($issuedqty.val()) == 0) {
		msg += $infoblk.data("issuedqtyrequiredtxt") + "<br>";
		$issuedqty.addClass("focus");
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

$(document).on("click", "#btnSave", function () {
	fillInCoupon();
	if (validCPForm()) {
		// console.log("here");
		//console.log(ItemCoupon);
		//return;
		openWaitingModal();
		$.ajax({
			//contentType: 'application/json; charset=utf-8',
			type: "POST",
			url: "/Coupon/Edit",
			data: {
				__RequestVerificationToken: $(
					"input[name=__RequestVerificationToken]"
				).val(),
				Coupon,
			},
			success: function (data) {
				closeWaitingModal();
				if (data) {
					window.location.href = "/Coupon/Index";
				}
			},
			dataType: "json",
		});
	}
});

$(document).on("click", ".btnChange", function () {
	let Id: number = Number($(this).data("id"));
	let idx: number = Number($(this).data("idx"));
	let code: string = makeId(10);
	let $td = $(this).parent("td");
	console.log("Id:" + Id + ";idx:" + idx);
	CouponLn = {Id:Id,cplCode:code} as ICouponLn;
	$.ajax({
		type: "POST",
		url: "/Coupon/EditLn",
		data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(),CouponLn,type:"code" },
		success: function (data) {
			if (data) {
				$td.empty().text(code);
			}

		},
		dataType: "json"
	});
});

$(document).on("dblclick", ".code", function () {
	getRowCurrentY.call(this, true);
	let Id: number = Number($tr.data("id"));
	let html = `<input type="text" class="form-control lncode mx-1" readonly value="${$(this).data("code")}"><button type="button" class="btn btn-warning mx-1 btnChange" data-idx="${$tr.index()}" data-id="${Id}" title="${changetxt}"><i class="fa fa-refresh"></i></button>`;
	if ($(this).find("input").length) {

		$(this).empty().text($(this).find("input").val() as string);

	} else {
		$(this).empty().append(html).find("input").trigger("focus");
	}
});
$(document).on("dblclick", ".drp", function () {
	getRowCurrentY.call(this, true);
	let Id: number = Number($tr.data("id"));
	//console.log("Id:" + Id);
	let type = $(this).data("type") as string;
	
	let drphtml = `<select class="form-control drpln ${type}"><option value="1">${yestxt}</option><option value="0">${notxt}</option></select>`;
	if (type == "code") {
		
	}
	else {

	}
	
});

$(function () {
	setFullPage();
	gTblId = "tblCouponLn";
	gFrmId = "frmCoupon";
	PageSize = $infoblk.data("pagesize");
	ConfigSimpleSortingHeaders();
	initModals();
	triggerMenu(0, 6);
	initDatePicker("cpExpiryDate", addMonths(1));
	setInput4NumberOnly("num");
	$("#cpTitle").trigger("focus");	
});
