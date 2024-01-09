$infoblk = $("#infoblk");
enableSN = $infoblk.data("enablesn") === "True";
enableTax = $infoblk.data("enabletax") === "True";
priceeditable = $infoblk.data("priceeditable") === "True";
disceditable = $infoblk.data("disceditable") === "True";

let purchaseitems: IPurchaseItem[] = [];
$(document).on("click", ".btnSave", function () {
	ppId = Number($(this).data("id"));
	updateSelectedPayment();	

	if (validPayment) {
		console.log("PurchasePayment:", purchasePayment);
		//return;
		$.ajax({
			//contentType: 'application/json; charset=utf-8',
			type: "POST",
			url: "/Purchase/EditPayment",
			data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), purchasePayment },
			success: function (data) {
				//if (data) window.location.href = "/Purchase/PurchaseOrderList";
				$.fancyConfirm({
					title: "",
					message: data,
					shownobtn: false,
					okButton: oktxt,
					noButton: notxt,
					callback: function (value) {
						if (value) {
							addPayRow();
							$(`#${gTblName} tbody tr`).last().find("td").eq(1).find(".chequeno").trigger("focus");
						}
					}
				});	
			},
			dataType: "json"
		});
	} else {
		$.fancyConfirm({
			title: "",
			message: paymentinfoerrtxt,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$(`#${gTblName} tbody tr`).last().find("td").eq(1).find(".chequeno").trigger("focus");
				}
			}
		});	
	}

	
});

$(document).on("click", "#btnAdd", function () {
	addPayRow();
});

function populateAccount4Purchase(acno: string, acname: string) {
	$tr = $(`#${gTblName} tbody tr`).eq(currentY);
	setAccName($tr, acno, acname);
}
function toggleDblDisabled(this: any) {
	$(this).prop("disabled", !$(this).prop("disabled"));
	if (!$(this).prop("disabled")) $(this).trigger("focus");
}
$(document).on("dblclick", ".pay", function () {
	toggleDblDisabled.call(this);
});

$(document).on("click", "#btnReload", function () {
	const Id = $("#Id").val();
	let billpara = "";
	if (Purchase.pstStatus.toLowerCase() == "open") billpara = "&status=bill";
	window.location.href = `/Purchase/Edit?Id=${Id}${billpara}`;
});
$(document).on("change", ".received", function () {
	$tr = $(this).parent("td").parent("tr");
	currentY = $tr.data("idx") as number;
	seq = currentY + 1;
	let $receivedqty = $(this);
	let receivedqty: number = Number($receivedqty.val());
	//console.log("receivedqty:" + receivedqty);
	$.each(Purchase.PurchaseItems, function (i, e) {
		if (e.piSeq == seq) {
			selectedPurchaseItem = structuredClone(e);
			e.piReceivedQty = selectedPurchaseItem.piReceivedQty = receivedqty;
			return false;
		}
	});
	let idx = PriceIdx4PstBill;
	const price = Number($tr.find("td").eq(idx).find(".price").val());
	idx++;
	const discpc = Number($tr.find("td").eq(idx).find(".discpc").val());
	//console.log("price:" + price + ";discpc:" + discpc);
	updateRow(price, discpc);
});

$(document).on("click", "#btnEdit", function () {
	window.location.href = `/Purchase/Review?receiptno=${Purchase.pstCode}&mode=editapproved`;
});

$(document).on("click", ".btnSaveRecur", function () {
	if (validatePSIForm()) {
		recurOrder = initRecurOrder();
		recurOrder.Mode = "save";
		$promisedDateDisplay.val("");
		openRecurOrderModal();
	}
});

$(document).on("click", ".btnRequestApproval", function () {
	updatePurchase();
	handleSubmit4Purchase();
});


function updatePurchase() {
	// console.log("updatepurchase in progress...");
	let purchaseitems: IPurchaseItem[] = Purchase.PurchaseItems.slice(0);
	Purchase = fillInPurchase(Purchase.pstStatus, Purchase.DicItemOptions);
	Purchase.PurchaseItems = purchaseitems.slice(0);
	let stockitem: IPurchaseItem;

	if (Purchase.pstStatus !== "order" && Purchase.pstStatus !== "created") {
		//console.log("currenty#updatepurchase:" + currentY);
		$tr = $("#tblPSI tbody tr").eq(currentY);
		$.each(Purchase.PurchaseItems, function (i, e) {
			let seq = currentY + 1;
			//console.log("e.piseq:" + e.piSeq + ";rtlSeq:" + seq);
			if (e.piSeq == seq) {
				e.piReceivedQty = Number($tr.find("td").last().find(".received").val());
				e.piQty = Number($tr.find("td:eq(4)").find(".qty").val());
				let idx = PriceIdx4PstBill;
				e.piUnitPrice = Number($tr.find("td").eq(idx).find(".price").val());
				idx++;
				e.piDiscPc = Number($tr.find("td").eq(idx).find(".discpc").val());
				idx++;
				if (enableTax && !inclusivetax) {
					e.piTaxPc = Number($tr.find("td").eq(idx).find(".taxpc").val());
					e.piTaxAmt = (e.piReceivedQty * e.piUnitPrice) * (e.piTaxPc / 100);
					idx++;
				}
				e.piAmtPlusTax = Number(
					$tr.find("td").eq(-2).find(".amount").val()
				);
				e.piAmt = e.piAmtPlusTax - (e.piTaxAmt ?? 0);

				return false;
			}
		});
		// console.log("purchaseitems@update:", Purchase.PurchaseItems);
	}
	else {
		Purchase.PurchaseItems = [];
		$("#tblPSI tbody tr").each(function (i, e) {
			stockitem = initPurchaseItem();
			stockitem.itmCode = <string>$(e).find("td:eq(1)").find(".itemcode").val();

			if (stockitem.itmCode !== "") {
				stockitem.piSeq = parseInt(<string>$(e).find("td:first").text());
				stockitem.pstCode = Purchase.pstCode;
				stockitem.itmNameDesc = <string>(
					$(e).find("td:eq(2)").find(".itemdesc").data("itemname")
				);
				stockitem.itmDesc = <string>(
					$(e).find("td:eq(2)").find(".itemdesc").val()
				);
				stockitem.piBaseUnit = <string>(
					$(e).find("td:eq(3)").find(".baseunit").val()
				);
				stockitem.piQty = Number(
					$(e).find("td:eq(4)").find(".qty").val()
				);

				let idx: number = PriceIdx4PstOrder;
				stockitem.piUnitPrice = Number(
					$(e).find("td").eq(idx).find(".price").val()
				);
				idx++;
				stockitem.piDiscPc = Number(
					$(e).find("td").eq(idx).find(".discpc").val()
				);
				idx++;
				if (enableTax && !inclusivetax) {
					stockitem.piTaxPc = Number($(e).find("td").eq(idx).find(".taxpc").val());
					stockitem.piTaxAmt = (stockitem.piReceivedQty * stockitem.piUnitPrice) * (stockitem.piTaxPc / 100);
					idx++;
				}
				stockitem.piStockLoc = $(e).find("td").eq(idx).find(".location").val() as string;
				idx++;

				stockitem.JobID = Number($(e)
					.find("td")
					.eq(idx)
					.find(".job")
					.val());

				idx++;
				stockitem.piAmtPlusTax = Number(
					$(e).find("td").eq(idx).find(".amount").val()
				);
				stockitem.piAmt = stockitem.piAmtPlusTax - (stockitem.piTaxAmt ?? 0);
				stockitem.piReceivedQty = -1;
				Purchase.PurchaseItems.push(stockitem);
			}
		});
	}
	let _totalamtplustax = 0;
	$.each(Purchase.PurchaseItems, function (i, e) {
		// console.log("e.piAmtPlusTax:" + e.piAmtPlusTax);
		_totalamtplustax += e.piAmtPlusTax;
	});
	itotalamt = _totalamtplustax;
	// console.log("itotalamt after sum up:" + itotalamt);
	$("#txtTotal").val(formatnumber(itotalamt));

	if (Purchase.pstStatus == "order") focusItemCode();
}

function handleSubmit4Purchase() {
	if (validatePSIForm()) {
		if (Purchase.pstStatus == "open") {
			if (checkPurchaseItems()) {
				Purchase.pstStatus = "opened";
				//console.log("purchasestock:", Purchase);
				//console.log("purchaseitems:", Purchase.PurchaseItems);
				//return false;
				openWaitingModal();
				$.ajax({
					type: "POST",
					url: "/Purchase/Edit",
					data: {
						__RequestVerificationToken: $(
							"input[name=__RequestVerificationToken]"
						).val(),
						model: Purchase,
						PurchaseItems: Purchase.PurchaseItems,
					},
					success: function (data) {
						if (data) {
							closeWaitingModal();
							window.location.href = "/Purchase/Index";
						}
					},
					dataType: "json",
				});
			}
		}
		else {
			updatePurchase();
			//console.log("purchase:", Purchase);
			//console.log("purchaseitems:", Purchase.PurchaseItems);
			//return false;
			openWaitingModal();
			$.ajax({
				type: "POST",
				url: "/Purchase/Edit",
				data: {
					__RequestVerificationToken: $(
						"input[name=__RequestVerificationToken]"
					).val(),
					model: Purchase,
					PurchaseItems: Purchase.PurchaseItems,
					recurOrder,
				},
				success: function (data: IPurchaseReturnMsg) {
					closeWaitingModal();
					if (data) {
						if (approvalmode && !data.ismanager) {
							handleApprovalMode4Purchase(data);
						} else {
							window.location.href = "/Purchase/Index";
						}
					}
				},
				dataType: "json",
			});
		}
	}
}

$(document).on("click", "#btnBill", function () {
	$("body").addClass("billbg");
	Purchase.pstStatus = "open";
	$("#status").text("BILL");
	$(this).addClass("disabled").off("click");

	$target = $(`#${gTblName}`);
	//remove last row:
	$target.find("tbody tr:last").remove();

	let batchtxt: string = $infoblk.data("batchtxt");
	let sntxt: string = $infoblk.data("sntxt");
	$target
		.find("thead tr:first")
		.find("td")
		.eq(4)
		.after(
			`<td title="${batchtxt}" class="text-center" style="width:100px;">${batchtxt}</td><td title="${sntxt}" class="text-center" style="width:100px;">${sntxt}</td><td title="${expirydatetxt}" class="text-center" style="width:100px;">${expirydatetxt}</td><td title="${itemvariationtxt}" class="text-center" style="width:100px;">${itemvariationtxt}</td>`
		);
	$target
		.find("thead tr:first")
		.append(
			`<td class="text-right" style="width:100px;!important;">${receivedqtytxt}</td>`
		);
	let currentItemCount = $target.find("tbody tr").length;

	let itemcodelist: string[] = [];
	let $rows = $target.find("tbody tr");
	$rows.each(function (i, e) {
		if (i < currentItemCount) {
			selectedItemCode = $(e)
				.find("td:eq(1)")
				.find(".itemcode")
				.val() as string;
			itemcodelist.push(selectedItemCode);
		}
		$(e).find("td").eq(4).find(".qty").prop("isadmin", true);
	});

	getDicItemOptionsVariByCodes(itemcodelist, $rows, currentItemCount);
});

$(document).on("change", ".baseunit", function () {
	let baseunit: string = <string>$(this).val();
	let seq: number = <number>$(this).parent("td").parent("tr").data("idx") + 1;
	if (Purchase.PurchaseItems.length > 0) {
		$.each(Purchase.PurchaseItems, function (i, e) {
			if (e.piSeq == seq) {
				e.piBaseUnit = baseunit;
				return false;
			}
		});
	}
});

$(document).on("click", "#btnSave", function () {
	handleSubmit4Purchase();
});

$(document).on("change", "#pstSupplierInvoice", function () {
	Purchase.pstSupplierInvoice = <string>$(this).val();
});
function validatePSIForm(): boolean {
	var msg = "";

	if (Purchase.pstCurrency == "") {
		msg += `${$infoblk.data("currencyrequiredtxt")}<br>`;
		$("#pstCurrency").addClass("focus");
	}

	if (Purchase.supCode == "") {
		msg += `${$infoblk.data("supplierrequiredtxt")}<br>`;
		$("#drpSupplier").addClass("focus");
	}
	if (Purchase.pstSalesLoc == "") {
		msg += `${$infoblk.data("locationrequiredtxt")}<br>`;
		$("#drpLocation").addClass("focus");
	}
	if (Purchase.PurchaseItems.length == 0) {
		msg += `${$infoblk.data("emptyitemwarning")}<br>`;
		$("#tblPSI tbody tr")
			.eq(0)
			.find("td:eq(1)")
			.find(".itemcode")
			.addClass("focus");
		focusItemCode(0);
	}

	if (msg !== "") {
		$.fancyConfirm({
			title: "",
			message: msg,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
		});
	}
	return msg === "";
}

$(document).on("change", "#drpSupplier", function () {
	Purchase.supCode = <string>$(this).val();
	//GetSupplierInfo
	$.ajax({
		type: "GET",
		url: "/Api/GetSupplierInfo",
		data: { supCode: Purchase.supCode },
		success: function (data) {
			//console.log(data);
			selectedSupplier = structuredClone(data) as ISupplier;
			//also trigger here:   $(document).on("change", ".form-control.card", function ()

			if (!useForexAPI) {
				let currcode = GetForeignCurrencyFrmCode(Purchase.supCode!);
				// console.log("currcode:" + currcode);
				if (currcode !== "") {
					//console.log("here");
					$("#pstCurrency").val(currcode).prop("isadmin", true);
					fillInCurrencyModal(currcode);
					exRate = selectedSupplier.ExchangeRate!;
					displayExRate(exRate);
				}
			}

			if (enableTax && !inclusivetax) {
				//console.log("here");
				updateRows();
			}
		},
		dataType: "json",
	});
});

$(document).on("change", "#drpLocation", function () {
	Purchase.pstSalesLoc = <string>$(this).val();
});

$(document).on("change", "#pstRemark", function () {
	Purchase.pstRemark = <string>$(this).val();
});

$(function () {
	approvalmode = $infoblk.data("approvalmode") == "True";
	setFullPage();
	forpurchase = true;
	DicLocation = $infoblk.data("jsondiclocation");
	MyobJobList = $infoblk.data("jsonjoblist");
	uploadsizelimit = parseInt($infoblk.data("uploadsizelimit"));
	uploadsizelimitmb = parseInt($infoblk.data("uploadsizelimitmb"));
	shop = $infoblk.data("shop") as string;
	initModals();

	gTblName = "tblPSI";
	itotalamt = 0;
	$(".datepicker").datepicker({
		dateFormat: jsdateformat,
		beforeShow: function () {
			setTimeout(function () {
				$(".ui-datepicker").css("z-index", 99999999999999);
			}, 0);
		},
	});
	const status: string =
		($("#pstStatus").val() as string).toLowerCase() === "passed"
			? "requesting"
			: ($("#pstStatus").val() as string);
	let bgcls: string = status.toLowerCase().concat("statusbg");
	$("body").addClass(bgcls);
	editmode = Number($("#Id").val()) > 0;
	editapproved =
		getParameterByName("mode") != null &&
		getParameterByName("mode") == "editapproved";

	let _receiptno = getParameterByName("receiptno");
	let isadmin: boolean = $infoblk.data("isadmin") === "True";
	//console.log("isadmin:", isadmin);

	if (_receiptno !== null || editmode) {
		receiptno = _receiptno as string;
		reviewmode = _receiptno !== null && isadmin;
	}
	// console.log("receiptno:" + receiptno);
	if (!editmode)
		$("#pstExRate").val(1);
	Purchase = fillInPurchase();

	if (reviewmode || editmode) {
		if ($infoblk.data("uploadfilelist") !== "") {
			Purchase.UploadFileList = $infoblk.data("uploadfilelist").split(",");
			$("#btnViewFile").removeClass("hide");
		}
		//console.log("uploadfilelist length:", Purchase.UploadFileList.length);
		purchaseitems = $infoblk.data("jsonpurchaseitems");
		//console.log("purchaseitems:", purchaseitems);
		Purchase.DicItemOptions = $infoblk.data("jsonpurchasedicitemoptions");
		DicItemOptions = Object.assign({}, Purchase.DicItemOptions);
		//console.log("dicitemoptions:", DicItemOptions);

		DicItemGroupedVariations = $infoblk.data("dicitemgroupedvariations");
		//console.log("DicItemGroupedVariations:", DicItemGroupedVariations);   
		let html = "";
		let idx = 0;
		$.each(purchaseitems, function (i, stockitem: IPurchaseItem) {
			itemOptions = DicItemOptions[stockitem.itmCode];
			const sntxt = stockitem.piHasSN ? "..." : "";
			//console.log("stockitem.batchlist:", stockitem.batchList);
			const batcode = stockitem.batchList.find((x) => x.batStockInCode == Purchase.pstCode)?.batCode;
			const batch = stockitem.batchList.length > 0 ? "..." : "";
			//console.log(stockitem);
			let vt: string | null = "";

			if (itemOptions && itemOptions.WillExpire) {
				if (!itemOptions.ChkBatch && !itemOptions.ChkSN) {
					vt = stockitem.ValidThruDisplay;
				} else {
					vt = "...";
				}
			}
			const formattedprice: string = formatnumber(stockitem.piUnitPrice);
			const formatteddiscpc: string = formatnumber(<number>stockitem.piDiscPc);
			const formattedamt: string = formatnumber(<number>stockitem.piAmtPlusTax);
			const formattedtaxpc: string = formatnumber(<number>stockitem.piTaxPc);

			var baseunit: string = stockitem.piBaseUnit ?? "N/A";
			html += `<tr data-idx="${idx}" data-qty="${stockitem.piQty}" class=""><td><span>${stockitem.piSeq}</span></td><td><input type="text" name="itemcode" class="itemcode text-left" value="${stockitem.itmCode}"></td><td><input type="text" name="itemdesc" class="itemdesc text-left small" data-itemname="${stockitem.itmNameDesc}" value="${stockitem.itmNameDesc}" title="${stockitem.itmNameDesc}"></td><td class="text-right"><input type="text" name="baseunit" class="baseunit text-right" value="${baseunit}"></td><td class="text-right"><input type="number" name="qty" class="qty text-right" value="${stockitem.piQty}"></td>`;
			var sncls = (Purchase.pstStatus !== "order" && Purchase.pstStatus.toLowerCase() !== "requesting" && Purchase.pstStatus.toLowerCase() !== "created" && Purchase.pstStatus.toLowerCase() !== "rejected") ? "posn pointer" : "serialno";
			var vtcls =
				(Purchase.pstStatus !== "order" && Purchase.pstStatus.toLowerCase() !== "requesting" && Purchase.pstStatus.toLowerCase() !== "created" && Purchase.pstStatus.toLowerCase() !== "rejected") ? "vt pointer" : "validthru datepicker";

			if (Purchase.pstStatus !== "order" && Purchase.pstStatus.toLowerCase() !== "requesting" && Purchase.pstStatus.toLowerCase() !== "created" && Purchase.pstStatus.toLowerCase() !== "rejected") {
				html += `<td><input type="text" name="batch" class="pobatch text-center pointer" data-batcode="${batcode}" value="${batch}" isadmin /></td><td><input type="text" name="serailno" isadmin class="${sncls} text-center" value="${sntxt}" /></td><td><input type="datetime" name="validthru" class="${vtcls} datepicker text-center" value="${vt}" /></td>`;

				//itemvari
				let vari: string = ((stockitem.itmCode in DicItemGroupedVariations) || (!itemOptions.ChkBatch && !itemOptions.ChkSN && !itemOptions.WillExpire)) ? "..." : "";
				html += `<td><input type="text" name="vari" class="povari text-center pointer" value="${vari}" /></td>`;
			}
			html += `<td class="text-right"><input type="number" name="price" class="price text-right" data-price="${stockitem.piUnitPrice}" value="${formattedprice}"></td><td class="text-right"><input type="number" name="discpc" class="discpc text-right" data-discpc="${stockitem.piDiscPc}" value="${formatteddiscpc}"></td>`;
			if (enableTax && !inclusivetax) {
				html += `<td class="text-right"><input type="number" name="taxpc" class="taxpc text-right" value="${formattedtaxpc}"></td>`;
			}

			let locations: string = "";
			for (const [key, value] of Object.entries(DicLocation)) {
				//default primary location:
				let selected: string =
					key == stockitem.piStockLoc ? "selected" : "";
				locations += `<option value='${key}' ${selected}>${value}</option>`;
			}
			html += `<td><select class="location flex text-center">${locations}</td>`;
			html += `<td><select class="job flex text-center">${setJobListOptions(stockitem.JobID ?? 0)}</select></td>`;
			html += `<td class="text-right"><input type="number" name="amount" class="amount text-right" data-amt="${stockitem.piAmtPlusTax}" value="${formattedamt}"></td>`;
			if (Purchase.pstStatus !== "order" && Purchase.pstStatus.toLowerCase() !== "requesting" && Purchase.pstStatus.toLowerCase() !== "created" && Purchase.pstStatus.toLowerCase() !== "rejected") {
				html += `<td class="text-right"><input type="number" name="received" class="received text-right" min="0" style="width:90px!important;" data-received="${stockitem.piReceivedQty}" value="${stockitem.piReceivedQty}"></td>`;
			}
			html += "</tr>";
			idx++;
		});
		$target = $("#tblPSI tbody");
		$target.empty().html(html);
		if (Purchase.pstStatus === "opened" || Purchase.pstStatus == "partialreceival") {

			forpayments = true;

			gTblName = "tblPayment";

			$("input:not([type='file'],[id='txtUserName'])").prop("isadmin", true).prop("disabled", true);
			$("select").prop("disabled", true);
			$("textarea").not("#txtField").prop("isadmin", true).prop("disabled", true);

			if (reviewmode) {
				if (!isadmin) $("button").addClass("disabled");
				$("#btnSave").addClass("disabled");
				$("#btnBill").addClass("disabled");
			}

			DicAcAccounts = $infoblk.data("dicacaccounts");

			//console.log("here");
			if (!reviewmode && (Purchase.pstStatus.toLowerCase() == "order" || Purchase.pstStatus.toLowerCase() == "created")) addRow();

			if (editmode) {
				user = $infoblk.data("user");
				lastppId = Number($infoblk.data("lastppid"));
				PurchasePayments = $infoblk.data("purchasepayments");
				addPayRow();
			}
		}
		else {
			if (Purchase.pstStatus.toLowerCase() == "requesting")
				$("#btnBill").hide();
			addRow();
		}

		$(".respond").data("code", receiptno);
		setValidThruDatePicker();

		initDatePicker(
			"purchaseDate",
			convertCsharpDateStringToJsDate(Purchase.PurchaseDateDisplay)
		);

		Purchase.PurchaseItems = purchaseitems;
		//console.log("purchaseitems:", Purchase.PurchaseItems);

		if (Purchase.PromisedDateDisplay != null) {
			let pdate: Date = convertCsharpDateStringToJsDate(
				Purchase.PromisedDateDisplay
			);
			initDatePicker("promisedDate", pdate);
		} else {
			initDatePicker("promisedDate", tomorrow);
		}

		if (getParameterByName("status") && getParameterByName("status") == "bill")
			$("#btnBill").trigger("click");

	}
	else {
		initDatePicker("promisedDate", tomorrow);
		initDatePicker("purchaseDate", new Date());

		$("#drpLocation").val(shop);
		addRow();
	}

	//console.log("SupplierOptionList:", SupplierOptionList);
	if (SupplierOptionList.length > 0) {
		$("#drpSupplier > option").each(function (i, e) {
			SupplierOptionList.push(`<option value="${$(e).val()}">${$(e).text()}</option>`);
		});
	}

	$("#drpSupplier").select2();
	backUpCardDrpOptions();

	Purchase.JsPurchaseDate = $purchaseDateDisplay.val() as string;
	Purchase.JsPromisedDate = $promisedDateDisplay.val() as string;
	useForexAPI = Purchase.UseForexAPI;
	if (useForexAPI) {
		//console.log("here");
		$.ajax({
			type: "GET",
			url: "https://api.freecurrencyapi.com/v1/latest?apikey=HDs6UlKfcrhu5qov6S1YSjtIF5xlPHeWK7zUw08p&currencies=USD%2CCNY%2CEUR%2CGBP%2CAUD%2CHKD&base_currency=HKD",
			data: {},
			success: function (data) {
				if (data) {
					//console.log("data:", data.data);
					let html = "";
					for (const [key, value] of Object.entries(data.data)) {
						// console.log("key:" + key + ";value:" + value);
						DicCurrencyExRate[key] = 1 / Number(value);
						html += `<tr class="currency" data-key="${key}" data-value="${value}"><td>${key}</td><td>${value}</td></tr>`;
					}
					currencyModal.find("#tblCurrency tbody").empty().html(html);
					//console.log("DicCurrencyExRate:", DicCurrencyExRate);
					if (editmode) {
						exRate = getExRate(Purchase.pstCurrency);
						displayExRate(exRate);
					}
				}
			},
			dataType: "json",
		});
	} else {
		DicCurrencyExRate = $infoblk.data("jsondiccurrencyexrate");
	}
});
