$infoblk = $("#infoblk");
editmode = Number($("#Id").val()) > 0;
let selectedCouponLnId: number = 0;

$(document).on("change", ".chklnall", function () {
	let type: string = $(this).hasClass("redeemed") ? "redeemed" : "voided";
	let all: number = $(this).is(":checked") ? 1 : 0;
	$("#btnSave").prop("disabled", true);
	openWaitingModal();
	$.ajax({
		type: "POST",
		url: "/Coupon/ToggleAllLn",
		data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), code: $("#cpCode").val(), all, type },
		success: function (data) {
			closeWaitingModal();
			if (data) window.location.href = "/Coupon/Index";
		},
		dataType: "json"
	});
});
function fillInCoupon() {
	Coupon = { Id: Number($("#Id").val()), cpCode: $("#cpCode").val() as string, cpCompanyName: $("#cpCompanyName").val() as string, cpTitle: $("#cpTitle").val() as string, cpPrice: Number($("#cpPrice").val()), cpDiscPc: Number($("#cpDiscPc").val()), JsExpiryDate: $("#cpExpiryDate").val() as string, cpIssuedQty: Number($("#cpIssuedQty").val()), cpDesc: $("#cpDesc").val() as string, cpRemark: $("#cpRemark").val() as string } as ICoupon;
}

function validCPForm(): boolean {
	let msg: string = "";
	let $company = $("#cpCompanyName");
	if ($company.val() == "") {
		msg += $infoblk.data("companynamerequiredtxt") + "<br>";
		$company.addClass("focus");
	}
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
		//console.log("Coupon:", Coupon);
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
	let type = $(this).data("type");
	let $td = $(this).parent("td");
	//console.log("Id:" + Id + ";idx:" + idx);
	if (type == "code") CouponLn = { Id, cplCode: makeId(10) } as ICouponLn;
	let data = { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), CouponLn, type };
	openWaitingModal();
	//console.log("data:", data);
	//return;
	$.ajax({
		type: "POST",
		url: "/Coupon/EditLn",
		data: data,
		success: function (data) {
			closeWaitingModal();
			if (data) {
				if (type == "code")
					$td.empty().data("code", CouponLn.cplCode).text(CouponLn.cplCode);
				else {
					$td.empty().data("val", type == "redeemed" ? CouponLn.cplIsRedeemed : CouponLn.cplIsVoided).text(type == "redeemed" ? CouponLn.cplIsRedeemed ? yestxt : notxt : CouponLn.cplIsVoided ? yestxt : notxt);
				}
			}

		},
		dataType: "json"
	});
});

$(document).on("dblclick", ".code", function () {
	getRowCurrentY.call(this, true);
	let Id: number = Number($tr.data("id"));
	let html = `<input type="text" class="form-control lncode mx-1" readonly value="${$(this).data("code")}"><button type="button" class="btn btn-warning mx-1 btnChange" data-idx="${$tr.index()}" data-id="${Id}" title="${changetxt}" data-type="code"><i class="fa fa-refresh"></i></button>`;

	$(this).empty().append(html).find("input").trigger("focus");

});
$(document).on("dblclick", ".drp", function () {
	getRowCurrentY.call(this, true);
	let Id: number = Number($tr.data("id"));
	let yes: boolean = $(this).data("val") == "True";
	let yesselected: string = yes ? "selected" : "";
	let noselected: string = yes ? "" : "selected";
	//console.log("Id:" + Id);
	let type = $(this).data("type") as string;
	let html = `<select class="form-control drpln mx-1" data-id="${Id}" data-type="${type}"><option value="1" ${yesselected}>${yestxt}</option><option value="0" ${noselected}>${notxt}</option></select><button type="button" class="btn btn-success mx-1 btnChange" data-idx="${$tr.index()}" data-id="${Id}" title="${savetxt}" data-type="${type}"><i class="fa fa-save"></i></button>`;
	$(this).empty().append(html).find("select").trigger("focus");
	$(`#${gTblId} tbody tr`).each(function (i, e) {
		if (Number($(e).data("id")) != Id) {
			let $td = $(e).find(".redeemed");
			toggleDrpTxt($td);
			$td = $(e).find(".voided");
			toggleDrpTxt($td);
		}
	});
	function toggleDrpTxt($td: JQuery<HTMLElement>) {
		$td.empty().text($td.data("val") == "True" ? yestxt : notxt);
	}
});

$(document).on("change", ".drpln", function () {
	handleDrpLnChanged.call(this);
});
function handleDrpLnChanged(this: any) {
	let $e = $(this);
	console.log("Id:" + $e.data("id"));
	selectedCouponLnId = $e.data("id");
	let type = $e.data("type");
	CouponLn = type == "redeemed" ? { Id: selectedCouponLnId, cplIsRedeemed: $e.val() == "1" } as ICouponLn : { Id: selectedCouponLnId, cplIsVoided: $e.val() == "1" } as ICouponLn;
	console.log("CouponLn:", CouponLn);
}

$(document).on("click", ".page-item:not(.active)", function (e) {
	e.preventDefault();
	e.stopPropagation();
	window.location.href = $(this).find("a").prop("href").concat(`&Id=${Coupon.cpId}`);
});

$(document).on("change", "#txtInterval", function () {
	let interval = Number($(this).val());
	if (interval > 0) {
		Coupon = { Id: $("#Id").val(), } as ICoupon;
		//todo:
	}
	
});
$(function () {
	setFullPage();
	forcoupon = true;
	gTblId = "tblCouponLn";
	gFrmId = "frmCoupon";
	PageSize = $infoblk.data("pagesize");
	ConfigSimpleSortingHeaders();
	initModals();
	triggerMenuByCls("menusetup", 6);
	initDatePicker("cpExpiryDate", addMonths(1));
	setInput4NumberOnly("num");
	$("#cpCompanyName").trigger("focus");
	Coupon = $infoblk.data("coupon");

	var checkall = getParameterByName("CheckAll");
	if (checkall !== null) {
		//console.log("checkall:" + checkall);
		let checked = checkall == "1";
		$(".chk").prop("checked", checked);
		handleCheckAll(checked);
	}

	showMsg("msg", "saved", "success");
});
