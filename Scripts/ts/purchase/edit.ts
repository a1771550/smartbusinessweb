$infoblk = $("#infoblk");


let purchaseitems: IPurchaseItem[] = [];
$(document).on("click", ".btnSave", function () {
	getRowCurrentY.call(this);
	ppId = Number($(this).data("id"));
	updateSelectedPayment();

	if (validPayment) {
		//console.log("PurchasePayment:", purchasePayment);
		//return;
		$.ajax({
			type: "POST",
			url: "/Purchase/EditPayment",
			data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), purchasePayment },
			success: function (data) {
				$.fancyConfirm({
					title: "",
					message: data,
					shownobtn: false,
					okButton: oktxt,
					noButton: notxt,
					callback: function (value) {
						if (value) {
							forpurchasepayments = false; //reset the flag
							forpurchase = true;
							$tr.find(".disabled").removeClass("disabled");
							let totalowed: number = Number($("#totalowed").text());
							if (totalowed > 0) {
								addPayRow();
								$(`#${gTblId} tbody tr`).last().find(".chequeno").trigger("focus");
							}
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
					$(`#${gTblId} tbody tr`).last().find(".chequeno").trigger("focus");
				}
			}
		});
	}


});

$(document).on("dblclick", ".viewfile", function () {
	openViewFileModal();
});
$(document).on("click", ".btnPoUpload", function () {
	forpurchasepayments = false;
	openUploadFileModal();
});
$(document).on("click", "#btnAdd", function () {
	addPayRow();
});

function populateAccount4Purchase(acno: string, acname: string) {
	$tr = $(`#${gTblId} tbody tr`).eq(currentY);
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
			SelectedPurchaseItem = structuredClone(e);
			e.piReceivedQty = SelectedPurchaseItem.piReceivedQty = receivedqty;
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
	let purchaseitems: IPurchaseItem[] = Purchase.PurchaseItems.slice(0);
	FillInPurchase(Purchase.pstStatus);
	Purchase.PurchaseItems = purchaseitems.slice(0);

	let purchaseItem: IPurchaseItem;

	if (Purchase.pstStatus !== "order" && Purchase.pstStatus !== "created" && Purchase.pstStatus !== "draft") {
		//console.log("currenty#updatepurchase:" + currentY);
		let $localTR = $("#tblPSI tbody tr").eq(currentY);
		$.each(Purchase.PurchaseItems, function (i, e) {
			let seq = currentY + 1;
			//console.log("e.piseq:" + e.piSeq + ";rtlSeq:" + seq);
			if (e.piSeq == seq) {
				e.piReceivedQty = Number($localTR.find(".received").val());
				e.piQty = Number($localTR.find(".qty").val());
				e.piUnitPrice = Number($localTR.find(".price").val());
				e.piDiscPc = Number($localTR.find(".discpc").val());
				
				if (enableTax && !inclusivetax) {
					e.piTaxPc = Number($localTR.find(".taxpc").val());
					e.piTaxAmt = (e.piReceivedQty * e.piUnitPrice) * (e.piTaxPc / 100);
					
				}
				e.piAmtPlusTax = Number(
					$localTR.find(".amount").val()
				);
				e.piAmt = e.piAmtPlusTax - (e.piTaxAmt ?? 0);

				return false;
			}
		});
		// console.log("purchaseitems@update:", Purchase.PurchaseItems);
	}
	else {
		//console.log("here");
		Purchase.PurchaseItems = [];
		$("#tblPSI tbody tr").each(function (i, e) {
			purchaseItem = {} as IPurchaseItem;
			purchaseItem.itmCode = $(e).find(".itemcode").val() as string;
			//console.log("purchaseItem.itmCode:", purchaseItem.itmCode);
			//console.log("code not empty?", purchaseItem.itmCode);

			if (purchaseItem.itmCode) {
				purchaseItem.piSeq = $(e).index() + 1;
				//console.log("seq:" + purchaseItem.piSeq);
				purchaseItem.pstCode = Purchase.pstCode;
				purchaseItem.itmNameDesc = <string>(
					$(e).find(".itemdesc").data("itemname")
				);
				purchaseItem.itmDesc = <string>(
					$(e).find(".itemdesc").val()
				);
				purchaseItem.piBaseUnit = <string>(
					$(e).find(".baseunit").val()
				);
				purchaseItem.piQty = Number(
					$(e).find(".qty").val()
				);

				purchaseItem.piUnitPrice = Number(
					$(e).find(".price").val()
				);

				purchaseItem.piDiscPc = Number(
					$(e).find(".discpc").val()
				);
				let discamt = purchaseItem.piUnitPrice * purchaseItem.piDiscPc / 100;

				if (enableTax && !inclusivetax) {
					purchaseItem.piTaxPc = Number($(e).find(".taxpc").val());
					purchaseItem.piTaxAmt = (purchaseItem.piQty * purchaseItem.piUnitPrice) * (purchaseItem.piTaxPc / 100);

				}
				purchaseItem.piStockLoc = $(e).find(".location").val() as string;


				purchaseItem.JobID = Number($(e)
					.find(".job")
					.val());

				//console.log("$(e).find(input.amount):", $(e).find("input.amount"));
				//console.log("amt:", $(e).find("input.amount").val());
				let amt = Number($(e).find("input.amount").val());
				if (amt === 0) amt = (purchaseItem.piUnitPrice * purchaseItem.piQty) - discamt + (purchaseItem.piTaxAmt??0);
				purchaseItem.piAmtPlusTax = amt;
				//console.log(" purchaseItem.piAmtPlusTax#0:" + purchaseItem.piAmtPlusTax);
				purchaseItem.piAmt = purchaseItem.piAmtPlusTax - (purchaseItem.piTaxAmt ?? 0);
				//console.log(" purchaseItem.piAmtPlusTax#1:" + purchaseItem.piAmtPlusTax);
				purchaseItem.piReceivedQty = -1;
				//console.log("purchaseItem:", purchaseItem);
				Purchase.PurchaseItems.push(purchaseItem);
			}
		});
	}
	let _totalamtplustax = 0;
	$.each(Purchase.PurchaseItems, function (i, e) {
		 //console.log("e.piAmtPlusTax:" + e.piAmtPlusTax);
		_totalamtplustax += e.piAmtPlusTax;
	});
	itotalamt = _totalamtplustax;
	//console.log("itotalamt after sum up:" + itotalamt);
	$("#txtTotal").val(formatnumber(itotalamt));
	$("#pstAmount").val(itotalamt);

	if (Purchase.pstStatus == "order") focusItemCode();
}

function handleSubmit4Purchase() {
	if (validatePSIForm()) {
		if (Purchase.pstStatus == "open") {
			if (checkPurchaseItems()) {
				Purchase.pstStatus = "opened";
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

	$target = $(`#${gTblId}`);
	//remove last row:
	$target.find("tbody tr:last").remove();

	let batchtxt: string = $infoblk.data("batchtxt");
	let sntxt: string = $infoblk.data("sntxt");
	$target
		.find("thead tr:first")
		.find("th")
		.eq(4)
		.after(
			`<th title="${batchtxt}" class="ip sellbat text-center">${batchtxt}</th><th title="${sntxt}" class="ip sellbat text-center">${sntxt}</th><th title="${expirydatetxt}" class="ip sellvt text-center">${expirydatetxt}</th><th title="${itemvariationtxt}" class="iv text-center selliv">${itemvariationtxt}</th>`
		);
	$target
		.find("thead tr:first")
		.append(
			`<th class="text-right treceived">${receivedqtytxt}</th>`
		);
	let currentItemCount = $target.find("tbody tr").length;

	let itemcodelist: string[] = [];
	let $rows = $target.find("tbody tr");
	$rows.each(function (i, e) {
		if (i < currentItemCount) {
			selectedItemCode = $(e)				
				.find(".itemcode")
				.val() as string;
			itemcodelist.push(selectedItemCode);
		}
		$(e).find("td:lt(5)").prop("isadmin", isadmin).find("input").prop("disabled", true);
		$(e).find(".number").prop("disabled", true);
		$(e).find("select").prop("disabled", true);
	});

	getDicItemOptionsVariByCodes(itemcodelist, $rows, currentItemCount);
	$("#tblPSI tbody input").removeClass("form-control");
	$("#tblPSI tbody select").removeClass("form-control");
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
			SelectedSupplier = structuredClone(data) as ISupplier;
			//also trigger here:   $(document).on("change", ".form-control.card", function ()

			if (!UseForexAPI) {
				let currcode = GetForeignCurrencyFrmCode(Purchase.supCode!);
				// console.log("currcode:" + currcode);
				if (currcode !== "") {
					//console.log("here");
					$("#pstCurrency").val(currcode).prop("isadmin", true);
					fillInCurrencyModal(currcode);
					exRate = SelectedSupplier.ExchangeRate!;
					displayExRate(exRate);
				}
			}

			if (enableTax && !inclusivetax) {
				
				if ($(`#${gTblId} tbody tr`).find(".itemcode").val()) updateRows4Tax();
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

function initPurchaseForm():boolean {
	approvalmode = $infoblk.data("approvalmode") == "True";
	setFullPage();
	apId = Number($infoblk.data("apid"));
	forpurchase = true;
	enableSN = $infoblk.data("enablesn") === "True";
	enableTax = $infoblk.data("enabletax") === "True";
	priceeditable = $infoblk.data("priceeditable") === "True";
	disceditable = $infoblk.data("disceditable") === "True";
	DicLocation = $infoblk.data("jsondiclocation");
	MyobJobList = $infoblk.data("jsonjoblist");
	uploadsizelimit = parseInt($infoblk.data("uploadsizelimit"));
	uploadsizelimitmb = parseInt($infoblk.data("uploadsizelimitmb"));
	shop = $infoblk.data("shop") as string;
	initModals();
	triggerMenuByCls("menupurchase", 0);

	gTblId = "tblPSI";
	itotalamt = 0;

	$(".datepicker").datepicker({
		dateFormat: jsdateformat,
		beforeShow: function () {
			setTimeout(function () {
				$(".ui-datepicker").css("z-index", 99999999999999);
			}, 0);
		},
	});

	initDatePicker("promisedDate", tomorrow);
	initDatePicker("purchaseDate", new Date());

	$("#drpLocation").val(shop);

	const status: string = ($("#pstStatus").val() as string).toLowerCase() === "passed"
		? "requesting"
		: ($("#pstStatus").val() as string);
	let bgcls: string = status.toLowerCase().concat("statusbg");
	$("body").addClass(bgcls);

	FillInPurchase();
	
	if ($infoblk.data("uploadfilelist") !== "") {
		Purchase.UploadFileList = ($infoblk.data("uploadfilelist").toString()).split(",");
		populateFileList(Purchase.UploadFileList);
	}

	editapproved =
		getParameterByName("mode") != null &&
		getParameterByName("mode") == "editapproved";

	let _receiptno = getParameterByName("receiptno");
	let isadmin: boolean = $infoblk.data("isadmin") === "True";
	//console.log("isadmin:", isadmin);
	if (_receiptno !== null) {
		receiptno = _receiptno as string;
		reviewmode = _receiptno !== null && isadmin;
	}

	//console.log("Purchase:", Purchase);
	editmode = Purchase.pstStatus != "draft" && !reviewmode;
	// console.log("receiptno:" + receiptno);
	if (!editmode)
		$("#pstExRate").val(1);

	//console.log("SupplierOptionList:", SupplierOptionList);
	if (SupplierOptionList.length > 0) {
		$("#drpSupplier > option").each(function (i, e) {
			SupplierOptionList.push(`<option value="${$(e).val()}">${$(e).text()}</option>`);
		});
	}

	$("#drpSupplier").select2();
	backUpCardDrpOptions();

	return isadmin;
}

function populatePurchaseItems() {
	let html = "";
	let idx = 0;

	$(".price").off("change");
	$(".discpc").off("change");
	$(".taxpc").off("change");

	$.each(purchaseitems, function (i, purchaseitem: IPurchaseItem) {
		itemOptions = DicItemOptions[purchaseitem.itmCode];
		const sntxt = purchaseitem.piHasSN ? "..." : "";
		//console.log("purchaseitem.batchlist:", purchaseitem.batchList);
		const batcode = purchaseitem.batchList.length === 0 ? "" : purchaseitem.batchList.find((x) => x.batStockInCode == Purchase.pstCode)?.batCode;
		const batch = purchaseitem.batchList.length > 0 ? "..." : "";
		//console.log(purchaseitem);
		let vt: string | null = purchaseitem.ValidThruDisplay??"";

		if (itemOptions && itemOptions.WillExpire) {
			if (!itemOptions.ChkBatch && !itemOptions.ChkSN) {
				vt = purchaseitem.ValidThruDisplay;
			} else {
				vt = "...";
			}
		}
		const formattedprice: string = formatnumber(purchaseitem.piUnitPrice);
		const formatteddiscpc: string = formatnumber(<number>purchaseitem.piDiscPc);
		const formattedamt: string = formatnumber(<number>purchaseitem.piAmtPlusTax);
		const formattedtaxpc: string = formatnumber(<number>purchaseitem.piTaxPc);

		var baseunit: string = purchaseitem.piBaseUnit ?? "N/A";
		//console.log("purchaseitem.itmCode:", purchaseitem.itmCode);
		let inputcls = (Purchase.pstStatus == "opened" || Purchase.pstStatus == "partialreceival") ? "" : "form-control";
		html += `<tr data-idx="${idx}" data-qty="${purchaseitem.piQty}" class=""><td class="text-center seq"><span>${purchaseitem.piSeq}</span></td><td class="text-center code"><input type="text" name="itemcode" class="${inputcls} pointer itemcode text-center flex" title="${purchaseitem.itmCode}" value="${purchaseitem.itmCode}"></td><td class="text-center namedesc"><input type="text" name="itemdesc" readonly class="${inputcls} itemdesc text-center small" value="${purchaseitem.itmNameDesc}" title="${purchaseitem.itmNameDesc}"></td><td class="text-right unit"><input type="text" name="baseunit" class="form-control baseunit text-right flex" readonly value="${baseunit}"></td><td class="text-right sellqty"><input type="number" name="qty" class="form-control qty text-right flex" value="${purchaseitem.piQty}"></td>`;
		var sncls = (Purchase.pstStatus !== "order" && Purchase.pstStatus.toLowerCase() !== "requesting" && Purchase.pstStatus.toLowerCase() !== "created" && Purchase.pstStatus.toLowerCase() !== "rejected") ? "posn pointer" : "serialno";
		var vtcls = (Purchase.pstStatus !== "order" && Purchase.pstStatus.toLowerCase() !== "requesting" && Purchase.pstStatus.toLowerCase() !== "created" && Purchase.pstStatus.toLowerCase() !== "rejected") ? "vt pointer" : "validthru datepicker";

		
		inputcls = "form-control ip";
		if (Purchase.pstStatus !== "order" && Purchase.pstStatus.toLowerCase() !== "requesting" && Purchase.pstStatus.toLowerCase() !== "created" && Purchase.pstStatus.toLowerCase() !== "rejected") {			
			html += `<td class="text-center ip"><input type="text" class="${inputcls} pobatch text-center pointer flex" data-batcode="${batcode}" value="${batch}" /></td><td class="text-center ip"><input type="text" class="${sncls} ${inputcls} text-center flex" value="${sntxt}" /></td><td class="text-center ip"><input type="text" class="${inputcls} ${vtcls} text-center flex" value="${vt}" title="${vt}" /></td>`;

			
			let vari: string = (purchaseitem.itmCode in DicItemGroupedVariations) ? "..." : "";
			html += `<td class="text-center iv"><input type="text" class="${inputcls} povari text-center flex pointer" value="${vari}" /></td>`;
		}
		html += `<td class="text-right sellprice num"><input type="text" name="price" class="form-control price number text-right flex" data-price="${purchaseitem.piUnitPrice}" value="${formattedprice}"></td><td class="text-right selldiscpc" num><input type="text" name="discpc" class="form-control discpc number text-right flex" data-discpc="${purchaseitem.piDiscPc}" value="${formatteddiscpc}"></td>`;
		if (enableTax && !inclusivetax) {
			html += `<td class="text-right selltax num"><input type="text" name="taxpc" class="form-control taxpc number text-right flex" value="${formattedtaxpc}"></td>`;
		}

		let locations: string = "";
		for (const [key, value] of Object.entries(DicLocation)) {
			//default primary location:
			let selected: string = key == purchaseitem.piStockLoc ? "selected" : "";
			locations += `<option value='${key}' ${selected}>${value}</option>`;
		}
		html += `<td class="text-center selllocation"><select class="form-control location flex text-center">${locations}</td>`;
		html += `<td class="text-center selljob"><select class="form-control job flex text-center">${setJobListOptions(purchaseitem.JobID ?? 0)}</select></td>`;
		html += `<td class="text-right sellamt num"><input type="text" name="amount" class="form-control amount number text-right flex" data-amt="${purchaseitem.piAmtPlusTax}" value="${formattedamt}" readonly></td>`;
		if (Purchase.pstStatus !== "order" && Purchase.pstStatus.toLowerCase() !== "requesting" && Purchase.pstStatus.toLowerCase() !== "created" && Purchase.pstStatus.toLowerCase() !== "rejected") {
			html += `<td class="text-right treceived"><input type="number" class="form-control received text-right flex" min="0" data-received="${purchaseitem.piReceivedQty}" value="${purchaseitem.piReceivedQty}"></td>`;
		}
		html += "</tr>";
		idx++;
	});
	$target = $("#tblPSI tbody");
	$target.empty().html(html);

	$(".itemdesc").on("dblclick", handleItemDescDblClick);

	$(".price").on("change", handlePriceChange);
	$(".discpc").on("change", handleDiscChange);
	$(".taxpc").on("change", handleTaxChange);
}

function initForEx() {
	UseForexAPI = $("#UseForexAPI").val() === "True";
	if (UseForexAPI) {
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
}
$(function () {	
	let isadmin: boolean = initPurchaseForm();

	if (reviewmode || editmode) initPurchaseFormWModes();
	else addRow();

	initForEx();
	function initPurchaseFormWModes() {
		purchaseitems = $infoblk.data("jsonpurchaseitems");
		//console.log("purchaseitems:", purchaseitems);
		DicItemOptions = $infoblk.data("dicitemoptions");
		//console.log("dicitemoptions:", DicItemOptions);
		DicItemGroupedVariations = $infoblk.data("dicitemgroupedvariations");
		//console.log("DicItemGroupedVariations:", DicItemGroupedVariations);   

		populatePurchaseItems();

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

		if (Purchase.pstStatus === "opened" || Purchase.pstStatus == "partialreceival") {
			//forpurchasepayments = true;
			gTblId = "tblPayment";

			ReadonlyDisableEntries();

			if (reviewmode) {
				if (!isadmin) $("button").addClass("disabled");
				$("#btnSave").addClass("disabled");
				$("#btnBill").addClass("disabled");
			}

			DicAcAccounts = $infoblk.data("dicacaccounts");
			//console.log("DicAcAccounts:", DicAcAccounts);
			if (!reviewmode && (Purchase.pstStatus.toLowerCase() == "order" || Purchase.pstStatus.toLowerCase() == "created")) addRow();

			if (editmode) {
				user = $infoblk.data("user");
				lastppId = Number($infoblk.data("lastppid"));
				PurchasePayments = $infoblk.data("purchasepayments");

				let totalowed = Number($("#totalowed").text());
				if (totalowed > 0) addPayRow();
			}
		}
		else {
			if (Purchase.pstStatus.toLowerCase() == "requesting")
				$("#btnBill").hide();

			if (editmode) addRow();

			if (reviewmode) ReadonlyDisableEntries();
		}
	}

	setInput4NumberOnly("number");
});