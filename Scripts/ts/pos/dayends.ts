$infoblk = $("#infoblk");

let paylns: Array<IPayType> = [];
let expectedamt: number = 0;
let actualamt = 0; //actual amt
let checkamt = false;
let cashdrawamtstart = 0;
let cashdrawamtstarttxt = $infoblk.data("cashdrawamtstarttxt");
let nothingtocount = false;
let dicCountPay: { [Key: string]: IDayendCountPay } = {};

$(document).on("change", ".entry", function () {
	let entry: any = $(this).val();
	if (entry !== "") {
		$(this).val(formatnumber(entry));
		$("#warn").addClass("hide");
		let val: number = Number(entry);
		$target = $(this)
			.parent("td")
			.parent("tr")
			.find("td:eq(1)")
			.find(".paymenttype");
		let code: string = <string>$(this).attr("id");
		let iscash: number = $(this).data("iscash") === "True" ? 1 : 0;
		if (val == Number($target.val())) {
			dicCountPay[code] = {
				selPayMethod: code,
				selAmtSys: val,
				selAmtCount: val,
				isCash: iscash,
			};
			$(this).removeClass("focus");
			actualamt += val;
			//   console.log("actualamt:" + actualamt);
			$("#lblTotal").text(formatmoney(actualamt));
		}
	}
});

function getDayendPaymentsOk(data) {
	closeWaitingModal();
	//console.log(data);
	$("#monthlypaytotal").val(data.monthlypaytotal);

	paylns = data.payLnViews.slice(0);
	var payIds: Array<number> = paylns.map((x) => x.payId as number);
	$("#payIds").val(payIds.join());

	cashdrawamtstart = data.cashdrawamtstart;

	$.each(paylns, function (i, e) {
		//console.log('e.amount:' + e.Amount);
		expectedamt += e.Amount;
	});

	//console.log('expectedamt#0:' + expectedamt);
	//console.log('dicpaytypes:', dicPayTypes);

	$(".entry").each(function (idx, ele) {
		let pmtcode: string = <string>$(ele).attr("id");
		// console.log("pmtcode:" + pmtcode);
		$.each(paylns, function (i, e) {
			if (pmtcode == e.pmtCode) {
				$("#static" + pmtcode).val(formatnumber(e.TotalAmt));
				//console.log($('#static'+))
			}
		});
	});

	expectedamt = round(expectedamt);
	//console.log('expectedamt#1:' + expectedamt);

	if (expectedamt === 0) {
		//nothing to count:
		/* $('#btnSubmit').prop('disabled', true);*/
		nothingtocount = true;
	} else {
		/* $('#btnSubmit').prop('disabled', false);*/
		nothingtocount = false;
	}

	$("#Cash").trigger("focus");
}

function submitform() {
	$("#dicCountPay").val(JSON.stringify(dicCountPay));
	let frmdata = $("#dayendsfrm").serializeArray();
	//   console.log("frmdata:", frmdata);
	//return false;
	$.ajax({
		type: "POST",
		url: "/POSFunc/CountPayments",
		data: frmdata,
		success: function (data) {
			$.fancyConfirm({
				title: "",
				message: data.msg,
				shownobtn: false,
				okButton: oktxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						if (data.success) {
							/* window.location.reload(true);*/
							window.location.href = "/POSFunc/Dayends?postback=1";
						}
					}
				},
			});
		},
		dataType: "json",
	});
}

$(document).on("click", "#btnSubmit", function () {
	//   console.log("actualamt:" + actualamt + ";expectedamt:" + expectedamt);
	if (nothingtocount) {
		submitform();
	} else {
		if (!checkamt) {
			if (actualamt !== expectedamt) {
				$("#warn").removeClass("hide").text(countpaymentsnotmatchwarning);
				$("#txtNotes").trigger("focus");

				$("#tblPay tbody tr").each(function (i, e) {
					let $expected = $(e).find("td:eq(1)").find(".paymenttype");
					let $actual = $(e).find("td:eq(2)").find(".entry");
					if (
						parseFloat(<string>$actual.val()) !==
						parseFloat(<string>$expected.val())
					) {
						$actual.addClass("focus");
					}
				});
			} else {
				/*return false;*/
				$.fancyConfirm({
					title: "",
					message: confirmdayendssubmit,
					shownobtn: true,
					okButton: oktxt,
					noButton: canceltxt,
					callback: function (value) {
						if (value) {
							submitform();
						}
					},
				});
			}
		} else {
			$.fancyConfirm({
				title: "",
				message: confirmdayendssubmit,
				shownobtn: true,
				okButton: oktxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						submitform();
					}
				},
			});
		}
	}
});

$(document).on("change", "#txtNotes", function () {
	if ($(this).val() !== "") {
		checkamt = true;
		$("#warn").addClass("hide");
	}
});

$(document).on("click", "#btnCancel", function () {
	window.location.href = "/Dayends/POSFunc";
});

$(function () {
	setFullPage();
	initModals();
	fordayends = true;
	triggerMenu(0, 6);

	if (getParameterByName("postback") === null) {
		$("#lblTotal").text(formatmoney(0));
		$(".paymenttype").val(formatnumber(0));
		openWaitingModal();
		getRemoteData(
			"/Api/GetDayendPayments",
			{},
			getDayendPaymentsOk,
			getRemoteDataFail
		);
	}
});
