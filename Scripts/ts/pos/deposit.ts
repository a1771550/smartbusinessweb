$infoblk = $("#infoblk");
priceeditable = false; //item price in deposit should not be editable
salesType = SalesType.deposit;

function submitRemaining() {
	if (Deposit.Change > 0) {
		$("#changeModal").dialog("close");
	}

	Deposit.Notes = <string>$("#txtNotes").val();
	Deposit.rtsCusID = selectedCus.cusCustomerID;
	Deposit.rtlCode = rno;
	Deposit.TotalRemainAmt = itotalremainamt;
	Deposit.rtsDvc = $("#txtDeviceCode").val() as string;

	console.log("DepositItemList:", DepositItemList);
	console.log("Payments:", Payments);
	//return false;
	if (DepositItemList.length > 0) {
		let url = "/POSFunc/ProcessRemain";
		openWaitingModal();
		$.ajax({
			type: "POST",
			url: url,
			data: { Deposit, DepositItemList, Payments },
			success: function (data) {
				closeWaitingModal();
				console.log("returned data:", data);
				if (data.msg !== "silent") {
					url =
						printurl +
						"?issales=1&salesrefundcode=" +
						data.rtlCode;
					window.open(url);
				}
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
			"/POSFunc/GetDeposit",
			{ receiptno: rno },
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
		falert(data.msg, oktxt);
	} else {
		Deposit = data.Deposit;
		selectedSalesCode = Deposit.rtsCode;
		selectedCus = data.customer;
		selectedCusCodeName = selectedCus.cusCode;
		companyinfo = data.companyinfo;
		receipt = data.receipt;
		dicPayTypes = data.dicpaytypes;
		DepositLnList = data.salesLns.slice(0);
		//console.log('saleslnlist:', DepositLnList);

		ItemList = data.items.slice(0);
		snlist = data.snlist.slice(0);
		cpplList = data.customerpointpricelevels.slice(0);

		if (data.depositLns.length > 0) {
			depositLns = data.depositLns.slice(0);
		}
		//console.log('depositLns:', depositLns);
		itotalremainamt = data.remainamt;
		$("#txtTotalRemain").val(formatnumber(itotalremainamt));
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
		$("#txtPoints").val(selectedCus.PointsActive);
		$("#txtPhone").val(selectedCus.cusCode);
		if (selectedCus.PointsActive == 0) {
			$("#txtPriceLevel").val(cpplList[0].PriceLevelDescription);
			selectedCus.cusPriceLevelID = cpplList[0].PriceLevelID;
		} else {
			$.each(cpplList, function (i, e) {
				if (e.CustomerPoint == selectedCus.PointsActive) {
					$("#txtPriceLevel").val(cpplList[i].PriceLevelDescription);
					selectedCus.cusPriceLevelID = cpplList[i].PriceLevelID;
					return false;
				}
				if (e.CustomerPoint > selectedCus.PointsActive) {
					if (typeof cpplList[i - 1].PriceLevelDescription !== "undefined") {
						$("#txtPriceLevel").val(cpplList[i - 1].PriceLevelDescription);
						selectedCus.cusPriceLevelID = cpplList[i - 1].PriceLevelID;
						return false;
					}
				}
			});
			if (
				selectedCus.PointsActive > cpplList[cpplList.length - 1].CustomerPoint
			) {
				$("#txtPriceLevel").val(
					cpplList[cpplList.length - 1].PriceLevelDescription
				);
				selectedCus.cusPriceLevelID =
					cpplList[cpplList.length - 1].PriceLevelID;
			}
		}
	}

	if (Deposit.rtsRmks !== null) {
		//console.log("remark:" + Deposit.rtsRmks);
		let $rblk = $("#salesremarkblk");
		$rblk.find("span").text(Deposit.rtsRmks);
		$rblk.show();
	}

	let html = "";
	/*let salesitem: IDepositItem;*/
	let salesitem: IDepositItem;

	$.each(DepositLnList, function (i, e) {
		let item = $.grep(ItemList, function (ele, idx) {
			return ele.itmCode == e.rtlItemCode;
		})[0];
		let batch = e.rtlBatchCode == null ? "N/A" : e.rtlBatchCode;
		totalsalesQty += e.rtlQty!;
		let depositqty: number = 0,
			depositdate = "N/A",
			depositamt: number = 0,
			depositamttxt: string = "";

		if (depositLns.length > 0) {
			$.each(depositLns, function (index, val) {
				/* console.log('depositlist seq:' + val.rtl) */
				if (
					e.rtlCode.toString().toLowerCase().indexOf("de") >= 0 &&
					val.rtlItemCode.toString() == e.rtlItemCode.toString() &&
					val.rtlSeq == e.rtlSeq
				) {
					//console.log('depositamt:' + val.DepositAmt);
					depositamt = val.DepositAmt as number;
					depositamttxt = formatmoney(val.DepositAmt as number);
					depositqty = val.rtlQty!;
					depositdate = val.SalesDateDisplay;
					return false;
				}
			});
		}
		//console.log('depositamt:' + depositamt);
		salesitem = {} as IDepositItem;
		salesitem.rtlCode = e.rtlCode;
		salesitem.rtlItemCode = e.rtlItemCode;
		salesitem.rtlSeq = e.rtlSeq as number;
		salesitem.rtlDesc = item.itmDesc;
		salesitem.rtlBatchCode = batch;
		salesitem.rtlQty = e.rtlQty as number;
		salesitem.rtlSellingPrice = e.rtlSellingPrice as number;
		salesitem.SellingPriceDisplay = formatmoney(e.rtlSellingPrice as number);
		salesitem.rtlLineDiscPc = e.rtlLineDiscPc as number;
		salesitem.DiscPcDisplay = formatnumber(e.rtlLineDiscPc as number);
		salesitem.TaxPcDisplay = formatnumber(e.rtlTaxPc as number);
		salesitem.rtlTaxPc = e.rtlTaxPc as number;
		salesitem.AmtDisplay = formatmoney(e.rtlSalesAmt as number);
		salesitem.rtlSalesAmt = e.rtlSalesAmt as number;
		salesitem.SalesDateDisplay = e.SalesDateDisplay;
		salesitem.DepositQty = depositqty;
		salesitem.DepositAmtDisplay = depositamttxt;
		salesitem.DepositAmt = depositamt;
		salesitem.DepositDate = depositdate;
		salesitem.QtyAvailable = item.Qty;
		salesitem.rtlStockLoc = e.rtlStockLoc;
		DepositItemList.push(salesitem);
		//項目代碼	數量	 價格	折扣%	金額	 銷售日期	退款金額 	退款日期 	詳細
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
			e.SalesDateDisplay +
			'</td><td class="text-right">' +
			formatnumber(depositamt) +
			'</td><td class="text-center">' +
			depositdate +
			'</td><td class="text-center">' +
			e.rtlStockLoc +
			"</td></tr>";
	});
	//console.log("salesitemlist:", salesitemlist);

	$("#tblDeposit tbody").empty().append(html);

	$("#tblDeposit tbody tr").each(function (i, e) {
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

function salesDetail_De(rtlItemCode, seq) {
	let salesitem = $.grep(DepositItemList, function (e, i) {
		return e.rtlItemCode === rtlItemCode && e.rtlSeq == seq;
	})[0];
	//console.log('salesitem:', salesitem);
	//console.log('salesdate:' + salesitem.date);
	//console.log('snlist:', snlist);
	let _snlist = $.grep(snlist, function (e, i) {
		console.log(
			"rtlCode:" +
			e.snoRtlSalesCode +
			";rtlSeq:" +
			e.snoRtlSalesSeq +
			";date:" +
			e.SalesDateDisplay
		);
		return (
			e.snoItemCode === rtlItemCode &&
			e.snoRtlSalesCode === salesitem.rtlCode &&
			e.snoRtlSalesSeq == seq &&
			e.SalesDateDisplay == salesitem.SalesDateDisplay
		);
	});
	//console.log('_snlist:', _snlist);

	let html = '<ul class="list-group list-group-flush">';
	html +=
		'<li class="list-group-item"><strong>' +
		receiptnotxt +
		"</strong>: " +
		salesitem.rtlCode +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		itemcodetxt +
		"</strong>: " +
		salesitem.rtlItemCode +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		description +
		"</strong>: " +
		salesitem.rtlDesc +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		batchtxt +
		"</strong>: " +
		salesitem.rtlBatchCode +
		"</li>";
	if (_snlist.length > 0) {
		let sncodes: string[] = [];
		$.each(_snlist, function (i, e) {
			sncodes.push(e.snoCode);
		});
		console.log("sncodes:", sncodes);
		html +=
			'<li class="list-group-item"><strong>' +
			serialnotxt +
			"</strong>: " +
			sncodes.join() +
			"</li>";
	}

	html +=
		'<li class="list-group-item"><strong>' +
		sellingpricetxt +
		"</strong>: " +
		salesitem.SellingPriceDisplay +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		discountitemheader +
		"</strong>: " +
		salesitem.DiscPcDisplay +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		taxitemheader +
		"</strong>: " +
		salesitem.TaxPcDisplay +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		amountitemheader +
		"</strong>: " +
		salesitem.AmtDisplay +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		salesdatetxt +
		"</strong>: " +
		salesitem.SalesDateDisplay +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		qtytxt +
		"</strong>: " +
		salesitem.rtlQty +
		"</li>";
	//html += '<li class="list-group-item"><strong>' + qtyavailable + '</strong>: ' + salesitem.qtyavailable + '</li>';
	html +=
		'<li class="list-group-item"><strong>' +
		depositamt +
		"</strong>: " +
		salesitem.DepositAmtDisplay +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		depositdate +
		"</strong>: " +
		salesitem.DepositDate +
		"</li>";
	html += "</ul>";
	$.fancyConfirm({
		title: "",
		message: html,
		shownobtn: false,
		okButton: oktxt,
		noButton: canceltxt,
		callback: function (value) {
			if (value) {
				//focusItemCode();
			}
		},
	});
}

$(document).on("click", "#btnPayment", function () {
	if (DepositLnList.length === 0) {
		falert(salesinfonotenough, oktxt);
	} else {
		openPayModel_De();
	}
});



$(document).on("click", "#btnReload", function () {
	if (DepositLnList.length > 0) {
		$.fancyConfirm({
			title: "",
			message: confirmreload,
			shownobtn: true,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					window.location.reload();
				}
			},
		});
	}
});

$(function () {
	fordeposit = true;
	setFullPage();
	initModals();

	salesType = SalesType.deposit;
	batchidx = 5;
	snidx = batchidx + 1;
	vtidx = snidx + 1;

	//Deposit = $infoblk.data("sales");
	gTblName = "tblDeposit";

	dicPayTypes = $infoblk.data("dicpaytypes");
	defaultcustomer = $infoblk.data("defaultcustomer");
	taxModel = $infoblk.data("taxmodel");
	inclusivetax = $infoblk.data("inclusivetax") == "True";
	inclusivetaxrate = $infoblk.data("inclusivetaxrate");
	enableTax = $infoblk.data("enabletax") == "True";
	DicLocation = $infoblk.data("diclocation");
	JobList = $infoblk.data("joblist");



	$("#txtDeviceCode").trigger("focus");

	$("#tblDeposit tr td input").hover(
		function () {
			$(this).css("background-color", "#FFFFB0");
		},
		function () {
			$("#tblDeposit tr td input").css("background-color", "#fff"); //apply to other inputs as well!
		}
	);
});
