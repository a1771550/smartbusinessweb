$infoblk = $("#infoblk");
priceeditable = false; //item price in deposit should not be editable
salesType = SalesType.deposit;

function submitRemaining() {
	if (Deposit.Change > 0) {
		$("#changeModal").dialog("close");
	}
	Deposit.rtsRmks = <string>$("#txtNotes").val();
	Deposit.rtsDvc = $("#txtDeviceCode").val() as string;
	//console.log("DepositLnList:", DepositLnList);
	//console.log("Payments:", Payments);
	//return false;
	if (DepositLnList.length > 0) {
		let url = "/Deposit/ProcessRemain";
		openWaitingModal();
		$.ajax({
			type: "POST",
			url: url,
			data: { Deposit, DepositLnList, Payments },
			success: function (data) {
				closeWaitingModal();
					url =
						printurl +
						"?issales=1&salesrefundcode=" +
						data.salescode;
					window.open(url);
				
				window.location.reload();
			},
			dataType: "json",
		});
	}
}

$(document).on("change", "#txtReceiptNo", function () {
	$("#btnSearchReceipt").trigger("click");
});
function resetDePage() {
	$(":input", "#frmCus")
		.not(":button, :submit, :reset, :hidden")
		.val("")
		.prop("checked", false)
		.prop("selected", false);
	$("#tblDeposit tbody").empty();
	$(".misc").val("");
}

$(document).on("click", "#btnSearchReceipt", function () {
	resetDePage();
	device = <string>$("#txtDeviceCode").val();
	rno = <string>$("#txtReceiptNo").val();
	phoneno = <string>$("#txtPhoneNo").val();
	if (rno === "" && phoneno === "") {
		$.fancyConfirm({
			title: "",
			message: renoorphonerequired,
			shownobtn: false,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					$("#txtReceiptNo").trigger("focus");
				}
			},
		});
		return false;
	} else if (device == "") {
		$.fancyConfirm({
			title: "",
			message: devicecoderequired,
			shownobtn: false,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					$("#txtDeviceCode").trigger("focus");
				}
			},
		});
		return false;
	} else {
		openWaitingModal();
		getRemoteData(
			"/Deposit/GetDeposit",
			{ receiptno: rno, phoneno },
			getReceiptOk_De,
			getRemoteDataFail
		);
	}
});

function getReceiptOk_De(data) {
	closeWaitingModal();
	//console.log("data:", data);
	//return;
	if (data.msg != null) {
		$.fancyConfirm({
			title: '',
			message: data.msg,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$("#btnReload").trigger("click");
				}
			}
		});	
	} else {
		Deposit = data.Deposit;
		selectedSalesCode = Deposit.rtsCode;
		selectedCus = data.customer;
		selectedCusCodeName = selectedCus.cusCode;
		companyinfo = data.companyinfo;
		//receipt = data.receipt;
		DicPayTypes = data.dicpaytypes;
		DepositLnList = data.salesLns.slice(0);
		//console.log('saleslnlist:', DepositLnList);

		ItemList = data.items.slice(0);
		snlist = data.snlist.slice(0);
		cpplList = data.customerpointpricelevels.slice(0);

		//dicPayTypes = $infoblk.data("dicpaytypes");
		////defaultcustomer = $infoblk.data("defaultcustomer");
		taxModel = data.taxModel;
		inclusivetax = data.inclusivetax;
		inclusivetaxrate = data.inclusivetaxrate;
		enableTax = data.enableTax;
		DicLocation = data.DicLocation;
		MyobJobList = data.JobList;
		DicCurrencyExRate = data.DicCurrencyExRate;

		$("#txtNotes").val(Deposit.rtsRmks);

		itotalremainamt = Deposit.TotalRemainAmt!;
		$("#txtDepositAmt").val(formatnumber(Deposit.PayAmt));
		$("#txtTotalRemain").val(formatnumber(itotalremainamt));
		$(".btnPayment").prop("disabled", itotalremainamt <= 0);

		fillinForm_De();
		setupForexInfo();
	}
}

function fillinForm_De() {
	$("#txtCustomerCode").val(selectedCusCodeName);
	$("#txtStaticCustomerName").val(selectedCus.cusName);

	shop = Deposit.rtsSalesLoc;
	device = Deposit.rtsDvc;
	$("#drpLocation").val(shop);
	$("#drpDevice").val(device);

	if (selectedCusCodeName.toLowerCase() !== "guest") {
		$("#txtPoints").val(selectedCus.cusPointsActive??0);
		$("#txtPhone").val(selectedCus.cusCode);
		if (selectedCus.cusPointsActive == 0) {
			$("#txtPriceLevel").val(cpplList[0].PriceLevelDescription);
			selectedCus.cusPriceLevelID = cpplList[0].PriceLevelID;
		} else {
			$.each(cpplList, function (i, e) {
				if (e.CustomerPoint == selectedCus.cusPointsActive) {
					$("#txtPriceLevel").val(cpplList[i].PriceLevelDescription);
					selectedCus.cusPriceLevelID = cpplList[i].PriceLevelID;
					return false;
				}
				if (e.CustomerPoint > (selectedCus.cusPointsActive??0)) {
					if (typeof cpplList[i - 1].PriceLevelDescription !== "undefined") {
						$("#txtPriceLevel").val(cpplList[i - 1].PriceLevelDescription);
						selectedCus.cusPriceLevelID = cpplList[i - 1].PriceLevelID;
						return false;
					}
				}
			});
			if (
				(selectedCus.cusPointsActive??0) > cpplList[cpplList.length - 1].CustomerPoint
			) {
				$("#txtPriceLevel").val(
					cpplList[cpplList.length - 1].PriceLevelDescription
				);
				selectedCus.cusPriceLevelID =
					cpplList[cpplList.length - 1].PriceLevelID;
			}
		}
	}

	let html = "";
	$.each(DepositLnList, function (i, e) {
		let item = $.grep(ItemList, function (ele, idx) {
			return ele.itmCode == e.rtlItemCode;
		})[0];
		let batch = e.rtlBatchCode == null ? "N/A" : e.rtlBatchCode;
		totalsalesQty += e.rtlQty!;
		//let depositqty: number = 0,
		//	depositdate = "N/A",
		//	depositamt: number = 0,

		let depositItem = {} as IDepositItem;
		depositItem.rtlCode = e.rtlCode;
		depositItem.rtlItemCode = e.rtlItemCode;
		depositItem.rtlSeq = e.rtlSeq as number;
		depositItem.rtlDesc = item.itmDesc;
		depositItem.rtlBatchCode = batch;
		depositItem.rtlQty = e.rtlQty as number;
		depositItem.rtlSellingPrice = e.rtlSellingPrice as number;
		depositItem.SellingPriceDisplay = formatmoney(e.rtlSellingPrice as number);
		depositItem.rtlLineDiscPc = e.rtlLineDiscPc as number;
		depositItem.DiscPcDisplay = formatnumber(e.rtlLineDiscPc as number);
		depositItem.TaxPcDisplay = formatnumber(e.rtlTaxPc as number);
		depositItem.rtlTaxPc = e.rtlTaxPc as number;
		depositItem.AmtDisplay = formatmoney(e.rtlSalesAmt as number);
		depositItem.rtlSalesAmt = e.rtlSalesAmt as number;

		depositItem.SalesDateDisplay = Deposit.SalesDateDisplay;
		depositItem.SettleDateDisplay = Deposit.SettleDateDisplay;

		depositItem.DepositAmt = Deposit.PayAmt;
		depositItem.DepositAmtDisplay = formatnumber(Deposit.PayAmt);
		
		depositItem.SettleDate = depositdate;
		depositItem.QtyAvailable = item.lstQtyAvailable;
		depositItem.rtlStockLoc = e.rtlStockLoc;

		//DepositItemList.push(depositItem);
		
		html +=
			'<tr data-itmDesc="' +
			item.itmDesc +
			'">' +
			/* '<td class="jexcel_row">' + (i + 1) + '</td>' +*/
			'<td class="text-center">' +
			e.rtlSeq +
			'</td><td class="text-center">' +
			e.rtlItemCode +
			'</td><td class="text-right">' +
			e.rtlQty +
			'</td><td class="text-right">' +
			formatnumber(e.rtlSellingPrice as number) +
			'</td><td class="text-right">' +
			formatnumber(e.rtlLineDiscPc as number) +
			'</td><td class="text-right">' +
			formatnumber(e.rtlSalesAmt as number) +
			'</td><td class="text-center">' +
			Deposit.SalesDateDisplay +
			'</td>' +
			'<td class="text-center">' +
			e.rtlStockLoc +
			"</td></tr>";
	});
	//console.log("salesitemlist:", salesitemlist);

	$(`#${gTblId} tbody`).empty().append(html);

	$(`#${gTblId} tbody tr`).each(function (i, e) {
		$(e)
			.find("td")
			.each(function (idx, ele) {
				$(ele).css({ "text-align": "center" });
			});
	});

	//check if all saleslns contain the same rtlItemCode:
	let codes: Array<string | number> = [];
	$.each(DepositItemList, function (i, e) {
		codes.push(e.rtlItemCode);
	});
}

$(function () {
	fordeposit = true;
	setFullPage();
	initModals();

	salesType = SalesType.deposit;
	batchidx = 5;
	snidx = batchidx + 1;
	vtidx = snidx + 1;

	//Deposit = $infoblk.data("sales");
	gTblId = "tblDeposit";

	$("#txtReceiptNo").trigger("focus");

	$("#tblDeposit tr td input").hover(
		function () {
			$(this).css("background-color", "#FFFFB0");
		},
		function () {
			$("#tblDeposit tr td input").css("background-color", "#fff"); //apply to other inputs as well!
		}
	);
});
