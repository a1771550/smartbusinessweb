﻿formatzero = formatnumber(0);
function handleOutOfStocks(
	zerostockItemcodes: string,
	salescode: string | null = null
) {
	let zerostockitemcodelist: string[] = zerostockItemcodes.split(",");
	//console.log("zerostockitemcodelist", zerostockitemcodelist);
	let msg = zerostockitemswarning + ":<br>";
	let codelist: Array<string> = [];
	$.each(zerostockitemcodelist, function (i, e: string) {
		if (!codelist.includes(e)) {
			msg += e + "<br>";
		}
		codelist.push(e);
	});
	$.fancyConfirm({
		title: "",
		message: msg,
		shownobtn: false,
		okButton: oktxt,
		noButton: canceltxt,
		callback: function (value) {
			if (value) {
				/*  if (forwholesales) {*/
				window.location.href = "/Item/ZeroStocks?rtsCode=" + salescode;
				//} else {
				//    window.open(printurl);
				//    window.location.reload();
				//}
			}
		},
	});
}
function searchItem() {
	if (keyword !== "") {
		let _keyword: string = keyword.toLowerCase();
		selectedItemCode = _keyword;
		openWaitingModal();
		GetItems(1);
	}
}

function getItemAccountMode(mode: string): ItemAccountMode {
	switch (mode.toLowerCase()) {
		default:
		case "buy":
			return ItemAccountMode.Buy;
		case "sell":
			return ItemAccountMode.Sell;
		case "inventory":
			return ItemAccountMode.Inventory;
	}
}

function togglePaging(type: string = "item", show: boolean = true) {
	let $pager: JQuery;
	switch (type) {
		case "Customer":
			$target = $("#tblCus");
			break;
		case "HotList":
			$target = $("#tblHotList");
		case "contact":
			$target = $("#tblContact");
			break;
		case "stock":
			$target = $("#tblStock");
			break;
		case "transfer":
			$target = $("#tblTransfer");
			break;
		default:
		case "item":
			$target = $("#tblItem");
	}
	$pager = $(".Pager");
	let $norecord: JQuery = $target.prev("#norecord");
	if (show) {
		$target.show();
		$norecord.addClass("hide");
		$pager.show();
		$("#tblcontact").hide();
	} else {
		//console.log("here");
		$target.hide();
		$norecord.removeClass("hide");
		$pager.hide();
		$("#tblcontact").show();
	}

	let $tblcustomer: JQuery = $("#tblCustomer");
	if ($tblcustomer.length) {
		$tblcustomer.hide();
	}
	let $pagingblk: JQuery = $("#pagingblk");
	if ($pagingblk.length) {
		$pagingblk.hide();
	}
}

function GetTrainings(pageIndex) {
	$.ajax({
		type: "GET",
		url: "/Training/GetTrainings",
		data: { pageIndex, sortCol, sortDirection, keyword },
		success: function (data) {
			//console.log("data:", data);
			if (data && data.pagingTrainingList) {
				TrainingList = data.pagingTrainingList.slice(0);
				if (TrainingList && TrainingList.length > 0) {

					const totalRecord: number = Math.min(...TrainingList.map(x => x.TotalRecord));

					$target = $("#tblmails .colheader");
					$target.removeClass("fa fa-sort-up fa-sort-down");
					$target = $target.eq(sortCol);
					$target.addClass("fa");
					if (sortDirection.toUpperCase() == "DESC") {
						sortDirection = "ASC";
						$target.addClass("fa-sort-down");
					} else {
						sortDirection = "DESC";
						$target.addClass("fa-sort-up");
					}

					fillInTrainingTable();

					$(".Pager").ASPSnippets_Pager({
						ActiveCssClass: "current",
						PagerCssClass: "pager",
						PageIndex: pageIndex,
						PageSize: PageSize,
						RecordCount: totalRecord,
					});
					$("#totalcount").text(totalRecord);
				}
			}
		},
		dataType: "json",
		error: onAjaxFailure,
	});
}
function GetJobs(pageIndex) {
	$.ajax({
		type: "GET",
		url: "/Job/GetJobs",
		data: { pageIndex, sortCol, sortDirection, keyword },
		success: function (data) {
			//console.log("data:", data);
			if (data && data.pagingJobList) {
				JobList = data.pagingJobList.slice(0);
				if (JobList && JobList.length > 0) {
					const totalRecord: number = Math.min(...JobList.map(x => x.TotalRecord));

					$target = $("#tblmails .colheader");
					$target.removeClass("fa fa-sort-up fa-sort-down");
					$target = $target.eq(sortCol);
					$target.addClass("fa");
					if (sortDirection.toUpperCase() == "DESC") {
						sortDirection = "ASC";
						$target.addClass("fa-sort-down");
					} else {
						sortDirection = "DESC";
						$target.addClass("fa-sort-up");
					}

					fillInJobTable();

					$(".Pager").ASPSnippets_Pager({
						ActiveCssClass: "current",
						PagerCssClass: "pager",
						PageIndex: pageIndex,
						PageSize: PageSize,
						RecordCount: totalRecord,
					});
					$("#totalcount").text(totalRecord);
				}
			}
		},
		dataType: "json",
		error: onAjaxFailure,
	});
}
function GetAttendances(pageIndex) {
	$.ajax({
		type: "GET",
		url: "/Attendance/GetAttendances",
		data: { pageIndex, sortCol, sortDirection, keyword },
		success: function (data) {
			//console.log("data:", data);
			if (data) {
				AttendanceList = data.pagingAttdList.slice(0);
				if (AttendanceList && AttendanceList.length > 0) {
					const totalRecord: number = Math.min(...AttendanceList.map(x => x.TotalRecord));

					$target = $("#tblmails .colheader");
					$target.removeClass("fa fa-sort-up fa-sort-down");
					$target = $target.eq(sortCol);
					$target.addClass("fa");
					if (sortDirection.toUpperCase() == "DESC") {
						sortDirection = "ASC";
						$target.addClass("fa-sort-down");
					} else {
						sortDirection = "DESC";
						$target.addClass("fa-sort-up");
					}

					fillInAttdTable();

					$(".Pager").ASPSnippets_Pager({
						ActiveCssClass: "current",
						PagerCssClass: "pager",
						PageIndex: pageIndex,
						PageSize: PageSize,
						RecordCount: totalRecord,
					});
					$("#totalcount").text(totalRecord);
				}
			}
		},
		dataType: "json",
		error: onAjaxFailure,
	});
}
function GetEnquiries(pageIndex) {
	openWaitingModal();
	//console.log("sortDirection#0:" + sortDirection);
	$.ajax({
		type: "GET",
		url: "/Enquiry/GetEnquiries",
		data: { pageIndex, sortCol, sortDirection, keyword },
		success: function (data) {
			//console.log("data:", data);
			if (data) {
				EnquiryList = data.pagingEnqList.slice(0);
				if (EnquiryList && EnquiryList.length > 0) {
					//const min = Math.min(...myArray.map(item => item.cost))
					const totalRecord: number = Math.min(...EnquiryList.map(x => x.TotalRecord));

					$target = $("#tblmails .colheader");
					$target.removeClass("fa fa-sort-up fa-sort-down");
					$target = $target.eq(sortCol);
					$target.addClass("fa");

					if (sortDirection.toUpperCase() == "DESC") {
						sortDirection = "ASC";
						$target.addClass("fa-sort-down");
					} else {
						sortDirection = "DESC";
						$target.addClass("fa-sort-up");
					}

					//console.log("sortDirection#1:" + sortDirection);

					fillInEnqTable();

					$(".Pager").ASPSnippets_Pager({
						ActiveCssClass: "current",
						PagerCssClass: "pager",
						PageIndex: pageIndex,
						PageSize: PageSize,
						RecordCount: totalRecord,
					});
					$("#totalcount").text(totalRecord);
				}
				closeWaitingModal();
			}
		},
		dataType: "json",
		error: onAjaxFailure,
	});
}
$(document).on("change", "#drpLatestRecordCount", function () {
	sortDirection = sortDirection.toUpperCase() == "DESC" ? "ASC" : "DESC";
	handleMGTmails(1, Number($(this).val()));
});
function GetItems(pageIndex) {
	let type = getParameterByName("type") ?? "";

	shop = $("#drpLocation").length
		? ($("#drpLocation").val() as string)
		: $infoblk.data("location")
			? ($infoblk.data("location") as string)
			: ($infoblk.data("shop") as string);

	let data = { pageIndex: pageIndex, keyword: keyword, location: shop, forsales: forsales, forwholesales: forwholesales, forpurchase: forpurchase, forstock: forstock, fortransfer: fortransfer, forpreorder: forpreorder, type: type };


	openWaitingModal();
	$.ajax({
		url: "/Api/GetItemsAjax",
		type: "GET",
		data: data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: OnSuccess,
		error: onAjaxFailure,
	});
}
function OnSuccess(response) {
	closeWaitingModal();
	var model = response;
	seq = currentY + 1;

	DicItemOptions = response.DicItemOptions;

	if (model.Items.length > 0) {
		ItemList = model.Items.slice(0);

		if (searchItemMode) searchItemMode = false;
		if (ItemList.length === 1) {
			if (searchItemMode) {
				closeItemModal();
			}

			selectedItemCode = ItemList[0].itmCode;
			if (forsales) {
				selectedSalesLn = GetSetSelectedSalesLn();
				selectedSalesLn!.Item = structuredClone(ItemList[0]);
			}
			if (forpreorder) {
				selectedPreSalesLn = GetSetSelectedPreSalesLn();
				selectedPreSalesLn!.Item = structuredClone(ItemList[0]);
			}
			if (forwholesales) {
				SelectedWholeSalesLn = GetSetSelectedWholeSalesLn();
				SelectedWholeSalesLn!.Item = structuredClone(ItemList[0]);
			}
			if (forpurchase) {
				SelectedPurchaseItem = GetSetSelectedPurchaseItem();
				SelectedPurchaseItem!.Item = structuredClone(ItemList[0]);
			}

			if (forsales || forpurchase || forwholesales || forpreorder || forIA || forEditReserve) {
				$(".itemcode").off("change");
				if (forEditReserve) populateReserveRow();
				else populateSalesRow();
				$(".itemcode").on("change", handleItemCodeChange);
			}
			else {
				copiedItem = structuredClone(ItemList[0]);
			}
		} else {
			openItemModal();
			writeItems(model.Items);
		}

		$(".Pager").ASPSnippets_Pager({
			ActiveCssClass: "current",
			PagerCssClass: "pager",
			PageIndex: model.PageIndex,
			PageSize: model.PageSize,
			RecordCount: model.RecordCount,
		});
	} else {
		togglePaging("item", false);
	}
}
function GetSetSelectedPreSalesLn(): IPreSalesLn {
	if (PreSalesLnList.length > 0) {
		let idx = PreSalesLnList.findIndex((x) => { return x.rtlSeq == seq; });
		if (idx >= 0) selectedPreSalesLn = PreSalesLnList[idx];
		else {
			initSimpleItem();
			PreSalesLnList.push(selectedPreSalesLn!);
		}
	} else {
		PreSalesLnList = [];
		initSimpleItem();
		PreSalesLnList.push(selectedPreSalesLn!);
	}
	return selectedPreSalesLn!;
}
function initSimpleItem() {
	selectedPreSalesLn = {} as IPreSalesLn;
	selectedPreSalesLn.rtlSeq = seq;
	selectedPreSalesLn.rtlItemCode = selectedItemCode
		? selectedItemCode.toString()
		: getItemCodeBySeq();
}

function GetSetSelectedSalesLn(): ISalesLn {
	if (SalesLnList.length > 0) {
		let idx = SalesLnList.findIndex((x) => { return x.rtlSeq == seq; });
		if (idx >= 0) selectedSalesLn = SalesLnList[idx];
		else {
			selectedSalesLn = initSalesLn();
			SalesLnList.push(selectedSalesLn);
		}
	} else {
		SalesLnList = [];
		selectedSalesLn = initSalesLn();
		SalesLnList.push(selectedSalesLn);
	}
	return selectedSalesLn;
}
function GetSetSelectedWholeSalesLn(): IWholeSalesLn {
	if (WholeSalesLns.length > 0) {
		let idx = WholeSalesLns.findIndex((x) => { return x.wslSeq == seq; });
		if (idx >= 0) SelectedWholeSalesLn = WholeSalesLns[idx];
		else {
			SelectedWholeSalesLn = initWholeSalesLn();
			WholeSalesLns.push(SelectedWholeSalesLn);
		}
	} else {
		SelectedWholeSalesLn = initWholeSalesLn();
		WholeSalesLns.push(SelectedWholeSalesLn);
	}
	return SelectedWholeSalesLn;
}
function GetSetSelectedPurchaseItem(): IPurchaseItem {
	if (Purchase.PurchaseItems.length > 0) {
		let idx = Purchase.PurchaseItems.findIndex((x) => { return x.piSeq == seq; });
		if (idx >= 0) SelectedPurchaseItem = Purchase.PurchaseItems[idx];
		else {
			SelectedPurchaseItem = initPurchaseItem();
			Purchase.PurchaseItems.push(SelectedPurchaseItem);
		}
	} else {
		SelectedPurchaseItem = initPurchaseItem();
		Purchase.PurchaseItems.push(SelectedPurchaseItem);
	}
	return SelectedPurchaseItem;
}

function writeItems(itemList: IItem[]) {
	let html = "";
	$.each(itemList, function () {
		var item = this;
		const itemcode: string = item.itmCode;
		let _qty: number = item.QtySellable;

		let trcls = "itmcode", proId = 0;

		if (forEditReserve) trcls = selectedItemCodes.includes(itemcode) ? "dimrow" : "";

		if (forIA) trcls = item.AbssQty <= 0 ? "" : "itmcode";

		if (!forpurchase) {
			if (item.ItemPromotions.length > 0) {
				if (item.ItemPromotions.find((e) => e.pro4Period)) {
					trcls += " period";
					proId = item.ItemPromotions.find((e) => e.pro4Period)!.proId;
				} else {
					trcls += " nonperiod";
					proId = item.ItemPromotions[0].proId;
				}
			}
		}

		html += `<tr class="${trcls}" data-code="${itemcode}" data-proid="${proId}" data-qty="${_qty}" data-abssqty="${item.AbssQty}">`;
		html += `<td>${itemcode}</td>`;

		var namedesc = handleItemDesc(item.NameDesc);
		html += `<td style="max-width:250px;" title="${item.NameDesc}">${namedesc}</td>`;
		let outofstock: boolean = forsales || forsimplesales || forpreorder || forIA ? false : itemcode.startsWith("/") ? false : _qty <= 0;
		if (!forpurchase) {
			let tdcls = outofstock ? "outofstock" : "";
			let qtydisplay = `${_qty}`;
			if (forIA) qtydisplay = `${_qty} <span class="text-primary font-weight-bold">(${item.AbssQty})</span>`;
			html += `<td class="${tdcls} text-right">${qtydisplay}</td>`;
		}

		let price: number = 0;

		if (forsales || forwholesales || forstock || forpreorder) {
			price = item.itmBaseSellingPrice!;
		}

		if (forpurchase) price = item.itmBuyStdCost!;
		if (forIA) price = item.itmSellUnitAvgCost ?? 0;

		html += `<td style="text-align:rigth;width:100px;max-width:100px;">${formatnumber(price)}</td>`;

		let _chkbated = "",
			_chksned = "",
			_chkexp = "";
		if (DicItemOptions.hasOwnProperty(itemcode)) {
			let itemoptions = DicItemOptions[itemcode];
			if (itemoptions)
				_chkbated = itemoptions.ChkBatch
					? itemoptions.ChkBatch
						? "checked"
						: ""
					: "";
			_chksned = itemoptions.ChkSN ? (itemoptions.ChkSN ? "checked" : "") : "";

			_chkexp = itemoptions.WillExpire
				? itemoptions.WillExpire
					? "checked"
					: ""
				: "";
		}

		let _chkbatcls = _chkbated == "checked" ? "danger" : "";
		let _chksncls = _chksned == "checked" ? "danger" : "";
		let _chkexpcls = _chkexp == "checked" ? "danger" : "";

		let chklist = `<div class="form-check form-check-inline">
        <input class="form-check-input ${_chkbatcls}" type="checkbox" Id="chkBatch" value="1" disabled ${_chkbated}>
        <label class="form-check-label" for="chkBatch">${batchtxt}</label>
    </div>

    <div class="form-check form-check-inline">
        <input class="form-check-input ${_chksncls}" type="checkbox" Id="chkSN" value="1" disabled ${_chksned}>
        <label class="form-check-label" for="chkSN">${serialnotxt}</label>
    </div>

    <div class="form-check form-check-inline">
        <input class="form-check-input ${_chkexpcls}" type="checkbox" Id="chkExpiry" value="1" disabled ${_chkexp}>
        <label class="form-check-label" for="chkExpiry">${expirydatetxt}</label>
    </div>`;

		html += `<td style="width:220px;min-width:220px;">${chklist}</td>`;

		let facls = item.hasItemVari ? "check" : "xmark";
		let displaycls = item.hasItemVari ? "text-success" : "text-danger";
		html += `<td><span class="fa fa-${facls} ${displaycls}"></span></td>`;

		if (!forpurchase && !forEditReserve) {
			seq = currentY + 1;
			let urlist = "";
			if (((forsales || forwholesales) && !outofstock) || forpreorder) urlist = genProUrList(urlist, item);
			html += `<td style="width:250px;min-width:250px;">${urlist}</td>`;
		}

		html += "</tr>";
	});
	$("#tblItem tbody").empty().append(html);
	if (!forpurchase && !forIA) {
		$("#tblItem tbody tr").each(function (i, e) {
			if ($(e).find("td").eq(2).hasClass("outofstock")) {
				$(e).removeClass("itmcode").addClass("outofstock");
			} else if (!$(e).hasClass("dimrow")) {
				$(e).addClass("itmcode").removeClass("outofstock");
			}
		});
	}
}

$(document).on("click", "#tblmails th", function () {
	sortName = $(this).data("category");
	sortCol = Number($(this).data("col"));
	PageNo = 1;
	if (forenquiry) GetEnquiries(PageNo);
	if (forattendance) GetAttendances(PageNo);
	if (forjob) GetJobs(PageNo);
	if (fortraining) GetTrainings(PageNo);
});
$(document).on("click", ".Pager .page", function () {
	PageNo = Number($(this).attr("page"));
	if (forenquiry) GetEnquiries(PageNo);
	else if (forattendance) GetAttendances(PageNo);
	else if (forjob) GetJobs(PageNo);
	else if (fortraining) GetTrainings(PageNo);
	else if (forstock) GetStocks(PageNo);
	else if (forcustomer) GetCustomerGroupList(PageNo);
	else if (forretailcustomer) GetCustomers4Sales(PageNo);
	else GetItems(PageNo);
});
$(document).on("click", "#tblItem th a", function () {
	sortName = $(this).data("category");
	sortDirection = sortDirection == "ASC" ? "DESC" : "ASC";
	/* console.log('sortname:' + sortName + ';sortdir:' + sortDirection);*/
	PageNo = 1;
	GetItems(PageNo);
});
function genProUrList(urlist: string, item: IItem) {
	urlist = "<ul class='nostylelist'>";
	if (ItemVari &&
		ItemVari.ItemPromotions.length > 0 &&
		(forsales || forpreorder || forwholesales)) {
		urlist += genPromotionHtml(ItemVari.ItemPromotions);
	} else if (item.ItemPromotions.length > 0 &&
		(forsales || forpreorder || forwholesales)) {
		urlist += genPromotionHtml(item.ItemPromotions);
	}
	urlist += "</ul>";
	return urlist;
}
function genPromotionHtml(ItemPromotions: IItemPromotion[]) {
	let html = ``;
	$.each(ItemPromotions, function (i, e) {
		//fillItemPromotion(e);
		// console.log("ip:", itemPromotion);
		if (e.pro4Period) {
			html += `<li class="period"><div class="alert alert-success">${itemperiodpromotiontxt}</div>${discountitemheader}:${e.DiscPcDisplay} <button class="btn btn-danger proItem period" data-code="${e.itemCode}" data-proid="${e.proId}" data-type="period">${selecttxt}</button></li>`;
		} else {
			html += `<li class="nonperiod"><div class="alert alert-warning">${itemqtypromotiontxt}</div>${qtytxt}:${e.proQty};${sellingpricetxt}${currency}:${e.PriceDisplay};${discountitemheader}:${e.DiscPcDisplay} <button class="btn btn-danger proItem nonperiod" data-code="${e.itemCode}" data-proid="${e.proId}" data-type="nonperiod">${selecttxt}</button></li>`;
		}
	});
	return html;
}

function fillItemPromotion(e: IItemPromotion) {
	itemPromotion = initItemPromotion();
	itemPromotion.proId = e.proId;
	itemPromotion.DateFrmDisplay = e.DateFrmDisplay;
	itemPromotion.DateToDisplay = e.DateToDisplay;
	itemPromotion.NameDisplay = e.NameDisplay;
	itemPromotion.DescDisplay = e.DescDisplay;
	itemPromotion.IPCreateTimeDisplay = e.IPCreateTimeDisplay;
	itemPromotion.IPModifyTimeDisplay = e.IPModifyTimeDisplay;
	itemPromotion.pro4Period = e.pro4Period;
	itemPromotion.proDiscPc = e.proDiscPc;
	itemPromotion.proPrice = e.proPrice;
	itemPromotion.proQty = e.proQty;
}

function searchCus(_mode: string = "") {
	if (keyword !== "") {
		keyword = keyword.toLowerCase();
	}
	if (_mode === "CustomerAttribute") {
	} else {
		selectedCusCodeName = keyword;
	}
	openWaitingModal();
	searchcusmode = true;
	GetCustomers4Sales(1, _mode);
}

function openCusModal() {
	cusModal.dialog("open");
	$("#txtCustomer").trigger("focus");
}
function closeCusModal() {
	cusModal.dialog("close");
	if (typeof selectedCusCodeName !== "undefined") {
		// console.log("selectedcuscode:" + selectedCusCodeName);
		if (selectedCusCodeName === "GUEST") {
			$("#txtCustomerName").val("GUEST");
		}
	}
	$("#txtCustomer").val("");
	forretailcustomer = !forretailcustomer;
}

function updateRows4Tax() {
	let taxpc: number = GetTaxPc();
	//console.log("here");
	$(`#${gTblId} tbody tr`).each(function (i, e) {
		if ($(e).find(".itemcode").val() !== "") {
			//console.log("taxpc:" + taxpc);
			let $taxpc = $(e).find(".taxpc");
			if ($taxpc.length) {
				$taxpc.off("change");
				$taxpc.data("taxpc", taxpc).val(formatnumber(taxpc));
				$taxpc.on("change", handleTaxChange);
				//console.log("tax trigger change#updateRows");
				$taxpc.trigger("change");
			}
		}
	});

}
function GetTaxPc(): number {
	let taxpc: number = 0;
	if (forsales) {
		if (reviewmode) { //salesorderlist
			taxpc =
				enableTax && selectedCus && selectedSimpleSalesLn!.Item.itmIsTaxedWhenSold
					? selectedCus.TaxPercentageRate!
					: 0;
		} else {
			taxpc =
				enableTax && selectedCus && selectedSalesLn!.Item.itmIsTaxedWhenSold
					? selectedCus.TaxPercentageRate!
					: 0;
		}

	}
	if (forpreorder && selectedPreSalesLn) {
		taxpc =
			enableTax && selectedCus && selectedPreSalesLn!.Item.itmIsTaxedWhenSold
				? selectedCus.TaxPercentageRate!
				: 0;
	}
	if (forwholesales && SelectedWholeSalesLn) {
		taxpc =
			enableTax &&
				selectedCus &&
				SelectedWholeSalesLn!.Item.itmIsTaxedWhenSold
				? selectedCus.TaxPercentageRate!
				: 0;
	}
	if (forpurchase && SelectedPurchaseItem) {
		taxpc =
			enableTax &&
				SelectedSupplier &&
				SelectedPurchaseItem!.Item.itmIsTaxedWhenBought
				? SelectedSupplier.TaxPercentageRate!
				: 0;
	}
	//console.log("taxpc:", taxpc);
	return taxpc;
}

function GetCustomers4Sales(pageIndex, mode = "") {
	let data = { pageIndex: pageIndex, mode: mode, keyword: keyword };
	// console.log("data:", data);
	/*return false;*/
	openWaitingModal();
	var callback;

	if (mode === "" || mode == "search") {
		callback = OnGetCustomersSuccess;
	} else if (mode === "attribute") {
		callback = OnSearchCustomersSuccess;
	}

	$.ajax({
		url: "/Api/GetCustomers4Retail",
		type: "GET",
		data: data,
		/*contentType: "application/json; charset=utf-8",*/
		dataType: "json",
		success: callback,
		error: onAjaxFailure,
	});
}
function OnGetCustomersSuccess(response) {
	keyword = "";
	closeWaitingModal();
	// console.log("response:", response);
	var model = response;

	//console.log("modelcustomers:", model.Customers);
	if (model.Customers.length > 0) {
		//togglePaging("Customer", true);

		CusList = model.Customers.slice(0);
		if (CusList.length === 1) {
			selectedCus = structuredClone(CusList[0]);
			//console.log("selectedCus#ongetcustomerssccuess:", selectedCus);
			selectedCusCodeName = selectedCus.cusCode;
			selectCus();
			closeCusModal();
		} else {
			openCusModal();
			_writeCustomers(CusList);
		}

		if (searchcusmode) {
			searchcusmode = false;
		} else {
			$(".Pager").ASPSnippets_Pager({
				ActiveCssClass: "current",
				PagerCssClass: "pager",
				PageIndex: model.PageIndex,
				PageSize: model.PageSize,
				RecordCount: model.RecordCount,
			});
		}
	}
	else {
		$.fancyConfirm({
			title: "",
			message: nocustomersfoundtxt,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$(".customer").val("");
					$("#txtCustomerName").val(defaultcustomer.cusName).trigger("focus");
				}
			}
		});
	}
}

function _writeCustomers(_customerlist: Array<ICustomer>) {
	let html = "";
	$.each(_customerlist, function (i, e) {
		html +=
			'<tr class="cuscode" data-code="' +
			e.cusCode +
			'"><td>' +
			e.cusCode +
			"</td><td>" +
			e.cusName +
			"</td></tr>";
	});
	$target = $("#tblCus tbody");
	$target.find("tr.cuscode").remove();
	$target.append(html);
	$target.find(".Pager").empty();
}
function OnSearchCustomersSuccess(response) {
	keyword = "";
	closeWaitingModal();
	//console.log("response:", response);
	var model = response;
	//console.log("modelcustomers:", model.Customers);

	if (model.Customers.length > 0) {
		togglePaging("Customer", true);
		CusList = model.Customers.slice(0);
		//console.log("cuslist:", CusList);
		if (typeof CusList === "undefined") {
			GetCustomers4Sales(1);
		} else {

			var row = $("#tblCus tr:last-child").removeAttr("style").clone(false);
			$("#tblCus tr").not($("#tblCus tr:first-child")).remove();

			$.each(CusList, function () {
				var customer = this;
				row.addClass("cuscode").attr("data-code", customer.cusCustomerID);
				let chktag = `<input type="checkbox" class="chk" data-id="${customer.cusCustomerID}">`;
				let detailtag = `<a href="#" class="btn btn-success detail" role="button" data-id="${customer.cusCustomerID}">${detailtxt}</a></td>`;
				let callhistorytag = `<a href="/CallHistory/Index?customerId=${customer.cusCustomerID}" class="btn btn-outline-warning" role="button"><span class="small">${callhistorytxt}</span></a>`;
				let attrtag = `<a class="btn btn-primary" role="button" href="/CustomerAttribute/Index?customerId=${customer.cusCustomerID}">${attributetxt}</a>`;
				let editremovetag = `<a class="btn btn-info" role="button" href="/Customer/Edit?customerId=${customer.cusCustomerID}"><span class="small">${edittxt}</span></a>
                    <a class="btn btn-danger remove" role="button" href="#" data-id="${customer.cusCustomerID}"><span class="small">${removetxt}</span></a>`;
				let salesman = "N/A";

				$("td", row)
					.eq(0)
					.css({ width: "5px", "max-width": "5px" })
					.addClass("text-center")
					.html(chktag);
				$("td", row)
					.eq(1)
					.css({ width: "110px", "max-width": "110px" })
					.addClass("text-center")
					.html(customer.cusName);
				$("td", row)
					.eq(2)
					.css({ width: "100px", "max-width": "100px" })
					.addClass("text-center")
					.html(customer.cusContact ?? "");
				$("td", row)
					.eq(3)
					.css({ width: "110px", "max-width": "110px" })
					.addClass("text-center")
					.html(customer.cusEmail ?? "");
				$("td", row)
					.eq(4)
					.css({ width: "100px", "max-width": "100px" })
					.addClass("text-center")
					.html(customer.AccountProfileName ?? "");
				$("td", row)
					.eq(5)
					.css({ width: "100px", "max-width": "100px" })
					.addClass("text-center")
					.html(salesman);
				$("td", row)
					.eq(6)
					.css({ width: "70px", "max-width": "70px" })
					.html(detailtag);
				$("td", row)
					.eq(7)
					.css({ width: "90px", "max-width": "90px" })
					.html(callhistorytag);
				$("td", row)
					.eq(8)
					.css({ width: "90px", "max-width": "90px" })
					.html(attrtag);
				$("td", row)
					.eq(9)
					.css({ width: "125px", "max-width": "125px" })
					.html(editremovetag);
				$("#tblCus").append(row);
				row = $("#tblCus tr:last-child").clone(false);
			});
			$(".Pager").ASPSnippets_Pager({
				ActiveCssClass: "current",
				PagerCssClass: "pager",
				PageIndex: model.PageIndex,
				PageSize: model.PageSize,
				RecordCount: model.RecordCount,
			});
		}
		//}
	} else {
		togglePaging("Customer", false);
	}
}

$(document).on("click", "#tblCus th a", function () {
	sortName = $(this).data("category");
	sortDirection = sortDirection == "ASC" ? "DESC" : "ASC";
	/* console.log('sortname:' + sortName + ';sortdir:' + sortDirection);*/
	PageNo = 1;
	GetCustomers4Sales(PageNo);
});

function openItemModal(msg = "") {
	itemModal.find(".warning").text("");
	itemModal.dialog("option", { width: 1250, title: searchitem });
	itemModal.dialog("open");
	$target = $("#txtItem");

	$target.trigger("focus");
	$target.val(selectedItemCode ?? keyword);

	if (msg !== "") {
		itemModal.find(".warning").text(msg);
	}
}

function closeItemModal() {
	keyword = "";
	itemModal.dialog("close");
}

function initAccount(): IAccount {
	return {
		AccountID: 0,
		AccountName: "",
		AccountNumber: "",
		AccountClassificationID: "",
		ACDescription: "",
		AccountProfileId: 0,
	};
}

function saveAttributeVals(edit = true) {
	//closeComboModal();

	let _attform = new attform(edit);
	if (_attform.validform()) {
		_attform.submitForm();
	}
}

function editAttribute(ele, editmode: boolean) {
	let $tr: JQuery = $(ele).parent("td").parent("tr");
	//console.log('tr:', $tr);
	let attrId: string = editmode ? $tr.data("attid") : $tr.data("attname");
	console.log("attid:" + attrId);
	selectedAttribute = fillAttribute($tr);
	console.log("selectedattribute#editattribute:", selectedAttribute);

	if (!$(ele).hasClass("dropdown")) {
		if ($(ele).hasClass("combo")) {
			if (editmode) {
				addValRows(selectedAttribute, dicAttrVals[attrId]);
			} else {
				addValRows(selectedAttribute, defaultAttVals[attrId]);
			}
		} else {
			addValRow(selectedAttribute, $(ele).data("attval"));
		}
	}

	if ($(ele).hasClass("dropdown") || $(ele).hasClass("combo")) {
		if ($(ele).hasClass("combo")) {
			let _ele = $(ele).prev(".form-control");
			console.log("here");
			openDropDownModal(_ele);
		} else {
			openDropDownModal(ele);
		}
	}
	//else {
	//    openComboModal(ele);
	//}
}


function editAttVals(ele, editmode: boolean) {
	console.log(
		"editmode:" +
		editmode +
		";selectedattribute attid:" +
		selectedAttribute.attrId
	);
	console.log("dicattvals:", dicAttrVals);
	attrvalue = editmode
		? dicAttrVals[selectedAttribute.attrId]
		: defaultAttVals[selectedAttribute.attrName];
	console.log("attvalue:", attrvalue);
	let _val: string = <string>$(ele).val();
	savemode = $(ele).hasClass("combo") ? "combo" : "text";
	console.log("savemode:" + savemode);
	//if (_val !== '') {
	//    let idx = -1;
	//    $.each(attvalues, function (i, e) {
	//        console.log('eleval:' + _val + ';e:' + e);
	//        if (e == $(ele).val()) {
	//            idx = i;
	//            return false;
	//        }
	//    });
	//    console.log('idx:' + idx + ';savemodel:' + savemode);
	//    if (idx === -1) {
	//        if (savemode === 'combo') {
	//            attvalues.push(_val);
	//            //remove old val:
	//            $.each(attvalues, function (i, e) {
	//                if (e == $(ele).data('attval')) {
	//                    idx = i;
	//                    return false;
	//                }
	//            });
	//            if (idx >= 0) {
	//                attvalues.splice(idx, 1);
	//            }
	//        } else {
	//            attvalues[0] = _val;
	//        }
	//    }
	//    console.log('attvalues:', attvalues);
	//} else {
	//    if (savemode === 'text') {
	//        attvalues[0] = '';
	//    } else {
	//        let _oldval = $(ele).data('attval');
	//        let idx = -1;
	//        $.each(attvalues, function (i, e) {
	//            if (e == _oldval) {
	//                idx = i;
	//                return false;
	//            }
	//        });
	//        if (idx >= 0) {
	//            attvalues.splice(idx, 1);
	//        }
	//    }
	//}

	if (editmode) {
		dicAttrVals[selectedAttribute.attrId] = attrvalue;
	} else {
		defaultAttVals[selectedAttribute.attrName] = attrvalue;
	}

	selectedAttribute.attrValue = attrvalue;
}

function addValRows(
	selectedAttribute: IAttribute,
	attvals: string,
	append: boolean = false
) {
	//console.log('addrows');
	console.log("selectedAttribute:", selectedAttribute);
	let attrId = selectedAttribute.attrId;
	$("#attrName").val(selectedAttribute.attrName);
	let plusbtn = `<div class="plus radius float-right" title="${addattributeval}"></div><div class="clearfix"></div>`;
	let row: string = "";
	if (append) {
		console.log("append");
		row += `<div class="row my-2">
            <input type="text" name="attrValue" data-attid="${attrId}" class="form-control combo attval" value="">
        </div>`;
		comboModal.find(".container").append(row);
	} else {
		console.log("notappend");
		row += `<label class="control-label" for="attval" style="margin-left:-.8em;">${attvaltxt}</label>`;
		if (typeof attvals !== "undefined" && attvals.length > 0) {
			$.each(attvals, function (i, attval) {
				row += `<div class="row my-2">
            <input type="text" name="attrValue" data-attid="${attrId}" class="form-control combo attval" data-attval="${attval}" value="${attval}">
        </div>`;
			});
		} else {
			row += `<div class="row my-2">
            <input type="text" name="attrValue" data-attid="${attrId}" class="form-control combo attval" value="">
        </div>`;
		}

		comboModal.find(".container").empty().append(plusbtn).append(row);
	}

	let $attname: JQuery = comboModal.find(".attname");
	console.log("emptyval?" + ($attname.val() === ""));
	if ($attname.val() === "") {
		$attname.trigger("focus");
	} else {
		comboModal
			.find(".container")
			.find(".attval")
			.each(function (i, e) {
				if ($(e).val() === "") {
					$(e).trigger("focus");
					return false;
				}
			});
	}
}

function addValRow(selectedAttribute: IAttribute, attval: string = "") {
	console.log("selectedAttribute:", selectedAttribute);
	let attrId = selectedAttribute.attrId;
	$("#attrName").val(selectedAttribute.attrName);
	let row: string = `<div class="row my-2">
 <label class="control-label" for="attval">${attvaltxt}</label>
            <input type="text" Id="attval" name="attrValue" data-attid="${attrId}" class="form-control text attval" value="${attval}">
        </div>`;
	comboModal.find(".container").empty().append(row);
	comboModal
		.find(".container")
		.find(".attval")
		.each(function (i, e) {
			if ($(e).val() === "") {
				$(e).trigger("focus");
				return false;
			}
		});
}

function openComboModal(ele = null) {
	comboModal.dialog("open");
}
function closeComboModal() {
	comboModal.dialog("close");
	if (reload) {
		window.location.reload();
	}
}

function openChangeModal() {
	changeModal.dialog("option", { width: 500, title: saleschange });
	changeModal.dialog("open");

	switch (salesType) {
		case SalesType.deposit:
			changeModal.find(".totalremainamt").text(formatmoney(itotalremainamt));
			break;
		case SalesType.refund:
		default:
		case SalesType.retail:
			$("#totalsalesamt").text(formatmoney(itotalamt));
			break;
	}

	$("#changeamt").text(formatmoney(Sales.rtpChange));
}

function getTotalPayments(): number {
	let payments: number = 0;
	$("#tblPay tbody tr").each(function (i, e) {
		let $chk = $(e).find(".chkpayment");
		if ($chk.is(":checked")) {
			let $pay = $(e).find(".paymenttype");
			if ($chk.is(":checked")) {
				payments += Number($pay.val());
			}
		}
	});
	return financial(payments);
};

function getPaymentRemain(): number {
	let subtotal = getTotalAmt4Order();
	console.log("subtotal:" + subtotal);
	GetServiceChargeAmt(subtotal);
	Sales.rtsFinalTotal = subtotal + ServiceChargeAmt;
	console.log("Sales.rtsFinalTotal:", Sales.rtsFinalTotal);
	let payments = getTotalPayments();
	console.log("payments:" + payments);
	return financial(Sales.rtsFinalTotal - payments);
}

function setRemain($e: JQuery, amt: number) {
	let type: string = <string>$e.attr("id")?.toString();
	let code: string = $e.attr("id") as string;
	let iscash: boolean = code.toLowerCase() === "cash";

	let _totalpay: number = 0, _totalamt: number = 0;
	if (!forsimplesales) {
		_totalpay = getTotalPayments();
		_totalamt = getTotalAmt4Order();
	}

	if (forsales || forsimplesales) {
		console.log("totalamt:", _totalamt);
		console.log("totalpay:", _totalpay);
		_setRemain(amt, _totalamt, _totalpay, iscash, type, $e);
	} else {
		_setRemain(amt, itotalremainamt, _totalpay, iscash, type, $e);
	}
}

function _setRemain(
	amt: number,
	_totalamt: number,
	_totalpay: number,
	iscash: boolean,
	type: string,
	$e: JQuery
) {
	if (_totalpay > _totalamt) {
		if (!iscash && !CouponInUse) {
			$.fancyConfirm({
				title: "",
				message: noncashgtremainamterrmsg,
				shownobtn: false,
				okButton: oktxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						amt -= _totalpay - _totalamt;
						$("#" + type)
							.val(amt.toFixed(2))
							.trigger("focus");
					}
				},
			});
		}
		else {
			let _remain = _totalamt - _totalpay;
			_setremain(_remain, amt);

		}
	} else {
		let _remain = _totalamt - _totalpay;
		_setremain(_remain, amt);
	}
}

function _setremain(_remain: number, _amt: number) {
	if (forsimplesales) {
		let totalpay = 0;
		$(".paymenttype").each(function (i, e) {
			totalpay += Number($(e).val());
		});
		console.log("totalpay:", totalpay);
		_remain = Sales.rtsFinalTotal! - totalpay;
		console.log("_remain:" + _remain);
	} else {
		if (chkIdx >= 0) {
			$tr = $("#tblPay tbody tr").eq(chkIdx);
			if ($tr != null) {
				if (chkchange && !paymenttypechange) {
					if (_amt < 0) {
						$tr.find(".paymenttype").val(formatnumber(0)).trigger("change");
					} else {
						$tr.find(".paymenttype").val(_amt.toFixed(2)).trigger("change");
					}
				}

				if (_amt == _remain) {
					_remain = 0;
				} else if (_amt < 0) {
					_remain += -1 * _amt;
				}

				$("#remainamt").text(formatmoney(_remain));
				if (_remain <= 0) {
					$("#remainblk").removeClass("alert-danger").addClass("alert-success");
					if (_remain < 0) {
						$("#remaintxt").text(saleschangetxt);
						_remain *= -1;
						//console.log('_remain:' + _remain);
						$("#remainamt").text(formatmoney(_remain));
					}
				} else {
					$("#remaintxt").text(remaintxt);
					$("#remainblk").removeClass("alert-success").addClass("alert-danger");
				}
				return;
			}
		}
		if (_remain > 0) {
			$("#remainblk").removeClass("alert-success").addClass("alert-danger");
		} else if (_remain <= 0) {
			if (forsimplesales) {

			}
			$("#remainblk").removeClass("alert-danger").addClass("alert-success");
		}
		//console.log('iremain:' + iremain);
		if (_remain < 0) {
			_remain *= -1;
			$("#remaintxt").text(saleschangetxt);
		}
	}

	$("#remainamt").text(formatmoney(_remain));

	//console.log("remainlt0:", _remain <= 0);
	if (forsimplesales) setRemainDisplay(_remain <= 0);
}
function setRemainDisplay(remainLt0: boolean) {
	//console.log("remainLt0#display:", remainLt0);
	if (remainLt0) {
		$("#remainblk").removeClass("bg-danger").addClass("bg-success");
	} else {
		$("#remainblk").removeClass("bg-success").addClass("bg-danger");
	}
}
function resetPay(partial: boolean = false) {

	payModal.dialog("close");

	if (!partial) {
		Payments = [];
		itotalpay = 0;
		iremain = 0;
		switch (salesType) {
			case SalesType.preorder:
				break;
			case SalesType.refund:
				Refund.MonthlyPay = 0;
				Refund.rtpChange = 0;
				Refund.Deposit = 0;
				Refund.rtpRoundings = 0;
				break;
			default:
			case SalesType.deposit:
			case SalesType.retail:
				Sales.MonthlyPay = 0;
				Sales.rtpChange = 0;
				Sales.Deposit = 0;
				Sales.rtpRoundings = 0;
				break;
		}
	}

	$("#txtPayerCode").val("");
	$(".paymenttype").val(0);
	let $txtRoundings: JQuery = $("#txtRoundings");
	if ($txtRoundings.length) {
		$txtRoundings.val(0);
	}

	//reset the idxs:
	chkIdx = -1;
	activeChkIdx = -1;
	activePayIdx = -1;

	//reset coupon
	CouponInUse = false;
	//reset paymenttypechange & chkchange
	paymenttypechange = false;
	chkchange = false;

	let $monthlypay: JQuery = $("#monthlypay");
	if ($monthlypay.length) {
		$monthlypay.prop("checked", false);
	}
	let $deposit: JQuery = $("#deposit");
	if ($deposit.length) {
		$deposit.prop("checked", false);
	}
}

function GetPaymentsInfo() {
	let _couponamt: number = 0;
	let _totalpay: number = 0;

	if (forsimplesales) {
		$(".paymenttype").each(function (i, e) {
			if ($(e).parent(".single__add").hasClass("activee")) {
				getPaymentInfo($(e).attr("id") as string, Number($(e).val()));
			}

		});
	} else {
		//console.log("here");
		$("#tblPay tbody tr").each(function (i, e) {
			if (forrefund) {
				let $pay = $(e).find(".paymenttype");
				let payamt = Number($pay.val());
				console.log("payamt:", payamt);
				getPaymentInfo($pay.attr("id") as string, payamt);
			} else {
				let $chk = $(e).find(".chkpayment");
				if ($chk.is(":checked")) {
					let $pay = $(e).find(".paymenttype");
					let payamt = isEpay ? Number($pay.data("amt")) : Number($pay.val());
					//console.log("payamt:", payamt);
					getPaymentInfo($chk.data("type") as string, payamt);
				}
			}
			

		});
	}
	function getPaymentInfo(typecode: string, amt: number) {
		if (isEpay) {
			if (typecode.toLowerCase() == "wechat" || typecode.toLowerCase() == "alipay") {//to nothing
				console.log("do nothing");
				console.log("amt#e:" + amt);
			}
			else amt = 0;
		}
		//console.log("amt#1:", amt);
		let paytype: IPayType = {
			payId: 0,
			pmtCode: typecode,
			Amount: amt,
			pmtIsCash: typecode.toLowerCase() == "cash",
			couponLnCode: $.isEmptyObject(CouponLn) ? null : CouponLn.cplCode,
			TotalAmt: 0,
		};

		Payments.push(paytype);
		if (typecode.toLowerCase() === "coupon") {
			_couponamt += amt;
		}
		_totalpay += amt;
	}

	return { couponamt: _couponamt, totalpay: _totalpay };
};

$(document).on("change", ".pay", function () {
	currentY = $(this).parent("td").parent("tr").index();
	let $amt = $(this);
	let amt: number = Number($amt.val());
	//let Id: number = Number($amt.data("id"));
	let amterrtxt = $infoblk.data("amterrtxt");
	let amtcls: string = "text-danger";
	//let accountno: string = "";
	//console.log("amt:" + amt);

	if (forpurchase) {
		if (amt > 0) {

			if (amt > Purchase.pstAmount) {
				amtErrWarning();
				return;
			}

			let totalamt: number = 0;
			$(`#${gTblId} tbody tr`).each(function (i, e) {
				$amt = $(e).find("td").eq(4).find(".pay");
				let amt: number = Number($amt.val());
				totalamt += amt;
				$amt.val(formatnumber(amt));
				//$(e).find("td").last().find(".owed").val(Number(Purchase.pstAmount - amt));
			});
			//console.log("totalamt:", totalamt);
			if (totalamt > Purchase.pstAmount) {
				amtErrWarning();
				return;
			}

			purchasePayment.Amount = amt;
			//console.log("Purchase.pstAmount:" + Purchase.pstAmount + ";totalamt:" + totalamt);
			let totalowed: number = Purchase.pstAmount - totalamt;
			//console.log("totalowed:", totalowed);
			if (totalowed <= 0) amtcls = "text-success";
			$("#totalowed").removeClass("text-danger").addClass(amtcls).text(formatnumber(totalowed));
		}
	}
	function amtErrWarning() {
		$.fancyConfirm({
			title: "",
			message: amterrtxt,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$amt.trigger("focus");
				}
			}
		});
	}
});

$(document).on("change", ".chkpayment", function () {
	let checked = $(this).is(":checked");
	$tr = $(this).parent("div").parent("td").parent("tr");
	//console.log("$tr:", $tr);
	chkIdx = $tr.index();

	let type = $(this).data("type") as string;
	DicPayTypesChecked[type.toLowerCase()] = checked;
	DicPayServiceCharge[type].Selected = checked;

	CouponInUse = DicPayTypesChecked["coupon"];
	//console.log("isCoupon:", isCoupon);

	$tr.find(".paymenttype").prop("readonly", !checked);

	if (type.toLowerCase() == "visa" || type.toLowerCase() == "mastercard") {
		if (checked) {
			GetServiceChargeAmt(Sales.rtsFinalTotal!);
			Sales.rtsFinalTotal! += ServiceChargeAmt;
		} else {
			Sales.rtsFinalTotal! -= ServiceChargeAmt;
		}
	}

	if (!checked) $tr.find(".paymenttype").val("0.00");


	setAmtDisplay(Sales!.rtsFinalTotal ?? 0, 0);

	if (CouponInUse && $.isEmptyObject(CouponLn)) {
		openBarCodeModal();
		/*for debug only*/
		if (debug) {
			barcodeModal.find("#txtBarCode").val("FYGoQQ0cg3");
		}
	}

	if ($(".chkpayment:checked").length == 0) {
		DicPayTypesChecked["cash"] = true;
		$(".chkpayment").first().prop("checked", true);
		initCashTxt(Sales!.rtsFinalTotal);
	}
});

$(document).on("change", ".paymenttype", function () {
	if (fordayends) return false;

	let payamt: number = Number($(this).val());
	console.log("payamt:", payamt);
	if (payamt == 0) {
		$(this).val(formatnumber(0));
		if (Sales.Deposit == 0) {
			setRemain($(this), 0);
		}
	}
	if (payamt > 0) {
		if (forsimplesales) populateOrderSummary();
		$(this).val(formatnumber(payamt));
		if (payamt >= 0) {
			/*couponamt = payamt;*/
			if ((Sales && Sales.Deposit == 0) || (PreSales && PreSales.rtsStatus == SalesStatus.presettling)) {
				setRemain($(this), payamt);
			}
		}
	}

});

function confirmPay() {
	//console.log("here");
	let _totalpay: number = 0;
	let _totalamt: number = 0;
	switch (salesType) {
		case SalesType.simplesales:
			//for debug only:
			_totalamt = Sales.rtsFinalTotal!;
			//_totalamt = Number($(".totalamt").first().text());
			break;
		case SalesType.deposit:
			_totalamt = itotalremainamt;
			break;
		case SalesType.refund:
			RefundList.forEach((x) => (_totalamt += x.amt));
			if (isEpay) submitRefund();
			break;
		default:
		case SalesType.retail:
		case SalesType.preorder:
			_totalamt = getTotalAmt4Order();
			//console.log("_totalamt:" + _totalamt);
			break;
	}

	//console.log("here");
	let paymentsInfo = GetPaymentsInfo();
	console.log("paymentsInfo:", paymentsInfo);
	let _couponamt: number = paymentsInfo.couponamt;
	_totalpay = paymentsInfo.totalpay;

	_totalpay = round(_totalpay, 2);
	_totalamt = round(_totalamt, 2);

	console.log('totalpay:' + _totalpay + ';totalamt:' + _totalamt);
	if (isNaN(_totalpay)) {
		falert(paymentrequiredtxt, oktxt);
	} else if (_totalpay < _totalamt) {
		switch (salesType) {
			case SalesType.simplesales:
				falert(paymentnotenough, oktxt);
				_totalpay = 0;
				break;
			case SalesType.deposit:
				break;
			case SalesType.refund:
				break;
			case SalesType.preorder:
				//console.log("here");
				submitSales();
				break;
			default:
			case SalesType.retail:
				if (Sales.Deposit == 1) {
					submitSales();
				} else {
					falert(paymentnotenough, oktxt);
					_totalpay = 0;
				}
				break;
		}
	} else if (_totalpay > _totalamt) {
		if (Sales.Deposit == 1) {
			$.fancyConfirm({
				title: "",
				message: depositmustnotgteqamtmsg,
				shownobtn: false,
				okButton: oktxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						$("#Cash").trigger("focus");
					}
				},
			});
		} else {
			//console.log("usecoupon:" + usecoupon + ";_couponamt:" + _couponamt);
			if (!CouponInUse) {
				Sales.rtpChange = _totalpay - _totalamt;
				//console.log('ichange:' + ichange + ';ready to open changemodal...');
				openChangeModal();
			} else {
				if (_couponamt < _totalamt) {
					Sales.rtpChange = _totalpay - _totalamt;
					//console.log('ichange:' + ichange + ';ready to open changemodal...');
					openChangeModal();
				}
				if (_couponamt >= _totalamt) {
					resetPay(true);
					if (forsales || forReservePaidOut)
						submitSales();
					if (forsimplesales) SubmitSimpleSales();
					//        break;
					//}
				}
			}
		}
	}

	else if (_totalpay == _totalamt) {
		switch (salesType) {
			case SalesType.simplesales:
				SubmitSimpleSales();
				break;
			case SalesType.deposit:
				submitRemaining();
				break;
			case SalesType.refund:
				submitRefund();
				break;
			case SalesType.simplesales:
				SubmitSimpleSales();
				break;
			default:
			case SalesType.preorder:
			case SalesType.retail:
				console.log("ready for submitsales");
				submitSales();
				break;
		}
	}
	//}

}

function closeChangeModal() {
	changeModal.dialog("close");
	resetPay(true);
	switch (salesType) {
		case SalesType.deposit:
			submitRemaining();
			break;
		case SalesType.refund:
		default:
		case SalesType.retail:
			submitSales();
			break;
	}
}

function resetPayModal() {
	$("#tblPay tbody tr").each(function (i, e) {
		$(e).find("td").first().find(".chkpayment").prop("checked", false);
	});
}
function openPayModal(totalamt: number = 0) {
	resetPayModal();
	payModal.dialog("option", { width: 600, title: processpayments });
	payModal.dialog("open");

	if (forpreorder) {
		let $deposit: JQuery = $("#deposit");
		$deposit.prop("checked", true);
	}

	setExRateDropDown();

	if (totalamt === 0)
		totalamt = getTotalAmt4Order();

	if (forsales) Sales.rtsFinalTotal = totalamt;

	setForexPayment(totalamt);

	setAmtDisplay(totalamt);

	initCashTxt(totalamt);

	setServiceChargeAmt(totalamt);
}

function setServiceChargeAmt(totalamt: number) {
	$("#tblPay tbody tr").each(function (i, e) {
		let $td = $(e).find(".scpc");
		if ($td.length) {
			let scpc = Number($td.find("input").data("scpc"));
			let scamt = calculateServiceChargeAmt(totalamt, scpc);
			$td.find("input").data("amt", scamt).val(formatnumber(scamt));
		}
	});
}
function setAmtDisplay(totalamt: number, remainamt: number = 0) {
	$("#salesamount").data("amt", totalamt).text(formatmoney(totalamt));
	$("#remainamt").text(formatmoney(remainamt));
}
function initCashTxt(totalamt: number | null) {
	let cashtxt = "";
	if (!totalamt) {
		totalamt = getTotalAmt4Order();
	}
	cashtxt = totalamt.toFixed(2);
	$("#Cash").val(cashtxt);

	DicPayTypesChecked["cash"] = true;
	if (forsales)
		$("#tblPay tbody tr").first().find(".chkpayment").prop("checked", true);

	if (forsimplesales) {
		togglePlusCheck("btnCash");
		togglePayment("cash", true);
	}
}
function togglePayModeTxt() {
	//console.log("check length:", $(".checks:visible").length);
	if ($(".checks:visible").length > 1) {
		$("#singlePayMode").hide();
		$("#multiplePayMode").show();
	} else {
		$("#singlePayMode").show();
		$("#multiplePayMode").hide();
	}
}

function togglePlusCheck(Id: string): boolean {
	$(`#${Id}`).toggleClass("toggle").find(".pluse").toggle();
	let $return = $(`#${Id}`).find(".checks").toggle();
	return $return.is(":visible");
}
function setForexPayment(totalamt: number | null) {
	if (!totalamt) totalamt = getTotalAmt4Order();
	$("#forexPayment").html(formatnumber(totalamt));
}

function closePayModal() {
	payModal.dialog("close");
}

function openCashDrawerModal() {
	cashdrawerModal.dialog("option", { width: 600, title: cashdraweramt });
	cashdrawerModal.dialog("open");
	//disable navlink:
	disableNavLink();

	//ui-dialog-titlebar-close
	$(
		".ui-button.ui-corner-all.ui-widget.ui-button-icon-only.ui-dialog-titlebar-close"
	).hide();
	$("#txtCashDrawerAmt").trigger("focus");
}
function closeCashDrawerModal() {
	if (checkedcashdrawer) {
		cashdrawerModal.dialog("close");
		restoreNavLink();
	} else {
		falert(cashdraweramtprompt, oktxt);
		$("#txtCashDrawerAmt").trigger("focus");
	}
}

function closePrintModal() {
	printModal.dialog("close");
	window.location.href = "/POSFunc/Sales";
}

function closeSerialModal() {
	serialModal.dialog("close");
	resetSerialModal();
}

function openWaitingModal() {
	waitingModal.dialog("open");
}
function closeWaitingModal() {
	waitingModal.dialog("close");
}

function openPreviewModal() {
	previewModal.dialog("open");
}
function closePreviewModal() {
	previewModal.dialog("close");
}

function openActionModal() {
	actionModal.dialog("open");
}
function closeActionModal() {
	actionModal.dialog("close");
}

function openAccountModal() {
	accountModal.dialog("open");
	$("txtKeyword").val("").trigger("focus");
}
function closeAccountModal() {
	accountModal.dialog("close");
}

function validateDropDown(): boolean {
	let $ele: JQuery = $(".select2multiple");
	let none: boolean = $ele.find("option:selected").length === 0;
	let msg = "";
	if (none) {
		msg = selectatleastoneitemtxt;
		$.fancyConfirm({
			title: "",
			message: msg,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$ele.trigger("focus");
				}
			},
		});
	}

	return msg === "";
}

function openSalesmenModal() {
	salesmenModal.dialog("open");
}
function closeSalesmenModal() {
	salesmenModal.dialog("close");
}

function resetGcomboForm() {
	$target = gcomboModal.find("form");
	$target.empty();
	let ele = `<div class="form-group">
                <input type="text" class="form-control gcombo">
            </div>`;
	$target.html(ele);
}

function openGComboModal() {
	gcomboModal.dialog("open");
	//console.log('gattr#open:', gAttribute);
	/* console.log('attrval:'+ gAttribute.attrValue);*/
	if (gAttribute.attrValue !== "") {
		$target = gcomboModal.find("form");
		$target.empty();
		//console.log("gval:" + gAttribute.attrValue);
		let _vals = gAttribute.attrValue.split("||");
		//console.log('_vals#open:', _vals);
		let html = "";
		$.each(_vals, function (i, e) {
			if (e !== null && e !== "") {
				html += `<div class="form-group">
                <input type="text" class="form-control gcombo" value="${e}">
            </div>`;
			}
		});
		$target.html(html);
	} else {
		resetGcomboForm();
	}

	$("form").find(".form-control:eq(0)").trigger("focus");
}
function closeGComboModal() {
	gcomboModal.dialog("close");
}

function openDocModal() {
	docModal.dialog("open");
}
function closeDocModal() {
	docModal.dialog("close");
}

function openHotListModal() {
	hotlistModal.dialog("open");
}
function closeHotListModal() {
	hotlistModal.dialog("close");
}


function openTestEblastModal() {
	testEblastModal.dialog("open");
}
function closeTestEblastModal() {
	testEblastModal.dialog("close");
}

function openActionLogValModal() {
	actionLogValModal.dialog("open");
}
function closeActionLogValModal() {
	actionLogValModal.dialog("close");
	$("#txtKeyword").trigger("focus");
}


function openGattrFilterModal() {
	gAttrFilterModal.dialog("open");
}
function closeGattrFilterModal() {
	gAttrFilterModal.dialog("close");
	$("#txtKeyword").trigger("focus");
}

function openCustomAttributeModal() {
	customAttributeModal.dialog("open");
	$("#attrName").trigger("focus");
	selectedAttribute = fillAttribute($infoblk);
	console.log("selectedattribute:", selectedAttribute);
}
function closeCustomAttributeModal() {
	customAttributeModal.dialog("close");
}
$(document).on("click", "#btnSaveCustomAttr", function () {
	selectedAttribute.attrType = "text";
	saveAttributeVals(editmode);
});

$(document).on("change", "#attrValue", function () {
	selectedAttribute.attrValue = <string>$(this).val();
});

$(document).on("change", "#attrName", function () {
	selectedAttribute.attrName = <string>$(this).val();
});

function openAssignedContactModal() {
	assignedContactModal.dialog("open");
}
function closeAssignedContactModal() {
	assignedContactModal.dialog("close");
	$("#txtKeyword").trigger("focus");
}


function openAssignedEnquiryModal() {
	assignedEnquiryModal.dialog("open");
}
function closeAssignedEnquiryModal() {
	assignedEnquiryModal.dialog("close");
	$("#txtKeyword").trigger("focus");
}

function initSalesGroup(): ISalesGroup {
	return {
		Id: 0,
		sgName: "",
		sgDesc: "",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
		UserName: "",
	};
}

function openSalesGroupMemberModal() {
	salesgroupMemberModal.dialog("open");
}
function closeSalesGroupMemberModal() {
	salesgroupMemberModal.dialog("close");
	$("#txtKeyword").trigger("focus");
}

function openGroupSalesmenModal() {
	groupSalesmenModal.dialog("open");
}
function closeGroupSalesmenModal() {
	groupSalesmenModal.dialog("close");
	$("#txtKeyword").trigger("focus");
}
function openTextAreaModal(title: string = "") {
	let $txtfield = textareaModal.find("#txtField");
	$txtfield.val("");

	textareaModal.dialog("open");
	if (stockTransferEditMode) {
		textareaModal.dialog({ title: remarktxt });
	} else {
		textareaModal.dialog({ title: title });
	}
	if (forjournal && selectedJournalLn) {
		$txtfield.val(selectedJournalLn.AllocationMemo);
	}
	if (forIA && IALs.length > 0) {
		let idx = IALs.findIndex((x) => { return x.Seq == (currentY + 1); });
		if (IALs[idx]) $txtfield.val(IALs[idx].Memo);
	}
}
function closeTextAreaModal() {
	textareaModal.dialog("close");
}

function openSalesGroupModal() {
	salesgroupModal.dialog("open");
}
function closeSalesGroupModal() {
	salesgroupModal.dialog("close");
}
function openLogoModal() {
	logoModal.dialog("open");
}
function closeLogoModal() {
	logoModal.dialog("close");
}
function openTaxTypeModal() {
	taxTypeModal.dialog("open");
}
function closeTaxTypeModal() {
	taxTypeModal.dialog("close");
}

function openCurrencyModal() {
	currencyModal.dialog("open");
}
function closeCurrencyModal() {
	currencyModal.dialog("close");
}
function openPurchaseCodeModal() {
	//purchaseCodeModal.find('#tblCode tbody tr').removeClass('selectedtr');
	purchaseCodeModal.dialog("open");
}
function closePurchaseCodeModal() {
	purchaseCodeModal.dialog("close");
}

function closeDescModal() {
	descModal.dialog("close");
}
function openDescModal(params: any = null, _title: string = description, _width: number = 400) {
	descModal.dialog("option", { width: _width, title: _title });
	descModal.dialog("open");

	if (forcustomer) {
		$("#descModal")
			.empty()
			.append(
				params
			);
	}

	if (forsales && selectedSalesLn) {
		$("#descModal")
			.empty()
			.append(
				"<p style='font-size:larger;'>" + selectedSalesLn!.Item.itmDesc + "</p>"
			);
	}
	if (forrefund && refundsalesln) {
		$("#descModal")
			.empty()
			.append("<p style='font-size:larger;'>" + refundsalesln.rtlDesc + "</p>");
	}
	if (forpurchase && SelectedPurchaseItem) {
		$("#descModal")
			.empty()
			.append(
				"<p style='font-size:larger;'>" + SelectedPurchaseItem!.itmDesc + "</p>"
			);
	}

	if (forwholesales && SelectedWholeSalesLn) {
		$("#descModal")
			.empty()
			.append(
				"<p style='font-size:larger;'>" + SelectedWholeSalesLn.wslDesc + "</p>"
			);
	}

	if (forItem || forstock || fortransfer) {
		$("#descModal")
			.empty()
			.append(
				"<p style='font-size:larger;'>" + selectedItem?.NameDesc + "</p>"
			);
	}
}

function openItemBuySellUnitsModal() {
	itemBuySellUnitsModal.dialog("open");
}
function closeItemBuySellUnitsModal() {
	itemBuySellUnitsModal.dialog("close");
}

function openValidthruModal(hasFocusCls: boolean) {
	validthruModal.dialog("open");
	$target = $(".ui-dialog-buttonpane .ui-dialog-buttonset");
	if (hasFocusCls) {
		$target.find(".savebtn").show();
		$target
			.find(".secondarybtn")
			.text(canceltxt)
			.on("click", handleValidthruModalCancel);
	} else {
		$target.find(".savebtn").hide();
		$target
			.find(".secondarybtn")
			.text(closetxt)
			.on("click", closeValidthruModal);
	}
}
function closeValidthruModal() {
	validthruModal.dialog("close");
}

function openPurchaseBatchModal(
	addrow: boolean = false,
	readonly: boolean = false
) {
	//console.log("addrow:", addrow);
	//console.log("readonly:",true);
	purchaseBatchModal.find("#batchLocSeqItem").text(selectedItemCode);
	purchaseBatchModal.dialog("open");
	if (addrow) addPoBatRow(false);
	//console.log("here#openpb");
	purchaseBatchModal
		.find("#tblPbatch tbody tr")
		.find("td")
		.find("input")
		.prop("readonly", readonly);
	if (readonly) {
		$(".savebtn").hide();
		$(".batminus").addClass("disabled");
	}
}
function closePurchaseBatchModal() {
	purchaseBatchModal.dialog("close");
}

function openPurchaseSerialModal(
	addrow: boolean = false,
	readonly: boolean = false
) {
	purchaseSerialModal.find("#serialLocItem").text(selectedItemCode);
	purchaseSerialModal.dialog("open");
	if (addrow) addPoSnRow();
	purchaseSerialModal
		.find("#tblPserial tbody tr")
		.find("td")
		.find("input")
		.prop("readonly", readonly);
	if (readonly) {
		$(".savebtn").hide();
		$(".snminus").addClass("disabled");
	}
}
function closePurchaseSerialModal() {
	purchaseSerialModal.dialog("close");
}

function openCustomerTermsModal() {
	customerTermsModal.dialog("open");
}
function closeCustomerTermsModal() {
	customerTermsModal.dialog("close");
}

function openCustomerFollowUpModal() {
	customerFollowUpModal.dialog("open");
}
function closeCustomerFollowUpModal() {
	customerFollowUpModal.dialog("close");
}

function openItemAttrModal() {
	itemAttrModal.dialog("open");
}
function closeItemAttrModal() {
	itemAttrModal.dialog("close");
	SaveItemAttr();
}
function openDateTimeModal() {
	dateTimeModal.dialog("open");
	$(".ui-dialog-buttonpane .ui-dialog-buttonset")
		.find("button")
		.first()
		.trigger("focus");
}
function closeDateTimeModal() {
	dateTimeModal.dialog("close");
}

function openConvertDateModal() {
	convertDateModal.dialog("open");
}
function closeConvertDateModal() {
	convertDateModal.dialog("close");
}
function openRecurOrderModal() {
	recurOrderModal.dialog("open");
	if (recurOrder!.Mode === "save" || recurOrder!.Mode === "savefrmposted") {
		recurOrderModal.find("#recurnameblk").removeClass("hide");
		recurOrderModal.find("#recurlistblk").addClass("hide");
		recurOrderModal
			.find("#txtRecurName")
			.val(`${formatDate()}${selectedCus.cusName}`)
			.trigger("focus");
		$("#btnMain").button("option", "label", savetxt);
	}
	if (recurOrder!.Mode === "list") {
		recurOrderModal.dialog("option", "width", 800);
		recurOrderModal.find("#recurnameblk").addClass("hide");
		recurOrderModal.find("#recurlistblk").removeClass("hide");
		recurOrderModal.find("#txtRecurKeyword").trigger("focus");
		$("#btnMain").button("option", "label", closetxt);
	}
}
function closeRecurOrderModal() {
	recurOrderModal.dialog("close");
}
function openWhatsappLinkModal() {
	whatsappLinkModal.dialog("open");
}
function closeWhatsappLinkModal() {
	whatsappLinkModal.dialog("close");
	if (forcustomer) window.location.href = "/Customer/Index";
	else window.location.reload();
}

function openUploadFileModal() {
	$("#uploadmsg").hide();
	uploadFileModal.dialog("open");
}
function closeUploadFileModal() {
	uploadFileModal.dialog("close");
}

function openViewFileModal() {
	if (forpurchasepayments) {
		populateFileList4PurchasePayments(UploadedFileList);
	} else {
		//console.log("UploadedFileList#open:", UploadedFileList);
		populateFileList(UploadedFileList);
	}
	viewFileModal.dialog("open");
}
function closeViewFileModal() {
	viewFileModal.dialog("close");
}

function openDropDownModal(ele: any = null) {
	dropdownModal.dialog("open");
	if (forcustomer) {
		if (forhotlist) {
			dropdownModal.find(".form-group").first().find("label").text(hotlisttxt);
		}
		if (foreblast) {
			dropdownModal.find(".form-group").first().find("label").text(eblasttxt);
		}
		if (forassignsalesmen) {
			setUpChkEmailNotification();
		}
	}
	if (forenquiry) {
		if (forassignsalesmen) {
			setUpChkEmailNotification();
		}
	}


	if (ele) {
		let _attrname: string = $(ele).data("attrname");
		dropdownModal.find("label").text(_attrname);
		let options: string = "";
		let $dropdown: JQuery = dropdownModal.find("select");
		$dropdown.data("attrname", _attrname);
		$dropdown.attr("Id", _attrname);
		let _items: string[] = $(ele).data("attrvalue").split("||");
		$.each(_items, function (i, e) {
			options += `<option value="${e}">${e}</option>`;
		});
		$dropdown.empty().append(options);
	}

	function setUpChkEmailNotification() {
		dropdownModal.find(".form-group").first().find("label").text(salesmentxt);

		if (!dropdownModal.find("#chkEmailNotification").length) {
			let html = `<div class="form-check small">
			<input type="checkbox" class="form-check-input" id="chkEmailNotification" checked />
			<label class="form-check-label" for="chkEmailNotification">${emailnotificationtosalesmentxt}</label>
		</div>`;
			dropdownModal.append(html);
		}
	}
}
function closeDropDownModal() {
	dropdownModal.dialog("close");
}

function openCurrencySettingModal() {
	currencySettingModal.dialog("open");
}
function closeCurrencySettingModal() {
	currencySettingModal.dialog("close");
}

function openAdvancedSearchModal() {
	advancedSearchModal.dialog("open");
	$(".attrval").first().trigger("focus");
}
function closeAdvancedSearchModal() {
	advancedSearchModal.dialog("close");
}

function openContactModal() {
	contactModal.dialog("open");
}
function closeContactModal() {
	contactModal.dialog("close");
}

function openBatchModal(hasFocusCls: boolean) {
	//console.log("hasfocuscls:", hasFocusCls);
	batchModal.dialog("open");
	$target = $(".ui-dialog-buttonpane .ui-dialog-buttonset");
	if (hasFocusCls) {
		$target.find(".savebtn").show();
		$target
			.find(".secondarybtn")
			.text(canceltxt)
			.on("click", handleBatchModalCancel);
	} else {
		$target.find(".savebtn").hide();
		$target.find(".secondarybtn").text(closetxt).on("click", closeBatchModal);
	}
}
function closeBatchModal() {
	batchModal.dialog("close");
	chkbatsnvtchange = false;
	batdelqtychange = false;
}

function openTransferModal(hasFocusCls: boolean = false) {
	//console.log("hasfocuscls:", hasFocusCls);
	transferModal.dialog("open");
	$target = $(".ui-dialog-buttonpane .ui-dialog-buttonset");
	if (hasFocusCls) {
		$target.find(".savebtn").show();
		$target
			.find(".secondarybtn")
			.text(canceltxt)
			.on("click", handleTransferModalCancel);
	} else {
		$target.find(".savebtn").hide();
		$target
			.find(".secondarybtn")
			.text(closetxt)
			.on("click", closeTransferModal);
	}
}
function closeTransferModal() {
	transferModal.dialog("close");
	chkbatsnvtchange = false;
	batdelqtychange = false;
}

//for those items without batch
$(document).on("change", ".chkvari", function () {
	const maxqty = Number($(this).data("maxqty"));
	//const ischecked = $(this).is(":checked");
	$target = itemVariModal.find(".chkvari");
	let chklength = 0;
	$target.each(function (i, e) {
		if ($(e).is(":checked")) chklength++;
	});
	$target.prop("disabled", chklength == maxqty);
	//if (ischecked) {
	//    if (chklength == maxqty) {
	//        $target.prop("disabled", true);
	//    }
	//} else {
	//    if (chklength < maxqty) {
	//        $target.prop("disabled", false);
	//    }
	//}
});
//for those items without batch

function addPoItemVariRow(hasFocusCls: boolean) {
	//console.log("hasfocuscls:", hasFocusCls);

	if (!$.isEmptyObject(DicItemGroupedVariations)) {
		var itemcode = selectedItemCode;
		var purchaseItem = Purchase.PurchaseItems.find((x) => x.piSeq == seq);

		//console.log("purchaseItem:", purchaseItem);
		//console.log("purchaseItem.poItemVariList:", purchaseItem!.poItemVariList);

		let batcode: string = $(`#${gTblId} tbody tr`)
			.eq(currentY)
			.find(".pobatch")
			.data("batcode");
		//console.log("batcode:" + batcode);
		//console.log("undefined:", batcode === "undefined");
		let disabled = hasFocusCls ? "" : "disabled";

		let html = "";
		for (const [key, value] of Object.entries(DicItemGroupedVariations)) {
			if (itemcode.toString() === key.toString()) {
				for (const [k, v] of Object.entries(value)) {
					//console.log("v:", v);

					html += `<div class="form-group">`;
					let itemvar: IItemVariation = v[0];
					//console.log("itemvar:", itemvar);

					html += `<label class="my-auto">${itemvar.iaName}</label><select class="drpItemAttr form-control" data-name=${itemvar.iaName} ${disabled}>`;
					$.each(v, function (i, e: IItemVariation) {
						//console.log("here");
						let found: boolean = false;
						if (purchaseItem && purchaseItem.poItemVariList.length > 0) {
							//console.log("hasFocusCls:",hasFocusCls);
							if (hasFocusCls) {
								found = purchaseItem.poItemVariList.some((x) => {
									return x.JsIvIdList && x.JsIvIdList.includes(e.Id);
								});
							} else {
								//console.log("here");
								//console.log("batcode:", batcode);
								//console.log("!undefined?", batcode !== "undefined");
								if (batcode) {
									//console.log("x");
									found = purchaseItem.poItemVariList.some((x) => {
										return (
											x.batCode == batcode &&
											x.ivStockInCode == Purchase.pstCode
										);
									});
								} else {
									console.log("here");
									found = purchaseItem.poItemVariList.some((x) => {
										return x.ivIdList?.split(",").includes(e.Id.toString());
									});
									//console.log("found:", found);
								}
							}
						}
						let selected: string = found ? "selected" : "";
						html += `<option value="${e.Id}" ${selected}>${e.iaValue}</option>`;
					});
					html += `</select>`;
					html += `</div>`;
				}
			}
		}

		poItemVariModal.find(".container").empty().append(html);
	}
}
function openPoItemVariModal(hasFocusCls: boolean = false) {
	//console.log("itemOptions:", itemOptions);
	if (
		!itemOptions?.ChkBatch &&
		!itemOptions?.ChkSN &&
		!itemOptions?.WillExpire
	) {
		poItemVariModal.find(".form-group").first().hide();
	} else {
		$.each(SelectedPurchaseItem!.batchList, function (i, item) {
			// const selected = selectedPurchaseItem!.ivBatCode === item.batCode;
			const selected = true;
			poItemVariModal
				.find("#batcode")
				.empty()
				.append(
					$("<option>", {
						value: item.batCode,
						text: item.batCode,
						selected: selected,
					})
				);
		});
		poItemVariModal.find("#batcode").prop("disabled", true);
	}

	//console.log("hasFocusCls:", hasFocusCls);
	addPoItemVariRow(hasFocusCls);

	poItemVariModal.dialog("open");
	$target = $(".ui-dialog-buttonpane .ui-dialog-buttonset");
	if (hasFocusCls) {
		$target.find(".savebtn").show();
		$target
			.find(".secondarybtn")
			.text(canceltxt)
			.on("click", handlePoItemVariModalCancel);
	} else {
		$target.find(".savebtn").hide();
		$target
			.find(".secondarybtn")
			.text(closetxt)
			.on("click", closePoItemVariModal);
	}
}
function closePoItemVariModal() {
	poItemVariModal.dialog("close");
}

function openItemVariModal(hasFocusCls: boolean = false) {
	//console.log("hasfocuscls:", hasFocusCls);
	itemVariModal.dialog("open");
	$target = $(".ui-dialog-buttonpane .ui-dialog-buttonset");

	if (hasFocusCls) {
		$target.find(".savebtn").show();
		$target
			.find(".secondarybtn")
			.text(canceltxt)
			.on("click", handleItemVariModalCancel);
	} else {
		$target.find(".savebtn").hide();
		$target
			.find(".secondarybtn")
			.text(closetxt)
			.on("click", closeItemVariModal);
	}
}
function closeItemVariModal() {
	itemVariModal.dialog("close");
}

function openBarCodeModal() {
	barcodeModal.dialog("open");
}
function closeBarCodeModal() {
	barcodeModal.dialog("close");
}

function openVoidPaymentModal() {
	voidPaymentModal.dialog("open");
	voidPaymentModal.find("#txtUserName").trigger("focus");
}
function closeVoidPaymentModal() {
	voidPaymentModal.dialog("close");
	UserName = "";
	NamesMatch = false;
}

function resetPaymentTypeModal() {
	paymentTypeModal.find("#pmtName").val("");
	paymentTypeModal.find("#pmtSCR").val("");
}
function openPaymentTypeModal(charge: number = 0) {
	resetPaymentTypeModal();
	setInput4NumberOnly("paytype");
	if (charge) paymentTypeModal.find("#pmtSCR").val(charge);
	paymentTypeModal.dialog("open");
}
function closePaymentTypeModal() {
	paymentTypeModal.dialog("close");
}

function openReserveModal() {
	reserveModal.dialog("open");
}
function closeReserveModal() {
	reserveModal.dialog("close");
}

function resetEnquiryGroupModal() {
	enquiryGroupModal.find(".text-danger").text("");
	enquiryGroupModal.find("#txtRemark").val("");
	enquiryGroupModal.find("#txtGroupName").val("").trigger("focus");
}
function resetCustomerGroupModal() {
	customerGroupModal.find(".text-danger").text("");
	customerGroupModal.find("#txtRemark").val("");
	customerGroupModal.find("#txtGroupName").val("").trigger("focus");
}
function openCustomerGroupModal() {
	resetCustomerGroupModal();
	customerGroupModal.dialog("open");
	GetCustomerGroupList(1);
}
function closeCustomerGroupModal() {
	customerGroupModal.dialog("close");
}

function openEnquiryGroupModal() {
	resetEnquiryGroupModal();
	enquiryGroupModal.dialog("open");
	GetEnquiryGroupList(1);
}
function closeEnquiryGroupModal() {
	enquiryGroupModal.dialog("close");
}

function resetHtmlPreviewModal() {
	htmlPreviewModal.find("div").empty();
}
function openHtmlPreviewModal() {
	htmlPreviewModal.dialog("open");
}
function closeHtmlPreviewModal() {
	resetHtmlPreviewModal();
	htmlPreviewModal.dialog("close");
}
function initModals() {
	if ($("#htmlPreviewModal").length) {
		htmlPreviewModal = $("#htmlPreviewModal").dialog({
			width: 960,
			title: previewtxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					class: "secondarybtn",
					text: closetxt,
					click: closeHtmlPreviewModal
				},
			],
		});
	}

	if ($("#enquiryGroupModal").length) {
		enquiryGroupModal = $("#enquiryGroupModal").dialog({
			width: 960,
			title: enquirygrouptxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: savetxt,
					class: "savebtn",
					click: handleEnquiryGroupSaved,
				},
				{
					class: "secondarybtn",
					text: canceltxt,
					click: closeEnquiryGroupModal
				},
			],
		});
	}

	if ($("#customerGroupModal").length) {
		customerGroupModal = $("#customerGroupModal").dialog({
			width: 960,
			title: customergrouptxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: savetxt,
					class: "savebtn",
					click: handleCustomerGroupSaved,
				},
				{
					class: "secondarybtn",
					text: canceltxt,
					click: closeCustomerGroupModal
				},
			],
		});
	}

	if ($("#reserveModal").length) {
		reserveModal = $("#reserveModal").dialog({
			width: 600,
			title: reserveitemtxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: savetxt,
					class: "savebtn",
					click: handleReserveSaved,
				},
				{
					class: "secondarybtn",
					text: canceltxt,
					click: closeReserveModal
				},
			],
		});
	}

	if ($("#paymentTypeModal").length) {
		paymentTypeModal = $("#paymentTypeModal").dialog({
			width: 600,
			title: paymenttypetxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: savetxt,
					class: "savebtn",
					click: handlePaymentTypeSaved,
				},
				{
					class: "secondarybtn",
					text: canceltxt,
					click: closePaymentTypeModal
				},
			],
		});
	}

	voidPaymentModal = $("#voidPaymentModal").dialog({
		width: 500,
		title: void4paymenttxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: savetxt,
				class: "savebtn",
				click: handleVoidPayment,
			},
			{
				class: "secondarybtn",
				text: canceltxt,
				click: closeVoidPaymentModal
			},
		],
	});

	if ($("#textareaModal").length) {
		textareaModal = $("#textareaModal").dialog({
			width: 700,
			title: "",
			autoOpen: false,
			modal: true,
			buttons: [
				{
					class: "savebtn",
					text: oktxt,
					click: function () {
						closeTextAreaModal();
						var remark = <string>$("#textareaModal").find("#txtField").val();

						if (approvalmode && (forsales || forpreorder || forpurchase || forwholesales)) {
							//reject reason:
							rejectreason = remark;
							respondReview("reject");
						}
						if (stockTransferEditMode) {

							$target = $(`#${gTblId} tbody tr`)
								.eq(currentY)
								.find(".remark");
							$target.data("remark", remark);
							if (remark !== "") {
								$target.val("...");
							}
						}
						if (forjournal) {
							if (selectedJournalLn) {
								if (remark !== "") {
									selectedJournalLn.AllocationMemo = remark;
									$tr.find(".memo").data("remark", remark).val("...");
								}

							}
						}
						if (forIA) {
							if (remark !== "") {
								if (IALs.length > 0) {
									let idx = IALs.findIndex((x) => { return x.Seq == (currentY + 1); });
									//console.log("idx:" + idx);
									if (IALs[idx]) {
										IALs[idx].Memo = remark;
										//console.log("$tr:", $tr);
										$tr.find(".memo").data("remark", remark).val("...");
									}
								}
							}

						}
					},
				},
				{
					text: canceltxt,
					click: closeTextAreaModal,
				},
			],
		});
	}


	barcodeModal = $("#barcodeModal").dialog({
		width: 400,
		title: barcodetxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: confirmtxt,
				class: "savebtn",
				click: confirmBarCodeClose,
			},
			{
				text: canceltxt,
				class: "secondarybtn",
				click: closeBarCodeModal,
			},
		],
	});

	itemVariModal = $("#itemVariModal").dialog({
		width: 900,
		title: itemvariationtxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				class: "savebtn",
				text: oktxt,
				click: function () {
					confirmIvQty();
				},
			},
			{
				class: "secondarybtn",
				text: canceltxt,
				click: function () {
					handleItemVariModalCancel();
				},
			},
		],
	});

	poItemVariModal = $("#poItemVariModal").dialog({
		width: 400,
		title: itemvariationtxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				class: "savebtn",
				text: oktxt,
				click: function () {
					confirmPoItemVariQty();
				},
			},
			{
				class: "secondarybtn",
				text: canceltxt,
				click: function () {
					handlePoItemVariModalCancel();
				},
			},
		],
	});

	transferModal = $("#transferModal").dialog({
		width: 900,
		title: transfertxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				class: "savebtn",
				text: oktxt,
				click: function () {
					confirmTransferQty();
				},
			},
			{
				class: "secondarybtn",
				text: canceltxt,
				click: function () {
					handleTransferModalCancel();
				},
			},
		],
	});
	batchModal = $("#batchModal").dialog({
		width: 900,
		title: batchtxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				class: "savebtn",
				text: oktxt,
				click: function () {
					confirmBatchSnQty();
				},
			},
			{
				class: "secondarybtn",
				text: canceltxt,
				click: function () {
					handleBatchModalCancel();
				},
			},
		],
	});

	contactModal = $("#contactModal").dialog({
		width: 400,
		title: contacttxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: closetxt,
				class: "secondarybtn",
				click: closeContactModal,
			},
		],
	});

	advancedSearchModal = $("#advancedSearchModal").dialog({
		width: 800,
		title: advancedsearchtxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: oktxt,
				class: "savebtn",
				click: confirmAdvancedSearch,
			},
			{
				text: canceltxt,
				class: "secondarybtn",
				click: closeAdvancedSearchModal,
			},
		],
	});

	currencySettingModal = $("#currencySettingModal").dialog({
		width: 350,
		title: currency,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: closetxt,
				class: "secondarybtn",
				click: closeCurrencySettingModal,
			},
		],
	});

	viewFileModal = $(".viewFileModal").dialog({
		width: 650,
		title: viewfiletxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: closetxt,
				class: "secondarybtn",
				click: closeViewFileModal,
			},
		],
	});

	uploadFileModal = $("#uploadFileModal").dialog({
		width: 400,
		title: uploadfiletxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: closetxt,
				class: "secondarybtn",
				click: closeUploadFileModal,
			},
		],
	});

	whatsappLinkModal = $("#whatsappLinkModal").dialog({
		width: 400,
		title: whatsappapilinktxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: closetxt,
				class: "secondarybtn",
				click: function () {
					closeWhatsappLinkModal();
				},
			},
		],
	});

	recurOrderModal = $("#recurOrderModal").dialog({
		width: 400,
		title: recurringordertxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				id: "btnMain",
				text: recurOrder && recurOrder!.Mode == "list" ? closetxt : oktxt,
				class:
					recurOrder && recurOrder!.Mode == "list" ? "secondarybtn" : "savebtn",
				click: function () {
					closeRecurOrderModal();
					// console.log("recurOrder!.Mode:" + recurOrder!.Mode);
					// return false;
					if (recurOrder!.Mode === "list") {
						handleRecurOrderList();
					} else {
						recurOrder!.IsRecurring = 1;
						recurOrder!.Name = recurOrderModal.find("#txtRecurName").val();
						//console.log('recurorder:', recurOrder);
						//return false;
						if (recurOrder!.Mode === "save") {
							handleSubmit4WholeSales(true);
						}
						if (recurOrder!.Mode === "savefrmposted") {
							openWaitingModal();
							$.ajax({
								type: "POST",
								url: "/WholeSales/SaveRecurOrder",
								data: {
									__RequestVerificationToken: $(
										"input[name=__RequestVerificationToken]"
									).val(),
									RecurOrder: recurOrder,
								},
								success: function (data) {
									if (data) {
										closeWaitingModal();
										$.fancyConfirm({
											title: "",
											message: data,
											shownobtn: false,
											okButton: oktxt,
											noButton: notxt,
											callback: function (value) {
												if (value) {
													$("#txtKeyword").trigger("focus");
												}
											},
										});
									}
								},
								dataType: "json",
							});
						}
					}
				},
			},
			{
				text: canceltxt,
				click: closeRecurOrderModal,
			},
		],
	});

	convertDateModal = $("#convertDateModal").dialog({
		width: 400,
		title: convertdatetxt,
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: oktxt,
				class: "savebtn",
				click: confirmConvertDate,
			},
			{
				text: canceltxt,
				click: closeConvertDateModal,
			},
		],
	});

	if ($("#dateTimeModal").length) {
		dateTimeModal = $("#dateTimeModal").dialog({
			width: 400,
			title: datetxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					class: "savebtn",
					text: oktxt,
					click: function () {
						confirmDateTime();
					},
				},
				{
					class: "secondarybtn",
					text: canceltxt,
					click: function () {
						closeDateTimeModal();
					},
				},
			],
		});
	}
	if ($("#itemAttrModal").length) {
		itemAttrModal = $("#itemAttrModal").dialog({
			width: 550,
			title: customattributetxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					class: "savebtn",
					text: oktxt,
					click: function () {
						confirmItemAttr();
					},
				},
				{
					class: "secondarybtn",
					text: canceltxt,
					click: function () {
						resetItemAttrModal();
						closeItemAttrModal();
					},
				},
			],
		});
	}

	if ($("#customerTermsModal").length)
		customerTermsModal = $("#customerTermsModal").dialog({
			width: 400,
			title: customertermstxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					class: "secondarybtn",
					text: closetxt,
					click: closeCustomerTermsModal,
				},
			],
		});

	if ($("#purchaseSerialModal").length) {
		purchaseSerialModal = $("#purchaseSerialModal").dialog({
			width: 700,
			title: serialnotxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					class: "savebtn",
					text: oktxt,
					click: confirmPoSn,
				},
				{
					class: "secondarybtn",
					text: closetxt,
					click: closePurchaseSerialModal,
				},
			],
		});
	}

	if ($("#purchaseBatchModal").length) {
		purchaseBatchModal = $("#purchaseBatchModal").dialog({
			width: 700,
			title: batchtxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					class: "savebtn",
					text: oktxt,
					click: confirmPoBatch,
				},
				{
					class: "secondarybtn",
					text: closetxt,
					click: closePurchaseBatchModal,
				},
			],
		});
	}

	if ($("#validthruModal").length)
		validthruModal = $("#validthruModal").dialog({
			width: 800,
			title: expirydatetxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					class: "savebtn",
					text: oktxt,
					click: function () {
						confirmVtQty();
					},
				},
				{
					class: "secondarybtn",
					text: canceltxt,
					click: closeValidthruModal,
				},
			],
		});

	if ($("#batchModal").length)
		batchModal = $("#batchModal").dialog({
			width: 900,
			title: batchtxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					class: "savebtn",
					text: oktxt,
					click: function () {
						confirmBatchSnQty();
					},
				},
				{
					class: "secondarybtn",
					text: canceltxt,
					click: function () {
						handleBatchModalCancel();
					},
				},
			],
		});

	if ($("#itemBuySellUnitsModal").length)
		itemBuySellUnitsModal = $("#itemBuySellUnitsModal").dialog({
			width: 400,
			title: buysellbaseunitstxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: oktxt,
					class: "savebtn",
					click: function () {
						if (selectedItem) {
							selectedItem!.itmBuyUnit = itemBuySellUnitsModal
								.find("#txtBuyUnit")
								.val();
							selectedItem!.itmSellUnit = itemBuySellUnitsModal
								.find("#txtSellUnit")
								.val();
							selectedItem!.itmSellUnitQuantity = <number>(
								itemBuySellUnitsModal.find("#txtItmSellUnitQuantity").val()
							);
						}
						if (ItemVari) {
							ItemVari!.itmBuyUnit = itemBuySellUnitsModal
								.find("#txtBuyUnit")
								.val();
							ItemVari!.itmSellUnit = itemBuySellUnitsModal
								.find("#txtSellUnit")
								.val();
							ItemVari!.itmSellUnitQuantity = <number>(
								itemBuySellUnitsModal.find("#txtItmSellUnitQuantity").val()
							);
						}
						closeItemBuySellUnitsModal();
						if (editmode) {
							let data = {};
							if (selectedItem)
								data = {
									__RequestVerificationToken: $(
										"input[name=__RequestVerificationToken]"
									).val(),
									item: selectedItem,
								};
							if (ItemVari) {
								data = {
									__RequestVerificationToken: $(
										"input[name=__RequestVerificationToken]"
									).val(),
									PGIV: ItemVari,
								};
							}
							$.ajax({
								type: "POST",
								url: "/Api/UpdateItemBuySellUnit",
								data: data,
								success: function (data) {
									$.fancyConfirm({
										title: "",
										message: data,
										shownobtn: false,
										okButton: oktxt,
										noButton: notxt,
									});
								},
								dataType: "json",
							});
						}
					},
				},
				{
					text: canceltxt,
					click: closeItemBuySellUnitsModal,
				},
			],
		});

	if ($("#purchaseCodeModal").length)
		purchaseCodeModal = $("#purchaseCodeModal").dialog({
			width: 400,
			title: purchasecodetxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closePurchaseCodeModal,
				},
			],
		});

	if ($("#currencyModal").length)
		currencyModal = $("#currencyModal").dialog({
			width: 400,
			title: exchangeratetxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closeCurrencyModal,
				},
			],
		});

	if ($("#taxTypeModal").length)
		taxTypeModal = $("#taxTypeModal").dialog({
			width: 400,
			title: taxtypetxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: oktxt,
					click: function () {
						let checked: boolean = false;
						taxTypeModal.find(".taxtype").each(function (i, e) {
							if ($(e).is(":checked")) {
								checked = true;
								return false;
							}
						});
						if (!checked) {
							$.fancyConfirm({
								title: "",
								message: plsselectatleastonetaxtypetxt,
								shownobtn: false,
								okButton: oktxt,
								noButton: notxt,
								callback: function (value) {
									if (value) {
										taxTypeModal.find(".taxtype").eq(0).trigger("focus");
									}
								},
							});
						} else {
							if ($("#incTax").is(":checked")) {
								$target = taxTypeModal.find("#txtTaxRate");
								if (<number>$target.val() == 0) {
									$.fancyConfirm({
										title: "",
										message: plsspecifiytaxrate,
										shownobtn: false,
										okButton: oktxt,
										noButton: notxt,
										callback: function (value) {
											if (value) {
												$target.trigger("focus");
											}
										},
									});
								} else {
									closeTaxTypeModal();
								}
							} else {
								closeTaxTypeModal();
							}
						}
					},
				},
				{
					text: canceltxt,
					click: closeTaxTypeModal,
				},
			],
		});

	if ($("#logoModal").length)
		logoModal = $("#logoModal").dialog({
			width: 400,
			title: logotxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closeLogoModal,
				},
			],
		});

	if ($("#salesgroupModal").length) {
		salesgroupModal = $("#salesgroupModal").dialog({
			width: 500,
			title: "",
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: canceltxt,
					click: closeSalesGroupModal,
				},
			],
		});
	}


	if ($("#groupSalesmenModal").length) {
		groupSalesmenModal = $("#groupSalesmenModal").dialog({
			width: 700,
			title: groupsalesmentxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closeGroupSalesmenModal,
				},
			],
		});
	}

	if ($("#salesgroupMemberModal").length) {
		salesgroupMemberModal = $("#salesgroupMemberModal").dialog({
			width: 700,
			title: salesgrouptxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closeSalesGroupMemberModal,
				},
			],
		});
	}

	//assignedEnquiryModal
	if ($("#assignedEnquiryModal").length) {
		assignedEnquiryModal = $("#assignedEnquiryModal").dialog({
			width: 850,
			title: assignedenquiriestxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closeAssignedEnquiryModal,
				},
			],
		});
	}

	//assignedContactModal
	if ($("#assignedContactModal").length) {
		assignedContactModal = $("#assignedContactModal").dialog({
			width: 850,
			title: assignedcontactstxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closeAssignedContactModal,
				},
			],
		});
	}

	//customAttributeModal
	if ($("#customAttributeModal").length) {
		customAttributeModal = $("#customAttributeModal").dialog({
			width: 450,
			title: customattributetxt,
			autoOpen: false,
			modal: true,
			buttons: [
				//{
				//    text: savetxt,
				//    "class": 'savebtn',
				//    click: function () {

				//    }
				//},
				{
					text: canceltxt,
					click: closeCustomAttributeModal,
				},
			],
		});
	}

	if ($("#gAttrFilterModal").length) {
		gAttrFilterModal = $("#gAttrFilterModal").dialog({
			width: 600,
			title: attributetxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: oktxt,
					class: "savebtn",
					click: function () {
						let $drpgattr = $("#drpGattr");
						let attrname = <string>$drpgattr.val();
						if (attrname == "") {
							$.fancyConfirm({
								title: "",
								message: attrnamerequiredtxt,
								shownobtn: false,
								okButton: oktxt,
								noButton: notxt,
								callback: function (value) {
									if (value) {
										$drpgattr.trigger("focus");
									}
								},
							});
						}
						let $drpoperator = $("#drpOperator");
						let operator = <string>$drpoperator.val();
						if (operator == "") {
							$.fancyConfirm({
								title: "",
								message: operatorrequiredtxt,
								shownobtn: false,
								okButton: oktxt,
								noButton: notxt,
								callback: function (value) {
									if (value) {
										$drpoperator.trigger("focus");
									}
								},
							});
						}
						let $txtattrval =
							attrname.toLowerCase().indexOf("date") >= 0
								? $("#txtAttrVal_d")
								: $("#txtAttrVal");
						let attrval = <string>$txtattrval.val();
						if (attrval == "") {
							$.fancyConfirm({
								title: "",
								message: attrvalrequiredtxt,
								shownobtn: false,
								okButton: oktxt,
								noButton: notxt,
								callback: function (value) {
									if (value) {
										$txtattrval.trigger("focus");
									}
								},
							});
						}

						if (attrname !== "" && operator != "" && attrval !== "") {
							let _attribute: IAttribute = initAttribute();
							_attribute.attrName = attrname;
							_attribute.operator = operator;
							_attribute.attrValue = attrval;
							closeGattrFilterModal();
							let $frm;
							if (gattrfilteropener == "contact") {
								$frm = $("#frmContact");
							} else {
								$frm = $("#filterform");
							}
							searchByAttribute(_attribute, $frm);
						}
					},
				},
				{
					text: closetxt,
					click: closeGattrFilterModal,
				},
			],
		});
	}

	if ($("#actionLogValModal").length) {
		actionLogValModal = $("#actionLogValModal").dialog({
			width: 800,
			title: actionlogvaltxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closeActionLogValModal,
				},
			],
		});
	}

	if ($("#testEblastModal").length) {
		testEblastModal = $("#testEblastModal").dialog({
			width: 600,
			title: testformattxt.replace("{0}", eblasttxt),
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: oktxt,
					class: "savebtn",
					click: function () {
						closeTestEblastModal();
						$target = $("#testemail");
						var testemail = <string>$target.val();
						if (testemail === "") {
							$.fancyConfirm({
								title: "",
								message: requiredinputtxt.replace("{0}", emailtxt),
								shownobtn: false,
								okButton: oktxt,
								noButton: notxt,
								callback: function (value) {
									if (value) {
										$target.trigger("focus");
									}
								},
							});
						} else {
							if (validateEmail(testemail)) {
								openWaitingModal();
								$.ajax({
									type: "POST",
									url: "/eBlast/SendTestEmail",
									data: {
										__RequestVerificationToken: $(
											"input[name=__RequestVerificationToken]"
										).val(),
										Id: eblastId,
										testemail: testemail,
									},
									success: function (data) {
										closeWaitingModal();
										$.fancyConfirm({
											title: "",
											message: data,
											shownobtn: false,
											okButton: oktxt,
											noButton: notxt,
											callback: function (value) {
												if (value) {
													$("#txtKeyword").trigger("focus");
												}
											},
										});
									},
									dataType: "json",
								});
							} else {
								$.fancyConfirm({
									title: "",
									message: emailformaterr,
									shownobtn: false,
									okButton: oktxt,
									noButton: notxt,
									callback: function (value) {
										if (value) {
											$target.trigger("focus");
										}
									},
								});
							}
						}
					},
				},
				{
					text: canceltxt,
					click: closeTestEblastModal,
				},
			],
		});
	}

	if ($("#hotlistModal").length) {
		hotlistModal = $("#hotlistModal").dialog({
			width: 800,
			title: hotlisttxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: canceltxt,
					click: closeHotListModal,
				},
			],
		});
	}

	if ($("#docModal").length) {
		docModal = $("#docModal").dialog({
			width: 600,
			title: doctxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: oktxt,
					class: "savebtn",
					click: function () { },
				},
				{
					text: canceltxt,
					click: closeDocModal,
				},
			],
		});
	}

	if ($("#gcomboModal").length) {
		gcomboModal = $("#gcomboModal").dialog({
			width: 600,
			title: customfieldvaltxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: oktxt,
					class: "savebtn",
					click: function () {
						saveGCombo();
					},
				},
				{
					text: canceltxt,
					click: closeGComboModal,
				},
			],
		});
	}

	if ($("#salesmenModal").length) {
		salesmenModal = $("#salesmenModal").dialog({
			width: 800,
			title: assignclientstosalestxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: canceltxt,
					class: "secondarybtn",
					click: closeSalesmenModal,
				},
			],
		});
	}

	if ($("#dropdownModal").length) {
		dropdownModal = $("#dropdownModal").dialog({
			width: 400,
			title: "",
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: oktxt,
					class: "savebtn",
					click: function () {
						$target = dropdownModal.find("select");
						closeDropDownModal();
						if (forcustomer) {
							if (foremail) handleEmailCustomers();
							if (forhotlist) handleHotListCustomers();
							if (foreblast) handleEblastCustomers();
							if (forassignsalesmen) {
								let $chk = $("#chkEmailNotification");
								handleSalesmenCustomers($chk.length > 0 && $chk.is(":checked"));
							}
						}
						if (forenquiry) {
							if (forassignsalesmen) {
								let $chk = $("#chkEmailNotification");
								handleSalesmenEnquiries($chk.length > 0 && $chk.is(":checked"));
							}
						}
						else {
							let _id: string = <string>$target.attr("id");
							//console.log("_id:" + _id);
							let _val: string = <string>$target.val();
							if (_val !== "") {
								$target = $("#gattrblk").find(".form-group");
								$.each($target, function (i, e) {
									let _target = $(e).find(".form-control");
									if (_target.data("attrname") == _id) {
										_target.val(_val);
										return false;
									}
								});
							}
						}
					},
				},
				{
					text: canceltxt,
					click: closeDropDownModal,
				},
			],
		});
	}

	if ($("#accountModal").length) {
		accountModal = $("#accountModal").dialog({
			width: 600,
			title: itemaccounttxt,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: canceltxt,
					click: resetAccountRow,
				},
			],
		});
	}

	if ($("#comboModal").length) {
		comboModal = $("#comboModal").dialog({
			width: 600,
			title: editattribute,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: "",
					class: "savebtn",
					click: function () {
						//saveAttributeVals(edit);
					},
				},
				{
					text: canceltxt,
					click: closeComboModal,
				},
			],
		});
	}

	if ($("#actionModal").length) {
		actionModal = $("#actionModal").dialog({
			width: 960,
			title: actionhistory,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closeActionModal,
				},
			],
		});
	}

	if ($("#previewModal").length) {
		previewModal = $("#previewModal").dialog({
			width: 960,
			title: templatepreview,
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closePreviewModal,
				},
			],
		});
	}

	if ($("#waitingModal").length) {
		waitingModal = $("#waitingModal").dialog({
			width: 180,
			title: plswaittxt,
			autoOpen: false,
			modal: true,
			buttons: [],
		});
	}

	if ($("#cashdrawerModal").length) {
		cashdrawerModal = $("#cashdrawerModal").dialog({
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: closeCashDrawerModal,
				},
			],
		});
	}

	if ($("#changeModal").length) {
		changeModal = $("#changeModal").dialog({
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: oktxt,
					click: function () {
						closeChangeModal();
					},
				},
			],
		});
	}

	if ($("#payModal").length) {
		payModal = $("#payModal").dialog({
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: oktxt,
					class: "savebtn",
					click: function () {
						if (
							(forsales && !Sales.MonthlyPay) ||
							forpreorder ||
							forrefund ||
							fordeposit || forsimplesales || forReservePaidOut
						)
							confirmPay();

						closePayModal();
					},
				},
				{
					text: canceltxt,
					class: "secondarybtn",
					click: function () {
						resetPay();
					},
				},
			],
		});
	}

	if ($("#descModal").length) {
		descModal = $("#descModal").dialog({
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: closetxt,
					click: function () {
						descModal.dialog("close");
					},
				},
			],
		});
	}

	if ($("#itemModal").length) {
		itemModal = $("#itemModal").dialog({
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: canceltxt,
					click: function () {
						itemModal.dialog("close");
					},
				},
			],
		});
	}

	if ($("#cusModal").length) {
		cusModal = $("#cusModal").dialog({
			autoOpen: false,
			width: 800,
			title: searchcustxt,
			modal: true,
			buttons: [
				{
					text: canceltxt,
					click: closeCusModal,
				},
			],
		});
	}

	if ($("#serialModal").length) {
		serialModal = $("#serialModal").dialog({
			autoOpen: false,
			modal: true,
			buttons: [
				{
					class: "savebtn",
					text: oktxt,
					click: function () {
						confirmSNs();
					},
				},
				{
					class: "secondarybtn",
					text: canceltxt,
					click: closeSerialModal,
				},
			],
		});
	}
}
function handlePoItemVariModalCancel() {
	closePoItemVariModal();
}
function handleItemVariModalCancel() {
	closeItemVariModal();
}
function handleTransferModalCancel() {
	closeTransferModal();
}
function handleValidthruModalCancel() {
	closeValidthruModal();
}
function handleBatchModalCancel() {
	closeBatchModal();
	if (
		batchModal.find(".secondarybtn").text == canceltxt &&
		!chkbatsnvtchange &&
		batdelqtychange
	)
		resetBatchQty();
}
function handleSerialModalCancel() {
	closeSerialModal();
}
function getActualPrice(_item: ISimpleItem): number {
	//console.log('item#getactualprice:', _item);
	//console.log("_item.itmBaseSellingPrice!:" + _item.itmBaseSellingPrice!);
	//console.log("selectedCus.cusPriceLevelID:" + selectedCus.cusPriceLevelID);
	let price = 0;
	if (selectedCus.cusCode.toLowerCase() !== "guest") {
		switch (selectedCus.cusPriceLevelID) {
			case "PLB":
				price = _item.PLB;
				break;
			case "PLC":
				price = _item.PLC;
				break;
			case "PLD":
				price = _item.PLD;
				break;
			case "PLE":
				price = _item.PLE;
				break;
			case "PLF":
				price = _item.PLF;
				break;
			default:
			case "PLA":
			case "BSP":
				price = _item.itmBaseSellingPrice!;
		}
	} else {
		price = _item.itmBaseSellingPrice!;
	}
	if (!price) price = _item.itmBaseSellingPrice!;
	//console.log('price#getactualprice:' + price);
	return price;
	// price = price / exRate;
}

function getSnVt(
	_itemsnvtlist: Array<IItemSnBatVt>,
	_itemcode: string | number,
	_seq: number
): IBatSnVt[] {
	let filteredsnvtlist = $.grep(_itemsnvtlist, function (e, i) {
		return e.itemcode.toString() === _itemcode.toString() && e.seq === _seq;
	});
	//console.log('filteredsnvlist:', filteredsnvtlist);
	let snvtlist: Array<IBatSnVt> = [];
	if (filteredsnvtlist.length > 0) {
		snvtlist = filteredsnvtlist[0].snvtlist;
	}
	//console.log('return snvtlist:', snvtlist);
	return snvtlist;
}

function getSncodes(
	_itemsnlist: Array<IItemSN>,
	_itemcode: string | number,
	_seq: number
): string[] {
	let filteredsnlist = $.grep(_itemsnlist, function (e, i) {
		return e.itemcode.toString() === _itemcode.toString() && e.seq === _seq;
	});
	//console.log('filteredsnlist:', filteredsnlist);
	let sncodes: Array<string> = [];
	if (filteredsnlist.length > 0) {
		sncodes = filteredsnlist[0].serialcodes;
	}
	//console.log('return sncode:', sncodes);
	return sncodes;
}

function calAmount(_qty: any, _price: any, _discount: any): number {
	var qty = parseInt(_qty);
	var price = parseFloat(_price);
	var discount = parseFloat(_discount);
	//console.log('qty:' + qty + ';price:' + price + ';discount:' + discount);
	let _amt: number = round(price * qty * (1 - discount / 100), 2);
	return _amt;
}

function calAmountPlusTax(
	qty: number,
	price: number,
	taxrate: number,
	discount: number
): number {
	/* console.log('qty:' + qty + ';price:' + price + ';discount:' + discount + ';taxrate:' + taxrate);*/
	let _amt: number = round(
		price * qty * (1 + taxrate / 100) * (1 - discount / 100),
		2
	);
	return _amt;
}

function formatnumber(amt: number): string {
	return Number(amt).toFixed(2);
}

function formatmoney(amt: number, png: boolean = false): string {
	if (png) {
		return "K" + formatnumber(amt);
	} else {
		// Create our number formatter.
		var formatter = new Intl.NumberFormat("zh-HK", {
			style: "currency",
			currency: currencyCode,
		});
		return formatter.format(amt);
	}
}

function formatmoney4PNG(amt: number): string {
	return "K" + formatnumber(amt);
}

function disableNavLink() {
	$(".nav-link").each(function (i, e) {
		/** @type {HTMLAnchorElement} */
		let ele = $(e);
		let href: string | undefined = ele.attr("href");
		if (typeof href !== "undefined") {
			ele.data("href", href);
		}
		ele.attr("href", "#");
	});
}

function restoreNavLink() {
	$(".nav-link").each(function (i, e) {
		$(e).attr("href", $(e).data("href"));
	});
}

function falert(msg, ok) {
	$.fancyAlert({
		message: msg,
		okButton: ok,
	});
}

$.fancyAlert = function (opts) {
	opts = $.extend(
		true,
		{
			message: "",
			okButton: "OK",
		},
		opts || {}
	);

	$.fancybox.open({
		type: "html",
		src:
			'<div class="fc-content">' +
			"<p>" +
			opts.message +
			"</p>" +
			'<p class="tright">' +
			'<button data-value="1" data-fancybox-close class="btn fancybox-btn">' +
			opts.okButton +
			"</button>" +
			"</p>" +
			"</div>",
		opts: {
			animationDuration: 350,
			animationEffect: "material",
			modal: true,
			baseTpl:
				'<div class="fancybox-container fc-container" role="dialog" tabindex="-1">' +
				'<div class="fancybox-bg"></div>' +
				'<div class="fancybox-inner">' +
				'<div class="fancybox-stage"></div>' +
				"</div>" +
				"</div>",
		},
	});
};

$.fancyConfirm = function (opts) {
	opts = $.extend(
		true,
		{
			title: "Are you sure?",
			message: "",
			okButton: "OK",
			noButton: "Cancel",
			callback: $.noop,
		},
		opts || {}
	);

	let _src = opts.shownobtn
		? '<div class="fc-content">' +
		"<h3>" +
		opts.title +
		"</h3>" +
		"<p>" +
		opts.message +
		"</p>" +
		'<p class="tright">' +
		'<a data-value="0" data-fancybox-close>' +
		opts.noButton +
		"</a>" +
		'<button data-value="1" data-fancybox-close class="btn fancybox-btn">' +
		opts.okButton +
		"</button>" +
		"</p>" +
		"</div>"
		: '<div class="fc-content">' +
		"<h3>" +
		opts.title +
		"</h3>" +
		"<p>" +
		opts.message +
		"</p>" +
		'<p class="tright">' +
		'<button data-value="1" data-fancybox-close class="btn fancybox-btn">' +
		opts.okButton +
		"</button>" +
		"</p>" +
		"</div>";

	$.fancybox.open({
		type: "html",
		src: _src,
		opts: {
			animationDuration: 350,
			animationEffect: "material",
			modal: true,
			baseTpl:
				'<div class="fancybox-container fc-container" role="dialog" tabindex="-1">' +
				'<div class="fancybox-bg"></div>' +
				'<div class="fancybox-inner">' +
				'<div class="fancybox-stage"></div>' +
				"</div>" +
				"</div>",
			afterClose: function (instance, current, e) {
				var button = e ? e.target || e.currentTarget : null;
				var value = button ? $(button).data("value") : 0;

				opts.callback(value);
			},
		},
	});
};


function initDayendCountPay(): IDayendCountPay {
	return {
		selPayMethod: "",
		selAmtSys: 0,
		selAmtCount: 0,
		isCash: 0,
	};
}

function initRefundItem(): IRefundBase {
	return {
		rtlUID: 0,
		itemcode: selectedItemCode,
		price: 0,
		refundedQty: 0,
		refundableQty: 0,
		qtyToRefund: 0,
		discount: 0,
		amt: 0,
		amtplustax: 0,
		rtlSeq: 0,
		taxrate: 0,
		//isZeroStockItem: false,
		rtlDesc: "",
		rtlRefSales: "",
		//rtlItemCode: '',
		//rtlSalesAmt: 0,
		//rtlQty: 0,
		SalesDateDisplay: "",
		vtdelIds: null,
		batdelIds: null,
		strsnlist: null,
		batdelId: 0,
		vtdelId: 0,
		rtlSn: null,
		rfSeq: 0,
		rtlStockLoc: "",
	};
}

function initReturnItem(): IReturnBase {
	return {
		itemcode: "",
		batchcode: "",
		price: 0,
		returnedQty: 0,
		returnableQty: 0,
		qtyToReturn: 0,
		discpc: 0,
		amount: 0,
		amountplustax: 0,
		seq: 0,
		taxrate: 0,
		taxamt: 0,
		itmNameDesc: "",
		psRefCode: "",
		PurchaseDateDisplay: "",
		baseUnit: "",
		serialNo: initSerialNo(),
		hasSN: false,
		JsValidThru: "",
	};
}
function initRefundSales(): IRefundSales {
	return {
		rtlUID: 0,
		rtsCode: "",
		rtsRmks: "",
		rtlItemCode: "",
		rtlSellingPrice: 0,
		rtlTaxPc: 0,
		rtlBatch: "",
		rtlQty: 0,
		rtlRefSales: "",
		rtlSeq: 0,
		rtlSalesAmt: 0,
		SalesDateDisplay: "",
		rtlCode: "",
		rtlLineDiscPc: 0,
		rtlSalesDate: "",
		rtlDesc: "",
		SellingPrice: 0,
		SellingPriceDisplay: "",
		//refundSeq:0,
		refundedQty: 0,
		refundableQty: -1,
		//refundableAmtPlusTax: 0,
		qtyToRefund: 0,
		taxModel: initTaxModel(),
		rtlTaxIncl: 0,
		rtlTaxExcl: 0,
		rtlTaxAmt: 0,
		rtlSellingPriceMinusInclTax: 0,
		vtdelIds: null,
		batdelIds: null,
		strsnlist: null,
		batdelId: 0,
		vtdelId: 0,
		rtlSn: null,
		rfSeq: 0,
		rtlStockLoc: "",
		rtlValidThru: null,
		itmNameDesc: "",
		rtsServiceChargeAmt: 0
	};
}

function initTaxModel(): ITaxModel {
	return {
		taxType: TaxType.Exclusive,
		taxRate: 0,
		inclTaxAmt: 0,
		exclTaxAmt: 0,
		taxAmt: 0,
		tIN: "",
		EnableTax: false,
	};
}


function initSalesItem(): ISalesItem {
	return {
		salescode: "",
		itemcode: "",
		rtlSeq: 0,
		desc: "",
		batch: "",
		qty: 0,
		price: 0,
		pricetxt: "",
		disc: 0,
		disctxt: "",
		tax: 0,
		taxtxt: "",
		amt: 0,
		amttxt: "",
		date: "",
		depositqty: 0,
		depositamttxt: "",
		depositamt: 0,
		depositdate: "",
		qtyavailable: 0,
		refundqty: 0,
		refundqtytxt: "",
		refundamt: 0,
		refundamttxt: "",
		refunddate: "",
		snlist: "",
		sncodes: [],
		remark: "",
		internalnote: "",
		customerpo: "",
		deliverydatedisplay: "",
		rtlStockLoc: "",
	};
}

function initDepositRemainItem(): IDepositRemainItem {
	return {
		itemcode: "",
		itemdesc: "",
		price: 0,
		qty: 0,
		amount: 0,
		seq: 0,
		depositamt: 0,
		remainamt: 0,
	};
}

function initAddressView(): IAddressView {
	return {
		Id: 0,
		cusCode: "",
		cusAddrLocation: "",
		AccountProfileId: 0,
		StreetLine1: "",
		StreetLine2: "",
		StreetLine3: "",
		StreetLine4: "",
		City: "",
		State: "",
		Postcode: "",
		Country: "",
		Phone1: "",
		Phone2: "",
		Phone3: "",
		Fax: "",
		Email: "",
		Salutation: "",
		ContactName: "",
		WWW: "",
	};
}


function initItem(): IItem {
	return {
		itmIsActive: $("#isActive").is(":checked"),
		itmIsNonStock: $("#inventory").length
			? !$("#inventory").is(":checked")
			: false,
		itmIsQtyFractional: false,
		itmIsCombo: false,
		itmChgCtrl: "",
		itmCode: $("#itmCode").val() as string,
		itmCode2: "",
		itmName: $("#itmName").val() as string,
		itmDesc: $("#itmDesc").val() as string,
		itmUseDesc: $("#replacing").is(":checked"),
		itmUseDesc2: false,
		chkSN: $("#chkSN").is(":checked"),
		itmSnReusable: false,
		chkVT: $("#chkExpiry").is(":checked"),
		itmValidDays: 0,
		itmValidThru: "",
		itmRedeemable: false,
		itmRedeemValue: 0,
		chkBat: $("#chkBatch").is(":checked"),
		itmBchWillExpire: false,
		itmCodeSup: "",
		itmNameSup: "",
		itmCodeSup2: "",
		itmNameSup2: "",
		itmSupDiscPc: 0,
		itmSupCurr: "",
		itmCodeCus: "",
		itmNameCus: "",
		itmSupCode: "",
		itmItemGrp: "",
		itmItemGrp2: "",
		itmSeries: "",
		itmTaxCode: "",
		itmTaxPc: 0,
		itmLength: Number($("#itmLength").val()),
		itmWidth: Number($("#itmWidth").val()),
		itmHeight: Number($("#itmHeight").val()),
		itmBaseUnit: "",
		itmBulkUnit: "",
		itmBulk2BaseUnit: 0,
		itmBuyUnit: $("#txtBuyUnit").val() as string,
		itmSellUnit: $("#txtSellUnit").val() as string,
		itmBuy2Unit: "",
		itmSell2Unit: "",
		itmBuy2BaseUnit: 1,
		itmSell2BaseUnit: 1,
		itmRrpLocAdj: false,
		itmRrpTaxExcl: 0,
		itmRrpTaxIncl: 0,
		itmRrp2TaxIncl: 0,
		itmRrpEquVip: 0,
		itmTopUpVipOK: false,
		itmSellUnitOnHand: 0,
		itmSellUnitAvgCost: 0,
		itmLastSold: "",
		itmBuyStdCost: 0,
		itmBuyLastCost: 0,
		itmBuyLastTime: "",
		itmMinStockQty: 0,
		itmPicFile: "",
		itmPicPath: "",
		itmRunUnitCost: 0,
		itmCntOrgCode: "",
		itmCntOrgName: "",
		itmAuthors: "",
		itmCreateBy: "",
		itmCreateTime: "",
		itmModifyBy: "",
		itmModifyTime: "",
		itmLockBy: "",
		itmLockTime: "",
		itmLastUnitPrice: 0,
		itmLastSellingPrice: 0,
		itmSellUnitQuantity:
			Number($("#txtItmSellUnitQuantity").val()) == 0
				? 1
				: Number($("#txtItmSellUnitQuantity").val()),
		itmBaseSellingPrice: 0,
		itmBaseUnitPrice: 0,
		itmUnitCost: 0,
		itmItemID: Number($("#itmItemID").val()),
		itmDSN: "",
		QtySellable: 1,
		PLA: Number($("#PLA").val()),
		PLB: Number($("#PLB").val()),
		PLC: Number($("#PLC").val()),
		PLD: Number($("#PLD").val()),
		PLE: Number($("#PLE").val()),
		PLF: Number($("#PLF").val()),
		IsActive: $("#isActive").is(":checked") ? 1 : 0,
		IncomeAccountID: $("#IncomeAccountID").length
			? Number($("#IncomeAccountID").data("id"))
			: 0,
		InventoryAccountID: $("#InventoryAccountID").length
			? Number($("#InventoryAccountID").data("id"))
			: 0,
		ExpenseAccountID: $("#ExpenseAccountID").length
			? Number($("#ExpenseAccountID").data("id"))
			: 0,

		itmIsBought: $("#buy").length ? $("#buy").is(":checked") : false,
		itmIsSold: $("#sell").length ? $("#sell").is(":checked") : false,
		SellingPriceDisplay: "",
		DicItemAccounts: {},
		LocQtyList: [],
		SelectedLocation: "",
		itmIsTaxedWhenBought: false,
		itmTaxExclusiveLastPurchasePrice: 0,
		itmTaxInclusiveLastPurchasePrice: 0,
		itmTaxExclusiveStandardCost: 0,
		itmTaxInclusiveStandardCost: 0,
		itmIsTaxedWhenSold: false,
		lstStockLoc: "",
		BaseSellingPrice: Number($("#BaseSellingPrice").val()),
		BaseSellingPriceDisplay: "",
		OnHandStock: 0,
		AbssQty: 0,
		DicItemLocQty: {},
		DicItemAbssQty: {},
		OutOfBalance: 0,
		LocStockIds: [],
		JsStockList: [],
		JsonJsStockList: "",
		DicLocQty:
			$infoblk.data("jsondiclocqty") == ""
				? []
				: $infoblk.data("jsondiclocqty"),
		NameDesc: "",
		AttrList:
			$infoblk.data("jsonattrlist") == "" ? [] : $infoblk.data("jsonattrlist"),
		SelectedAttrList4V: [],
		itmWeight: Number($("#itmWeight").val()),
		IsModifyAttr: false,
		TotalBaseStockQty: 0,
		catId: 0,
		ItemPromotions: [],
		hasSelectedIvs: false,
		singleProId: 0,
		hasItemVari: false,
		CategoryName: "",
		discpc: 0,
		ItemOptionsDisplay: "",
		ItemVariDisplay: "",
	};
}

function initSnVt(): ISnVt {
	return {
		pocode: "",
		sn: "",
		vt: "",
		selected: false,
	};
}

function initSerial(): ISerial {
	return {
		pocode: "",
		sn: "",
		seq: 0,
		vt: null,
		itemcode: "",
		selected: false,
	};
}


function initItemSnValidThru(): IItemSnBatVt {
	return {
		itemcode: "",
		batch: "",
		seq: 0,
		snvtlist: [],
		validthru: "",
	};
}
function initBatSnVt(): IBatSnVt {
	return {
		pocode: "",
		sn: "",
		batcode: "",
		vt: "",
		selected: false,
		status: "",
	};
}

function initItemSnSeqVtList(): IItemSnSeqVtList {
	return {
		itemcode: "",
		seq: 0,
		snseqvtlist: [],
	};
}
function initSnBatSeqVt(): ISnBatSeqVt {
	return {
		sn: "",
		batcode: null,
		snseq: 0,
		vt: null,
		seq: seq,
	};
}
function initItemSnVtList(): IItemSnVtList {
	return {
		itemcode: "",
		seq: 0,
		snvtlist: [],
	};
}
function initSerialNo(): ISerialNo {
	return {
		snoUID: 0,
		snoRtlSalesCode: "",
		snoRtlSalesSeq: 0,
		SalesDateDisplay: "",
		snoItemCode: "",
		snoCode: "",
		snoStatus: "",
		snoStockInCode: "",
		snoStockInSeq: 0,
		snoBatchCode: "",
		snoValidThru: "",
		StockInDateDisplay: "",
		itmNameDesc: "",
		wslSellUnit: "",
		wslValidThru: null,
		ValidThruDisplay: "",
		wslSellingPrice: 0,
		wslTaxPc: 0,
		wslTaxAmt: 0,
		wslLineDiscAmt: 0,
		wslLineDiscPc: 0,
		wslSalesAmt: 0,
		wslUID: 0,
		snValidThru: null,
		snSeq: 0,
		seq: seq,
	};
}

function fillAttribute($e: JQuery, attrval: string = ""): IAttribute {
	//console.log('e:', $e);
	return {
		attrId: $e.data("attid"),
		contactId: $e.data("contactid"),
		attrName: $e.data("attname"),
		attrType: $e.data("atttype"),
		attrIsDefault: false,
		attrIsGlobal: false,
		attrOrder: 0,
		iIsDefault: <number>$e.data("isdefault"),
		iIsGlobal: 0,
		AccountProfileId: $e.data("apid"),
		attrValue: attrval,
		CreateTime: "",
		ModifyTime: "",
		Id: "",
		attrValues: "",
		operator: "",
	};
}
function initAttribute(
	_customerId = 0,
	name = "",
	type = "",
	isdefault = 0,
	isglobal = 0,
	apId = 0,
	value: string = "",
	_attrId: string = ""
): IAttribute {
	return {
		attrId: _attrId,
		contactId: _customerId,
		attrName: name,
		attrType: type,
		attrIsDefault: false,
		attrIsGlobal: false,
		iIsDefault: isdefault,
		iIsGlobal: isglobal,
		attrOrder: 0,
		AccountProfileId: apId,
		attrValue: value,
		CreateTime: "",
		ModifyTime: "",
		Id: "",
		attrValues: "",
		operator: "",
	};
}
function plusBtn(
	btncls: string = "secondary",
	additionalcls: string = ""
): string {
	return `<button type="button" class="btn btn-${btncls} ${additionalcls}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
</svg>
              </button>`;
}
function handleCheckEnqAll(checked: boolean) {
	if (forenquirygroup) {
		EnIdList4Group = [];
		if (checked) {
			$(".enqchk").each(function (i, e) {
				if (!$(e).prop("disabled"))
					EnIdList4Group.push($(e).data("enid")); //MUST NOT data("id")!!!
			});

		} else {
			EnIdList4Group = [];
		}
	} else {
		EnIdList = [];
		if (checked) {
			$(".enqchk").each(function (i, e) {
				EnIdList.push($(e).data("id"));
			});

		} else {
			EnIdList = [];
		}
	}

}
$(".chk").on("input", function (e) {
	e.stopPropagation();
});
$(document).on("change", ".chk", function (e) {
	forcustomergroup = $(this).hasClass("group");
	if (forcustomer || forcoupon) {
		let code: string = ($(this).data("code")).toString();
		if ($(this).is(":checked") && !CodeList.includes(code)) {
			CodeList.push(code);
		} else {
			let codex = -1;
			$.each(CodeList, function (i, e) {
				if (e == code) {
					codex = i;
					return false;
				}
			});
			if (codex >= 0) {
				CodeList.splice(codex, 1);
			}
		}
	} else {
		let _id: number = <number>$(this).data("id");
		if ($(this).is(":checked") && !IdList.includes(_id)) {
			IdList.push(_id);
		} else {
			let idx = -1;
			$.each(IdList, function (i, e) {
				if (e == _id) {
					idx = i;
					//IdList.splice(i, 1);
					return false;
				}
			});
			if (idx >= 0) {
				IdList.splice(idx, 1);
			}
		}
	}
});
$(document).on("change", ".enqchk", function (e) {
	let id: string = <string>$(this).data("id");
	//console.log("AssignEnqIdList#change:", AssignEnqIdList);

	//if (forenquirygroup) {
	//	if ($(this).is(":checked") && !EnIdList4Group.includes(id)) {
	//		EnIdList4Group.push(id);
	//	} else {
	//		let idx = EnIdList4Group.findIndex(x => x == id);
	//		if (idx >= 0) {
	//			EnIdList4Group.splice(idx, 1);
	//		}
	//	}
	//} else {
	if ($(this).is(":checked") && !EnIdList.includes(id)) {
		EnIdList.push(id);
	} else {
		let idx = EnIdList.findIndex(x => x == id);
		if (idx >= 0) {
			EnIdList.splice(idx, 1);
		}
	}
	//}	
	//console.log("AssignEnqIdList#change:", AssignEnqIdList);
});
function handleChk(checked: boolean) {
	$(".chk").each(function (i, e) {
		if (!$(e).prop("disabled") && checked) {
			$(e).prop("checked", true);
		} else {
			$(e).prop("checked", false);
		}
	});
}
function handleEnqChk(checked: boolean) {
	$(".enqchk").each(function (i, e) {
		if (!$(e).prop("disabled") && checked) {
			$(e).prop("checked", true);
		} else {
			$(e).prop("checked", false);
		}
	});
}
$(document).on("change", "#chkenqall", function () {
	EnqCheckedAll = $(this).is(":checked");
	handleEnqChk(EnqCheckedAll);
	handleCheckEnqAll(EnqCheckedAll);
});
$(document).on("change", "#chkall", function () {
	if (forcoupon) gTblId = "tblCustomer";
	let checked: boolean = $(this).is(":checked");
	forcustomergroup = $(this).hasClass("group");
	handleChk(checked);
	handleCheckAll(checked);
});
function handleCheckAll(checked: boolean) {
	if (forcustomer || forcoupon) {
		CodeList = [];
		if (checked) {
			if ($(`#${gTblId} tbody tr`).length != PageSize) {
				$(".chk").each(function (i, e) {
					CodeList.push($(e).data("code"));
				});

			} else {
				CodeList = $infoblk.data("codelist");
			}
		} else {
			CodeList = [];
		}
		//console.log("CodeList:", CodeList);
	} else {
		IdList = [];
		if (checked) {
			if ($(`#${gTblId} tbody tr`).length != PageSize) {
				$(".chk").each(function (i, e) {
					IdList.push($(e).data("id"));
				});
			} else {
				IdList = $infoblk.data("idlist").split(",");
			}
		} else {
			IdList = [];
		}
	}

	$("#chkall").prop("checked", checked);
	//console.log("idlist:", IdList);
	icheckall = checked ? 1 : 0;

	if ($(".page-link").length) {
		$(".page-link").each(function (i, e) {
			if (!$(e).parent("li").hasClass("active")) {
				let href: string = <string>$(e).attr("href");
				href += `&CheckAll=${icheckall}`;
				$(e).attr("href", href);
				//console.log("href:" + $(e).attr("href"));
			}
		});
	}
}
function replacebreakline(str: string) {
	return str.replace(/\r?\n/g, "<br>");
}

$(document).on("click", "#dimmedcrm", function () {
	openCrmMarketingMsg($(this).data("msg"));
});

function openCrmMarketingMsg(msg: string) {
	$.fancyConfirm({
		title: "",
		message: msg,
		shownobtn: false,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				$("#dimmedcrm").trigger("focus");
			}
		},
	});
}

function initGraphSettings(): IGraphSettings {
	return {
		Id: 0,
		gsAppName: "",
		gsAuthority: "",
		gsClientId: "",
		gsRedirectUri: "",
		gsTenantId: "",
		gsClientSecretId: "",
		gsClientSecretVal: "",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
		gsEmailResponsible: "",
	};
}
function initCallHistory(): ICallHistory {
	return {
		Id: 0,
		chContactId: 0,
		chDateTime: "",
		chStatus: "",
		chDocumentName: "",
		chDocumentLink: "",
		strDateTime: "",
		chDateTimeDisplay: "",
		ContactName: "",
	};
}
function getGraphAuthority(tenantId: string): string {
	return (<string>$infoblk.data("defaultmsalauthority")).replace(
		"{0}",
		tenantId
	);
}

function initOneDrive(): IOneDrive {
	return {
		Id: "",
		odFileName: "",
		odFileLink: "",
		odFileWebUrl: "",
		odFileType: "",
		odFileSize: 0,
		odRemark: "",
		UploadTimeDisplay: "",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
		folder: {},
		package: {},
	};
}
function initHotList(ele: JQuery | null): IHotList {
	return ele === null
		? {
			Id: Number($("#Id").val()),
			hoName: <string>$("#hoName").val(),
			hoSalesmanResponsible: Number($("#drpSalesmen").val()),
			hoDescription: <string>$("#hoDescription").val(),
			CreateTimeDisplay: <string>$("#JsJournalDate").val(),
			ModifyTimeDisplay: <string>$("#ModifyTimeDisplay").val(),
			SalesPersonName: "",
			SalesmanList: [],
		}
		: {
			Id: Number($(ele).data("id")),
			hoName: <string>$(ele).data("name"),
			hoSalesmanResponsible: Number($(ele).data("salesmanresponsible")),
			hoDescription: <string>$(ele).data("desc"),
			CreateTimeDisplay: <string>$(ele).data("createtime"),
			ModifyTimeDisplay: <string>$(ele).data("modifytime"),
			SalesPersonName: <string>$(ele).data("salesmanname"),
			SalesmanList: [],
		};
}
function pagingRecords(records, containername) {
	var container = $(`#pagination-${containername}`);
	var options = {
		dataSource: records,
		locator: "",
		pageSize: <number>$infoblk.data("pagesize"),
		callback: function (response, pagination) {
			//window.console && console.log(response, pagination);
			if (containername == "enquiry") {
				//populateTblmails(response);
			} else if (containername == "actionlog_contact") {
				populateTblActionLog(response, "contact");
			} else if (containername == "assignedcontacts") {
				populateTblAssignedContacts(response);
			} else if (containername == "assignedenquiries") {
				populateTblAssignedEnquiries(response);
			} else if (containername == "groupsalesmen") {
				populateTblGroupSalesmen(response);
			} else {
				populateTblonedrives(response);
			}
		},
	};

	container.addHook("beforeInit", function () {
		window.console && console.log("beforeInit...");
	});
	container.pagination(options);

	container.addHook("beforePageOnClick", function () {
		window.console && console.log("beforePageOnClick...");
	});

	$("#totalcount").text(records.length);
}

function initGCombo(id: string, _val: string = ""): IGCombo {
	//console.log("_val:" + _val);
	if (_val && isNumber(_val)) _val = convertNumToString(_val);
	return {
		id: id,
		values: _val ? _val.split("||") : [],
	};
}

function initStockFilter(
	_pageIndex: number,
	_location: string,
	_keyword: string = ""
): IStockFilter {
	return {
		pageIndex: _pageIndex,
		includeStockInfo: true,
		location: _location,
		keyword: _keyword,
	};
}


function initCustomerFormData(customer: ICustomer): ICustomerFormData {
	return {
		model: structuredClone(customer),
		/*addressList: [],*/
		__RequestVerificationToken: <string>(
			$("input[name=__RequestVerificationToken]").val()
		),
	};
}
function initContactFormData(): IContactFormData {
	return {
		model: initContact(),
		AttributeList: [],
		__RequestVerificationToken: <string>(
			$("input[name=__RequestVerificationToken]").val()
		),
	};
}



function fillFullName() {
	let fullname = _firstname + " " + _lastname;
	$("#cusContact").val(fullname);
}

function toggleNames() {
	if (isorgan) {
		$("#namesblk").addClass("hide");
		$("#colastname").show();
		$("#cusName").trigger("focus");
	} else {
		$("#namesblk").removeClass("hide");
		$("#colastname").hide();
		$("#cusFirstName").trigger("focus");
	}
	_firstname = "";
	_lastname = "";
}


function initEmailSetting(): IEmailSetting {
	return {
		Id: <number>$("#Id").val(),
		emOffice365: <string>$("#emOffice365").val() == "True",
		iOffice365: <number>$("#iOffice365").val(),
		emSMTP_Server: <string>$("#emSMTP_Server").val(),
		emSMTP_Port: <number>$("#emSMTP_Port").val(),
		emSMTP_Auth:
			<string>$("#emOffice365").val() == "True" ||
			<string>$("#emSMTP_Auth").val() == "True",
		emSMTP_UserName: <string>$("#emSMTP_UserName").val(),
		emSMTP_Pass: <string>$("#emSMTP_Pass").val(),
		emSMTP_EnableSSL: $("#emSMTP_EnableSSL").val() == "True",
		emEmailsPerSecond: <number>$("#emEmailsPerSecond").val(),
		emMaxEmailsFailed: <number>$("#emMaxEmailsFailed").val(),
		emEmailTrackingURL: <string>$("#emEmailTrackingURL").val(),
		emEmail: <string>$("#emEmail").val(),
		emDisplayName: <string>$("#emDisplayName").val(),
		AccountProfileId: <number>$("#AccountProfileId").val(),
		emTestEmail: <string>$("#emTestEmail").val(),
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
	};
}
function initContact(): IContact {
	return {
		cusContactID: 0,
		AccountProfileId: 0,
		cusIsActive: false,
		cusCode: "",
		cusIsOrganization: false,
		cusName: "",
		cusFirstName: "",
		cusTitle: "",
		cusGender: "",
		cusContact: "",
		cusPhone: "",
		cusMobile: "",
		cusEmail: "",
		cusFax: "",
		cusAddrLocation: 0,
		cusAddrStreetLine1: "",
		cusAddrStreetLine2: "",
		cusAddrStreetLine3: "",
		cusAddrStreetLine4: "",
		cusAddrCity: "",
		cusAddrState: "",
		cusAddrPostcode: "",
		cusAddrCountry: "",
		cusAddrPhone1: "",
		cusAddrPhone2: "",
		cusAddrPhone3: "",
		cusAddrFax: "",
		cusAddrWeb: "",
		cusPriceLevel: "",
		cusPriceLevelID: "",
		cusPointsSoFar: 0,
		cusPointsActive: 0,
		cusPointsUsed: 0,
		CreateBy: "",
		CreateTimeDisplay: "",
		ModifyBy: "",
		ModifyTimeDisplay: "",
		cusCheckout: false,
		SalesPerson: {} as ISalesman,
		NameDisplay: "",
		FrmEnquiry: false,
		SelectedType: "",
		Attributes: [],
		AttributeList: [],
		JsonDefaultAttrVals: {},
		OverWrite: false,
		JsonAttributeList: "",
		IsActive: 1,
		IsOrganization: "",
		UnsubscribeTimeDisplay: "",
		DeleteTimeDisplay: "",
		cusEblastSubscribed: false,
		Organization: "",
	};
}


function getDateString(format = "ymd"): string {
	var m = new Date();
	var dateString;
	if (format == "ymd") {
		dateString =
			m.getFullYear() +
			"-" +
			("0" + (m.getMonth() + 1)).slice(-2) +
			"-" +
			("0" + m.getDate()).slice(-2) +
			" " +
			("0" + m.getHours()).slice(-2) +
			":" +
			("0" + m.getMinutes()).slice(-2);
	} else {
		dateString =
			("0" + m.getDate()).slice(-2) +
			" " +
			("0" + (m.getMonth() + 1)).slice(-2) +
			"-" +
			m.getFullYear() +
			"-" +
			("0" + m.getHours()).slice(-2) +
			":" +
			("0" + m.getMinutes()).slice(-2);
	}

	return dateString;
}


function getExtension(filename) {
	var parts = filename.split(".");
	return parts[parts.length - 1];
}

function isExcel(filename) {
	var ext = getExtension(filename);
	switch (ext.toLowerCase()) {
		case "xls":
		case "xlsm":
		//default:
		case "xlsx":
			return true;
	}
	return false;
}

function isImage(filename) {
	var ext = getExtension(filename);
	switch (ext.toLowerCase()) {
		case "jpg":
		case "gif":
		case "bmp":
		case "png":
			//etc
			return true;
	}
	return false;
}

function isVideo(filename) {
	var ext = getExtension(filename);
	switch (ext.toLowerCase()) {
		case "m4v":
		case "avi":
		case "mpg":
		case "mp4":
			// etc
			return true;
	}
	return false;
}

function convertBytesInMB(bytes: number): number {
	return bytes * 1000000;
}

function searchByAttribute(attribute: IAttribute, $frm: JQuery) {
	console.log("attribute:", attribute);
	//return false;
	$frm.append(
		$("<input />")
			.attr("type", "hidden")
			.attr("name", "attrName")
			.attr("value", attribute.attrName)
	);
	$frm.append(
		$("<input />")
			.attr("type", "hidden")
			.attr("name", "attrOperator")
			.attr("value", attribute.operator)
	);
	$frm.append(
		$("<input />")
			.attr("type", "hidden")
			.attr("name", "attrVal")
			.attr("value", attribute.attrValue)
	);
	$frm.trigger("submit");
}

function blinker() {
	$(".blinking").fadeOut(1000);
	$(".blinking").fadeIn(1000);
}

function populateTblAssignedEnquiries(response) {
	let dataHtml: string = "";
	$.each(response, function (i, e) {
		dataHtml += `<tr class="enquiry"><td style="width:110px;max-width:110px;">${e.enEmail}</td><td style="width:80px;max-width:80px;">${e.enPhone}</td><td style="width:90px;max-width:90px;">${e.enOrganization}</td><td style="width:80px;max-width:80px;">${e.enContact}</td>`;
		//if (iscrmadmin || iscrmsalesmanager) {
		dataHtml += `<td><button class="btn btn-danger btnunassignenquiry" type="button" data-salesmanid="${selectedSalesmanId}" data-enqid="${e.Id
			}" onclick="unassignEnquiry(${selectedSalesmanId},${e.Id
			});"><span class="small">${$infoblk.data(
				"unassigntxt"
			)}</span></button></td>`;
		//}
	});
	dataHtml += "</tr>";
	$("#tblassignedEnquiries tbody").empty().html(dataHtml);
	openAssignedEnquiryModal();
}
function populateTblAssignedContacts(response: Array<IContact>) {
	let dataHtml: string = "";
	$.each(response, function (i, e) {
		let tdwidth: number = iscrmadmin || iscrmsalesmanager ? 240 : 140;
		dataHtml += `<tr class="contact"><td style="width:160px;max-width:160px;">${e.cusEmail}</td><td style="width:90px;max-width:90px;">${e.cusPhone}</td><td style="width:130px;max-width:130px;">${e.Organization}</td><td style="width:80px;max-width:80px;">${e.cusContact}</td>`;
		if (iscrmadmin || iscrmsalesmanager) {
			dataHtml += `<td style="width:${tdwidth}px;max-width:${tdwidth}px"><button type="button" class="btn btn-primary btnassigntosales mx-2" data-salesmanid="${selectedSalesmanId}" data-contactid="${e.cusContactID
				}" onclick="assignToSales(${selectedSalesmanId},${e.cusContactID
				});"><span class="small">${assigntosalesmantxt}</span></button><button type="button" class="btn btn-danger btnunassigncontact" data-salesmanid="${selectedSalesmanId}" data-contactid="${e.cusContactID
				}" onclick="unassignContactFrmSalesman(${selectedSalesmanId},${e.cusContactID
				});"><span class="small">${$infoblk.data(
					"unassigntxt"
				)}</span></button></td>`;
		}
		dataHtml += `</tr>`;
	});
	$("#tblassignedContacts tbody").empty().html(dataHtml);
	openAssignedContactModal();
}

function populateTblGroupSalesmen(response: Array<ISalesman>) {
	//console.log('response:', response);
	let dataHtml: string = "";
	$.each(response, function (i, e) {
		dataHtml += `<tr class="salesman" data-salesmanid="${e.surUID}" ondblclick="selectSales4Assign(${e.surUID});"><td style="width:100px;max-width:100px;">${e.UserCode}</td><td style="width:120px;max-width:120px;">${e.UserName}</td><td style="width:160px;max-width:160px;">${e.Email}</td><td style="width:100px;max-width:100px;">${e.ManagerName}</td><td style="width:90px;max-width:90px"><button type="button" class="btn btn-primary btnsales mx-2" data-salesmanid="${e.surUID}" onclick="selectSales4Assign(${e.surUID});"><span class="small">${selecttxt}</span></button>`;
		dataHtml += `</td></tr>`;
	});
	$("#tblgroupSalesmen tbody").empty().html(dataHtml);
	openGroupSalesmenModal();
}
function changeCheckoutPortal(portal: string, direction: string) {
	console.log("portal:" + portal);
	let url;
	switch (direction) {
		case "export":
			url = `/DataTransfer/DayendsExportFrmShop?defaultCheckoutPortal=${portal}`;
			break;
		case "import":
			url = `/DataTransfer/DayendsImportFrmCentral?defaultCheckoutPortal=${portal}`;
			break;
		default:
		case "retail":
			url = `/POSFunc/Sales?defaultCheckoutPortal=${portal}`;
			break;
	}
	window.location.href = url;
}


function initSalesLn(_seq: number | undefined = 0): ISalesLn {
	//console.log("Sales@initsalseln:", Sales);
	//console.log("salescode#initsalesln:" + Sales.rtsCode);\
	return {
		rtlUID: 0,
		rtlSalesLoc: "",
		rtlDvc: "",
		rtlCode: Sales ? Sales.rtsCode : "",
		rtlDate: "",
		rtlSeq: _seq === undefined || _seq == 0 ? currentY + 1 : _seq,
		rtlRefSales: "",
		rtlReasonCode: "",
		rtlItemCode: selectedItemCode
			? selectedItemCode.toString()
			: getItemCodeBySeq(),
		rtlDesc: "",
		rtlStockLoc: "",
		rtlChkBch: false,
		rtlBatchCode: "",
		rtlItemColor: "",
		rtIsConsignIn: false,
		rtlIsConsignOut: false,
		rtlIsNoCharge: false,
		rtlHasSn: false,
		rtlChkSn: false,
		rtlSnReusable: false,
		rtlTaxCode: "",
		rtlTaxPc: 0,
		rtlSellUnit: "",
		rtlRrpTaxIncl: 0,
		rtlRrpTaxExcl: 0,
		rtlLineDiscAmt: 0,
		rtlLineDiscPc: 0,
		rtlDiscSpreadPc: 0,
		rtlQty: 0,
		rtlTaxAmt: 0,
		rtlSalesAmt: 0,
		rtlIndex1: 0,
		rtlIndex2: 0,
		rtlType: "",
		rtlSellingPrice: 0,
		rtlCheckout: false,
		rtlSellingPriceMinusInclTax: 0,
		rtlParentUID: 0,
		Item: {} as IItem,
		DelItems: [] as IDeliveryItem[],
		SalesDateDisplay: "",
		DepositAmt: 0,
		JsValidThru: "",
		dlCode: "",
		ivIdList: null,
		SelectedIvList: [],
		DicItemSNs: [],
		rtlHasSerialNo: false,
		JobID: 0,
		itemVariList: [],
		batchList: [],
		SettleDateDisplay: "",
	};
}


$(document).on("click", ".linkdisabled", function () {
	return false;
});

function initSelectListItem(): ISelectListItem {
	return {
		Disabled: false,
		Selected: false,
		Text: "",
		Value: "",
	};
}
function initPurchaseItem(): IPurchaseItem {
	return {
		pstId: 0,
		pstCode: "",
		itmCode: selectedItemCode
			? selectedItemCode.toString()
			: getItemCodeBySeq(),
		piSeq: currentY + 1,
		piBaseUnit: "",
		piQty: 0,
		batchList: [],
		piHasSN: false,
		piValidThru: null,
		piUnitPrice: 0,
		piDiscPc: 0,
		piTaxPc: 0,
		piTaxAmt: 0,
		piAmt: 0,
		piAmtPlusTax: 0,
		piReceivedQty: 1,
		piStatus: "",
		itmName: "",
		itmDesc: "",
		itmUseDesc: false,
		itmNameDesc: "",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
		JsValidThru: "",
		ValidThruDisplay: "",
		snbatseqvtlist: [],
		SerialNoList: [],
		returnedQty: 0,
		returnableQty: 0,
		qtyToReturn: 0,
		pstPurchaseDate: new Date(),
		PurchaseDateDisplay: "",
		piStockLoc: "",
		JobID: 0,
		vtList: [],
		comboIvId: "",
		SelectedIvList: [],
		hasSelectedIvs: false,
		singleProId: 0,
		poItemVariList: [],
		ivBatCode: "",
		Item: initItem(),
	};
}

function getCurrentY(ele) {
	return (
		parseInt(
			$(ele).parent("td").parent("tr").find("td:eq(0)").find("span").text()
		) - 1
	);
}


function handleQtyChange(this: any) {
	//console.log("here");
	getRowCurrentY.call(this);
	//console.log("$tr index:", $tr.index());
	let _qty: number = Number($(this).val());
	//console.log("_qty#0:", _qty);
	let $price, $discount, _price, _discpc;

	$price = $tr.find(".price");
	_price = Number($price.val());

	if (forsales) {
		$discount = $tr.find(".discpc");
		_discpc = Number($discount.val());
	}
	//console.log("$tr.index#qtychange:", $tr.index());
	//console.log("price#qty change:" + _price + ";_discpc:" + _discpc);

	if (forsales || forpreorder) {
		if ($(this).data("proqty")) {
			const proqty: number = Number($(this).data("proqty"));
			//console.log("proqty:",proqty);
			if (_qty >= proqty) {
				if ($(this).data("proprice")) {
					const proprice: string = formatnumber($(this).data("proprice"));
					const originalprice = Number($price.val());
					$price
						.data("originalprice", originalprice)
						.val(proprice)
						.trigger("change");
					return false;
				}
				if ($(this).data("prodiscpc")) {
					const prodiscpc: string = formatnumber($(this).data("prodiscpc"));
					const originaldiscpc: number = Number($discount.val());
					$discount
						.data("originaldiscpc", originaldiscpc)
						.val(prodiscpc)
						.trigger("change");
					return false;
				}
			}
			else {
				if ($(this).data("proprice")) {
					$price
						.val(formatnumber($price.data("originalprice")))
						.trigger("change");
					return false;
				}
				if ($(this).data("prodiscpc")) {
					$discount
						.val(formatnumber($discount.data("originaldiscpc")))
						.trigger("change");
					return false;
				}
			}
		} else {
			updateRow(_price, _discpc);
		}
	}

	if (forpurchase) {
		/*	if (Purchase.pstStatus !== "order"&&Purchase.pstStatus!=="created"&&Purchase.pstStatus!=="draft")*/
		let $received = $tr.find(".received");
		if ($received.length) $received.attr("max", _qty).val(_qty);

		updateRow(_price, _discpc);
		seq = currentY + 1;
		if (Purchase.PurchaseItems.length > 0) {
			$.each(Purchase.PurchaseItems, function (i, e) {
				if (e.piSeq == seq) {
					e.piQty = e.piReceivedQty = _qty;
					SelectedPurchaseItem = structuredClone(e);
					SelectedPurchaseItem.Item = ItemList.find(x => x.itmCode == e.itmCode)!;
					return false;
				}
			});
		}
	}

	if (forwholesales) {
		if (WholeSales.wsStatus == "invoice")
			$tr.find("td").last().find(".received").attr("max", _qty).val(_qty);

		updateRow(_price, _discpc);

		seq = currentY + 1;
		if (WholeSalesLns.length > 0) {
			$.each(WholeSalesLns, function (i, e) {
				if (e.wslSeq == seq) {
					if (WholeSales.wsStatus == "invoice") {
						e.wslDelQty = _qty;
					} else {
						e.wslQty = _qty;
					}
					SelectedWholeSalesLn = structuredClone(e);
					SelectedWholeSalesLn.Item = ItemList.find(x => x.itmCode == e.wslItemCode)!;
					return false;
				}
			});
		}
	}


	if (forIA) {
		let _cost = Number($tr.find(".unitcost").val());
		let _amt = _qty * _cost;
		$tr.find(".amt").data("amt", _amt).val(formatnumber(_amt));
	}

	//console.log("$tr.index#qtychange:", $tr.index());
}
$(document).on("change", ".unitcost", function () {
	getRowCurrentY.call(this);
	let _cost = Number($(this).val());
	if (forIA) {
		let _qty = Number($tr.find(".qty").val());
		let _amt = _qty * _cost;
		$tr.find(".amt").data("amt", _amt).val(formatnumber(_amt));
	}
});
$(document).on("change", ".qty", function () {
	handleQtyChange.call(this);
});

$(document).on("change", ".location", function () {
	handleLocationChange.call(this);
});

$(document).on("change", ".price", function () {
	// console.log("price changed");
	handlePriceChange.call(this);
});

$(document).on("change", ".discpc", function () {
	//console.log("disc changed");
	handleDiscChange.call(this);
});

$(document).on("change", ".taxpc", function () {
	//console.log("tax val:", $(this).val());
	if ($(this).val()) {
		//console.log("taxchange");
		handleTaxChange.call(this);
	}
});

function handleTaxChange(this: any) {
	//console.log("handletaxchange");
	getRowCurrentY.call(this);
	//console.log("itemcode:", $tr.find(".itemcode").val());
	if ($tr.find(".itemcode").val())
		updateRow(getRowPrice(), getRowDiscPc());
}

function getDicItemOptionsVariByCodes(
	itemcodelist: string[],
	$rows: JQuery,
	currentItemCount: number
) {
	var itemcodes = itemcodelist.join();
	$.ajax({
		type: "GET",
		url: "/Api/GetItemOptionsByCodes",
		data: { itemcodes },
		success: function (data: typeof DicItemOptions) {
			DicItemOptions = structuredClone(data);
			$rows.each(function (i, e) {
				let batcls = "";
				let sncls = "";
				let vtinput = "";
				let vtdisabled = "";
				let pointercls = "";
				if (i < currentItemCount) {
					selectedItemCode = $(e)
						.find(".itemcode")
						.val() as string;
					itemOptions = !$.isEmptyObject(DicItemOptions)
						? DicItemOptions[selectedItemCode]
						: null;
					if (itemOptions) {
						batcls = itemOptions.ChkBatch ? "pobatch pointer focus" : "disabled";
						sncls = itemOptions.ChkSN ? "posn pointer focus" : "disabled";
						vtdisabled =
							(itemOptions.ChkBatch || itemOptions.ChkSN) ? "disabled" : "";
						pointercls =
							(itemOptions.ChkBatch || itemOptions.ChkSN) ? "disabled" : "pointer";
						vtinput = itemOptions.WillExpire
							? `<input type="datetime" class="text-center flex datepicker validthru ${pointercls} focus " ${vtdisabled} />`
							: `<input type="datetime" class="text-center flex datepicker validthru" />`;
					}
				}
				let html = `<td class="sellbat text-center ip"><input type="text" class="text-center flex ${batcls}" readonly /></td>
				<td class="sellsn text-center ip"><input type="text" class="text-center flex ${sncls}" readonly /></td>
<td class="text-center flex sellvt ip" data-validthru="">${vtinput}</td>`;

				//itemvari
				let varicls = "";
				if (
					!$.isEmptyObject(DicItemGroupedVariations) &&
					selectedItemCode in DicItemGroupedVariations
				)
					varicls = "povari pointer focus";
				if (
					itemOptions?.ChkBatch &&
					!$.isEmptyObject(DicItemGroupedVariations) &&
					selectedItemCode in DicItemGroupedVariations
				)
					varicls = "povari pointer focus";
				//console.log("DicItemGroupedVariations:", DicItemGroupedVariations);
				html += `<td class="iv selliv text-center"><input type="text" class="text-center flex ${varicls}" readonly /></td>`;

				let $cell = $(e).find("td").eq(4);
				$cell.after(html);
				let qty: number = Number($cell.find(".qty").val());
				$(e).append(
					`<td class="treceived text-right"><input type="number" min="0" max="${qty}" class="text-right flex received" value="${qty}"></td>`
				);

				let seq = ($(e).data("idx") as number) + 1;
				$.each(Purchase.PurchaseItems, function (k, v) {
					if (v.piSeq == seq) {
						v.piReceivedQty = qty;
					}
				});
			});

			selectedItemCode = "";
			setValidThruDatePicker();
		},
		dataType: "json",
	});
}




function handleItmCodeSelected() {
	closeItemModal();
	seq = currentY + 1;
	if (forsales || forpreorder || forwholesales || forpurchase || forIA) {
		//console.log("here");
		GetSetSelectedLns(null);
	}
	else if (forEditReserve) toggleItemCodeChange();
	else {
		copiedItem = $.grep(ItemList, function (e: IItem, i: number) {
			return (
				e.itmCode.toString() == selectedItemCode.toString()
			);
		})[0];
		if (typeof copiedItem === "undefined") {
			searchItem();
		}
		copyItemAccount();
		toggleItemCodeChange();
	}

}
$(document).on("dblclick", ".itmcode", function () {
	selectedItemCode = $(this).data("code").toString();
	//console.log("selectedItemCode:", selectedItemCode);
	handleItmCodeSelected();
});


$(document).on("click", ".proItem", function (e) {
	handleProItemClick(e);
});


function toggleItemCodeChange(proId: number | null = 0) {
	$(".itemcode").off("change");
	if (forEditReserve) populateReserveRow();
	else populateSalesRow(proId);
	$(".itemcode").on("change", handleItemCodeChange);
}

function handleProItemClick(e: any) {
	e.stopPropagation();
	$target = $(e.target);
	isPromotion = true;
	selectedItemCode = $target.data("code");
	let proId = $target.data("proid");
	//console.log("proId:" + proId);
	//console.log(selectedItemCode);
	closeItemModal();
	seq = currentY + 1;
	if (forsales || forpreorder || forwholesales || forpurchase) {
		GetSetSelectedLns(proId);
	}
}


function GetSetSelectedLns(proId: any) {
	if (forsales) {
		selectedSalesLn = GetSetSelectedSalesLn();
		//console.log("selectedSalesLn#8871:", selectedSalesLn);//ok
		selectedSalesLn!.Item = ItemList.find((x) => x.itmCode == selectedItemCode)!;
		//console.log("selectedSalesLn.Item:", selectedSalesLn!.Item);
	}
	if (forpreorder) {
		selectedPreSalesLn = GetSetSelectedPreSalesLn();
		selectedPreSalesLn!.Item = ItemList.find(
			(x) => x.itmCode == selectedItemCode
		)!;
	}
	if (forwholesales) {
		SelectedWholeSalesLn = GetSetSelectedWholeSalesLn();
		SelectedWholeSalesLn!.Item = ItemList.find(
			(x) => x.itmCode == selectedItemCode
		)!;
	}
	if (forpurchase) {
		SelectedPurchaseItem = GetSetSelectedPurchaseItem();
		SelectedPurchaseItem!.Item = ItemList.find(
			(x) => x.itmCode == selectedItemCode
		)!;
		//console.log("SelectedPurchaseItem.Item:", SelectedPurchaseItem!.Item);
	}

	if (forIA) {
		SelectedIAL = GetSetSelectedIAL();
		//console.log("SelectedIAL#GetSetSelectedLns:", SelectedIAL);
	}
	toggleItemCodeChange(proId);
}
function GetSetSelectedIAL(): IIAL {
	var IAL = {} as IIAL;
	if (IALs && IALs.length > 0) {
		IAL = IALs.find(x => x.Seq == (currentY + 1)) as IIAL;
	}
	//console.log("IAL#0:", IAL);
	if (!IAL || (IAL && !IAL.JounralNumber && !IAL.itmCode)) {
		var item = ItemList.find(
			(x) => x.itmCode == selectedItemCode
		)!;
		IAL = {
			JounralNumber: IA.JournalNumber,
			Seq: $(`#${gTblId} tbody tr`).last().index() + 1,
			itmCode: selectedItemCode,
			NameDesc: item.NameDesc,
			UnitCost: item.itmSellUnitAvgCost ?? 0,
			AccountID: item.ExpenseAccountID
		} as IIAL;
	}
	//console.log("IAL#1:", IAL);
	return IAL;

}
function populateSalesRow(proId: number | null = 0, triggerChange: boolean = true) {
	//console.log("here");
	//console.log("selectedItemCode#popu:" + selectedItemCode);
	if (!selectedItemCode) return false;

	let $rows = $(`#${gTblId} tbody tr`);
	let $target = $rows.eq(currentY);
	//console.log($target);
	seq = currentY + 1;
	$target.data("qty", 1);

	let qty: number = 1,
		qtysellable: number = 0,
		price: number = 0,
		discpc: number = 0,
		taxpc: number = GetTaxPc();

	let amount: number = 0;
	let namedesctxt: string;
	let namedesc: string = "";

	selectedProId = proId ?? 0;
	//console.log("selectedSalesLn!.Item:", selectedSalesLn!.Item);

	if (forsales) {
		//console.log("selectedSalesLn#popu:", selectedSalesLn);
		discpc = (selectedSalesLn && selectedSalesLn!.rtlLineDiscPc) ?? 0;
		if (reviewmode) { //salesorderlist
			selectedSimpleSalesLn!.rtlSeq = seq;
			selectedSimpleSalesLn!.Item.singleProId = proId;
			namedesc = selectedSimpleSalesLn!.Item.NameDesc;
			qtysellable = selectedSimpleSalesLn!.Item.QtySellable;
		} else {
			selectedSalesLn!.rtlSeq = seq;
			selectedSalesLn!.Item.singleProId = proId;
			namedesc = selectedSalesLn!.Item.NameDesc;
			qtysellable = selectedSalesLn!.Item.QtySellable;
		}

	}
	if (forpreorder && selectedPreSalesLn) {
		discpc = selectedPreSalesLn!.rtlLineDiscPc ?? 0;
		selectedPreSalesLn!.rtlSeq = seq;
		selectedPreSalesLn!.Item.singleProId = proId;
		namedesc = selectedPreSalesLn!.Item.NameDesc;
		qtysellable = selectedPreSalesLn!.Item.QtySellable;
	}
	if (forwholesales && SelectedWholeSalesLn) {
		discpc = SelectedWholeSalesLn!.wslLineDiscPc ?? 0;
		SelectedWholeSalesLn!.wslSeq = seq;
		SelectedWholeSalesLn!.Item.singleProId = proId;
		namedesc = SelectedWholeSalesLn!.Item.NameDesc;
		qtysellable = SelectedWholeSalesLn!.Item.QtySellable;
	}
	if (forpurchase && SelectedPurchaseItem) {
		discpc = SelectedPurchaseItem!.piDiscPc ?? 0;
		SelectedPurchaseItem!.piSeq = seq;
		namedesc = SelectedPurchaseItem!.Item.NameDesc;
	}
	if (forIA && SelectedIAL) namedesc = SelectedIAL.NameDesc;


	const rowcls: string = isPromotion ? "promotion" : "";
	$target.find("td").first().addClass(rowcls);

	namedesctxt = handleItemDesc(namedesc);

	let $itemcode = $target.find(".itemcode");
	$itemcode.off("change");
	$target.find(".itemcode").val(selectedItemCode);
	$itemcode.on("change", handleItemCodeChange);

	let $itemdesc = $target.find(".itemdesc");
	$itemdesc.off("change");
	$itemdesc
		.data("itemname", namedesctxt)
		.attr("title", namedesc)
		.val(namedesctxt);
	$itemdesc.on("change", handleItemDescChange);

	if (forpurchase) {
		$target
			.find(".baseunit")
			.data("baseunit", SelectedPurchaseItem!.Item.itmBuyUnit)
			.val(SelectedPurchaseItem!.Item.itmBuyUnit);
	}

	let sellunit = "";
	if (forwholesales) {
		sellunit = SelectedWholeSalesLn!.Item.itmSellUnit;
	}
	if (forsales) {
		sellunit = reviewmode ? selectedSimpleSalesLn!.Item.itmSellUnit : selectedSalesLn!.Item.itmSellUnit;
	}
	if (forpreorder) {
		sellunit = selectedPreSalesLn!.Item.itmSellUnit;
	}

	$target
		.find(".sellunit")
		.data("sellunit", sellunit)
		.val(sellunit);

	// console.log(seqitem!.ItemPromotions);
	let proqty: number = 0;
	let proprice: number | null = 0;
	let prodiscpc: number | null = 0;
	if (isPromotion) {
		//console.log("proId:" + proId);
		if (forsales) {
			if (reviewmode) getItemPromotion(selectedSimpleSalesLn!.Item, proId!);
			else getItemPromotion(selectedSalesLn!.Item, proId!);
		}
		if (forpreorder) {
			getItemPromotion(selectedPreSalesLn!.Item, proId!);
		}
		if (forwholesales) {
			getItemPromotion(SelectedWholeSalesLn!.Item, proId!);
		}
		proqty = itemPromotion!.proQty!;
		proprice = itemPromotion!.proDiscPc === 0 ? itemPromotion!.proPrice : 0;
		prodiscpc = itemPromotion!.proDiscPc! > 0 ? itemPromotion!.proDiscPc : 0;
	}


	let $qty = $target.find(".qty");
	$qty.off("change");
	$qty.val(qty).data({
		proqty: proqty,
		proprice: proprice,
		prodiscpc: prodiscpc,
		qtysellable: qtysellable,
	});
	$qty.on("change", handleQtyChange);

	let batmsg: string = "";
	let snmsg: string = "";
	let vtmsg: string = "";
	let missingtxt: string = "";
	let batcls = "batch";
	let sncls = "serialno";
	let vtcls = "datepicker validthru";
	let pointercls = "";

	itemOptions = DicItemOptions[selectedItemCode];

	//console.log(itemOptions);

	const $bat = $target.find(".batch");

	const $sn = $target.find(".serialno");

	const $vt = $target.find(".validthru");

	const $iv = $target.find(".vari");

	const readonly =
		!itemOptions.ChkBatch && !itemOptions.ChkSN && !itemOptions.WillExpire
			? ""
			: "readonly";
	const nonitemoptionscls =
		!itemOptions.ChkBatch && !itemOptions.ChkSN && !itemOptions.WillExpire
			? "nonitemoptions"
			: "";

	if ((forsales && !reviewmode) || (forpreorder && PreSales.rtsStatus == SalesStatus.presettling)) {
		$bat.data("type", "bat");
		if (itemOptions.ChkBatch) {
			batcls = `batch pointer focus`;
			//console.log("selectedItemCode:" + selectedItemCode);
			//console.log("DicItemBatchQty[selectedItemCode].length:", DicItemBatchQty[selectedItemCode].length);
			if (DicItemBatchQty[selectedItemCode].length === 0) {
				missingtxt = itemoptionsinfomissingformat.replace("{0}", batchtxt);
				batcls = "itemoptionmissing";
				batmsg = `${missingtxt} ${purchaserequiredmsg}`;
			}
			//console.log("batcls:" + batcls);
			$bat.addClass(batcls);
		}
		else {
			$bat.removeClass("pointer focus");
			if (
				!itemOptions.ChkBatch &&
				!itemOptions.ChkSN &&
				!itemOptions.WillExpire
			)
				$bat.addClass(nonitemoptionscls);
		}
		if (readonly !== "") $bat.prop("readonly", true);
		$bat.prop("title", batmsg);
	}
	else {
		if (reviewmode) {
			if (itemOptions.ChkBatch) $bat.addClass("pointer").val("...");
		} else {
			if (itemOptions.ChkBatch) $bat.addClass("focus");
			else $bat.removeClass("batch pointer");
		}
	}

	if ((forsales && !reviewmode) || (forpreorder && PreSales.rtsStatus == SalesStatus.presettling)) {
		$sn.data("type", "sn");

		if (itemOptions.ChkSN) {
			sncls = `serialno pointer focus`;
			if (itemOptions.ChkBatch) {
				if (DicItemSnVtList[selectedItemCode].length === 0) {
					missingtxt = itemoptionsinfomissingformat.replace(
						"{0}",
						serialnotxt
					);
					sncls = "itemoptionmissing";
					snmsg = `${missingtxt} ${purchaserequiredmsg}`;
				} else {
					sncls = "focus";
				}
			} else {
				if (DicItemSnVtList[selectedItemCode].length === 0) {
					missingtxt = itemoptionsinfomissingformat.replace(
						"{0}",
						serialnotxt
					);
					sncls = "itemoptionmissing";
					snmsg = `${missingtxt} ${purchaserequiredmsg}`;
				}
			}
			$sn.addClass(sncls);
		} else {
			$sn.removeClass("pointer focus");
			if (
				!itemOptions.ChkBatch &&
				!itemOptions.ChkSN &&
				!itemOptions.WillExpire
			)
				$sn.addClass(nonitemoptionscls);
		}

		if (readonly !== "") {
			$sn.prop("readonly", true);
		}
		$sn.prop("title", snmsg);
	}
	else {
		if (reviewmode) {
			if (itemOptions.ChkSN) $sn.addClass("pointer").val("...");
		}
		else {
			if (itemOptions.ChkSN) {
				$sn.addClass("focus");
				if (itemOptions.ChkBatch) $sn.removeClass("pointer");
			} else {
				$sn.removeClass("serialno pointer");
			}
		}
	}

	if ((forsales && !reviewmode) || (forpreorder && PreSales.rtsStatus == SalesStatus.presettling)) {
		$vt.data("type", "vt");
		$vt.removeClass("datepicker");
		//console.log("itemoptions:", itemOptions);
		let vtdisabled = "";
		if (itemOptions.WillExpire) {
			vtdisabled = (itemOptions.ChkBatch || itemOptions.ChkSN)
				? "disabled"
				: "";
			vtcls = "validthru focus";
			pointercls =
				(itemOptions.ChkBatch || itemOptions.ChkSN) ? "" : "pointer";
			if (!(selectedItemCode in DicItemVtQtyList)) {
				missingtxt = itemoptionsinfomissingformat.replace(
					"{0}",
					expirydatetxt
				);
				vtmsg = `${missingtxt} ${purchaserequiredmsg}`;
				vtcls = "itemoptionmissing";
			} else {
				if (
					DicItemVtQtyList[selectedItemCode].length === 0 &&
					!itemOptions.ChkBatch &&
					!itemOptions.ChkSN
				) {
					missingtxt = itemoptionsinfomissingformat.replace(
						"{0}",
						expirydatetxt
					);
					vtmsg = `${missingtxt} ${purchaserequiredmsg}`;
					vtcls = "itemoptionmissing";
				}
			}
			//console.log("vtdisabled:" + vtdisabled + ";vtcls:" + vtcls);
			vtcls += ` ${pointercls}`;
		}
		else {
			$vt.removeClass("pointer focus").datepicker("disable");
			if (
				!itemOptions.ChkBatch &&
				!itemOptions.ChkSN &&
				!itemOptions.WillExpire
			)
				$vt.addClass(nonitemoptionscls);
		}

		//console.log(`(vtdisabled !== ""):`, (vtdisabled !== ""));
		$vt.prop("disabled", (vtdisabled !== ""));

		if (readonly !== "") $vt.prop("readonly", true);

		$vt.addClass(vtcls).prop("title", vtmsg);
	}
	else {
		if (reviewmode) {
			if (itemOptions.WillExpire) $vt.addClass("pointer").val("...").datepicker("disable");
		} else {
			if (itemOptions.WillExpire) {
				if (itemOptions.ChkBatch || itemOptions.ChkSN) {
					$vt.removeClass("pointer").datepicker("disable");
				}
			} else {
				$vt.removeClass("validthru pointer").datepicker("disable");
			}
		}
	}

	if (
		(forpurchase &&
			editmode &&
			Purchase.pstStatus !== "order" &&
			Purchase.pstStatus.toLowerCase() !== "requesting" &&
			Purchase.pstStatus.toLowerCase() !== "created" &&
			Purchase.pstStatus.toLowerCase() !== "rejected") ||
		forsales ||
		forpreorder
	) {
		initVTDatePicker();
	}

	if ((forsales && !reviewmode) || (forpreorder && PreSales.rtsStatus == SalesStatus.prestart) || forwholesales) {
		let itemcode = selectedItemCode;
		let ivpointer =
			!itemOptions.ChkBatch && !itemOptions.ChkSN && !itemOptions.WillExpire
				? "pointer"
				: "";
		//console.log("ivpointer:" + ivpointer);
		let ivcls =
			!$.isEmptyObject(DicIvInfo) &&
				itemcode in DicIvInfo &&
				DicIvInfo[itemcode].length > 0
				? `focus ${ivpointer}`
				: "disabled";
		//itemvari
		$iv.addClass(ivcls);
	}
	if (forsales && reviewmode) {
		const vari = selectedSimpleSalesLn!.ivIdList ? "..." : "";
		$iv.addClass("pointer").val(vari);
	}

	if (forsales || forpreorder || forpurchase || forwholesales) {

		if (forsales || forpreorder) {
			//idx = PriceIdx4Sales;
			if (selectedItemCode.toString().startsWith("/")) {
				price = 0;
			} else {
				if (selectedCus.cusCode.toLowerCase() !== "guest") {
					//console.log("selectedCus:", selectedCus);
					if (selectedCus.CustomerItems) {
						const proItems = selectedCus.CustomerItems.filter(
							(x) => x.itmCode == selectedItemCode
						);
						const proItem =
							proItems != null && proItems.length ? proItems[0] : null;
						if (proItem == null) {
							//console.log(selectedSalesLn!.Item);
							price = forsales
								? reviewmode ? getActualPrice(selectedSimpleSalesLn!.Item) : getActualPrice(selectedSalesLn!.Item)
								: getActualPrice(selectedPreSalesLn!.Item);
							$target.find("td").first().removeClass("lastsellingprice");
						} else {
							price = proItem.LastSellingPrice;
							$target.find("td").first().addClass("lastsellingprice");
						}
					} else {
						//console.log(selectedPreSalesLn!.Item.itmBaseSellingPrice);
						price = forsales
							? reviewmode ? getActualPrice(selectedSimpleSalesLn!.Item) : getActualPrice(selectedSalesLn!.Item)
							: getActualPrice(selectedPreSalesLn!.Item);
						$target.find("td").first().removeClass("lastsellingprice");
					}
				} else {
					price = forsales
						? reviewmode ? getActualPrice(selectedSimpleSalesLn!.Item) : getActualPrice(selectedSalesLn!.Item)
						: getActualPrice(selectedPreSalesLn!.Item);
					$target.find("td").first().removeClass("lastsellingprice");
				}
			}
			//price = price * exRate;
			//console.log("price:" + price);
			if (forsales) reviewmode ? selectedSimpleSalesLn!.rtlSellingPrice = price : selectedSalesLn!.rtlSellingPrice = price;
			if (forpreorder) selectedPreSalesLn!.rtlSellingPrice = price;
		}

		if (forpurchase) {
			//console.log("selectedPurchaseItem!.Item:", selectedPurchaseItem!.Item);
			price = Number(SelectedPurchaseItem!.Item.itmBuyStdCost);
			//console.log("price#popu:" + price);
			SelectedPurchaseItem!.piUnitPrice = price;
		}
		if (forwholesales) {
			price = Number(SelectedWholeSalesLn!.Item.itmBaseSellingPrice);
			SelectedWholeSalesLn!.wslSellingPrice = price;
		}

		/*price = price / exRate;*/
		let $price = $target
			.find(".price");
		$price.off("change");
		$price.data("price", price)
			.val(formatnumber(price));
		$price.on("change", handlePriceChange);

		if (isPromotion && proId) {
			if (itemPromotion && itemPromotion.pro4Period) {
				discpc = itemPromotion.proDiscPc!;
			}
		}

		let $discpc = $target.find(".discpc");
		$discpc.off("change");
		//console.log("formated discpc:" + formatnumber(discpc));
		$discpc.data("discpc", discpc).val(formatnumber(discpc));
		$discpc.on("change", handleDiscChange);
		//console.log("$discpc val:" + $discpc.val());
		//console.log("enableTax:", enableTax);
		//console.log("triggerchange:", triggerChange);
		if (!enableTax && triggerChange) $discpc.trigger("change");


		if (enableTax && !inclusivetax) {
			let $tax = $target.find(".taxpc");
			$tax.data("taxpc", taxpc)
				.prop("readonly", true);
			$tax.off("change");
			$tax.val(formatnumber(taxpc));
			$tax.on("change", handleTaxChange);

			//console.log("triggerChange:", triggerChange);
			if (triggerChange) $tax.trigger("change");
		}

		if (forsales || forpurchase || forwholesales || forpreorder) {
			amount = calAmountPlusTax(qty, price, taxpc, discpc);
			//console.log("amount:" + amount);
		}

		itotalamt += amount;
		if (typeof itotalamt != "number") {
			alert("itotalamt is not a number type!");
			return false;
		}

		$target
			.find("td")
			.last()
			.find(".amount")
			.data("amt", amount)
			.data("amount", amount)
			.val(formatnumber(amount));
	}

	if (forIA && SelectedIAL) {
		$target.find(".unitcost").data("unitcost", SelectedIAL!.UnitCost).val(formatnumber(SelectedIAL!.UnitCost));
		let acno: string | undefined = DicAcAccounts["COS"].find(x => x.AccountID == SelectedIAL!.AccountID)?.AccountNumber;
		$target.find(".acno").val(acno ?? "");

		$target.find(".amt").data("amt", SelectedIAL.UnitCost).val(formatnumber(SelectedIAL.UnitCost));
	}

	selectedItemCode = "";
	selectedSalesLn = null;
	SelectedWholeSalesLn = null;
	SelectedPurchaseItem = null;
	selectedPreSalesLn = null;
	//SelectedIAL = null;

	if (forIA) {
		//cleanUpIALs();
		IALs.push(SelectedIAL);
		addIALRow();
	} else {
		if ($rows.eq($rows.length).length) {
			focusItemCode($rows.length);
		}
		else if ($rows.eq(currentY + 1).length) {
			if (
				$rows
					.eq(currentY + 1)
					.find(".itemcode")
					.val() !== ""
			) {
				if (!$rows.eq($rows.length - 1).length) {
					addRow();
				}
			} else {
				focusItemCode(currentY + 1);
			}
		} else {
			addRow();
		}
	}
}


function getItemPromotion(item: IItem | ISimpleItem, proId: number) {
	if (isPromotion && item.ItemPromotions) {
		// console.log("seqitem itempromotions:", seqitem.ItemPromotions);
		itemPromotion = item.ItemPromotions.filter(function (el) {
			return el.proId == proId;
		})[0];
		// console.log(itemPromotion);
	}
}
function addRow() {
	$target = $(`#${gTblId} tbody`);
	let idx = $target.find("tr").length;
	let i = idx + 1;
	let html = "";
	let unitcls = forpurchase ? "baseunit" : "sellunit";
	html = `<tr>
							<td class="text-center seq">${i}</td>
							<td class="text-center code"><input type="text" name="itemcode" class="form-control itemcode text-center flex"  /></td>
							<td class="text-center namedesc"><input type="text" readonly class="itemdesc small flex form-control text-center" /></td>
							<td class="text-right unit"><input type="text" readonly class="${unitcls} text-right flex form-control" /></td>
							<td class="text-right sellqty"><input type="number" class="qty text-right flex form-control" />`;

	let showbat = false;
	let batcls = "batch";
	let readonly = "";
	if (forsales ||
		(forwholesales && editmode && WholeSales.wsStatus == "invoice") ||
		fordelivery ||
		(forpurchase &&
			editmode &&
			Purchase.pstStatus !== "order" &&
			Purchase.pstStatus.toLowerCase() !== "requesting" &&
			Purchase.pstStatus.toLowerCase() !== "created" &&
			Purchase.pstStatus.toLowerCase() !== "rejected")
	) {
		//html += `<td class="form-control text-center"><input type="text" class="batch form-control text-center pointer flex" readonly /></td>`;
		readonly = "readonly";
		batcls += " pointer";
		showbat = true;
	}
	let disabled = "";
	if (forpreorder) {
		disabled = PreSales && PreSales.rtsStatus == SalesStatus.presettling ? "" : "disabled";
		batcls =
			PreSales.rtsStatus == SalesStatus.presettling ? "batch" : `b ${disabled}`;
		showbat = true;
	}

	let showsn = false;
	let sncls = "serialno";
	if (forsales ||
		(forpurchase &&
			editmode &&
			Purchase.pstStatus !== "order" &&
			Purchase.pstStatus.toLowerCase() !== "requesting" &&
			Purchase.pstStatus.toLowerCase() !== "created" &&
			Purchase.pstStatus.toLowerCase() !== "rejected") ||
		(forwholesales && editmode && WholeSales.wsStatus == "invoice") ||
		fordelivery
	) {
		sncls += " pointer";
		readonly = "readonly";
		showsn = true;
	}

	if (forpreorder) {
		sncls =
			PreSales.rtsStatus == SalesStatus.presettling
				? "serialno"
				: `s ${disabled}`;
		showsn = true;
		//html += `<td class="form-control text-center"><input type="text" class="${sncls} form-control text-center flex" ${disabled} /></td>`;
	}

	let showvt = false;
	let vtcls = "validthru datepicker"; //don't add small here!
	if (
		forpurchase &&
		editmode &&
		Purchase.pstStatus !== "order" &&
		Purchase.pstStatus.toLowerCase() !== "requesting" &&
		Purchase.pstStatus.toLowerCase() !== "created" &&
		Purchase.pstStatus.toLowerCase() !== "rejected"
	) {
		//html +=
		//	'<td class="form-control text-center"><input type="datetime" name="validthru" class="validthru small datepicker form-control text-center pointer flex" /></td>';
		vtcls += "pointer";
		showvt = true;
	}


	if (forsales ||
		(forwholesales && editmode &&
			WholeSales.wsStatus != "order" &&
			WholeSales.wsStatus.toLowerCase() !== "requesting" &&
			WholeSales.wsStatus.toLowerCase() !== "created" &&
			WholeSales.wsStatus.toLowerCase() !== "rejected")
	) {
		vtcls += "pointer";
		showvt = true;
	}
	//html += `<td class="form-control text-center"><input type="text" class="${vtcls.trim()} form-control text-center flex" /></td>`;
	//console.log("vtcls:" + vtcls);
	if (forpreorder) {
		if (!(PreSales.rtsStatus == SalesStatus.presettling)) {
			vtcls = `v ${disabled}`;
			showvt = true;
		}
	}


	//to be added other classes later
	if (showbat)
		html += `<td class="text-center sellbat"><input type="text" class="text-center flex form-control ${batcls}" ${readonly} ${disabled} /></td>`;
	if (showsn)
		html += `<td class="text-center sellsn"><input type="text" class="text-center flex form-control ${sncls}" ${readonly} ${disabled} /></td>`;
	if (showvt)
		html += `<td class="text-center sellvt"><input type="text" class="${vtcls.trim()} text-center flex form-control" ${disabled} /></td>`;

	//item variations:
	if (forsales || forpreorder) {
		html += `<td class="text-center selliv""><input type="text" class="vari form-control text-center flex" /></td>`;
	}

	let p_readonly: string = "",
		d_readonly: string = "";
	if (forsales || forpreorder) {
		if (!priceeditable) {
			p_readonly = "readonly";
		}
		if (!disceditable) {
			d_readonly = "readonly";
		}
	}
	if (forsales || forpreorder || forpurchase || forwholesales || fordelivery) {
		html += `<td class="text-right sellprice num">
								<input type="text" class="price text-right flex form-control number" ${p_readonly} />
							</td>
							<td class="text-right selldiscpc num">
								<input type="text" class="discpc text-right flex form-control number" ${d_readonly} />
							</td>`;
	}
	// console.log("inclusivetax:", inclusivetax);
	if (
		forsales ||
		forpreorder ||
		forpurchase ||
		forwholesales
		// && enableTax && !inclusivetax
	) {
		html += `<td class="selltax text-right num">
								<input type="text" class="taxpc text-right flex form-control number" readonly />
							</td>`;
	}

	html += `<td class="text-center selllocation">							
								<select class="location flex form-control text-center">
									${setLocationListOptions(shop)}
								</select>
							</td>
							<td class="text-center selljob">
								<select class="job flex form-control text-center">
									${setJobListOptions(0)}
								</select>
									</td>`;


	html += `<td class="text-right sellamt num"><input type="text" class="amount text-right flex form-control" readonly /></td>`;


	if (
		forpurchase &&
		editmode &&
		Purchase.pstStatus !== "order" &&
		Purchase.pstStatus.toLowerCase() !== "requesting" &&
		Purchase.pstStatus.toLowerCase() !== "created" &&
		Purchase.pstStatus.toLowerCase() !== "rejected"
	) {
		html +=
			'<td class="text-right poreceived"><input type="number" name="received" min="0" class="received form-control text-right flex" style="width:90px!important;" /></td>';
	}

	html += "</tr>";


	$target.append(html);

	if (approvalmode && idx === 0 && $(".itemcode").val() == "") {
		$("#drpSalesman").trigger("focus");
	} else {
		focusItemCode(idx);
	}
}
function initVTDatePicker() {
	//console.log("ready to initvtdatepicker...");
	$(".validthru.datepicker").datepicker({
		dateFormat: jsdateformat, beforeShow: function () {
			setTimeout(function () {
				$('.ui-datepicker').css('z-index', 99999999999999);
			}, 0);
		}
	});
}
function setLocationListOptions(shop: string) {
	let locations: string = "";
	for (const [key, value] of Object.entries(DicLocation)) {
		//default primary location:
		let selected: string = key == shop ? "selected" : "";
		locations += `<option value='${key}' ${selected}>${value}</option>`;
	}
	return locations;
}

function setJobListOptions(selectedJobId: number = 0) {
	let jobs: string = `<option value="0">---</option>`;
	MyobJobList.forEach((x) => {
		const selected: string = selectedJobId == x.JobID ? "selected" : "";
		jobs += `<option value='${x.JobID}' ${selected}>${x.JobName}</option>`;
	});
	return jobs;
}
function focusItemCode(idx: number = -1) {
	//console.log('optional idx#focusitemcode:' + idx);
	$target = $(`#${gTblId} tbody tr`);
	if (typeof idx === "undefined") {
		$target.each(function (i, e) {
			let $itemcode = $(e).find(".itemcode");
			if ($itemcode.val() === "") {
				/* setTimeout(function () {*/
				$itemcode.trigger("focus");
				/*}, 3000);*/
				/* $itemcode.trigger('focus');*/
				//console.log('focus set;i:' + i);
				return false;
			}
		});
	} else {
		//console.log('setting focus...');
		$target.eq(idx).find(".itemcode").trigger("focus");
	}
}

function fillInDelDetail(arr: string[], title: string) {
	let html = `<h4>${title}</h4><table Id="" class="table table-bordered table-striped table-hover table-condensed">`;
	$.each(arr, function (i, e) {
		html += "<tr>";
		html += `<td>${e}</td>`;
		html += `</tr>`;
	});
	html += "</table>";
	$.fancyConfirm({
		title: "",
		message: html,
		shownobtn: false,
		okButton: oktxt,
		noButton: notxt,
	});
}

$(document).on("dblclick", ".serialno.pointer", function () {
	getRowCurrentY.call(this);
	//console.log("here");
	let hasFocusCls: boolean = $(this).hasClass("focus");

	selectedItemCode = <string>$tr.find(".itemcode").val();
	// console.log("selecteditemcode:" + selectedItemCode);	
	seq = forrefund ? currentY : currentY + 1;
	// console.log("seq:" + seq);

	if (selectedItemCode === "") {
		$.fancyConfirm({
			title: "",
			message: emptyitemwarning,
			shownobtn: false,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					$tr
						.find(".itemcode")
						.trigger("focus");
				}
			},
		});
	} else {
		if (forpurchase || forwholesales || forsales || forpreorder || forrefund) {
			if (forwholesales || forsales || forpreorder || forrefund) {
				itemOptions = DicItemOptions[selectedItemCode];
				if (forwholesales) {
					if (
						WholeSales.wsStatus == "deliver" ||
						WholeSales.wsStatus == "partialdeliver"
					) {
						DeliveryItems = DicSeqDeliveryItems[seq];
					}
					SelectedWholeSalesLn = WholeSalesLns.find(
						(x) => x.wslSeq == seq
					) as IWholeSalesLn;
				}
			}

			if (forsales || forrefund) {
				if (reviewmode) {
					DeliveryItems = DicSeqDeliveryItems[seq];
					selectedSimpleSalesLn = SimpleSalesLns.find((x) => x.rtlSeq == seq) as ISimpleSalesLn;

					DeliveryItems.forEach((x) => {
						if (x.seq == seq) {
							snvtlist.push({
								pocode: x.pstCode,
								sn: x.snoCode ?? "",
								vt: x.VtDisplay,
							} as ISnVt);
						}
					});
				} else {
					if (DicItemSnVtList && selectedItemCode in DicItemSnVtList)
						snvtlist = DicItemSnVtList[selectedItemCode].slice(0);
					selectedSalesLn = $.grep(SalesLnList, function (e, i) {
						return e.rtlSeq == seq;
					})[0];
				}
			}

			if (forpreorder) {
				if (DicItemSnVtList && selectedItemCode in DicItemSnVtList)
					snvtlist = DicItemSnVtList[selectedItemCode].slice(0);
				selectedPreSalesLn = $.grep(PreSalesLnList, function (e, i) {
					return e.rtlSeq == seq;
				})[0];
			}

			if (editmode) {
				if (forpurchase) {
					toggleSnVt();
					$.each(Purchase.PurchaseItems, function (i, e) {
						if (e.piSeq == seq) {
							SelectedPurchaseItem = structuredClone(e);
						}
					});
				}

				if (forwholesales) {
					if (WholeSales.wsStatus == "invoice") {
						snvtlist = DicItemSnVtList[selectedItemCode].slice(0);
					}
					if (
						WholeSales.wsStatus.toLowerCase() === "deliver" ||
						WholeSales.wsStatus.toLowerCase() === "partialdeliver"
					) {
						DeliveryItems.forEach((x) => {
							if (x.seq == seq) {
								snvtlist.push({
									pocode: x.pstCode,
									sn: x.snoCode ?? "",
									vt: x.VtDisplay,
								} as ISnVt);
							}
						});
					}

					//for itemnamedesc display only:
					$.each(WholeSalesLns, function (i, e) {
						if (e.wslSeq == seq) {
							SelectedWholeSalesLn = structuredClone(e);
						}
					});
				}
			}
			else {
				if (forpurchase) {
					if (purchaseitems.length > 0) {
						$.each(purchaseitems, function (i, e) {
							if (e.piSeq == seq) {
								SelectedPurchaseItem = e;
								return false;
							}
						});

						if (SelectedPurchaseItem!.piStatus !== "order") {
							$target = $tr
								.find(".received");
							SelectedPurchaseItem!.piReceivedQty = <number>$target.val();
							if (SelectedPurchaseItem!.piReceivedQty == 0) {
								$.fancyConfirm({
									title: "",
									message: receivedqtyrequiredtxt,
									shownobtn: false,
									okButton: oktxt,
									noButton: notxt,
									callback: function (value) {
										if (value) {
											$target.trigger("focus");
										}
									},
								});
								return false;
							}
						}
					} else {
						SelectedPurchaseItem = initPurchaseItem();
						SelectedPurchaseItem!.piSeq = currentY + 1;
						SelectedPurchaseItem!.itmCode = <string>(
							$tr
								.find(".itemcode")
								.val()
						);
						SelectedPurchaseItem!.itmNameDesc = <string>(
							$tr
								.find(".itemdesc")
								.val()
						);
						SelectedPurchaseItem!.piQty = <number>(
							$tr
								.find(".qty")
								.val()
						);
					}
				}

				if (forwholesales) {
					SelectedWholeSalesLn = initWholeSalesLn();
					SelectedWholeSalesLn.wslSeq = currentY + 1;
					SelectedWholeSalesLn.wslItemCode = <string>(
						$tr
							.find(".itemcode")
							.val()
					);
					SelectedWholeSalesLn.itmNameDesc = <string>(
						$tr
							.find(".itemdesc")
							.val()
					);
					$target = $tr
						.find(".qty");
					SelectedWholeSalesLn.wslQty = <number>$target.val();

					if (SelectedWholeSalesLn.wslStatus == "open") {
						if (SelectedWholeSalesLn.wslQty == 0) {
							$.fancyConfirm({
								title: "",
								message: qtyrequiredtxt,
								shownobtn: false,
								okButton: oktxt,
								noButton: notxt,
								callback: function (value) {
									if (value) {
										$target.trigger("focus");
									}
								},
							});
							return false;
						}
					}
				}
			}
			openSerialModal(hasFocusCls);
		}
	}
});

function openSerialModal(hasFocusCls: boolean) {
	serialModal.dialog("option", {
		width: 1000,
		title: forwholesales ? serialnotxt : enterserialno,
	});
	serialModal.dialog("open");
	_openSerialModal = true;

	$target = $(".ui-dialog-buttonpane .ui-dialog-buttonset");
	if (hasFocusCls) {
		$target.find(".savebtn").show();
		$target
			.find(".secondarybtn")
			.text(canceltxt)
			.on("click", handleSerialModalCancel);
	} else {
		$target.find(".savebtn").hide();
		$target.find(".secondarybtn").text(closetxt).on("click", closeSerialModal);
	}

	//console.log('selecteditemcode:' + selectedItemCode);
	$("#txtStaticItemCode").val(selectedItemCode);

	if (forpurchase) {
		//console.log('selectedpurchasestockitem:', selectedPurchaseItem);
		$("#txtStaticItemName").val(SelectedPurchaseItem!.itmNameDesc);
		$("#txtStaticQty").val(SelectedPurchaseItem!.piReceivedQty);
	}
	if (forwholesales || forsales || forpreorder || forrefund) {
		//console.log("selectedWholesalesLn:", selectedWholesalesLn);
		if (forwholesales)
			$("#txtStaticItemName").val(SelectedWholeSalesLn!.itmNameDesc);
		if (forsales) reviewmode ? $("#txtStaticItemName").val(selectedSimpleSalesLn!.Item.NameDesc) : $("#txtStaticItemName").val(selectedSalesLn!.Item.NameDesc);
		if (forpreorder)
			$("#txtStaticItemName").val(selectedPreSalesLn!.itmNameDesc);

		if (
			SeqSnsVtsList.length === 0 ||
			!SeqSnsVtsList.find((x) => x.seq == seq)
		) {
			SeqSnsVtsList.push({
				seq: seq,
				snvtList: [],
			});
		}

		let snqty: number = 0;
		if (DeliveryItems.length > 0) {
			DeliveryItems.forEach((x) => {
				if (x.dlHasSN && x.seq == seq) {
					snqty++;
				}
			});
		}
		$("#txtStaticQty").val(snqty);
	}

	let html: string = "";

	if (forpurchase) {
		if (SelectedPurchaseItem!.snbatseqvtlist.length > 0) {
			$.each(SelectedPurchaseItem!.snbatseqvtlist, function (i, e) {
				html += writeSN(Purchase.pstCode, hasFocusCls, e.sn, e.vt ?? "");
			});
			SelectedPurchaseItem!.snbatseqvtlist = []; //reset to avoid duplicates
		}
	}
	if (
		(forwholesales && WholeSales.wsStatus != "order") ||
		forsales ||
		forpreorder
	) {
		//console.log("here");
		//console.log("snvtlist:", snvtlist);
		if (snvtlist.length > 0) {
			$.each(snvtlist, function (i, e) {
				html += writeSN(e.pocode, hasFocusCls, e.sn, e.vt ?? "");
			});
			snvtlist = []; //reset to avoid duplicates
		}
	}

	$("#tblSerial tbody").empty().append(html);

	if (forwholesales || forsales || forpreorder) {
		$("#txtSearchSN").trigger("focus");
	} else {
		$("#txtSerialNo").val("").trigger("focus");
	}

	let seqtxt = sequencetxt.concat(" ").concat(seq.toString());
	$("#vtseq").text(seqtxt);
}

function writeSN(
	pocode: string,
	hasFocusCls: boolean,
	_sn,
	_validthru = ""
): string {
	if (!itemOptions) return "";
	//console.log("here");
	let _snseq = $("#tblSerial tbody").find("tr").length + 1;
	let html: string = "";

	html = `<tr Id='${_sn}' data-itemcode="${selectedItemCode}" data-sn='${_sn}'>`;

	if (!forwholesales && !forsales && !forpreorder) html += `<td>${_snseq}</td>`;

	html += `<td>${_sn}</td>`;

	if (forwholesales || forsales || forpreorder) {
		if (!itemOptions.WillExpire) _validthru = "N/A";
		html += `<td>${_validthru}</td>`;
		let _checked = "";
		let _disabled = hasFocusCls ? "" : "disabled";

		if (DeliveryItems.length > 0) {
			/*console.log("here");*/
			$.each(DeliveryItems, function (i, v) {
				if (hasFocusCls) {
					if (v.snoCode == _sn) {
						_checked = "checked disabled";
						return false;
					}
				} else {
					if (v.snoCode == _sn && v.seq == seq) {
						_checked = "checked disabled";
						return false;
					}
				}
			});
		}

		html += `<td>${pocode}</td>`;

		html += `<td><input type="checkbox" Id="chksnvt${_sn}" class="chksnvt" data-pocode="${pocode}" data-sn="${_sn}" data-vt="${_validthru}" ${_checked} ${_disabled}></td>`;
	}

	if (!forwholesales && !forsales && !forpreorder)
		html += `<td><a href='#' role='button' class='btn btn-default removesn' data-snseq="${_snseq}" data-vtseq="${seq}" onclick='removeSN("${_sn}",true);'>${txtremove}</a></td>`;

	html += `</tr>`;

	return html;
}

$(document).on("change", "#txtSerialNo", function () {
	let sn = <string>$(this).val();
	$(this).val("");
	if (sn !== "") {
		//console.log('itemsnlist:', itemsnlist);
		if (itemsnlist.length === 0) {
			getRemoteData(
				"/Api/CheckIfDuplicatedSN",
				{ sn: sn },
				checkIfDuplicatedSNOk,
				getRemoteDataFail
			);
		} else {
			let duplicated = false;
			$.each(itemsnlist, function (i, e) {
				$.each(e.serialcodes, function (k, v) {
					if (v.includes(sn)) {
						duplicated = true;
						return false;
					}
				});
			});

			if (duplicated) {
				//console.log('duplicated!');
				$.fancyConfirm({
					title: "",
					message: duplicatedsnwarning,
					shownobtn: false,
					okButton: oktxt,
					noButton: canceltxt,
					callback: function (value) {
						if (value) {
							$("#txtSerialNo").trigger("focus");
							return false;
						}
					},
				});
			} else {
				getRemoteData(
					"/Api/CheckIfDuplicatedSN",
					{ sn: sn },
					checkIfDuplicatedSNOk,
					getRemoteDataFail
				);
			}
		}
	}
});


function checkIfDuplicatedSNOk(data) {
	let sn: string = data.sn.toString();
	duplicatedSerailNo = data.serialno !== null;
	if (!duplicatedSerailNo) {
		if (forpurchase) {
			//resume datepicker
			$("#tblPserial tbody tr").each(function (i, e) {
				$target = $(e).find("td:eq(1)").find(".posn");
				if ($target.val() == sn) {
					$target
						.parent("td")
						.next("td")
						.find(".posnvt")
						.prop("disabled", false);
					return false;
				}
			});
		}
		if (forsales || forpreorder) {
			writeSN("", false, sn);
			let idx = -1;
			let _snqty = 0;

			$.each(itemsnlist, function (i, e: IItemSN) {
				if (
					e.itemcode.toString().toLowerCase() ===
					selectedItemCode.toString().toLowerCase() &&
					e.seq === currentY + 1
				) {
					idx = i;
					return false;
				}
			});
			if (idx === -1) {
				let arrSN: Array<string> = [];
				arrSN.push(sn);
				let objSN: IItemSN = {
					itemcode: selectedItemCode,
					seq: currentY + 1,
					serialcodes: arrSN,
					validthru: "",
				};
				itemsnlist.push(objSN);
				_snqty = arrSN.length;
				//console.log('snqty:' + _snqty + ';currentqty:' + currentQty + ';seq:' + seq);
			} else {
				itemsnlist[idx].serialcodes.push(sn);
				_snqty = itemsnlist[idx].serialcodes.length;
				//console.log('snqty:' + _snqty + ';currentqty:' + currentQty);
			}
			//console.log('itemsnlist:', itemsnlist);
			//}

			$("#txtStaticQty").val(_snqty);
		}

		if (forwholesales) {
			return;
		}
	} else {
		let msg = duplicatedserialnowarning;
		snUsedDate = data.serialno.PurchaseDateDisplay;
		msg = msg
			.replace("{1}", snUsedDate)
			.replace("{0}", data.serialno.snoStockInCode);
		if (forpurchase) {
			//console.log("here");
			$.fancyConfirm({
				title: duplicatedserialno,
				message: msg,
				shownobtn: false,
				okButton: oktxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						//<input type="text" class="form-control text-center posn" value="a1">
						$("#tblPserial tbody tr").each(function (i, e) {
							$target = $(e).find("td:eq(1)").find(".posn");
							if ($target.val() == sn) {
								$target.val("").trigger("focus");
								//resume vt datepicker
								$target
									.parent("td")
									.next("td")
									.find(".posnvt")
									.prop("disabled", false);
								return false;
							}
						});
					}
				},
			});
		}
		if (forwholesales) {
			$.fancyConfirm({
				title: duplicatedserialno,
				message: msg,
				shownobtn: false,
				okButton: oktxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						$(`#${gTblId} tbody tr`).each(function (i, e) {
							$target = $(e).find("td:eq(6)").find(".serialno");
							if ($target.val() == sn) {
								$target.val("").trigger("focus");
								return false;
							}
						});
					}
				},
			});
		}
		//forsales or forpreorder
		if (forsales || forpreorder) {
			let idx = -1;
			$.each(itemsnlist, function (i, e) {
				if (
					e.itemcode.toString().toLowerCase() ===
					selectedItemCode.toString().toLowerCase() &&
					e.seq === currentY + 1
				) {
					idx = i;
					return false;
				}
			});
			if (idx > -1) {
				let index = -1;
				$.each(itemsnlist[idx].serialcodes, function (i, e) {
					if (e.toString() == sn.toString()) {
						index = i;
						return false;
					}
				});
				if (index > -1) {
					itemsnlist[idx].serialcodes.splice(index, 1);
				}
			}
			//console.log('itemsnlist after update:', itemsnlist);
			snUsedDate = data.serialno.SalesDateDisplay;
			msg = msg
				.replace("{1}", snUsedDate)
				.replace("{0}", data.serialno.snoRtlSalesCode);

			$.fancyConfirm({
				title: duplicatedserialno,
				message: msg,
				shownobtn: false,
				okButton: oktxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						$("#txtSerialNo").trigger("focus");
					}
				},
			});
		}

		duplicatedSerailNo = false;
	}
}


function confirmSNs() {
	let lnqty: number = 0;
	if (forwholesales || forsales || forpreorder) {
		$("#tblSerial tbody tr").each(function (i, e) {
			$target = $(e).find("td:eq(3)").find(".chksnvt");
			let snvtId = $target.attr("id");
			let pocode = $target.data("pocode");
			let _snvt = {
				pocode: pocode,
				sn: $(e).find("td:eq(0)").text() as string,
				vt: $(e).find("td:eq(1)").text().toString().trim(),
				selected: $target.is(":checked"),
			};

			if (_snvt.selected) {
				//console.log("_snvt.sn:", _snvt.sn);
				let idx = -1;
				$.each(DeliveryItems, function (k, v) {
					//console.log("v.snoCode:" + v.snoCode);
					if (v.snoCode == _snvt.sn) {
						idx = k;
						return false;
					}
				});
				if (idx < 0) {
					deliveryItem = initDeliveryItem();
					deliveryItem.pstCode = _snvt.pocode;
					deliveryItem.dlCode = snvtId as string;
					deliveryItem.seq = seq;
					deliveryItem.dlHasSN = true;
					deliveryItem.snoCode = _snvt.sn;
					deliveryItem.JsVt = _snvt.vt;
					deliveryItem.itmCode = selectedItemCode.toString();
					deliveryItem.dlQty = 1;

					getItemInfo4BatSnVtIv(_snvt.sn);

					DeliveryItems.push(deliveryItem);
				}

				if (snvt.selected && itemOptions && itemOptions.WillExpire) {
					setExpiryDateMark();
				}
			} else {
				let idx = -1;
				$.each(DeliveryItems, function (k, v) {
					if (v.snoCode == _snvt.sn) {
						idx = k;
						return false;
					}
				});
				if (idx >= 0) {
					DeliveryItems.splice(idx, 1);
				}

				if (SeqSnsVtsList.find((x) => x.seq == seq)?.snvtList.length === 0) {
					setSNmark(true);
					removeExpiryDateMark();
				}
			}
		});
	}
	//console.log("selecteditemcode:" + selectedItemCode + ";seq:" + seq);
	lnqty = getSerialNoLnQty();
	//console.log("lnqty#confirmsns:", lnqty);
	let $qty = $(`#${gTblId} tbody tr`)
		.eq(currentY)
		.find("td")
		.eq(4)
		.find(".qty");
	if (lnqty > Number($qty.val())) {
		$.fancyConfirm({
			title: "",
			message: newqtygtoriginalqtyindeliveryconfirmtxt,
			shownobtn: true,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$qty.val(lnqty).trigger("change");
					_confirmSNs(false);
				} else {
					let idx = -1;

					if (
						SeqSnsVtsList &&
						SeqSnsVtsList.find((x) => x.seq == seq) &&
						SeqSnsVtsList.find((x) => x.seq == seq)!.snvtList
					) {
						var snvtlist = SeqSnsVtsList.find(
							(x) => x.seq == seq
						)!.snvtList.slice(0);
						DeliveryItems.forEach((v, k) => {
							snvtlist.every((y) => {
								if (v.snoCode == y.sn) {
									idx = k;
									return false;
								}
							});
						});
						if (idx >= 0) {
							DeliveryItems.splice(idx, 1);
						}

						$("#tblSerial tbody tr").each(function (i, e) {
							let sn = $(e).find("td:eq(0)").text() as string;
							//console.log("sn:" + sn);
							if (snvtlist.find((x) => x.sn == sn)) {
								$(e).find("td:eq(2)").find(".chksnvt").prop("checked", false);
							}
						});

						SeqSnsVtsList.find((x) => x.seq == seq)!.snvtList = [];
					}

					$("#txtStaticQty").val(0);
					$target.addClass("focus-input");

					setSNmark(true);
					removeExpiryDateMark();

					$("#txtSearchSN").trigger("focus");
				}
			},
		});
	} else {
		$qty.val(lnqty).trigger("change");
		_confirmSNs(false);
	}
}

function getSerialNoLnQty(): number {
	//console.log("here");
	let lnqty: number = 0;
	if (
		SeqSnsVtsList &&
		SeqSnsVtsList.find((x) => x.seq == seq) &&
		SeqSnsVtsList.find((x) => x.seq == seq)!.snvtList
	) {
		lnqty = SeqSnsVtsList.find((x) => x.seq == seq)!.snvtList.length;
	}
	return lnqty;
}

function _confirmSNs(setfocus: boolean = true) {
	closeSerialModal();
	_openSerialModal = false;
	setSNmark();
	if (setexpirydateMark) setExpiryDateMark();
	selectedItemCode = "";
	if (setfocus) focusItemCode();
}


$(document).on("change", ".chksnvt", function () {
	let todelqty: number = getToDelQty();

	$(this).data("rtlseq", seq);
	//let selected: boolean = $(this).is(":checked");
	let sn = $(this).data("sn");
	let vt = $(this).data("vt");

	let ischecked: boolean = $(this).is(":checked");
	$tr = $(this).parent("td").parent("tr");
	chksnvtchange = true;

	snvt = { pocode: "", sn, vt, selected: ischecked };

	if (
		SeqSnsVtsList &&
		SeqSnsVtsList.find((x) => x.seq == seq) &&
		SeqSnsVtsList.find((x) => x.seq == seq)!.snvtList
	) {
		if (snvt.selected) {
			if (!SeqSnsVtsList.find((x) => x.seq == seq)!.snvtList.includes(sn))
				SeqSnsVtsList.find((x) => x.seq == seq)!.snvtList.push(snvt);
		} else {
			let idx = SeqSnsVtsList.find((x) => x.seq == seq)!.snvtList.indexOf(snvt);
			if (idx >= 0)
				SeqSnsVtsList.find((x) => x.seq == seq)!.snvtList.splice(idx, 1);
		}
	}

	let currentsnqty = $("#txtStaticQty").val() as number;
	if (snvt.selected) {
		currentsnqty++;
	} else {
		currentsnqty--;
	}
	$("#txtStaticQty").val(currentsnqty);

	if (currentsnqty == todelqty) {
		$("#tblSerial tbody .chksnvt").prop("disabled", true);
	}
});

$(document).on("change", ".snvalidthru", function () {
	snvt.vt = $(this).val() as string;
});

$(document).on("click", "#btnSearchSN", function () {
	//var requiredsn = serialnorequired;
	let searchsn: string = <string>$("#txtSearchSN").val()?.toString();
	if (searchsn !== "") {
		searchsn = searchsn.trim();
		let found = false;
		if (forsales) {
			$.each(itemsnlist, function (i, e) {
				if (e.serialcodes.includes(searchsn)) {
					window.location.href = "#" + searchsn;
					$("#tblSerial tbody tr").each(function (i, e) {
						if ($(e).prop("Id") === searchsn) {
							$(e).addClass("highlight_row");
							found = true;
							return false;
						}
					});
				}
			});
		}
		if (forwholesales) {
			$.each(snvtlist, function (i, e) {
				if (e.sn == searchsn) {
					window.location.href = "#" + searchsn;
					$("#tblSerial tbody tr").each(function (i, e) {
						if ($(e).prop("Id") === searchsn) {
							$(e).addClass("highlight_row");
							found = true;
							return false;
						}
					});
				}
			});
		}

		if (!found) falert(nodatafoundtxt, oktxt);
	}
});

$(document).on("change", "#txtSearchSN", function () {
	$("#btnSearchSN").trigger("click");
});

function getToDelQty(): number {
	let idx = forwholesales ? 5 : 4;
	let qtycls = forwholesales ? ".delqty" : ".qty";
	return Number(
		$(`#${gTblId} tbody tr`)
			.eq(currentY)
			.find("td")
			.eq(idx)
			.find(qtycls)
			.val()
	);
}

function resetSerialModal() {
	serialModal.find("input").val("");
	if (forwholesales) {
		serialModal.find("input[type=checkbox]").prop("checked", false);
	}
	//console.log('serailmodal inputs cleared');
}

function removeSN(_sn: string, needconfirm: boolean) {
	if (needconfirm) {
		$.fancyConfirm({
			title: "",
			message: confirmremove,
			shownobtn: true,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					_removeSN(_sn);
				}
			},
		});
	} else {
		_removeSN(_sn);
	}
}

function _removeSN(_sn: string) {
	//console.log('_sn#_removesn:' + _sn);
	//console.log('itemsnlist before remove:', itemsnlist);
	let idx = -1;
	$.each(itemsnlist, function (i, e) {
		//e.itemcode.toString().toLowerCase() === selectedItemCode.toString().toLowerCase() && e.seq === currentY + 1
		if (
			e.itemcode.toString().toLowerCase() ===
			selectedItemCode.toString().toLowerCase() &&
			e.seq === currentY + 1
		) {
			idx = i;
			return false;
		}
	});
	if (idx > -1) {
		let index = -1;
		$.each(itemsnlist[idx].serialcodes, function (i, e) {
			if (e.toString() == _sn.toString()) {
				index = i;
				return false;
			}
		});
		if (index > -1) {
			itemsnlist[idx].serialcodes.splice(index, 1);
		}
	}
	//console.log('itemsnlist after remove:', itemsnlist);
	setSNmark(true);
	$("#tblSerial tbody tr").each(function (i, e) {
		console.log("edatasn:" + $(e).data("sn"));
		if ($(e).data("sn") == _sn) {
			$(e).remove();
			//console.log("itemsnlist#0:", itemsnlist);
			if (itemsnlist.length > 0) {
				let idx = -1;
				$.each(itemsnlist, function (k, v) {
					$.each(v.serialcodes, function (_i, _e) {
						if (_e == _sn) {
							idx = _i;
							return false;
						}
					});
					if (idx > -1) {
						v.serialcodes.splice(idx, 1);
						return false;
					}
				});
			}
			//console.log("itemsnlist#1:", itemsnlist);
			$("#txtStaticQty").val(itemsnlist.length);
		}
	});
	$("#txtSerialNo").trigger("focus");
}

function setIvMark() {
	let ivcls = ".vari";
	$tr
		.find(ivcls)
		.removeClass("focus")
		.val("...");
}
function setBatchMark() {
	//console.log("batchidx:", batchidx);//ok
	let batcls = forpurchase ? ".pobatch" : ".batch";
	$tr
		.find(batcls)
		.removeClass("focus")
		.val("...");
}

function setExpiryDateMark() {
	//console.log("tr index:", $tr.index());
	if (itemOptions && (itemOptions.ChkBatch || itemOptions.ChkSN))
		$tr
			.find(".validthru")
			.removeClass("focus validthru datepicker pointer")
			.prop("readonly", true)
			.val("...");
	else
		$tr
			.find(".validthru")
			.removeClass("focus datepicker")
			.prop("readonly", true)
			.val("...");
}

function removeExpiryDateMark() {
	if (forwholesales) {
		$tr
			.find(".small.pointer")
			.addClass("validthru datepicker focus")
			.prop("readonly", false)
			.val("");
	} else {
		$tr
			.find(".validthru")
			.addClass("validthru datepicker")
			.prop("readonly", false)
			.val("");
	}

	setValidThruDatePicker();
}

function setSNmark(remove = false) {
	if (forwholesales || forsales || forpreorder) {
		if (itemOptions && itemOptions.ChkBatch && itemOptions.ChkSN)
			$tr
				.find(".serialno")
				.removeClass("serialno pointer focus")
				.val("...");
		if (itemOptions && !itemOptions.ChkBatch && itemOptions.ChkSN)
			$tr
				.find(".serialno")
				.removeClass("focus")
				.val("...");
	} else
		remove
			? $tr.find(".serialno").val("")
			: $tr
				.find(".serialno")
				.removeClass("focus")
				.val("...");
}
function resetRow() {
	//console.log("Here");
	let idx = -1;
	//remove itemsn from itemsnlist, if any:
	$.each(itemsnlist, function (i, e: IItemSN) {
		if (e.seq == currentY + 1) {
			idx = i;
			return false;
		}
	});
	if (idx > -1) {
		itemsnlist.splice(idx, 1);
	}
	//   console.log("updated itemsnlist#resetrow:", itemsnlist);
	idx = -1;

	if (forsales) {
		$.each(SalesLnList, function (i, e) {
			if (e.rtlSeq == currentY + 1) {
				idx = i;
				return false;
			}
		});
		if (idx > -1) {
			SalesLnList.splice(idx, 1);
		}
	}
	if (forpreorder) {
		$.each(PreSalesLnList, function (i, e) {
			if (e.rtlSeq == currentY + 1) {
				idx = i;
				return false;
			}
		});
		if (idx > -1) {
			PreSalesLnList.splice(idx, 1);
		}
	}
	if (forwholesales) {
		$.each(WholeSalesLns, function (i, e) {
			if (e.wslSeq == currentY + 1) {
				idx = i;
				return false;
			}
		});
		if (idx > -1) {
			WholeSalesLns.splice(idx, 1);
		}
	}
	if (forpurchase) {
		$.each(Purchase.PurchaseItems, function (i, e) {
			if (e.piSeq == currentY + 1) {
				idx = i;
				return false;
			}
		});
		if (idx > -1) {
			Purchase.PurchaseItems.splice(idx, 1);
		}
		// console.log("updatedpurchaseitems#resetrow:", Purchase.PurchaseItems);
	}

	$target = $(`#${gTblId} tbody tr`);

	$target.eq(currentY).find("td:eq(2)").find(".itemdesc").val("");

	const unitclsname = forpurchase ? ".baseunit" : ".sellunit";
	$target.eq(currentY).find("td:eq(3)").find(unitclsname).val("");

	//let qty = Number($target.eq(currentY).find("td:eq(4)").find(".qty").val());
	$target.eq(currentY).find("td:eq(4)").find(".qty").val("");

	if (
		forsales ||
		forpreorder ||
		(forpurchase && Purchase.pstStatus !== "order") ||
		(forwholesales && WholeSales.wsStatus == "invoice")
	) {
		idx = 5;
		$target
			.eq(currentY)
			.find("td")
			.eq(idx)
			.find(".batch")
			.removeClass("itemoptionmissing")
			.val("");
		idx++;
		$target
			.eq(currentY)
			.find("td")
			.eq(idx)
			.find(".serialno")
			.removeClass("itemoptionmissing")
			.val("");
		idx++;
		$target
			.eq(currentY)
			.find("td")
			.eq(idx)
			.find(".validthru")
			.removeClass("itemoptionmissing")
			.val("");
	}

	if (forsales || forpreorder) {
		idx++;
		$target.eq(currentY).find("td").eq(idx).empty(); //item varaitions
	}

	//let price = 0;
	//let disc = 0;
	//let taxrate = 0;
	//let amount = 0;
	if (forsales || forpreorder) {
		idx = 9;
	}
	if (
		(forpurchase && Purchase.pstStatus == "order") ||
		(forwholesales && WholeSales.wsStatus == "order")
	) {
		idx = 5;
	}

	const $price = $target.eq(currentY).find("td").eq(idx).find(".price");
	//price = Number($price.val());
	$price.val("");
	idx++;
	const $disc = $target.eq(currentY).find("td").eq(idx).find(".discpc");
	//disc = Number($disc.val());
	$disc.val("");

	if (enableTax && !inclusivetax) {
		idx++;
		const $tax = $target.eq(currentY).find("td").eq(idx).find(".taxpc");
		//taxrate = Number($tax.val());
		$tax.val("");
	}
	idx++;
	const $location = $target.eq(currentY).find("td").eq(idx).find(".location");
	$location.val($location.find("option").eq(1).val() as string);
	idx++;
	const $job = $target.eq(currentY).find("td").eq(idx).find(".job");
	$job.val($job.find("option").first().val() as string);

	const $amount = $target.eq(currentY).find("td").last().find(".amount");
	//amount = Number($amount.val());
	$amount.val("");

	$(`#${gTblId} tbody`).empty();
	if (forsales) {
		if (SalesLnList.length === 0) {
			addRow();
		} else {
			SalesLnList.forEach((x, i) => {
				addRow();
				selectedSalesLn = structuredClone(x);
				selectedItemCode = x.rtlItemCode;
				currentY = i;
				$(`#${gTblId} tbody tr`)
					.eq(currentY)
					.find("td")
					.eq(1)
					.find(".itemcode")
					.val(selectedItemCode);
				populateSalesRow(x.Item.singleProId ?? 0);
			});
			selectedItemCode = "";
			selectedSalesLn = {} as ISalesLn;
		}
	}
	if (forpreorder) {
		if (PreSalesLnList.length === 0) {
			addRow();
		} else {
			PreSalesLnList.forEach((x, i) => {
				addRow();
				selectedPreSalesLn = structuredClone(x);
				selectedItemCode = x.rtlItemCode;
				currentY = i;
				$(`#${gTblId} tbody tr`)
					.eq(currentY)
					.find("td")
					.eq(1)
					.find(".itemcode")
					.val(selectedItemCode);
				populateSalesRow(x.Item.singleProId ?? 0);
			});
			selectedItemCode = "";
			selectedPreSalesLn = {} as IPreSalesLn;
		}
	}
	if (forwholesales) {
		if (WholeSalesLns.length === 0) {
			addRow();
		} else {
			WholeSalesLns.forEach((x, i) => {
				addRow();
				SelectedWholeSalesLn = structuredClone(x);
				selectedItemCode = x.wslItemCode;
				currentY = i;
				$(`#${gTblId} tbody tr`)
					.eq(currentY)
					.find("td")
					.eq(1)
					.find(".itemcode")
					.val(selectedItemCode);
				populateSalesRow(x.Item.singleProId ?? 0);
			});
			selectedItemCode = "";
			SelectedWholeSalesLn = {} as IWholeSalesLn;
		}
	}
	if (forpurchase) {
		if (Purchase.PurchaseItems.length === 0) {
			addRow();
		} else {
			Purchase.PurchaseItems.forEach((x, i) => {
				addRow();
				SelectedPurchaseItem = structuredClone(x);
				selectedItemCode = x.itmCode;
				currentY = i;
				$(`#${gTblId} tbody tr`)
					.eq(currentY)
					.find("td")
					.eq(1)
					.find(".itemcode")
					.val(selectedItemCode);
				populateSalesRow(x.singleProId ?? 0);
			});
			selectedItemCode = "";
			SelectedPurchaseItem = {} as IPurchaseItem;
		}
	}

	let totalamt = getTotalAmt4Order();
	$("#txtTotal").val(formatnumber(totalamt));

	focusItemCode();
}

function checkPurchaseItems(): boolean {
	//console.log("here");
	let msg = "";
	let currentItemCount = $(`#${gTblId} tbody tr`).length;
	//console.log("currentitemcount:" + currentItemCount);
	$(`#${gTblId} tbody tr`).each(function (i, e) {
		if (i < currentItemCount) {
			selectedItemCode = $(e)
				.find("td:eq(1)")
				.find(".itemcode")
				.val() as string;
			//console.log('selecteditemcode:' + selectedItemCode);
			if (!$.isEmptyObject(DicItemOptions)) {
				itemOptions = DicItemOptions[selectedItemCode];
				if (itemOptions) {
					//console.log("itemoptions:", itemoptions);
					let idx = 5;
					let $batch = $(e).find("td").eq(idx).find(".batch");
					if (itemOptions.ChkBatch && $batch.val() == "") {
						msg += `${selectedItemCode} ${batchrequiredtxt}<br>`;
						$batch.addClass("focus");
					}
					idx++;
					let $sn = $(e).find("td").eq(idx).find(".posn");
					if (itemOptions.ChkSN && $sn.val() == "") {
						msg += `${selectedItemCode} ${snrequiredtxt}<br>`;
						$sn.addClass("focus");
					}
					idx++;
					let $vt = $(e).find("td").eq(idx).find(".validthru");
					if (itemOptions.WillExpire && $vt.val() == "") {
						msg += `${selectedItemCode} ${expirydaterequiredtxt}<br>`;
						$vt.addClass("focus");
					}
				}
			}
		}
	});
	selectedItemCode = "";

	if (msg !== "") {
		$(`#${gTblId} tbody tr:first`)
			.find("td:last")
			.find(".received")
			.removeClass("focus");
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

$(document).on("dblclick", "input.itemcode", function () {
	getRowCurrentY.call(this);
	//console.log('seq:' + seq + ';currenty:' + currentY);
	if (forpurchase) {
		if (Purchase.pstStatus !== "order" && checkPurchaseItems()) {
			GetItems(1);
		}
		if (Purchase.pstStatus == "order" || Purchase.pstStatus == "created") {
			GetItems(1);
		}
	}
	else {
		/*console.log("here");*/
		GetItems(1);
	}
});

function handleLocationChange(this: any) {
	getRowCurrentY.call(this);
	updateRow(getRowPrice(), getRowDiscPc());
}

function getRowDiscPc(): number {
	return Number($tr.find(".discpc").val());
}
function getRowPrice(): number {
	return Number($tr.find(".price").val());
}

function handlePriceChange(this: any) {
	//console.log("price change called");
	getRowCurrentY.call(this);
	//console.log("price:" + event.target.value);
	const price: number = Number($(this).val());
	if (price === 0) {
		zeroprice = true;
	} else {
		zeroprice = false;
	}
	if (price < 0) {
		$(this).val(price * -1);
	}
	$tr = $(`#${gTblId} tbody tr`).eq(currentY);

	let _discpc: number = Number($tr.find(".discpc").val());
	//console.log("price#p change:" + price + ";discpc#p change:" + _discpc);
	updateRow(price, _discpc);
}
function handleDiscChange(this: any) {
	//console.log("discchange");
	getRowCurrentY.call(this);
	let _discpc: number = Number($(this).val());
	$tr = $(`#${gTblId} tbody tr`).eq(currentY);
	let _price: number = 0;

	if (_discpc < 0) {
		$.fancyConfirm({
			title: "",
			message: lt0dispctxt,
			shownobtn: true,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					_price = Number($tr.find(".price").val());
					updateRow(_price, _discpc);
				} else {
					updateRow(_price, 0);
				}
			},
		});
	} else {
		_price = Number($tr.find(".price").val());
		updateRow(_price, _discpc);
	}
}

function updateRow(_price: number = 0, _discount: number = 0) {
	//console.log("_price#updaterow:" + _price + ";_disc:" + _discount);
	//console.log("$tr.index#updaterow:", $tr.index());
	$target = $(`#${gTblId} tbody tr`).eq(currentY);
	seq = currentY + 1;

	let qty: number = 0;
	qty = Number($target.find(".qty").val());

	if (forwholesales && WholeSales && WholeSales.wsStatus == "invoice") {
		qty = Number($target.find(".delqty").val());
	}

	let taxrate: number = 0;

	seq = currentY + 1;
	if (_price > 0) {
		// _price = _price * exRate;
	} else {
		if (forsales || forReservePaidOut) {
			if (SalesLnList.length > 0) {
				$.each(SalesLnList, function (i, e) {
					if (e.rtlSeq == seq) {
						selectedSalesLn = structuredClone(e);
						_price = Number(selectedSalesLn!.rtlSellingPrice);
						return false;
					}
				});
			} else {
				_price = selectedSalesLn ? selectedSalesLn!.rtlSellingPrice! : 0;
			}
		}
		if (forpreorder) {
			if (PreSalesLnList.length > 0) {
				$.each(PreSalesLnList, function (i, e) {
					if (e.rtlSeq == seq) {
						selectedPreSalesLn = structuredClone(e);
						_price = Number(selectedPreSalesLn!.rtlSellingPrice);
						return false;
					}
				});
			} else {
				_price = selectedPreSalesLn ? selectedPreSalesLn!.rtlSellingPrice! : 0;
			}
		}
		if (forpurchase) {
			if (Purchase.PurchaseItems.length > 0) {
				$.each(Purchase.PurchaseItems, function (i, e) {
					if (e.piSeq == seq) {
						SelectedPurchaseItem = structuredClone(e);
						return false;
					}
				});
			} else {
				_price = SelectedPurchaseItem ? SelectedPurchaseItem!.piUnitPrice! : 0;
			}
		}

		if (forwholesales) {
			if (WholeSalesLns.length > 0) {
				$.each(WholeSalesLns, function (i, e) {
					if (e.wslSeq == seq) {
						SelectedWholeSalesLn = structuredClone(e);
						_price = Number(SelectedWholeSalesLn!.wslSellingPrice);
						return false;
					}
				});
			} else {
				_price = SelectedWholeSalesLn
					? SelectedWholeSalesLn!.wslSellingPrice!
					: 0;
			}
		}
	}
	let $price = $target.find(".price");
	$price.off("change");
	//console.log("_price:"+_price);
	$price.val(formatnumber(_price));
	$price.on("change", handlePriceChange);
	//didx = pidx + 1;
	//console.log("disc idx:" + didx);
	if ((forsales || forpreorder || forReservePaidOut) && isPromotion && itemPromotion?.pro4Period) {
		_discount = itemPromotion.proDiscPc!;
	}

	//console.log("_discount#0:" + _discount);
	if (_discount !== 0) {
		let $discount = $target.find(".discpc");
		$discount.off("change");
		$discount.val(formatnumber(_discount));
		$discount.on("change", handleDiscChange);
	} else {
		// console.log("discpc:" + $target.find("td").eq(idx).find(".discpc").val());
		_discount = Number($target.find(".discpc").val());
	}
	//console.log("_discount#1:" + _discount);

	//tidx=didx+1;
	if (enableTax && !inclusivetax) {
		taxrate = Number($target.find(".taxpc").val());
	} else {
		taxrate = 0;
	}

	let newamtplustax: number = 0;
	let newamt: number = 0;

	if (forpurchase && (Purchase.pstStatus !== "order" && Purchase.pstStatus !== "created" && Purchase.pstStatus !== "draft"))
		qty = Number($target.find(".received").val());

	//console.log(
	//  "qty:" + qty + ";price:" + _price + ";tax:" + taxrate + ";disc:" + _discount
	//);
	newamtplustax = calAmountPlusTax(qty, _price, taxrate, _discount);

	if (forsales || forpreorder || forpurchase || forwholesales || forReservePaidOut) {
		newamt = calAmount(qty, _price, _discount);
	}
	//console.log("newamtplustax:" + newamtplustax + ";newamt:" + newamt);

	$target.data("amt", newamt);
	$target.data("amtplustax", newamtplustax);


	//console.log('saleslist#updaterow:', SalesList);
	if (forsales || forpreorder || forpurchase || forwholesales || forReservePaidOut) {
		// console.log("newamtplustax#updaterow:" + newamtplustax);
		//console.log("here");
		_updaterow($target, newamtplustax);
	}

	isPromotion = false;
	itemPromotion = null;
}

function _updaterow($target: JQuery, _amtplustax: number) {
	if (forsales || forpreorder || forReservePaidOut) {
		$("#btnPayment").prop("disabled", false);
	}

	if (forsales || forpreorder || forwholesales || forReservePaidOut) {
		$target
			.find(".amount")
			.val(formatnumber(_amtplustax))
			.data("amount", _amtplustax);
	}

	if (forpurchase) {
		//console.log("here");
		let $amt = $target.find(".amount");
		$amt.off("change");
		$amt.val(formatnumber(_amtplustax));
		$amt.on("change", handleQtyChange);
		updatePurchase();
	}
	//return;
	if ((forsales && !reviewmode) || forReservePaidOut) {//not for salesorderlist here
		UpdateSales();
	}
	if (forpreorder) UpdatePreSales();

	if (forwholesales) {
		//console.log("WholeSalesLns#_updaterow:", WholeSalesLns);
		updateWholesales();
	}

}

function handleItemDescDblClick(this: any) {
	getRowCurrentY.call(this);

	if (forrefund) {
		seq = Number(
			$(this)
				.parent("td")
				.parent("tr")
				.find("td")
				.last()
				.find(".rtlSeq")
				.data("rtlseq")
		);
		//console.log("seq:", seq);
		refundsalesln = $.grep(RefundableSalesList, function (e, i) {
			return e.rtlSeq == seq;
		})[0];
	}
	seq = currentY + 1;
	//console.log("seq:" + seq);
	if (forsales) {
		selectedSalesLn = $.grep(SalesLnList, function (e, i) {
			return e.rtlSeq == seq;
		})[0];
	}
	if (forpurchase) {
		SelectedPurchaseItem = $.grep(Purchase.PurchaseItems, function (e, i) {
			return e.piSeq == seq;
		})[0];
	}
	if (forwholesales) {
		SelectedWholeSalesLn = $.grep(WholeSalesLns, function (e, i) {
			return e.wslSeq == seq;
		})[0];
	}
	if (forItem || forstock || fortransfer) {
		//selectedItemCode = $(this).parent("tr").find("td").first().text();
		selectedItem = initItem();
		selectedItem.NameDesc = $(this).data("desc") as string;
	}
	openDescModal();
}
function initStockInItem(): IStockInItem {
	return {
		CompanyId: 0,
		AccountProfileId: 0,
		stCode: "",
		siSeq: 0,
		itmCode: "",
		siBaseUnit: "",
		siQty: 0,
		siBatch: "",
		siHasSN: false,
		siValidThru: new Date(),
		ValidThruDisplay: "",
		siUnitCost: 0,
		siAmt: 0,
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
		itmName: "",
		itmUseDesc: false,
		itmDesc: "",
		itmNameDesc: "",
		stLocStock: "",
		SerialNoList: [],
		snlist: [],
		JsValidThru: "",
	};
}


function resetPage(partial: boolean = false) {
	if (forrefund) {
		if (!partial) {
			$(":input", "#frmCus")
				.not(":button, :submit, :reset, :hidden")
				.val("")
				.prop("checked", false)
				.prop("selected", false);
			$("#tblsales tbody").empty();
		}

		$("#tblRefund tbody").empty();
		//console.log('tblrefund empty');
		$("#txtTotal").val(formatnumber(0));
		$(".paymenttype").val(formatnumber(0));
		$("#refundamount").val(formatnumber(0));
		isEpay = false;
		$("#partialrefundnote").addClass("hide");
		epaytype = "";
		$("#ebtnblk").addClass("hide");

		Payments = [];
		RefundList = [];
		iremain = 0;
		itotalamt = 0;
		refundsalesln = initRefundSales();
		salesrefundlist = [];
		RefundSalesList = [];
		RefundableSalesList = [];
		seq = 0;
		RefundSales = initRefundSales();
		selectedSalesCode = "";
		selectedCusCodeName = "";
		ItemList = [];
		snlist = [];
		cpplList = [];
	}
	if (forreturn) {
	}
}

function GetStocks(pageIndex: number) {
	//let data:IStockFilter = initStockFilter(pageIndex,stocklocation,keyword); //must not use json here!!!
	let includenonstock: number = forsales ? 1 : 0;
	if (!forsales) {
		stocklocation = "";
	}
	//
	let data = { pageIndex: pageIndex, includeStockInfo: 1, location: stocklocation, keyword: keyword, includenonstock: includenonstock, forstock: forstock, fortransfer: fortransfer };
	//console.log('data:', data);
	/*return false;*/
	openWaitingModal();
	$.ajax({
		url: "/Api/GetItemsAjax",
		type: "GET",
		data: data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: OnGetStocksOK,
		error: onAjaxFailure,
	});
}
function OnGetStocksOK(response) {
	//keyword = "";
	closeWaitingModal();
	//console.log('response:', response);
	var model = response;
	//console.log('modelitems:', model.Items);
	let type = forstock ? "stock" : "transfer";
	const primaryLocation: string = model.PrimaryLocation;
	//console.log("primarylocation:" + primaryLocation);

	$("#lastupdatetime").text(model.LatestUpdateTime);

	DicLocItemList = Object.assign({}, model.DicLocItemList);
	DicItemOptions = Object.assign({}, model.DicItemOptions);

	DicIvInfo = Object.assign({}, model.DicIvInfo);

	if (model.Items.length > 0) {
		ItemList = model.Items.slice(0);

		let html = "";
		$.each(ItemList, function () {
			var item = this;
			const itemcode = item.itmCode;
			//console.log('item:', item);
			DicStockTransferList[itemcode] = [];

			let itemoption: IItemOptions | null = null;
			if (DicCodeItemOptions) {
				itemoption = DicCodeItemOptions[item.itmCode!];
			}

			html += `<tr class="{0}" data-code="${itemcode}" data-jsstocklist="${item.JsonJsStockList}" ondblclick="{1}">`;
			let _checked = icheckall === 1 ? "checked" : "";
			//let _disabled = (itemoption) && itemoption.Disabled ? "disabled" : "";
			let _disabled = _checked !== "" ? "disabled" : "";
			if (forstock)
				html += `<td><input type="checkbox" class="form-check chk" data-id="${item.itmItemID}" ${_checked} ${_disabled}></td>`;

			if (!fortransfer && enablebuysellunits) {
				html = html
					.replace("{0}", "button")
					.replace("{1}", `HandleStockDblClick("${itemcode}");`);
			}
			//console.log("itemoption:", itemoption);
			let fabatcls = itemoption
				? itemoption.ChkBatch
					? "check-square"
					: "square-o"
				: "square-o";
			let fasncls = itemoption
				? itemoption.ChkSN
					? "check-square"
					: "square-o"
				: "square-o";
			let favtcls = itemoption
				? itemoption.WillExpire
					? "check-square"
					: "square-o"
				: "square-o";

			html += `<td class="text-left">${itemcode}</td>`;
			html += `<td class="text-left itemdesc" data-desc="${item.NameDesc}" title="${item.NameDesc}">${handleItemDesc(item.NameDesc)}</td>`;

			html += `<td class="text-center"><span class="text-success"><span class="fa fa-${fabatcls}"></span> <span class="fa fa-${fasncls}"></span> <span class="fa fa-${favtcls}"></span></span></td>`;
			let facls = item.hasItemVari ? "check" : "xmark";
			let displaycls = item.hasItemVari ? "text-success" : "text-danger";
			html += `<td class="text-center"><span class="fa fa-${facls} ${displaycls}"></span></td>`;

			const onhandstock: string =
				item.OnHandStock <= 0
					? `<span class="outofstock">${item.OnHandStock}</span>`
					: item.OnHandStock.toString();

			html += `<td class="text-right locqty">${onhandstock}</td>`;
			//console.log("shops:", shops);
			$.each(shops, function (i, e) {
				//console.log("sbitem:", sbitem);
				let st: IStockTransfer = initStockTransfer();
				st.itmCode = itemcode;
				st.stShop = e;
				st.stSender = "";
				st.stReceiver = "";
				st.inQty = 0;
				st.outQty = 0;
				let Id: string = "";
				$.each(item.JsStockList, function (k, v) {
					//console.log('v.loccode:' + v.LocCode);
					if (e == v.LocCode) {
						Id = v.Id;
						return false;
					}
				});
				let diclocqty = item.DicItemLocQty[item.itmCode];
				let dicabssqty = item.DicItemAbssQty[item.itmCode];
				let locqty: number = diclocqty[e] ?? 0;
				let abssqty: number = dicabssqty[e] ?? 0;
				let locqtydisplay: string = "";
				const isprimary = primaryLocation == e ? 1 : 0;

				//for debug only
				//if (itemcode == "ITEMITEM0001" && e=="office") {
				//    //console.log("diclocqty:", diclocqty);
				//    //console.log("locqty:" + locqty);
				//    console.log(itemoption);
				//}
				//if (itemcode == "ABSSP23.9-1U") {
				//    console.log("(itemcode in DicIvInfo):", (itemcode in DicIvInfo));
				//}

				if (locqty <= 0) {
					locqtydisplay = `<span class="danger">${locqty}</span>`;
				} else {
					locqtydisplay = `<span>${locqty}</span>`;
				}

				let readonly =
					itemoption?.ChkBatch ||
						itemoption?.ChkSN ||
						itemoption?.WillExpire ||
						(itemcode in DicIvInfo && DicIvInfo[itemcode].length > 0)
						? "readonly"
						: "";

				let inputcls =
					!itemoption?.ChkBatch && !itemoption?.ChkSN && !itemoption?.WillExpire
						? "locqty"
						: "locqty itemoption";
				if (
					itemcode in DicIvInfo &&
					DicIvInfo[itemcode].length > 0 &&
					!itemoption?.ChkBatch &&
					!itemoption?.ChkSN &&
					!itemoption?.WillExpire
				)
					inputcls = "locqty vari";

				let _html = forstock
					? `${locqtydisplay}`
					: `<input type="text" class="text-right form-control btnsmall ${inputcls}" data-isprimary="${isprimary}" data-code="${item.itmCode}" data-shop="${e}" data-onhandstock="${item.OnHandStock}" data-id="${Id}" data-oldval="${locqty}" data-abssqty="${abssqty}" data-itemid="${item.itmItemID}" value="${locqty}" ${readonly} title="${transferdblclickhints}"/>`;

				html += `<td class="text-right locqty">${_html}</td>`;

				DicStockTransferList[item.itmCode].push(st);
			});
			if (fortransfer) {
				let bgcls = item.OutOfBalance >= 0 ? "okbalance" : "outofbalance";
				let _html = `<input type="text" class="text-right form-control btnsmall balance ${bgcls} btnsmall" value="${item.OutOfBalance ?? 0
					}" readonly />`;

				html += `<td class="text-right locqty">${_html}</td>`;
			}
			if (forstock) {
				let _html = `<button class="btn btn-info mr-2 edit btnsmall" type="button" data-id="${item.itmItemID}" onclick="editItem(${item.itmItemID});"><span class="">${edittxt}</span></button>`;
				html += `<td>${_html}</td>`;
			}
			html += "</tr>";
		});

		$(`#${gTblId} tbody`).empty().html(html);


		let $pager = $(".Pager");
		$pager.ASPSnippets_Pager({
			ActiveCssClass: "current",
			PagerCssClass: "pager",
			PageIndex: model.PageIndex,
			PageSize: model.PageSize,
			RecordCount: model.RecordCount,
		});

		setInput4NumberOnly("locqty");
	}


	togglePaging(type, model.Items.length > 0);
}
function handleItemDesc(itemnamedesc: string): string {
	//let length = lang == 2 ? 40 : 20;
	let length = 40;
	if (itemnamedesc.length > length) {
		itemnamedesc = itemnamedesc.substring(0, length);
		itemnamedesc = itemnamedesc.concat("...");
	}
	return itemnamedesc;
}

function HandleStockDblClick(itemcode: string) {
	selectedItem = initItem();
	selectedItem!.itmCode = itemcode;
	openItemBuySellUnitsModal();
}


function editItem(itemId: number) {
	openWaitingModal();
	window.location.href = `/Item/Edit?itemId=${itemId}&referrer=stock`;
}
function removeItem(itemId: number) {
	$.fancyConfirm({
		title: "",
		message: confirmremovetxt,
		shownobtn: true,
		okButton: oktxt,
		noButton: nottxt,
		callback: function (value) {
			if (value) {
				$.ajax({
					type: "POST",
					url: "/Item/Delete",
					data: {
						__RequestVerificationToken: $(
							"input[name=__RequestVerificationToken]"
						).val(),
						itemId,
					},
					success: function (data) {
						$.fancyConfirm({
							title: "",
							message: data,
							shownobtn: false,
							okButton: oktxt,
							noButton: notxt,
							callback: function (value) {
								if (value) {
									$("#txtKeyword").trigger("focus");
								}
							},
						});
					},
					dataType: "json",
				});
			} else {
				$("#txtKeyword").trigger("focus");
			}
		},
	});
}

function initJsStock(): IJsStock {
	return {
		Id: "",
		itmCode: "",
		LocCode: "",
		Qty: 0,
	};
}

// jquery ready start
$(function () {
	// jQuery code

	//////////////////////// Prevent closing from click inside dropdown
	$(document).on("click", ".dropdown-menu", function (e) {
		e.stopPropagation();
	});

	// make it as accordion for smaller screens
	if (<number>$(window).width() < 992) {
		$(".dropdown-menu a").on("click", function (e) {
			e.preventDefault();
			if ($(this).next(".submenu").length) {
				$(this).next(".submenu").toggle();
			}
			$(".dropdown").on("hide.bs.dropdown", function () {
				$(this).find(".submenu").hide();
			});
		});
	}
}); // jquery end

$(document).on("change", ".stockmode", function () {
	window.location.href = $(this).val();
});

function initStockTransfer(): IStockTransfer {
	return {
		Id: 0,
		tmpId: "",
		stCode: stockTransferCode,
		stSender: "",
		stReceiver: "",
		itmCode: "",
		inQty: 0,
		outQty: 0,
		stCounted: 0,
		stVariance: 0,
		stSignedUp_Sender: false,
		stSignedUp_Receiver: false,
		stShop: "",
		stDate: new Date(),
		itmNameDesc: "",
		stChecked: false,
		stRemark: "",
		poIvId: "",
		ivIdList: "",
		CreateTime: new Date(),
		ModifyTime: new Date(),
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
	};
}
function convertNumToString(inum: any): string {
	if (!isNaN(inum)) {
		return (inum as number).toString();
	}
	return inum;
}

function caller(f) {
	f();
}
function fancyMsg(
	msg: string,
	oktxt: string,
	notxt: string,
	callbackfunc: any = null,
	shownobtn: boolean = false,
	title: string = ""
) {
	//not working! fancyconfirm must not be included in the other function!!!
	$.fancyConfirm({
		title: title,
		message: msg,
		shownobtn: shownobtn,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				if (callbackfunc !== null) {
					caller(callbackfunc);
				}
			}
		},
	});
}
function getExRate(currencyCode: string): number {
	const exrate = $.isEmptyObject(DicCurrencyExRate)
		? 1
		: DicCurrencyExRate[currencyCode];
	//console.log("exrate:" + exrate);
	displayExRate(exrate);
	return exrate;
}
function displayExRate(exrate: number) {
	if (exrate) $("#exratedisplay").text(formatexrate(exrate.toString()));
}
function FillInWholeSales() {
	batchidx = 6;
	snidx = batchidx + 1;
	vtidx = snidx + 1;
	WholeSales = {
		wsUID: $("#WholeSales_wsUID").val() as number,
		wsCode: $("#WholeSales_wsCode").val() as string,
		wsCusID: 0,
		wsCusCode: $("#drpCustomer").val() as string,
		wsCustomerPO: $("#wsCustomerPO").val() as string,
		wsCustomerTerms: $("#wsCustomerTerms").val() as string,
		wsSalesLoc: $("#drpLocation").val() as string,
		wsRemark: $("#wsRemark").val() as string,
		wsDate: new Date(),
		WsDateDisplay: <string>$("#WsDateDisplay").val(),
		JsWholesalesDate: $("#wholesalesDate").val() as string,
		wsStatus: ($("#WholeSales_wsStatus").val() as string).toLowerCase(),
		wsCurrency: $("#wsCurrency").val() as string,
		wsExRate: getExRate($("#wsCurrency").val() as string),
		wsDeliveryDate: null,
		wsDvc: $("#WholeSales_wsDvc").val() as string,
		wsRefCode: $("#WholeSales_wsRefCode").val() as string,
		wsType: $("#WholeSales_wsType").val() as string,
		wsCusMbr: "",
		wsLineTotal: 0,
		wsLineTotalPlusTax: 0,
		wsFinalDisc: 0,
		wsFinalDiscAmt: 0,
		wsFinalAdj: 0,
		wsFinalTotal: 0,
		wsRmksOnDoc: "",
		wsCarRegNo: "",
		wsUpldBy: "",
		wsUpldTime: "",
		wsUpLdLog: "",
		wsInternalRmks: "",
		wsMonthBase: false,
		wsLineTaxAmt: 0,
		wsDeliveryAddressId: Number($("#wsDeliveryAddressId").val()),
		wsDeliveryAddress1: $("#txtDelAddr").val() as string,
		wsDeliveryAddress2: "",
		wsDeliveryAddress3: "",
		wsDeliveryAddress4: "",
		DeliveryDateDisplay: <string>$("#WholeSales_DeliveryDateDisplay").val(),
		JsDeliveryDate: <string>$("#deliveryDate").val(),
		wsReturnDate: "",
		WsTimeDisplay: "",
		wsAllLoc: $("#chkAllLoc").is(":checked"),
		wsChkManualDelAddr: $("#chkDelAddr").is(":checked"),
		Customer: {} as ICustomer,
		CustomerName: $("#txtCustomerName").val() == null ? null : $("#txtCustomerName").val()!.toString(),
		TrimmedRemark: "",
		UploadFileList: [],
		FileList: [],
		ImgList: []
	} as IWholeSales;
}
function initWholeSalesLn(): IWholeSalesLn {
	return {
		wslUID: 0,
		wslSalesLoc: "",
		wslDvc: "",
		wslCode: "",
		wslDate: "",
		wslSeq: currentY + 1,
		wslRefSales: "",
		wslReasonCode: "",
		wslItemCode: selectedItemCode
			? selectedItemCode.toString()
			: getItemCodeBySeq(),
		wslDesc: "",
		wslStockLoc: "",
		wslChkBch: false,
		wslBatchCode: "",
		wslHasSerialNo: false,
		wslHasSn: false,
		wslChkSn: false,
		wslSnReusable: false,
		wslTaxCode: "",
		wslTaxPc: 0,
		wslSellUnit: "",
		wslLineDiscAmt: 0,
		wslLineDiscPc: 0,
		wslDiscSpreadPc: 0,
		wslQty: 0,
		wslDelQty: 0,
		wslTaxAmt: 0,
		wslSalesAmt: 0,
		wslType: "",
		wslSellingPrice: 0,
		wslSellingPriceMinusInclTax: 0,
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
		wslStatus: "",
		itmName: "",
		itmNameDesc: "",
		//itmCode: '',
		//itmDesc: '',
		snbvlist: [],
		SerialNoList: [],
		wslValidThru: null,
		ValidThruDisplay: "",
		JsValidThru: "",
		snoUID: 0,
		snvtList: [],
		MissingItemOptions: false,
		Item: {} as IItem,
		JobID: 0,
		comboIvId: "",
		SelectedIvList: [],
		ivIdList: "",
		itemVariList: [],
	};
}
function initDevice(): IDevice {
	return {
		dvcUID: 0,
		dvcIsActive: false,
		dvcCode: "",
		dvcShop: "",
		dvcNextRtlSalesNo: 0,
		dvcNextRefundNo: 0,
		dvcNextDepositNo: 0,
		dvcNextPurchaseNo: 0,
		dvcNextPsReturnNo: 0,
		dvcNextWholeSalesNo: 0,
		dvcNextWsReturnNo: 0,
		dvcNextRtlSalesNoHold: 0,
		dvcNextRtlQuoNo: 0,
		dvcNextSessionNo: 0,
		dvcName: "",
		dvcShopName: "",
		dvcLastDataChange: "",
		dvcOpStatus: "",
		dvcStockLoc: "",
		dvcPicPath: "",
		dvcMyoDat: "",
		dvcMyoExe: "",
		dvcMyoVer: "",
		dvcXlsPath: "",
		dvcTicketPrinter: "",
		dvcA4Printer: "",
		dvcDisplayPoleConnTo: "",
		dvcDisplayPolePort: "",
		dvcCashDrawerConnTo: "",
		dvcCashDrawerPort: "",
		dvcReceiptPrinter: "",
		dvcDayEndPrinter: "",
		dvcReceiptCopiesCash: 0,
		dvcReceiptCopiesNonCash: 0,
		dvcDefaultCusSales: "",
		dvcDefaultCusRefund: "",
		dvcWcpTermID: "",
		dvcRmks: "",
		dvcShopInfo: "",
		dvcPageHead: "",
		dvcPageFoot: "",
		dvcRtlSalesCode: "",
		dvcRtlRefundCode: "",
		dvcPurchasePrefix: "",
		dvcPsReturnCode: "",
		dvcWholesalesPrefix: "",
		dvcWsReturnCode: "",
		dvcRtlSalesInitNo: "",
		dvcRtlRefundInitNo: "",
		dvcPurchaseInitNo: "",
		dvcPsReturnInitNo: "",
		dvcWholeSalesInitNo: "",
		dvcWsReturnInitNo: "",
		dvcCreateBy: "",
		dvcCreateTime: "",
		dvcModifyBy: "",
		dvcModifyTime: "",
		dvcLockBy: "",
		dvcLockTime: "",
		dvcIP: "",
		dvcInvoicePrefix: "",
		dvcRefundPrefix: "",
		accountNo: 0,
		accountProfileId: 0,
		companyId: 0,
		dvcNextTransferNo: 0,
		dvcTransferCode: "",
	};
}
function convertCsharpDateStringToJsDate(strdate: string): Date {
	return new Date(Date.parse(strdate));
}
function setValidThruDatePicker() {
	if (forpurchase) {
		$(".validthru").datepicker({
			dateFormat: jsdateformat,
			beforeShow: function () {
				setTimeout(function () {
					$(".ui-datepicker").css("z-index", 99999999999999);
				}, 0);
			},
		});
	} else {
		$(".validthru")
			.not(".focus")
			.datepicker({
				dateFormat: jsdateformat,
				beforeShow: function () {
					setTimeout(function () {
						$(".ui-datepicker").css("z-index", 99999999999999);
					}, 0);
				},
			});
	}

	$(".snvalidthru").datepicker({
		dateFormat: jsdateformat,
		beforeShow: function () {
			setTimeout(function () {
				$(".ui-datepicker").css("z-index", 99999999999999);
			}, 0);
		},
	});
	$(".pobavt").datepicker({
		dateFormat: jsdateformat,
		beforeShow: function () {
			setTimeout(function () {
				$(".ui-datepicker").css("z-index", 99999999999999);
			}, 0);
		},
	});
	$(".posnvt").datepicker({
		dateFormat: jsdateformat,
		beforeShow: function () {
			setTimeout(function () {
				$(".ui-datepicker").css("z-index", 99999999999999);
			}, 0);
		},
	});
}

function initPoBatVQ(): IPoBatVQ {
	return {
		pocode: "",
		batchcode: "",
		vt: null,
		batchqty: 0,
	};
}
function initPoItemBatVQ(): IPoItemBatVQ {
	return {
		id: "",
		pocode: "",
		itemcode: "",
		batchcode: "",
		vt: null,
		batchqty: 0,
	};
}
function initItemBatchVQ(): IItemBatchVQ {
	return {
		itemcode: "",
		batchcode: "",
		vt: null,
		batchqty: 0,
	};
}
function initBatchVQ(): IBatchVQ {
	return {
		batchcode: "",
		vt: null,
		batchqty: 0,
	};
}
function initBatchQty(): IBatchQty {
	return {
		batcode: "",
		batqty: 0,
		sellableqty: 0,
		itemcode: "",
		delqty: 0,
		seq: 0,
		batId: 0,
		pocode: "",
	};
}
function initBatchVtQty(): IBatchVtQty {
	return {
		batchcode: "",
		validthru: "",
		batchqty: 0,
	};
}
function initItemQtyValidThru(): IPoItemQtyValidThru {
	return {
		PoCode: "",
		ItemCode: "",
		TotalQty: 0,
		LnQty: 0,
		ValidThru: "",
	};
}
function initValidThruBatchSn(): IValidThruBatchSn {
	return {
		ValidThru: null,
		Batch: null,
		SN: null,
	};
}
function initVtQty(): IVtQty {
	return {
		vtId: 0,
		vt: "",
		delqty: 0,
		qty: 0,
		pocode: "",
		vtseq: 0,
		itemcode: "",
		sellableqty: 0,
	};
}


function initPoBatchQty(): IPoItemBatchVQty {
	return {
		PoCode: "",
		ItemCode: "",
		Batch: null,
		ValidThru: null,
		Qty: 0,
	};
}


function containsObject(obj, list) {
	var i;
	for (i = 0; i < list.length; i++) {
		if (list[i] === obj) {
			return true;
		}
	}
	return false;
}


function initDeliveryItem(
	$tr: JQuery<HTMLElement> | null = null
): IDeliveryItem {
	if ($tr !== null) {
		let pidx: number = 10; //price index
		let didx: number = pidx + 1;
		let tidx: number = pidx + 2;
		let lidx: number = pidx + 3;
		let jidx: number = pidx + 4;
		let $td = $tr.find("td");
		return {
			Id: 0,
			CompanyId: 0,
			AccountProfileId: 0,
			dlCode: forwholesales ? WholeSales.wsCode : Sales.rtsCode,
			seq: seq,
			batseq: 0,
			snseq: 0,
			vtseq: 0,
			ivseq: 0,
			dlStatus: forwholesales ? WholeSales.wsStatus : Sales.rtsStatus,
			itmCode: $td.eq(1).find(".itemcode").val() as string,
			itmNameDesc: $td.eq(2).find(".itemdesc").val() as string,
			snlist: [],
			dlBaseUnit: $td.eq(3).find(".sellunit").val() as string,
			dlQty: Number($td.eq(5).find(".delqty").val()),
			dlBatch: "",
			dlHasSN: false,
			dlValidThru: null,
			VtDisplay: null,
			JsVt: null,
			dlIvId: null,
			dlUnitPrice: Number($td.eq(pidx).find(".price").val()),
			dlDiscPc: Number($td.eq(didx).find(".discpc").val()),
			dlTaxPc: Number($td.eq(tidx).find(".taxpc").val()),
			dlTaxAmt: 0,
			dlAmt: Number($td.last().find(".amount").val()),
			dlAmtPlusTax: Number($td.last().find(".amount").val()),
			pstCode: "",
			snoCode: "",
			CreateTimeDisplay: "",
			ModifyTimeDisplay: "",
			currentbdq: 0,
			newbdq: 0,
			batqty: 0,
			snvtlist: [],
			vttotalqty: 0,
			newvtqty: 0,
			vtdelqty: 0,
			currentvdq: 0,
			dlBatId: null,
			dlVtId: null,
			dlStockLoc: $td.eq(lidx).find(".location").val() as string,
			JobID: Number($td.eq(jidx).find(".job").val()),
			ivIdList: null,
			ivList: [],
		};
	} else {
		return {
			Id: 0,
			CompanyId: 0,
			AccountProfileId: 0,
			dlCode: "",
			seq: seq,
			batseq: 0,
			snseq: 0,
			vtseq: 0,
			ivseq: 0,
			dlStatus: "",
			itmCode: "",
			itmNameDesc: "",
			snlist: [],
			dlBaseUnit: "",
			dlQty: 0,
			dlBatch: "",
			dlHasSN: false,
			dlValidThru: null,
			VtDisplay: null,
			JsVt: null,
			dlIvId: null,
			dlUnitPrice: 0,
			dlDiscPc: 0,
			dlTaxPc: 0,
			dlTaxAmt: 0,
			dlAmt: 0,
			dlAmtPlusTax: 0,
			pstCode: "",
			snoCode: "",
			CreateTimeDisplay: "",
			ModifyTimeDisplay: "",
			currentbdq: 0,
			newbdq: 0,
			batqty: 0,
			snvtlist: [],
			vttotalqty: 0,
			newvtqty: 0,
			vtdelqty: 0,
			currentvdq: 0,
			dlBatId: null,
			dlVtId: null,
			dlStockLoc: "",
			JobID: 0,
			ivIdList: null,
			ivList: [],
		};
	}
}
function initItemOptions(): IItemOptions {
	return {
		ChkBatch: false,
		ChkSN: false,
		WillExpire: false,
		Disabled: false,
	};
}
function toggleSnVt() {
	itemOptions = DicItemOptions[selectedItemCode];
	//console.log('itemoptions:', itemOptions);
	if (itemOptions.WillExpire) {
		$("#tblSerial thead tr").find("th:eq(2)").show();
	} else {
		$("#tblSerial thead tr").find("th:eq(2)").hide();
	}
}
function initSnVtPo(): ISnVtPo {
	return {
		pocode: "",
		sn: "",
		vt: "",
		selected: false,
	};
}


$(document).on("click", ".snminus", function () {
	$tr = $(this).parent("td").parent("tr");
	$.fancyConfirm({
		title: "",
		message: confirmremovetxt,
		shownobtn: true,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				$tr.remove();
			} else {
				$tr.find("td:eq(1)").find(".pserial").trigger("focus");
			}
		},
	});
});
$(document).on("click", ".snplus", function () {
	addPoSnRow(true);
});

function fillSnRow(idx: number, snseqvt: ISnBatSeqVt | null): string {
	let html = "";
	let _seq: number =
		snseqvt === null ? idx + 1 : ((<ISnBatSeqVt>snseqvt).snseq as number);

	html += `<tr data-idx="${idx}" data-itemcode="${selectedItemCode}" data-snseq="${_seq}">`;
	let sn: string = snseqvt === null ? "" : (<ISnBatSeqVt>snseqvt).sn;
	let vt: string =
		snseqvt === null ? "" : ((<ISnBatSeqVt>snseqvt).vt as string);

	html += `<td>${idx + 1}</td><td><input type="text" class="form-control text-center posn" value="${sn}" /></td>`;

	if (itemOptions && itemOptions.WillExpire) {
		html += `<td><input type="datetime" class="form-control text-center datepicker posnvt small" value="${vt}" title="${vt}" /></td>`;
	}

	if (Purchase.pstStatus != "opened" && Purchase.pstStatus != "partialreceival") {
		html += `<td><button type="button" class="btn btn-danger snminus"><i class="fa fa-minus"></i></button></td>`;
	}

	html += `</tr>`;
	return html;
}
function addPoSnRow(plus: boolean = false) {
	$target = purchaseSerialModal.find("#tblPserial tbody");
	let html = "";

	if (plus) {
		html = fillSnRow($(`#tblPserial tbody tr`).length, null);
	} else {
		if (forpurchase) {
			//console.log("here");
			if (SelectedPurchaseItem!.snbatseqvtlist.length > 0) {
				let $rows = $target.find("tr");
				let tblSns: string[] = [];
				if ($rows.length > 0) {
					$rows.each(function (i, e) {
						let sn = $(e).find("td:eq(1)").find(".posn").val() as string;
						if (typeof sn !== "undefined") tblSns.push(sn);
					});
					$.each(SelectedPurchaseItem!.snbatseqvtlist, function (i, e) {
						//tblSns.includes(e.sn) may happen when sn length !== po quantity
						if (tblSns.length > 0 && tblSns.includes(e.sn)) {
							html = fillSnRow(0, null);
							return false;
						} else {
							html += fillSnRow(i, e);
						}
					});
				} else {
					$.each(SelectedPurchaseItem!.snbatseqvtlist, function (i, e) {
						html += fillSnRow(i, e);
					});
				}
			} else {
				//console.log('selectedPurchaseItem!.piReceivedQty:' + selectedPurchaseItem!.piReceivedQty);				
				for (let i = 0; i < SelectedPurchaseItem!.piReceivedQty; i++) {
					html += fillSnRow(i, null);
				}
			}
		}
	}

	$target.append(html);
	setValidThruDatePicker();
	setSerialFocus($target);
}
function setSerialFocus($target: JQuery) {
	$target.find("tr").each(function (i, e) {
		let $pserial = $(e).find("td").eq(1).find(".posn");
		if ($pserial.val() === "") {
			$pserial.trigger("focus");
			return false;
		}
	});
}
$(document).on("change", ".posn", function () {
	//check if duplicated on the client side:
	let sn = $(this).val() as string;
	if (sn !== "") {
		let samesncount: number = 0;
		$("#tblPserial tbody tr").each(function (i, e) {
			$target = $(e).find("td:eq(1)").find(".posn");
			if ($target.val() == sn) {
				//disable vt datepicker first
				$target.parent("td").next("td").find(".posnvt").prop("disabled", true);
				samesncount++;
				//return false;
			}
		});

		if (samesncount > 1) {
			duplicatedSerailNo = true;
			$(this).val("");
			handleDuplicatedPoSn(duplicatedsnwarning);
			duplicatedSerailNo = false;
		} else {
			if (forpurchase) {
				$.each(Purchase.PurchaseItems, function (i, e) {
					if (e.snbatseqvtlist.length > 0) {
						$.each(e.snbatseqvtlist, function (idx, ele) {
							//console.log('ele.sn:' + ele.sn + ';sn:' + sn + ';equal?' + ele.sn == sn);
							if (ele.sn == sn) {
								duplicatedSerailNo = true;
								return false;
							}
						});
					}
				});
			}

			if (duplicatedSerailNo) {
				$(this).val("");
				handleDuplicatedPoSn(duplicatedsnwarning);
				duplicatedSerailNo = false;
			} else {
				posnseq = Number(
					$(this).parent("td").parent("tr").find("td:first").text()
				);
				//console.log("check server side:");
				//check server side:
				getRemoteData(
					"/Api/CheckIfDuplicatedSN",
					{ sn: sn },
					checkIfDuplicatedSNOk,
					getRemoteDataFail
				);
			}
		}
	}
});


$(document).on("change", ".posnvt", function () {
	posnvt = $(this).val() as string;
});

function checkIfPoSnDuplicatedSNOk(data) {
	//console.log(data);
	duplicatedSerailNo = data.serialno !== null;
	if (duplicatedSerailNo) {
		let msg = duplicatedserialnowarning;
		snUsedDate = data.serialno.PurchaseDateDisplay;
		msg = msg
			.replace("{1}", snUsedDate)
			.replace("{0}", data.serialno.snoStockInCode);
		handleDuplicatedPoSn(msg);
	}
}

function handleDuplicatedPoSn(msg: string) {
	$.fancyConfirm({
		title: duplicatedserialno,
		message: msg,
		shownobtn: false,
		okButton: oktxt,
		noButton: canceltxt,
		callback: function (value) {
			if (value) {
				$("#tblPserial tbody tr")
					.eq(posnseq)
					.find("td:eq(1)")
					.find(".posn")
					.addClass("focus")
					.trigger("focus");
			}
		},
	});
}
function resetPurchaseSerialModal() {
	$("#tblPserial tbody").empty();
}

function _confirmSnVt() {
	closePurchaseSerialModal();
	resetPurchaseSerialModal();
}
function confirmPoSn() {
	let bOk = false;
	let itemcode = forpurchase
		? SelectedPurchaseItem!.itmCode
		: selectedSalesLn!.rtlItemCode;
	itemOptions = DicItemOptions[itemcode];
	let msg = "";

	if (itemcode != "") {
		if (typeof itemSeqSnBatSeqVtList[itemcode] === "undefined") {
			itemSeqSnBatSeqVtList[itemcode] = { [seq.toString()]: [] };
		} else if (
			typeof itemSeqSnBatSeqVtList[itemcode][seq.toString()] === "undefined"
		) {
			itemSeqSnBatSeqVtList[itemcode][seq.toString()] = [];
		}

		let $rows = $("#tblPserial tbody tr");
		if ($rows.length === 1) {
			msg = handlePoSn4Confirm($rows, itemcode);
		} else {
			$rows.each(function (i, e) {
				//console.log('here');
				msg = handlePoSn4Confirm($(e), itemcode);
			});
		}
		bOk = msg === "";

		if (bOk) {
			/*Error -234:  Received quantity cannot exceed the Ordered quantity.*/
			if (forpurchase) {
				let snqty = SelectedPurchaseItem!.snbatseqvtlist.length;
				if (
					SelectedPurchaseItem!.snbatseqvtlist.length >
					SelectedPurchaseItem!.piReceivedQty ||
					SelectedPurchaseItem!.snbatseqvtlist.length <
					SelectedPurchaseItem!.piReceivedQty
				) {
					/*if (selectedPurchaseItem!.snbatseqvtlist.length < selectedPurchaseItem!.piReceivedQty) {*/
					$.fancyConfirm({
						title: "",
						message: serialnoqtymustmatchreceivedqtyprompt,
						shownobtn: false,
						okButton: oktxt,
						noButton: notxt,
						callback: function (value) {
							$target = $(`#${gTblId} tbody tr`)
								.eq(currentY)
								.find("td:last")
								.find(".received");
							if (value) {
								$target.attr("max", snqty).val(snqty).trigger("focus");
								$target.trigger("change");
								_confirmSnVt();
							} else {
								$("#tblPserial tbody tr:last")
									.find("td:eq(1)")
									.find(".posn")
									.trigger("focus");
							}
						},
					});
				} else {
					_confirmSnVt();
				}

				$.each(Purchase.PurchaseItems, function (i, e) {
					if (e.piSeq == seq) {
						e.snbatseqvtlist = SelectedPurchaseItem!.snbatseqvtlist.slice(0);
						e.piHasSN = e.snbatseqvtlist.length > 0;
						return false;
					}
				});
			}

			setPoSnMark();

			if (itemOptions.WillExpire) {
				setExpiryDateMark();
			}
			//console.log('purchaseitems#ok:', Purchase.PurchaseItems);
		} else {
			$.fancyConfirm({
				title: "",
				message: msg,
				shownobtn: false,
				okButton: oktxt,
				noButton: notxt,
				callback: function (value) {
					if (value) {
						$("#tblPserial tbody tr").find(".focus").first().trigger("focus");
					}
				},
			});
		}
	}
}

function handlePoSn4Confirm($tr: JQuery, itemcode: string): string {
	let msg = "";
	$target = $tr.find("td:eq(1)").find(".posn");
	let serialcode: string = $target.val() as string;
	if (serialcode === "") {
		msg += `#${$tr.data("snseq")}${rowtxt} ${snrequiredtxt}<br>`;
		$target.addClass("focus");
	} else {
		getRemoteData(
			"/Api/CheckIfDuplicatedSN",
			{ sn: serialcode },
			checkIfPoSnDuplicatedSNOk,
			getRemoteDataFail
		);
	}
	if (!duplicatedSerailNo) {
		// console.log("here");
		let serial: ISnBatSeqVt = initSnBatSeqVt();
		serial.sn = serialcode;
		serial.snseq = $tr.data("snseq") as number;

		if (itemOptions && itemOptions.ChkBatch && itemOptions.ChkSN) {
			serial.batcode = forpurchase
				? SelectedPurchaseItem!.batchList[0].batCode
				: selectedSalesLn!.batchList[0].batCode;
		}

		$target = $tr.find("td:eq(2)").find(".posnvt");
		let validthru: any = $target.val();
		if (validthru) validthru = validthru.toString().trim();
		if (itemOptions && itemOptions.WillExpire) {
			if (validthru === "") {
				msg += `#${serial.snseq}${rowtxt} ${expirydaterequiredtxt}<br>`;
				$target.addClass("focus");
			} else {
				serial.vt = validthru;
			}
		}
		updateUniqueSerial(serial, itemcode);
	}
	return msg;
}

function updateUniqueSerial(serial: ISnBatSeqVt, itemcode: string) {
	if (serial.sn !== "") {
		//console.log("snbatseqvtlist#0:", selectedPurchaseItem!.snbatseqvtlist);
		if (forpurchase) {
			if (SelectedPurchaseItem!.snbatseqvtlist.length > 0) {
				let idx = SelectedPurchaseItem!.snbatseqvtlist.findIndex(
					(s) => { return s.snseq === serial.snseq; }
				);
				if (idx >= 0) {
					SelectedPurchaseItem!.snbatseqvtlist[idx] = structuredClone(serial); //update
				} else {
					SelectedPurchaseItem!.snbatseqvtlist.push(serial);
				}
			} else {
				SelectedPurchaseItem!.snbatseqvtlist.push(serial);
			}
		}

		if (itemSeqSnBatSeqVtList[itemcode][seq.toString()].length > 0) {
			let idx = itemSeqSnBatSeqVtList[itemcode][seq.toString()].findIndex(
				(s) => { return s.snseq === serial.snseq; }
			);
			if (idx >= 0) {
				itemSeqSnBatSeqVtList[itemcode][seq.toString()][idx] =
					structuredClone(serial); //update
			} else {
				itemSeqSnBatSeqVtList[itemcode][seq.toString()].push(serial);
			}
		} else {
			itemSeqSnBatSeqVtList[itemcode][seq.toString()].push(serial);
		}
	}
}

function setPoSnMark() {
	let $tr = $(`#${gTblId} tbody tr`);
	$tr
		.eq(currentY)
		.find("td")
		.eq(6)
		.find(".posn")
		.removeClass("focus")
		.val("...");
	/* $(`#${gTblName} tbody tr`).eq(currentY).find('td:eq(5)').find('.posn').removeClass('focus');*/
}

$(document).on("click", ".batminus", function () {
	$tr = $(this).parent("td").parent("tr");
	$.fancyConfirm({
		title: "",
		message: confirmremovetxt,
		shownobtn: true,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				$tr.remove();
			} else {
				$tr.find("td:eq(1)").find(".pbatch").trigger("focus");
			}
		},
	});
});
$(document).on("click", ".batplus", function () {
	addPoBatRow(true);
});

function fillBatchRow(index: number | null, batch: IBatch | null): string {
	if (!itemOptions) return "";
	
	//console.log("batch#fill:", batch);
	let html = "";
	let idx = batch === null ? Number(index) : Number(batch.batSeq) - 1;
	let batcode = batch === null ? "" : batch.batCode;
	let vt = batch === null ? "" : batch.BatVtDisplay ?? "N/A";
	let batseq = batch === null ? idx + 1 : batch.batSeq;
	let batqty = batch === null ? 0 : batch.batQty;
	//console.log("batqty:" + batqty);
	html += `<tr data-idx="${idx}" data-batseq="${batseq}">`;
	html += `<td>${idx + 1
		}</td><td class="text-center"><input type="text" class="form-control pbatch" value="${batcode}" /></td>`;

	if (
		(itemOptions.ChkSN && itemOptions.WillExpire) ||
		(itemOptions.ChkBatch && !itemOptions.WillExpire)
	) {
	} else {

		html += `<td class="text-center"><input type="datetime" class="form-control datepicker pobavt small" value="${vt}" /></td>`;
	}

	if (itemOptions.ChkBatch && !itemOptions.ChkSN)
		html += `<td class="text-right"><input type="number" class="form-control batqty" value="${batqty}" /></td>`;

	if (itemOptions.ChkBatch && itemOptions.ChkSN) {
	} else {
		html += `<td><button type="button" class="btn btn-danger batminus"><i class="fa fa-minus"></i></button></td>`;
	}

	html += `</tr>`;
	return html;
}
function addPoBatRow(isPlus: boolean = true) {
	$target = purchaseBatchModal.find("#tblPbatch tbody");
	let html = "";
	if (isPlus) {
		html = fillBatchRow($(`#tblPbatch tbody tr`).index()+1, null);
	} else {
		if (
			SelectedPurchaseItem &&
			SelectedPurchaseItem!.batchList &&
			SelectedPurchaseItem!.batchList.length > 0
		) {
			if (Purchase.pstStatus == "order") {
				let idx = -1;
				$.each(SelectedPurchaseItem!.batchList, function (i, e) {
					if (e.seq == seq) {
						idx = i;
						html += fillBatchRow(i, e);
						return false;
					}
				});
				if (idx < 0) {
					html = fillBatchRow(0, null);
				}
			} else {
				$.each(SelectedPurchaseItem!.batchList, function (i, e) {
					html += fillBatchRow(i, e);
				});
				//console.log("html:", html);
			}
		} else {
			html = fillBatchRow(0, null);
		}
	}	
	/*$target.empty().append(html);*/
	$target.append(html);
	if (forpurchase) {
		if (Purchase.pstStatus != "opened") {
			setBatchFocus();
			setValidThruDatePicker();
		}
	}
}
function resetPurchaseBatchModal() {
	$("#tblPbatch tbody").empty();
}

function setBatchFocus() {
	$("#tblPbatch tbody tr").each(function (i, e) {
		let $pbat = $(e).find("td").eq(1).find(".pbatch");
		if ($pbat.val() === "") {
			$pbat.trigger("focus");
			return false;
		}
	});
}

function checkBatQty(): boolean {
	let qty = $(`#${gTblId} tbody tr`)
		.eq(currentY)
		.find("td:eq(4)")
		.find(".qty")
		.val() as number;
	let totalbatqty = 0;
	$("#tblPbatch tbody tr").each(function (i, e) {
		let idx = itemOptions && itemOptions.WillExpire ? 3 : 2;
		totalbatqty += Number($(e).find("td").eq(idx).find(".batqty").val());
	});
	//console.log('qty:' + qty + ':totalbatqty:' + totalbatqty);
	if (totalbatqty > qty) {
		$.fancyConfirm({
			title: "",
			message: batqtymustnotgtpoqtytxt,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$(".batqty").addClass("focus");
				}
			},
		});
	}
	return qty >= totalbatqty;
}

function confirmPoBatch() {
	if (itemOptions && !itemOptions.ChkSN && !checkBatQty()) {
		return false;
	}

	let bOk = false;
	itemOptions = DicItemOptions[selectedItemCode];
	let msg = "";

	$("#tblPbatch tbody tr").each(function (i, e) {
		msg += _confirmPoBatch($(e));
	});

	bOk = msg === "";

	if (bOk) {
		closePurchaseBatchModal();
		if (forpurchase) {
			$.each(Purchase.PurchaseItems, function (i, e) {
				//console.log('e.piseq:' + e.piSeq + ';seq:' + seq);
				if (e.piSeq == seq) {
					e.batchList = SelectedPurchaseItem!.batchList.slice(0);
					let lnqty = 0;
					$.each(e.batchList, function (k, v) {
						lnqty += v.batQty;
					});
					return false;
				}
			});
		}

		setBatchMark();
		$(`#${gTblId} tbody tr`)
			.eq(currentY)
			.find("td:eq(5)")
			.find(".pobatch")
			.removeClass("focus");
		if (!itemOptions.ChkSN && itemOptions.WillExpire) {
			setExpiryDateMark();
			$(`#${gTblId} tbody tr`)
				.eq(currentY)
				.find("td:eq(7)")
				.find(".validthru")
				.removeClass("focus validthru datepicker")
				.prop("readonly", true);
		}
	} else {
		$.fancyConfirm({
			title: "",
			message: msg,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$("#tblPbatch tbody tr").find(".focus").first().trigger("focus");
				}
			},
		});
	}
}
function _confirmPoBatch($tr: JQuery): string {
	let msg = "";
	let idx = 1;
	$target = $tr.find("td").eq(idx).find(".pbatch");
	let batchcode: string = $target.val() as string;
	let batch: IBatch = initBatch();
	batch.batItemCode = selectedItemCode.toString();
	batch.batSeq = Number($tr.data("batseq"));

	if (itemOptions && itemOptions.ChkBatch) {
		// console.log("batchcode:" + batchcode);
		if (batchcode === "") {
			msg += `#${seq}${rowtxt} ${batchrequiredtxt}<br>`;
			$target.addClass("focus");
		} else {
			batch.batCode = batchcode;
		}

		if (itemOptions.WillExpire) {
			idx++;
			$target = $tr.find("td").eq(idx).find(".pobavt");
			let validthru: any = $target.val();
			if (validthru) validthru.toString().trim();
			if (itemOptions.WillExpire) {
				if (validthru === "") {
					msg += `#${seq}${rowtxt} ${expirydaterequiredtxt}<br>`;
					$target.addClass("focus");
				} else {
					batch.validthru = validthru;
				}
			}
		}

		if (!itemOptions.ChkSN) {
			idx++;
			$target = $tr.find("td").eq(idx).find(".batqty");
			batch.batQty = Number($target.val());
			if (batch.batQty == 0) {
				msg += `#${seq}${rowtxt} ${batqtyrequiredtxt}<br>`;
				$target.addClass("focus");
			}
		} else {
			batch.batQty = Number(
				$(`#${gTblId} tbody tr`)
					.eq(currentY)
					.find("td")
					.eq(4)
					.find(".qty")
					.val()
			);
		}
	}

	if (msg === "") {
		//console.log("batchlist#0:", selectedPurchaseItem!.batchList);
		if (forpurchase) {
			if (!SelectedPurchaseItem)
				SelectedPurchaseItem = Purchase.PurchaseItems.find(
					(x) => x.piSeq == seq
				)!;

			let idx = SelectedPurchaseItem!.batchList.findIndex(
				(b) => { return b.batSeq == batch.batSeq; }
			);
			if (idx >= 0) {
				SelectedPurchaseItem!.batchList[idx] = structuredClone(batch); //update
			} else {
				SelectedPurchaseItem!.batchList.push(batch);
			}
		}
	}
	return msg;
}

function confirmIvQty() {
	ivdelqtychange = false; //reset ivdelqtychange
	let lnqty: number = 0;

	if (!itemOptions) return false;

	$("#tblIv tbody tr").each(function (i, e) {
		$(e)
			.find("td")
			.first()
			.find(".ivdelqty")
			.each(function (k, v) {
				let newivqty = Number($(v).val());
				if (newivqty > 0) {
					deliveryItem = initDeliveryItem();
					deliveryItem.dlQty = newivqty;
					deliveryItem.seq = seq;
					deliveryItem.pstCode = $(v).data("pocode") as string;
					deliveryItem.dlCode = $(v).data("id") as string;
					deliveryItem.ivIdList = $(v).data("ividlist").toString().trim();
					deliveryItem.itmCode = $(v).data("itemcode") as string;

					deliveryItem.ivseq = Number($(v).data("ivseq"));
					deliveryItem.dlVtId = Number($(v).data("ivid"));

					lnqty += newivqty;
					getItemInfo4BatSnVtIv();

					let idx = -1;
					DeliveryItems.every((d, i) => {
						if (d.dlCode == deliveryItem!.dlCode && d.seq == seq) {
							idx = i;
							//update
							d = structuredClone(deliveryItem) as IDeliveryItem;
							return false;
						}
					});

					if (deliveryItem.dlQty <= 0) {
						DeliveryItems.splice(idx, 1);
					}

					//add
					if (idx < 0) {
						DeliveryItems.push(deliveryItem);
					}
				}
			});
	});

	//console.log("DeliveryItems#confirmivqty:", DeliveryItems);
	//$("#totalivdelqty").data("totalivdelqty", lnqty).val(lnqty);

	let $qty = $(`#${gTblId} tbody tr`)
		.eq(currentY)
		.find("td")
		.eq(4)
		.find(".qty");

	const qty: number = Number($qty.val());

	if (lnqty > qty) {
		//console.log("here");
		$.fancyConfirm({
			title: "",
			message: newqtygtoriginalqtyindeliveryconfirmtxt,
			shownobtn: true,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					if ($qty.val() == "" || $qty.val() == 0) $qty.val(lnqty);

					closeValidthruModal();
					setExpiryDateMark();
				} else {
					lnqty = 0;
					$("#totalivdelqty").data("totalivdelqty", lnqty).val(lnqty);
					$(".ivdelqty").val(0).addClass("focus");

					$("#tblIv tbody tr").each(function (i, e) {
						$(e)
							.find("td")
							.first()
							.find(".ivdelqty")
							.each(function (k, v) {
								let dlCode = $(v).attr("id") as string;
								let idx = -1;
								$.each(DeliveryItems, function (index, ele: IDeliveryItem) {
									if (ele.dlCode == dlCode) {
										idx = index;
										return false;
									}
								});
								if (idx >= 0) DeliveryItems.splice(idx, 1);
							});
					});
				}
			},
		});
	} else {
		closeItemVariModal();
		if (lnqty > 0) {
			$qty.val(lnqty).trigger("change");
			setIvMark();
		}
	}
	console.log(DeliveryItems);
	closeItemVariModal();
}
function confirmPoItemVariQty() {
	let selectedIvIdList: number[] = [];
	poItemVariModal.find(".drpItemAttr").each(function (i, e) {
		selectedIvIdList.push(Number($(e).val()));
	});

	let selectedBatCode: string =
		!itemOptions?.ChkBatch && !itemOptions?.ChkSN && !itemOptions?.WillExpire
			? ""
			: poItemVariModal.find("#batcode").val();

	if (selectedIvIdList.length > 0) {
		$tr = $(`#${gTblId} tbody tr`).eq(currentY);
		$tr.find("td").eq(8).find(".povari").removeClass("focus").val("...");
		const itemcode: string = $tr
			.find("td")
			.eq(1)
			.find(".itemcode")
			.val()!
			.toString();
		const ivqty = Number($tr.find("td").last().find(".received").val());
		const comboId = selectedIvIdList.join(":");
		Purchase.PurchaseItems.forEach((x) => {
			if (x.piSeq == seq) {
				if (
					x.poItemVariList &&
					x.poItemVariList.findIndex((x) => { return x.ivComboId == comboId; }) < 0
				) {
					addPoItemVari(
						x,
						comboId,
						ivqty,
						itemcode,
						selectedIvIdList,
						selectedBatCode
					);
				} else {
					addPoItemVari(
						x,
						comboId,
						ivqty,
						itemcode,
						selectedIvIdList,
						selectedBatCode
					);
				}
			}
		});
	}
	//console.log(Purchase.PurchaseItems);
	closePoItemVariModal();
}

function addItemVari(
	x: IDeliveryItem,
	ivqty: number,
	itemcode: string,
	selectedIvIdList: string[]
) {
	x.ivList = [];
	x.ivList.push({
		JsIdList: selectedIvIdList.slice(0),
		seq: currentY + 1,
		ivQty: ivqty,
		itmCode: itemcode,
		batCode: null,
	} as IPoItemVari);

	x.ivIdList = selectedIvIdList.join();
}
function addPoItemVari(
	x: IPurchaseItem,
	comboId: string,
	ivqty: number,
	itemcode: string,
	selectedIvIdList: number[],
	selectedBatCode: string
) {
	x.poItemVariList.push({
		ivComboId: comboId,
		seq: currentY + 1,
		ivQty: ivqty,
		itmCode: itemcode,
		JsIvIdList: selectedIvIdList.slice(0),
		batCode: selectedBatCode,
	} as IPoItemVari);
}
function initBatch(): IBatch {
	return {
		Id: 0,
		batCode: "",
		batValidThru: null,
		validthru: null,
		BatVtDisplay: null,
		batSeq: null,
		batItemCode: "",
		batStockInCode: "",
		batStockInDate: null,
		JsStockDate: "",
		batQty: 0,
		seq: seq,
	};
}

function confirmTransferQty() { }

function resetVtQty() {
	$(".delqty").val(0);
}

function confirmVtQty() {
	vtdelqtychange = false; //reset vtdelqtychange
	let lnqty: number = 0;

	if (!itemOptions) return false;

	$("#tblVt tbody tr").each(function (i, e) {
		$(e)
			.find(".vtdelqty")
			.each(function (k, v) {
				let newvtqty = Number($(v).val());
				if (newvtqty > 0) {
					deliveryItem = initDeliveryItem();
					deliveryItem.newvtqty = newvtqty;
					deliveryItem.seq = seq;
					deliveryItem.vttotalqty = parseInt($(v).data("qty"));
					if (deliveryItem.newvtqty > deliveryItem.vttotalqty) {
						deliveryItem.newvtqty = deliveryItem.vttotalqty;
						$(v).val(deliveryItem.newvtqty);
					}
					deliveryItem.pstCode = $(v).data("pocode") as string;
					deliveryItem!.dlQty = deliveryItem!.newvtqty;
					deliveryItem.dlCode = $(v).attr("id") as string;
					deliveryItem.JsVt = $(v).data("vt").toString().trim();
					deliveryItem.itmCode = $(v).data("itemcode") as string;

					deliveryItem.vtseq = Number($(v).data("vtseq"));
					deliveryItem.dlVtId = Number($(v).data("vtid"));

					lnqty += deliveryItem!.newvtqty;
					getItemInfo4BatSnVtIv();

					let idx = -1;
					DeliveryItems.every((d, i) => {
						if (d.dlCode == deliveryItem!.dlCode && d.seq == seq) {
							idx = i;
							//update
							d = structuredClone(deliveryItem) as IDeliveryItem;
							return false;
						}
					});

					if (deliveryItem.dlQty <= 0) {
						DeliveryItems.splice(idx, 1);
					}

					//add
					if (idx < 0) {
						DeliveryItems.push(deliveryItem);
					}
				}
			});
	});


	//console.log("$tr.table:", $tr.parent("tbody").parent("table").attr("id"));
	//console.log("$tr.index:", $tr.index());
	let $qty = $tr.find(".qty");
	//console.log("$qty:", $qty);
	const qty: number = Number($qty.val());
	//console.log("lnqty:" + lnqty + ";qty:" + qty);
	if (lnqty > qty) {
		//console.log("here");
		$.fancyConfirm({
			title: "",
			message: newqtygtoriginalqtyindeliveryconfirmtxt,
			shownobtn: true,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					if ($qty.val() == "" || $qty.val() == 0) $qty.val(lnqty);

					closeValidthruModal();
					setExpiryDateMark();
				} else {
					lnqty = 0;
					$("#totalvtdelqty").data("totalvtdelqty", lnqty).val(lnqty);
					$(".vtdelqty").val(0).addClass("focus");

					$("#tblVt tbody tr").each(function (i, e) {
						$(e)
							.find(".vtdelqty")
							.each(function (k, v) {
								let dlCode = $(v).attr("id") as string;
								let idx = -1;
								$.each(DeliveryItems, function (index, ele: IDeliveryItem) {
									if (ele.dlCode == dlCode) {
										idx = index;
										return false;
									}
								});
								if (idx >= 0) DeliveryItems.splice(idx, 1);
							});
					});
				}
			},
		});
	} else {
		closeValidthruModal();
		if (lnqty > 0) {
			$qty.val(lnqty).trigger("change");
			setExpiryDateMark();
		}
	}
}

function resetBatchQty() {
	//DicItemSeqDelQty[genItemSeq(selectedItemCode.toString(), seq)] = 0;
	$(".batdelqty").val(0);
}

function confirmBatchSnQty() {
	chkBatSnVtCount = 0; //reset chkBatSnVtCount
	batdelqtychange = false; //reset batdelqtychange
	let lnqty: number = 0;

	if (!itemOptions) return false;

	$("#tblBatch tbody tr").each(function (i, e) {
		let ividlist: string[] = [];
		if (!$.isEmptyObject(DicIvInfo) && selectedItemCode in DicIvInfo) {
			$(e)
				.data("ivids")
				.toString()
				.split(",")
				.forEach((x) => ividlist.push(x));
		}
		if (!itemOptions!.ChkSN) {
			$(e)
				.find(".batdelqty")
				.each(function (k, v) {
					let newbdq = Number($(v).val());
					if (newbdq > 0) {
						deliveryItem = initDeliveryItem();
						deliveryItem.ivIdList = ividlist.join();
						deliveryItem.newbdq = newbdq;
						deliveryItem.seq = seq;
						//console.log("#confirm deliveryItem.seq:", deliveryItem.seq);

						deliveryItem.batqty = parseInt($(v).data("batqty"));
						if (deliveryItem.newbdq > deliveryItem.batqty) {
							deliveryItem.newbdq = deliveryItem.batqty;
							$(v).val(deliveryItem.newbdq);
						}
						deliveryItem!.dlQty = deliveryItem!.newbdq;

						deliveryItem.pstCode = $(v).data("pocode") as string;
						deliveryItem.dlCode = $(v).attr("id") as string;
						deliveryItem.dlBatch = $(v).data("batch") as string;
						deliveryItem.JsVt = $(v).data("batvt").toString().trim();
						deliveryItem.itmCode = selectedItemCode.toString();
						deliveryItem.batseq = $(v).data("batseq") as number;
						deliveryItem.dlBatId = Number($(v).data("batid"));

						lnqty += deliveryItem!.newbdq;
						getItemInfo4BatSnVtIv();

						//console.log(deliveryItem);
						let idx = -1;
						$.each(DeliveryItems, function (index, ele: IDeliveryItem) {
							if (ele.dlCode == deliveryItem!.dlCode && ele.seq == seq) {
								idx = index;
								ele = structuredClone(deliveryItem) as IDeliveryItem; //update current deliveryitem
								return false;
							}
						});

						if (deliveryItem.dlQty <= 0) {
							DeliveryItems.splice(idx, 1);
						}

						//add
						if (idx < 0) DeliveryItems.push(deliveryItem);
					}
				});
		} else {
			//console.log("here");
			$(e)
				.find(".chkbatsnvt")
				.each(function (k, v) {
					$target = $(v);
					let sn: string = $target.val() as string;
					let batId: string = $target.attr("id") as string;
					let batcode: string = $target.data("batcode") as string;
					let vt: string = $target.data("snvt").toString().trim();
					let pocode: string = $target.data("pocode") as string;

					if ($target.is(":checked")) {
						//if (Number($target.data("seq")) == seq) lnqty++;
						//lnqty++;
						//console.log("lnqty#checked", lnqty);
						let idx = -1;
						$.each(DeliveryItems, function (index, ele) {
							if (ele.dlCode == batId) {
								idx = index;
								return false;
							}
						});
						if (idx < 0) {
							deliveryItem = initDeliveryItem();
							deliveryItem.ivIdList = ividlist.join();
							deliveryItem.pstCode = pocode;
							deliveryItem.dlCode = batId;
							deliveryItem.dlBatch = batcode;
							deliveryItem.JsVt = vt;
							deliveryItem.itmCode = selectedItemCode.toString();
							deliveryItem.snoCode = sn;
							deliveryItem.dlHasSN = true;
							deliveryItem.dlQty = 1;
							deliveryItem.seq = seq;

							getItemInfo4BatSnVtIv(sn);

							DeliveryItems.push(deliveryItem);
						}
					} else {
						//lnqty--;
						//console.log("lnqty#unchecked", lnqty);
						let idx = -1;
						$.each(DeliveryItems, function (index, ele) {
							if (ele.dlCode == batId) {
								idx = index;
								return false;
							}
						});
						if (idx >= 0) {
							DeliveryItems.splice(idx, 1);
						}
					}
				});
		}
	});

	DeliveryItems.forEach((x) => {
		if (x.dlHasSN && x.seq == seq) lnqty++;
	});

	let $qty = $tr
		.find(".delqty");

	// console.log("del qty:" + Number($qty.val()) + ";lnqty:" + lnqty);
	if (lnqty > Number($qty.val())) {
		// console.log("here");
		$.fancyConfirm({
			title: "",
			message: newqtygtoriginalqtyindeliveryconfirmtxt,
			shownobtn: true,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					//$qty.val(lnqty).trigger("change");
					$qty.val(lnqty);

					setBatchMark();
					closeBatchModal();
					if (itemOptions && itemOptions.ChkSN) setSNmark(false);
					if (itemOptions && itemOptions.WillExpire) setExpiryDateMark();
					const price = getRowPrice();
					console.log("price:" + price);
					updateRow(price, getRowDiscPc());
				} else {
					lnqty = 0;
					$("#totalbatdelqty").data("totalbatdelqty", lnqty).val(lnqty);
					$(".batdelqty").val(0).addClass("focus");

					$("#tblBatch tbody tr").each(function (i, e) {
						if (itemOptions && !itemOptions.ChkSN) {
							$(e)
								.find("td")
								.eq(1)
								.find(".batdelqty")
								.each(function (k, v) {
									let dlCode = $(v).attr("id") as string;
									let idx = -1;
									$.each(DeliveryItems, function (index, ele: IDeliveryItem) {
										if (ele.dlCode == dlCode) {
											idx = index;
											return false;
										}
									});
									if (idx >= 0) DeliveryItems.splice(idx, 1);
								});
						} else {
							$(e)
								.find("td")
								.eq(1)
								.find(".chkbatsnvt")
								.each(function (k, v) {
									$target = $(v);
									$target.prop("checked", false);
									let sn: string = $target.val() as string;
									let batId: string = $target.attr("id") as string;

									let idx = -1;
									$.each(snvtlist, function (index, ele) {
										if (ele.sn == sn) {
											idx = index;
											return false;
										}
									});
									if (idx >= 0) {
										snvtlist.splice(idx, 1);
									}

									idx = -1;
									$.each(DeliveryItems, function (index, ele) {
										if (ele.dlCode == batId) {
											idx = index;
											return false;
										}
									});
									if (idx >= 0) {
										DeliveryItems.splice(idx, 1);
									}

									$target
										.parent("div")
										.addClass("custom-control custom-checkbox");
									$target.addClass("custom-control-input");
									$target.siblings("label").addClass("custom-control-label");
								});
						}
					});
				}
			},
		});
	} else {
		closeBatchModal();
		//console.log("itemoptions:", itemOptions);
		if (lnqty > 0) {
			//$qty.val(lnqty).trigger("change");
			if ($qty.val() == "" || $qty.val() == 0) $qty.val(lnqty);
			setBatchMark();
			if (itemOptions!.ChkSN) setSNmark(false);
			if (itemOptions!.WillExpire) setExpiryDateMark();

			if (
				!$.isEmptyObject(DicIvInfo) &&
				selectedItemCode in DicIvInfo &&
				DicIvInfo[selectedItemCode].length > 0
			) {
				setIvMark();
			}
		}
	}
}

function getItemInfo4BatSnVtIv(sn: string | null = null) {
	deliveryItem!.itmNameDesc = $tr
		.find(".itemdesc")
		.val() as string;

	deliveryItem!.dlBaseUnit = $tr
		.find(".sellunit")
		.val() as string;

	deliveryItem!.dlUnitPrice = Number(
		$tr.find(".price").data("price")
	);
	//console.log("dlunitprice:" + deliveryItem!.dlUnitPrice);

	deliveryItem!.dlDiscPc = Number(
		$tr.find(".discpc").data("discpc")
	);

	if (enableTax && !inclusivetax) {
		deliveryItem!.dlTaxPc = Number(
			$tr.find(".taxpc").data("taxpc")
		);
	}

	deliveryItem!.dlStockLoc = $tr
		.find(".location")
		.val() as string;

	deliveryItem!.JobID = Number($tr.find(".job").val());
}

function toggleBatQty() {
	if (!itemOptions) return;
	if (itemOptions.ChkBatch && itemOptions.ChkSN) {
		$("#tblPbatch thead tr th").eq(3).hide();
	}
	if (itemOptions.ChkBatch && !itemOptions.ChkSN) {
		$("#tblPbatch thead tr th").eq(3).show();
	}
}

function toggleBatSn() {
	if (!itemOptions) return false;
	if (itemOptions!.ChkBatch) {
		if (itemOptions!.ChkSN) {
			$("#tblBatch thead th:eq(1)").show();
			$("#tblBatch thead th:eq(2)").hide();
		} else {
			$("#tblBatch thead th:eq(1)").hide();
			$("#tblBatch thead th:eq(2)").show();
		}
	} else {
		if (itemOptions!.ChkSN) {
			$("#tblBatch thead th:eq(1)").show();
		} else {
			$("#tblBatch thead th:eq(1)").hide();
		}
	}
}
function FillInPurchase(currentStatus: string = "") {

	$purchaseDateDisplay = $("#purchaseDate");
	$promisedDateDisplay = $("#promisedDate");

	//console.log("Purchase.JsPurchaseDate:" + $purchaseDateDisplay.val() + ";Purchase.JsPromisedDate:" + $promisedDateDisplay.val());

	const exrate =
		$("#pstExRate").val() == null ? 1 : Number($("#pstExRate").val());
	//console.log("exrate#fillinpurchase:" + exrate);
	displayExRate(exrate);
	// console.log("purchasedate:", $purchaseDateDisplay.val());
	// console.log("promiseddate:", $promisedDateDisplay.val());
	batchidx = 5;
	snidx = batchidx + 1;
	vtidx = snidx + 1;

	Purchase = {
		Id: Number($("#Id").val()),
		pstCode: <string>$("#pstCode").val(),
		supCode: <string>$("#drpSupplier").val(),
		pstSupplierInvoice: <string>$("#pstSupplierInvoice").val(),
		pstSalesLoc: <string>$("#drpLocation").val(),
		pstAllLoc: $("#chkAllLoc").is(":checked"),
		pstRemark: <string>$("#pstRemark").val(),
		PurchaseItems: [],
		ReturnItems: [],
		PSCodeDisplay: "",
		pstPurchaseDate: new Date(),
		PurchaseDateDisplay: <string>$("#PurchaseDateDisplay").val(),
		JsPurchaseDate: <string>$purchaseDateDisplay.val(),
		pstStatus:
			currentStatus === ""
				? (<string>$("#pstStatus").val()).toLowerCase()
				: currentStatus,
		pstCurrency: <string>$("#pstCurrency").val(),
		pstExRate: exrate,
		pstPromisedDate: null,
		PromisedDateDisplay: <string>$("#PromisedDateDisplay").val(),
		JsPromisedDate: <string>$promisedDateDisplay.val(),
		pstAmount: Number($("#pstAmount").val()),
		pstPartialAmt: Number($("#pstPartialAmt").val()),
		FileList: [],
		ImgList: [],
		UploadFileList: [],
	} as IPurchase;
}


const populateSelectedItem = () => {
	selectedItem!.itmIsActive = $("#isActive").is(":checked");
	selectedItem!.itmItemID = Number($("#itmItemID").val());
	selectedItem!.itmCode = $("#itmCode").val() as string;
	//console.log("itmCode.val:", $("#itmCode").val());
	//console.log("selectedItem.itmcode:" + selectedItem!.itmCode);
	selectedItem!.itmSupCode = $("#itmSupCode").val() as string;
	selectedItem!.itmName = $("#itmName").val() as string;
	selectedItem!.itmDesc = $("#itmDesc").val() as string;
	selectedItem!.itmUseDesc = $("#replacing").is(":checked");
	selectedItem!.itmBaseSellingPrice = Number($("#BaseSellingPrice").val());
	selectedItem!.itmBuyStdCost = Number($("#BuyStdCost").val());
	selectedItem!.chkSN = $("#chkSN").is(":checked");
	selectedItem!.chkVT = $("#chkExpiry").is(":checked");
	selectedItem!.chkBat = $("#chkBatch").is(":checked");
	selectedItem!.itmLength = Number($("#itmLength").val());
	selectedItem!.itmWidth = Number($("#itmWidth").val());
	selectedItem!.itmHeight = Number($("#itmHeight").val());
	selectedItem!.itmBuyUnit = $("#txtBuyUnit").val() as string;
	selectedItem!.itmSellUnit = $("#txtSellUnit").val() as string;
	selectedItem!.itmSellUnitQuantity = Number(
		$("#txtItmSellUnitQuantity").val()
	);

	selectedItem!.PLA = Number($("#PLA").val());
	selectedItem!.PLB = Number($("#PLB").val());
	selectedItem!.PLC = Number($("#PLC").val());
	selectedItem!.PLD = Number($("#PLD").val());
	selectedItem!.PLE = Number($("#PLE").val());
	selectedItem!.PLF = Number($("#PLF").val());
	selectedItem!.IncomeAccountID = $("#IncomeAccountID").length
		? Number($("#IncomeAccountID").data("id"))
		: 0;
	selectedItem!.InventoryAccountID = $("#InventoryAccountID").length
		? Number($("#InventoryAccountID").data("id"))
		: 0;
	selectedItem!.ExpenseAccountID = $("#ExpenseAccountID").length
		? Number($("#ExpenseAccountID").data("id"))
		: 0;
	selectedItem!.itmIsBought = $("#buy").length
		? $("#buy").is(":checked")
		: false;
	selectedItem!.itmIsSold = $("#sell").length
		? $("#sell").is(":checked")
		: false;
	selectedItem!.itmIsNonStock = $("#inventory").length
		? !$("#inventory").is(":checked")
		: false;

	$tr = $("#locationblk table tbody tr").first();
	$tr.find("td").each(function (i, e) {
		let $stqty = $(e).find(".stqty");
		let location: string = $stqty.data("location") as string;
		selectedItem!.DicLocQty[location] = Number($stqty.val());
	});

	selectedItem!.itmWeight = Number($("#itmWeight").val());
	selectedItem!.itmWidth = Number($("#itmWidth").val());
	selectedItem!.itmHeight = Number($("#itmHeight").val());
	selectedItem!.itmLength = Number($("#itmLength").val());

	//ItemVari does not include category
	selectedItem!.catId = Number($("#drpCategory").val());
	if (ItemVariations.length === 0)
		selectedItem!.AttrList =
			ItemAttrList.length > 0 ? ItemAttrList.slice(0) : [];

	if ($(".drpItemAttr").length) {
		let itemcode = $("#itmCode").val() as string;
		$(".drpItemAttr").each(function (i, e) {
			let attr: IItemAttribute = initItemAttr(itemcode);
			attr.Id = Number($(e).attr("id"));
			attr.iaName = $(e).data("name");
			attr.iaValue = $(e).val() as string;
			attr.iaUsed4Variation = true;
			attr.iaShowOnSalesPage = $(e).data("show") == "True";
			selectedItem!.SelectedAttrList4V.push(attr);
		});
	}
};

const populateItemVari = () => {
	//ItemVari does not include category
	ItemVari!.itmIsActive = $("#isActive").is(":checked");
	ItemVari!.itmItemID = Number($("#itmItemID").val());
	ItemVari!.itmCode = $("#itmCode").val() as string;
	ItemVari!.itmSupCode = $("#itmSupCode").val() as string;
	ItemVari!.itmName = $("#itmName").val() as string;
	ItemVari!.itmDesc = $("#itmDesc").val() as string;
	ItemVari!.itmUseDesc = $("#replacing").is(":checked");
	ItemVari!.itmBaseSellingPrice = Number($("#BaseSellingPrice").val());
	ItemVari!.itmBuyStdCost = Number($("#BuyStdCost").val());
	ItemVari!.chkSN = $("#chkSN").is(":checked");
	ItemVari!.chkVT = $("#chkExpiry").is(":checked");
	ItemVari!.chkBat = $("#chkBatch").is(":checked");
	ItemVari!.itmLength = Number($("#itmLength").val());
	ItemVari!.itmWidth = Number($("#itmWidth").val());
	ItemVari!.itmHeight = Number($("#itmHeight").val());
	ItemVari!.itmBuyUnit = $("#txtBuyUnit").val() as string;
	ItemVari!.itmSellUnit = $("#txtSellUnit").val() as string;
	ItemVari!.itmSellUnitQuantity = Number($("#txtItmSellUnitQuantity").val());

	ItemVari!.PLA = Number($("#PLA").val());
	ItemVari!.PLB = Number($("#PLB").val());
	ItemVari!.PLC = Number($("#PLC").val());
	ItemVari!.PLD = Number($("#PLD").val());
	ItemVari!.PLE = Number($("#PLE").val());
	ItemVari!.PLF = Number($("#PLF").val());
	ItemVari!.IncomeAccountID = $("#IncomeAccountID").length
		? Number($("#IncomeAccountID").data("id"))
		: 0;
	ItemVari!.InventoryAccountID = $("#InventoryAccountID").length
		? Number($("#InventoryAccountID").data("id"))
		: 0;
	ItemVari!.ExpenseAccountID = $("#ExpenseAccountID").length
		? Number($("#ExpenseAccountID").data("id"))
		: 0;
	ItemVari!.itmIsBought = $("#buy").length ? $("#buy").is(":checked") : false;
	ItemVari!.itmIsSold = $("#sell").length ? $("#sell").is(":checked") : false;
	ItemVari!.itmIsNonStock = $("#inventory").length
		? !$("#inventory").is(":checked")
		: false;

	$tr = $("#locationblk table tbody tr").first();
	$tr.find("td").each(function (i, e) {
		let $stqty = $(e).find(".stqty");
		let location: string = $stqty.data("location") as string;
		ItemVari!.DicLocQty[location] = Number($stqty.val());
	});

	ItemVari!.itmWeight = Number($("#itmWeight").val());
	ItemVari!.itmWidth = Number($("#itmWidth").val());
	ItemVari!.itmHeight = Number($("#itmHeight").val());
	ItemVari!.itmLength = Number($("#itmLength").val());

	if ($(".drpItemAttr").length) {
		let itemcode = $("#itmCode").val() as string;
		$(".drpItemAttr").each(function (i, e) {
			let attr: IItemAttribute = initItemAttr(itemcode);
			attr.Id = Number($(e).attr("id"));
			attr.iaName = $(e).data("name");
			attr.iaValue = $(e).val() as string;
			attr.iaUsed4Variation = true;
			attr.iaShowOnSalesPage = $(e).data("show") == "True";
			ItemVari!.SelectedAttrList4V.push(attr);
		});
	}
};

function getStockQtyAvailable4ItemVari() {
	let totalbasestockqty = Number($infoblk.data("totalbasestockqty"));
	let stockqtyavailable =
		totalbasestockqty - DicIVLocQty[ItemVari!.Id.toString()];
	console.log("stockqtyavailable:" + stockqtyavailable);
	let totallocqty = 0;
	for (const [key, value] of Object.entries(ItemVari!.DicLocQty)) {
		totallocqty += value;
	}
	console.log("totallocqty:" + totallocqty);
	return { stockqtyavailable, totallocqty };
}

function getStockQtyAvailable4Item() {
	let totallocqty = 0;
	// console.log("selectedItem diclocqty:", selectedItem!.DicLocQty);
	for (const [key, value] of Object.entries(selectedItem!.DicLocQty)) {
		totallocqty += value;
	}
	//console.log(
	//  "selectedItem.TotalBaseStockQty:" + selectedItem!.TotalBaseStockQty
	//);
	// console.log("totallocqty:" + totallocqty);
	let totalIvLocQty = 0;
	if (DicIVLocQty) {
		for (const [key, value] of Object.entries(DicIVLocQty)) {
			totalIvLocQty += value;
		}
	}

	// console.log("totalIvLocQty:" + totalIvLocQty);
	let stockqtyavailable = selectedItem!.TotalBaseStockQty - totalIvLocQty;
	return { stockqtyavailable, totallocqty };
}

function searchAccount() {
	keyword = keyword.toLowerCase();
	filteredAccountList = [];
	$.each(accountList, function (i, e) {
		if (
			e.AccountClassificationID.toLowerCase().indexOf(keyword) >= 0 ||
			e.AccountName.toLowerCase().indexOf(keyword) >= 0 ||
			e.AccountNumber.toLowerCase().indexOf(keyword) >= 0 ||
			e.ACDescription.toLowerCase().indexOf(keyword) >= 0
		) {
			filteredAccountList.push(e);
		}
	});
	if (filteredAccountList.length > 0) {
		changeAccountPage(1);
	} else {
		$.fancyConfirm({
			title: "",
			message: nodatafoundtxt,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$("#txtKeyword").val("").trigger("focus");
				}
			},
		});
	}
}
function copyItemAccount() {
	itemAcId = copiedItem.IncomeAccountID;
	$("#IncomeAccountID").data("Id", itemAcId);
	itemaccountmode = ItemAccountMode.Sell;
	selectItemAccount();
	itemAcId = copiedItem.ExpenseAccountID;
	$("#ExpenseAccountID").data("Id", itemAcId);
	itemaccountmode = ItemAccountMode.Buy;
	selectItemAccount();
	itemAcId = copiedItem.InventoryAccountID;
	$("#InventoryAccountID").data("Id", itemAcId);
	itemaccountmode = ItemAccountMode.Inventory;
	selectItemAccount();
	if (selectedItem) {
		selectedItem!.IncomeAccountID = copiedItem.IncomeAccountID;
		selectedItem!.ExpenseAccountID = copiedItem.ExpenseAccountID;
		selectedItem!.InventoryAccountID = copiedItem.InventoryAccountID;
		selectedItem!.itmIsBought = selectedItem!.ExpenseAccountID === 0;
		selectedItem!.itmIsSold = selectedItem!.IncomeAccountID === 0;
		selectedItem!.itmIsNonStock = selectedItem!.InventoryAccountID === 0;
	}
	selectedItemCode = "";
}

$(document).on("click", ".itemaccount", function () {
	$(this).trigger("change");
});
$(document).on("change", ".itemaccount", function () {
	AcClfID = <string>$(this).val();
	itemaccountmode = getItemAccountMode($(this).data("itemaccountmode"));
	//console.log('itemaccountmodel:' + itemaccountmode);
	if (AcClfID !== "") {
		//console.log('itemaccountmodel:', itemaccountmode);
		accountList = DicAcAccounts[AcClfID];
		//console.log('aclist:', accountList);
		changeAccountPage(1);
	}
});

$(document).on("change", ".radaccount", function () {
	closeAccountModal();
	//console.log("here");
	if (forIA)
		populateAccount4IA($(this).data("acno"), $(this).data("acname"));
	if (forjournal)
		populateAccount4Journal($(this).data("acno"), $(this).data("acname"));
	if (forpurchase)
		populateAccount4Purchase($(this).data("acno"), $(this).data("acname"));
	else {
		itemAcId = $(this).data('acid');
		//console.log("itemAcId:", itemAcId);
		selectItemAccount();
	}
});
function changeAccountPage(page) {
	let _list: Array<IAccount> = [];
	if (filteredAccountList.length > 0) {
		_list = filteredAccountList.slice(0);
	} else {
		_list = accountList.slice(0);
	}

	var page_span = <HTMLElement>document.getElementById("page");

	// Validate page
	if (page < 1) page = 1;
	if (page > numAccountPages()) page = numAccountPages();

	var output = "";
	let currentstartpage = (page - 1) * records_per_page;
	let currentendpage = page * records_per_page;

	for (var i = currentstartpage; i < currentendpage; i++) {
		var e = _list[i];
		if (typeof e !== "undefined")
			output += `<tr><td>${e.AccountNumber}</td><td>${e.AccountName}</td><td>${e.ACDescription}</td><td><input type="radio" class="radaccount" data-acid="${e.AccountID}" data-acno="${e.AccountNumber}" data-acdesc="${e.ACDescription}" data-acname="${e.AccountName}"></td></tr>`;
	}

	accountModal
		.find(".container")
		.find("#tblAccount tbody")
		.empty()
		.html(output);

	if (_list.length > records_per_page) {
		//<div class="Pager"><span id="recordtxt" class="font-weight-bold">項目 <span id="recordrange">1 - 10</span> 共 <span id="recordcount">15</span></span><span>1</span><a style="cursor:pointer" class="page" page="2">2</a><a style="cursor:pointer" class="page" page="2">&gt;</a><a style="cursor:pointer" class="page" page="2">&gt;&gt;</a></div>
		let html = `<div class="Pager"><span Id="recordtxt" class="font-weight-bold">${itemtxt} <span Id="recordrange">${currentstartpage + 1
			} - ${currentendpage}</span> ${pagetotaltxt} <span Id="recordcount">${_list.length
			}</span></span>`;
		for (var i = 0; i < numAccountPages(); i++) {
			if (i === page - 1) {
				html += `<span>${i + 1}</span>`;
			} else {
				html += `<a style="cursor:pointer" class="iapage" data-page="${i + 1
					}">${i + 1}</a>`;
			}
		}
		html += "</div>";
		page_span.innerHTML = html;
	} else {
		page_span.innerHTML = "";
	}

	openAccountModal();
}

$(document).on("change", ".chkitemac", function () {
	let ischecked = $(this).is(":checked");

	if (!NonABSS && !ischecked && $(this).attr("id") == "inventory") {
		$("#drpInventory").prop("selectedIndex", 0);
		$(".accountno").eq(2).val("");
		selectedItem!.InventoryAccountID = 0;
	}

	itemaccountmode = getItemAccountMode(<string>$(this).attr("id"));

	if (itemaccountmode === ItemAccountMode.Buy) {
		selectedItem!.itmIsBought = ischecked;
		if (selectedItem!.itmIsBought) {
			$("#drpCOS").val("COS").trigger("focus");
			$(".accountno").eq(0).val("5-4500");
			selectedItem!.InventoryAccountID = 74;
		}
	}
	if (itemaccountmode === ItemAccountMode.Sell) {
		selectedItem!.itmIsSold = ischecked;
		if (selectedItem!.itmIsSold) {
			$("#drpIncome").val("I").trigger("focus");
			$(".accountno").eq(1).val("4-8000");
			selectedItem!.InventoryAccountID = 116;
		}
	}
	if (itemaccountmode === ItemAccountMode.Inventory) {
		selectedItem!.itmIsNonStock = ischecked;
		if (selectedItem!.itmIsNonStock) {
			$("#drpInventory").val("A").trigger("focus");
			$(".accountno").eq(2).val("1-2400");
			selectedItem!.InventoryAccountID = 117;

			$("#stqty").val(1).prop("disabled", false);
		} else {
			$("#stqty").val(0).prop("disabled", true);
		}
	}
	if (!ischecked) {
		resetAccountRow(true);
	}
});

function getAccountClassificationID() {
	$.each(accountList, function (i, e) {
		if (e.AccountID === itemAcId) {
			AcClfID = e.AccountClassificationID;
			return false;
		}
	});
}
function getAccountList() {
	for (const [key, value] of Object.entries(DicAcAccounts)) {
		$.each(value, function (i, e) {
			if (e.AccountID === itemAcId) {
				accountList = value.slice(0);
				return false;
			}
		});
	}
}
function getItemAccountNumber() {
	$.each(accountList, function (i, e) {
		if (e.AccountID === itemAcId) {
			ItemAccountNumber = e.AccountNumber;
			return false;
		}
	});
}
function fillAccountNumber(_itemaccountmode: string) {
	$(".accountno").each(function (i, e) {
		if (
			<string>$(e).data("itemaccountmode").toLowerCase() === _itemaccountmode
		) {
			$(this).val(ItemAccountNumber);
			$(this).data("Id", itemAcId);
			return false;
		}
	});
}

function selectItemAccount() {
	//console.log('acid:' + itemAcId);
	getAccountList();
	//console.log('accountlist:', accountList);
	let _selected = itemAcId > 0;
	if (itemaccountmode === ItemAccountMode.Buy) {
		if (_selected) {
			getAccountClassificationID();
			getItemAccountNumber();
			fillAccountNumber("buy");
		}
		$("#drpCOS").val(AcClfID);
		$("#buy").prop("checked", _selected);
	}
	if (itemaccountmode === ItemAccountMode.Sell) {
		if (_selected) {
			getAccountClassificationID();
			getItemAccountNumber();
			fillAccountNumber("sell");
		}
		$("#drpIncome").val(AcClfID);
		$("#sell").prop("checked", _selected);
	}
	if (itemaccountmode === ItemAccountMode.Inventory) {
		selectedItem!.InventoryAccountID = itemAcId;
		if (_selected) {
			getAccountClassificationID();
			getItemAccountNumber();
			fillAccountNumber("inventory");
		}
		$("#drpInventory").val(AcClfID);
		$("#inventory").prop("checked", _selected);
	}
}

function resetAccountRow(all: boolean = false) {
	closeAccountModal();
	filteredAccountList = [];
	if (itemaccountmode === ItemAccountMode.Buy) {
		$("#drpCOS").val("");
		if (all) {
			$(".accountno").each(function (i, e) {
				if ($(e).data("itemaccountmode") === "Buy") {
					$(e).val("");
				}
			});
		}
	}
	if (itemaccountmode === ItemAccountMode.Sell) {
		$("#drpIncome").val("");
		if (all) {
			$(".accountno").each(function (i, e) {
				if ($(e).data("itemaccountmode") === "Sell") {
					$(e).val("");
				}
			});
		}
	}
	if (itemaccountmode === ItemAccountMode.Inventory) {
		$("#drpInventory").val("");
		if (all) {
			$(".accountno").each(function (i, e) {
				if ($(e).data("itemaccountmode") === "Inventory") {
					$(e).val("");
				}
			});
		}
	}
}

$(document).on("click", "#btnSearchCustomer", function () {
	keyword = (<string>$("#txtCustomer").val()).toLowerCase();
	if (keyword !== "") {
		openWaitingModal();
		searchcusmode = true;
		GetCustomers4Sales(1);
	}
});

$(document).on("click", "#btnSearchItem", function () {
	keyword = (<string>$("#txtItem").val()).toLowerCase();
	if (keyword !== "") {
		openWaitingModal();
		searchmode = true;
		GetItems(1);
	}
});
$(document).on("change", "#tblSales .location", function () {
	console.log("location:" + $(this).val());
});
function initSales(): ISales {
	return {
		authcode: "",
		epaytype: "",
		rtsUID: 0,
		rtsSalesLoc: $("#drpLocation").val()?.toString(),
		rtsDvc: $("#drpDevice").val()?.toString(),
		rtsCode: $("#rtsCode").val() as string,
		rtsRefCode: "",
		rtsType: "",
		rtsStatus: "",
		rtsDate: "",
		rtsTime: "",
		rtsCusCode: "",
		rtsLineTotal: 0,
		rtsLineTotalPlusTax: 0,
		rtsFinalDisc: 0,
		rtsFinalDiscAmt: 0,
		rtsFinalAdj: 0,
		rtsFinalTotal: 0,
		rtsRmks: "",
		rtsRmksOnDoc: "",
		rtsUpldBy: "",
		rtsUpldTime: null,
		rtsUpLdLog: "",
		rtsInternalRmks: "",
		rtsMonthBase: false,
		rtsLineTaxAmt: 0,
		rtsEpay: false,
		rtsDeliveryAddressId: 0,
		rtsDeliveryAddress1: "",
		rtsDeliveryAddress2: "",
		rtsDeliveryAddress3: "",
		rtsDeliveryAddress4: "",
		rtsReviewUrl: "",
		rtsSendNotification: false,
		rtsCustomerPO: "",
		rtsDeliveryDate: null,
		rtsSaleComment: "",
		rtsCheckout: false,
		rtsCheckoutPortal: "",
		rtsParentUID: 0,
		rtsExRate: 1,
		rtsCurrency: "HKD",
		rtpRoundings: 0,
		rtpChange: 0,
		MonthlyPay: 0,
		Deposit: 0,
		deliveryAddressId: 0,
		ireviewmode: 0,
		selectedPosSalesmanCode: null,
		CustomerPO: null,
		DeliveryDate: null,
		TotalRemainAmt: 0,
		rtsAllLoc: false,
	} as ISales;
}
function initSimpleSales(): ISales {
	return {
		authcode: "",
		epaytype: "",
		rtsUID: 0,
		rtsSalesLoc: $("#drpLocation").val()?.toString(),
		rtsDvc: $("#drpDevice").val()?.toString(),
		rtsCode: $("#rtsCode").val(),
		rtsRefCode: "",
		rtsType: "",
		rtsStatus: "",
		rtsDate: "",
		rtsTime: "",
		rtsCusCode: defaultcustomer.cusCode,
		rtsLineTotal: 0,
		rtsLineTotalPlusTax: 0,
		rtsFinalDisc: 0,
		rtsFinalDiscAmt: 0,
		rtsFinalAdj: 0,
		rtsFinalTotal: 0,
		rtsRmks: "",
		rtsRmksOnDoc: "",
		rtsUpldBy: "",
		rtsUpldTime: null,
		rtsUpLdLog: "",
		rtsInternalRmks: "",
		rtsMonthBase: false,
		rtsLineTaxAmt: 0,
		rtsEpay: false,
		rtsDeliveryAddressId: 0,
		rtsDeliveryAddress1: "",
		rtsDeliveryAddress2: "",
		rtsDeliveryAddress3: "",
		rtsDeliveryAddress4: "",
		rtsReviewUrl: "",
		rtsSendNotification: false,
		rtsCustomerPO: "",
		rtsDeliveryDate: null,
		rtsSaleComment: "",
		rtsCheckout: false,
		rtsCheckoutPortal: "",
		rtsParentUID: 0,
		rtsExRate: 1,
		rtsCurrency: "HKD",
		rtpRoundings: 0,
		rtpChange: 0,
		MonthlyPay: 0,
		Deposit: 0,
		deliveryAddressId: 0,
		ireviewmode: 0,
		selectedPosSalesmanCode: null,
		CustomerPO: null,
		DeliveryDate: null,
		TotalRemainAmt: 0,
		rtsAllLoc: false,
	} as ISales;
}

$(document).on("change", ".validthru.focus", function () {
	if ($(this).val() !== "") $(this).removeClass("focus");
});

function handleBatVtQtyChange(this: any, lastCellCls: string) {
	let qty: number = Number($(this).val());
	let maxqty: number = Number($(this).attr("max"));
	let tblIndex: number = Number($(this).data("tblindex"));
	let tmpId: string = $(this).data("id").toString();
	let itemcode: string = $(this).data("itemcode").toString();
	let receiver: string = $(this).data("shop").toString();
	let $localTR = $(this).parent("div").parent("td").parent("tr");
	let tridx: number = Number($localTR.data("idx"));
	let transferredqty: number = 0;
	if (qty > 0) {
		if (qty > maxqty) {
			qty = maxqty;
			$(this).val(qty);
		}
		transferredqty = qty;
		$(".tblTransfer").each(function (i, e) {
			if (i !== tblIndex) {
				$target =
					lastCellCls === ""
						? $(e)
							.find("tbody tr")
							.eq(tridx)
							.find("td")
							.first()
							.find(".batqtytf")
						: $(e)
							.find("tbody tr")
							.eq(tridx)
							.find("td")
							.last()
							.find(lastCellCls!);
				if (i === 0) {
					//$target.val(maxqty - qty);
				} else {
					if (Number($target.val()) > 0) {
						$target.val(maxqty - qty);
						transferredqty += maxqty - qty;
					}
				}
			}
		});

		if (lastCellCls === "") {
			$(".tblTransfer")
				.first()
				.find("tbody tr")
				.eq(tridx)
				.find("td")
				.first()
				.find(".batqtytf")
				.val(maxqty - transferredqty);
		} else {
			$(".tblTransfer")
				.first()
				.find("tbody tr")
				.eq(tridx)
				.find("td")
				.last()
				.find(lastCellCls)
				.val(maxqty - transferredqty);
		}

		let idx = TransferList.findIndex((x) => { return x.tmpId == tmpId; });
		if (idx >= 0) TransferList.splice(idx, 1);

		TransferList.push({
			tmpId: tmpId,
			itmCode: itemcode,
			stReceiver: receiver,
			stSender: $infoblk.data("primarylocation"),
			inQty: qty,
			outQty: qty,
			stCode: $infoblk.data("stcode"),
		} as IStockTransfer);
		// console.log("TransferList#change:", TransferList);
	}

	if (qty === 0) {
		if (lastCellCls === "") {
			$(".tblTransfer").each(function (i, e) {
				if (i > 0) {
					transferredqty += Number(
						$(e)
							.find("tbody tr")
							.eq(tridx)
							.find("td")
							.first()
							.find(".batqtytf")
							.val()
					);
				}
			});
			$(".tblTransfer")
				.first()
				.find("tbody tr")
				.eq(tridx)
				.find("td")
				.first()
				.find(".batqtytf")
				.val(maxqty - transferredqty);
		} else {
			$(".tblTransfer").each(function (i, e) {
				if (i > 0) {
					transferredqty += Number(
						$(e)
							.find("tbody tr")
							.eq(tridx)
							.find("td")
							.last()
							.find(lastCellCls)
							.val()
					);
				}
			});
			$(".tblTransfer")
				.first()
				.find("tbody tr")
				.eq(tridx)
				.find("td")
				.last()
				.find(lastCellCls)
				.val(maxqty - transferredqty);
		}
	}
}

function handleIvQtyChange(this: any, lastCellCls: string) {
	let qty: number = Number($(this).val());
	let maxqty: number = Number($(this).attr("max"));
	let tblIndex: number = Number($(this).data("tblindex"));
	let poIvId: string = $(this).data("poivid").toString();
	let itemcode: string = $(this).data("itemcode").toString();
	let receiver: string = $(this).data("shop").toString();
	let ivIdList: string = $(this).data("ividlist").toString();
	$tr = $(this).parent("div").parent("td").parent("tr");
	let tridx: number = Number($tr.data("idx"));
	let transferredqty: number = 0;

	if (qty > 0) {
		if (qty > maxqty) {
			qty = maxqty;
			$(this).val(qty);
		}
		transferredqty = qty;
		//console.log("qty:" + qty + ";tridx:" + tridx);
		$(".tblTransfer").each(function (i, e) {
			if (i !== tblIndex) {
				$target = $(e)
					.find("tbody tr")
					.eq(tridx)
					.find("td")
					.last()
					.find(lastCellCls!);
				if (i === 0) {
					// $target.val(maxqty - qty);
				} else {
					if (Number($target.val()) > 0) {
						$target.val(maxqty - qty);
						transferredqty += maxqty - qty;
					}
				}
			}
		});

		$(".tblTransfer")
			.first()
			.find("tbody tr")
			.eq(tridx)
			.find("td")
			.last()
			.find(lastCellCls)
			.val(maxqty - transferredqty);

		let idx = TransferList.findIndex((x) => { return x.poIvId == poIvId; });
		if (idx >= 0) TransferList.splice(idx, 1);

		TransferList.push({
			poIvId: poIvId,
			itmCode: itemcode,
			stReceiver: receiver,
			stSender: $infoblk.data("primarylocation"),
			inQty: qty,
			outQty: qty,
			stCode: $infoblk.data("stcode"),
			ivIdList: ivIdList,
		} as IStockTransfer);
		// console.log("TransferList#change:", TransferList);
	}

	if (qty === 0) {
		$(".tblTransfer").each(function (i, e) {
			if (i > 0) {
				transferredqty += Number(
					$(e)
						.find("tbody tr")
						.eq(tridx)
						.find("td")
						.last()
						.find(lastCellCls)
						.val()
				);
			}
		});
		$(".tblTransfer")
			.first()
			.find("tbody tr")
			.eq(tridx)
			.find("td")
			.last()
			.find(lastCellCls)
			.val(maxqty - transferredqty);
	}
}

$(document).on("change", "#drpShop", function () {
	Sales.rtsSalesLoc = $(this).val() as string;
});
$(document).on("change", "#drpDevice", function () {
	Sales.rtsDvc = $(this).val() as string;
});

$(document).on("change", "#drpDeliveryAddr", function () {
	Sales.deliveryAddressId = <number>$(this).val();
});

$(document).on("change", "#deposit", function () {
	if ($(this).is(":checked")) {
		Sales.Deposit = 1;
	} else {
		Sales.Deposit = 0;
	}
});
$(document).on("click", "#deposit", function () {
	$.fancyConfirm({
		title: confirmsubmit,
		message: confirmdeposittxt,
		shownobtn: true,
		okButton: oktxt,
		noButton: canceltxt,
		callback: function (value) {
			if (value) {
				Sales.Deposit = 1;
				confirmPay();
			} else {
				Sales.Deposit = 0;
			}
		},
	});
});
$(document).on("click", "#monthlypay", function () {
	$.fancyConfirm({
		title: confirmsubmit,
		message: confirmmonthlypay,
		shownobtn: true,
		okButton: oktxt,
		noButton: canceltxt,
		callback: function (value) {
			if (value) {
				Sales.MonthlyPay = 1;
				SubmitSimpleSales();
			} else {
				Sales.MonthlyPay = 0;

			}
		},
	});
});
$(document).on("change", "#monthlypay", function () {
	if ($(this).is(":checked")) {
		$.fancyConfirm({
			title: confirmsubmit,
			message: confirmmonthlypay,
			shownobtn: true,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					Sales.MonthlyPay = 1;
					payModal.find(".paymenttype").prop("disabled", true);
					closePayModal();
					submitSales();
				} else {
					Sales.MonthlyPay = 0;
					$("#monthlypay").prop("checked", false);
					payModal.find(".paymenttype").prop("disabled", false);
				}
			},
		});
	} else {
		Sales.MonthlyPay = 0;
		payModal.find(".paymenttype").prop("disabled", false);
	}
});
function togglePaymentBlk(mode: string, toggleId: string, totalamt: number) {
	if (mode == "open") {
		$(`#${toggleId}`).hide();
		$("#paymentBlk").removeClass("hide");

		if (forpreorder) {
			let $deposit: JQuery = $("#deposit");
			$deposit.prop("checked", true);
		}

		setExRateDropDown();

		if (totalamt === 0)
			totalamt = getTotalAmt4Order();

		//console.log("totalamt:" + totalamt);
		setForexPayment(totalamt);

		setAmtDisplay(totalamt);

		setRemainDisplay(true);

		initCashTxt(totalamt);

		setInput4NumberOnly("paymenttype");

		populateOrderSummary();

	} else {
		$(`#${toggleId}`).show();
		$("#paymentBlk").addClass("hide");
	}
}

function calculateServiceChargeAmt(subtotal: number, scpc: number) {
	return financial(subtotal * scpc / 100);
}
function GetServiceChargeAmt(subtotal: number) {
	ServiceChargePC = 0;
	for (const [key, value] of Object.entries(DicPayServiceCharge)) {
		if (value.Selected) { ServiceChargePC += value.Percentage; }
	}
	ServiceChargeAmt = calculateServiceChargeAmt(subtotal, ServiceChargePC);
	console.log("ServiceChargeAmt:", ServiceChargeAmt);
}
function populateOrderSummary() {
	$("#receiptno").text(Sales.rtsCode);
	$("#salesdate").text(formatDate());
	$("#salestime").text(formatTime());

	let currencySym = $infoblk.data("currency");

	let subtotal: number = 0, total: number = 0, disc: number = 0, scamt: number = 0;
	let html = "";

	SelectedSimpleItemList.forEach((x: ISimpleItem) => {
		let _subtotal: number = x.QtySellable * (x.itmBaseSellingPrice ?? 0);
		let _disc: number = financial(_subtotal * x.discpc / 100);
		subtotal += _subtotal;
		disc += _disc;
		html += `<h3>${x.NameDesc} x ${x.QtySellable} <span>${currencySym}${formatnumber(_subtotal)}</span></h3>`;
	});

	$(".table__single.items").empty().html(html);

	GetServiceChargeAmt(subtotal);
	Sales.rtsFinalTotal = total = (subtotal - disc + ServiceChargeAmt);

	$(".taxamt").text(currencySym + formatnumber(0));
	$(".discamt").text(currencySym + formatnumber(disc));
	$(".servicechargeamt").text(currencySym + formatnumber(ServiceChargeAmt));
	$(".totalamt").text(currencySym + formatnumber(total));
}
$(document).on("change", ".batch", function () {
	currentY = getCurrentY(this);
	updateRow();
});

$(document).on("change", "#txtRoundings", function () {
	let _roundings = $(this).val();
	if (_roundings !== "") {
		//minus current roundings first:
		itotalamt -= Sales.rtpRoundings;
		//add new roundings:
		Sales.rtpRoundings = parseFloat(<any>$(this).val());
		itotalamt += Sales.rtpRoundings;
	} else {
		itotalamt -= Sales.rtpRoundings;
		$(this).val(formatnumber(0));
	}
	$("#txtTotal").val(formatnumber(itotalamt));
});

$(document).on("change", "#txtPayerCode", function () {
	authcode = <string>$(this).val();
	if (authcode !== "") {
		$(".chkpayment").prop("checked", false);
		if (authcode.indexOf("2") === 0) {
			//starts with 2
			//alipay
			$("#chkAlipay").prop("checked", true);
			$(".chkpayment").trigger("change");
			$("#Alipay").val(formatnumber(itotalamt));
		}
		if (authcode.indexOf("1") === 0) {
			//starts with 1
			//wechat
			$("#chkWechat").prop("checked", true);
			$(".chkpayment").trigger("change");
			$("#Wechat").val(formatnumber(itotalamt));
		}
		confirmPay();
	}
});

$(document).on("click", "#transactionEpay", function () {
	//for debug only:
	//selectedSalesCode = 'SA100256';
	//printurl += '?issales=1&salesrefundcode=' + selectedSalesCode;
	$.ajax({
		type: "GET",
		url: "/POSFunc/TransactionResult",
		data: { salescode: selectedSalesCode },
		success: function (data) {
			$.fancyConfirm({
				title: "",
				message: data.msg,
				shownobtn: false,
				okButton: oktxt,
				noButton: notxt,
				callback: function (value) {
					if (value) {
						if (data.status == 1) {
							window.open(printurl);
							window.location.reload();
						} else {
						}
					}
				},
			});
		},
		dataType: "json",
	});
});

$(document).on("click", ".btnPayment", function () {
	if (forsales || forReservePaidOut) {
		if (SalesLnList.length === 0 || $(`#${gTblId} .focus`).length > 0) {
			falert(salesinfonotenough, oktxt);
		} else {
			openPayModal();
		}
	}
	if (fordeposit) {
		if (DepositLnList.length === 0) {
			falert(salesinfonotenough, oktxt);
		} else {
			openPayModel_De();
		}
	}
	if (forpreorder) {
		if (PreSales.rtsUID > 0) openPayModel_De();
		else openPayModal();
	}
});

$(document).on("change", ".itemdesc", function () {
	handleItemDescChange.call(this);
});

$(document).on("change", "#drpSalesman", function () {
	selectedPosSalesmanCode = <string>$(this).val();
});

$(document).on("dblclick", "#txtCustomerName", function () {
	forretailcustomer = true;
	GetCustomers4Sales(1);
});

$(document).on("change", ".customer", function (e) {
	handleCustomerNameChange(e);
});

$(document).on("dblclick", ".cuscode", function () {
	closeCusModal();
	selectedCusCodeName = $(this).data("code");
	selectedCus = CusList.filter(
		(x) => x.cusCode == selectedCusCodeName
	)[0];
	if (!selectedCus) {
		$.ajax({
			type: "GET",
			url: "/Api/GetCustomerByCode",
			data: { cusCode: selectedCusCodeName },
			success: function (data: ICustomer) {
				selectedCus = data;
				selectCus();
			},
			dataType: "json",
		});
	} else {
		selectCus();
	}
});
//for transfer
$(document).on("change", ".ivqtytf", function () {
	handleIvQtyChange.call(this, ".ivqtytf");
});
//for transfer
$(document).on("change", ".vtqtytf", function () {
	handleBatVtQtyChange.call(this, ".vtqtytf");
});
//for transfer
$(document).on("change", ".batqtytf", function () {
	handleBatVtQtyChange.call(this, "");
});
//for transfer
$(document).on("change", ".batvtqtytf", function () {
	handleBatVtQtyChange.call(this, ".batvtqtytf");
});
//for transfer
$(document).on("change", ".chkbatsnvttf", function () {
	let ischecked: boolean = $(this).is(":checked");
	let receiver: string = $(this).data("shop").toString();
	//console.log("receiver:" + receiver);
	let itemcode: string = $(this).data("itemcode").toString();
	let tblIndex: number = Number($(this).data("tblindex"));
	//console.log("tblIndex:" + tblIndex);

	let sn = $(this).val()?.toString();

	if (ischecked) {
		$(".tblTransfer")
			.first()
			.find("tbody tr")
			.each(function (i, e) {
				$(e)
					.find("td")
					.eq(1)
					.find(".chkbatsnvttf")
					.each(function (k, v) {
						if ($(v).val()?.toString() == sn) {
							$(v).prop("checked", false);
						}
					});
			});

		$(".tblTransfer").each(function (idx, tbl) {
			//console.log("idx:" + idx+";tblIndex:"+tblIndex);
			if (idx !== tblIndex) {
				//console.log("idx:" + idx);
				$(tbl)
					.find("tbody tr")
					.each(function (i, e) {
						$(e)
							.find("td")
							.eq(1)
							.find(".chkbatsnvttf")
							.each(function (k, v) {
								if ($(v).val()?.toString() == sn) {
									$(v).prop("checked", false);
								}
							});
					});
			}
		});
	} else {
		$(".tblTransfer")
			.first()
			.find("tbody tr")
			.each(function (i, e) {
				$(e)
					.find("td")
					.eq(1)
					.find(".chkbatsnvttf")
					.each(function (k, v) {
						if ($(v).val()?.toString() == sn) {
							$(v).prop("checked", true);
						}
					});
			});
	}

	//console.log("TransferList#change#0:", TransferList);
	//console.log("sn:" + sn);
	let idx = TransferList.findIndex((x) => { return x.tmpId == sn; });
	if (idx >= 0) TransferList.splice(idx, 1);

	TransferList.push({
		tmpId: sn,
		itmCode: itemcode,
		stReceiver: receiver,
		stSender: $infoblk.data("primarylocation"),
		inQty: 1,
		outQty: 1,
		stCode: $infoblk.data("stcode"),
	} as IStockTransfer);
	//console.log("TransferList#change#1:", TransferList);
});

$(document).on("keypress", ".numonly", function (e) {
	return isNumber(e);
});

$(document).on("change", ".chkbatsnvt", function () {
	let idx = forwholesales ? 5 : 4;
	let qtycls = forwholesales ? ".delqty" : ".qty";
	let todelqty: number = Number(
		$(`#${gTblId} tbody tr`)
			.eq(currentY)
			.find("td")
			.eq(idx)
			.find(qtycls)
			.val()
	);

	let ischecked: boolean = $(this).is(":checked");
	let $localTR = $(this).parent("div").parent("td").parent("tr");
	chkbatsnvtchange = true;

	$target = $localTR.find(".currentbattypeqty");
	let currentbattypeqty: number = Number($target.text());
	currentbattypeqty = ischecked ? currentbattypeqty - 1 : currentbattypeqty + 1;
	//if (currentbattypeqty < 0) currentbattypeqty = 0;
	$target.text(currentbattypeqty);

	$target = $localTR.find("td.batdelqtytxt").find(".row").find(".batdeledqty");
	let currentdelqty = Number($target.text());
	//console.log("currentdelqty#0:" + currentdelqty);

	if (ischecked) {
		chkBatSnVtCount++;
		currentdelqty++;
		//DicBatDelQty[batcode] = currentdelqty +1;
	} else {
		chkBatSnVtCount--;
		currentdelqty--;
		//DicBatDelQty[batcode] = currentdelqty - 1;
	}

	if (currentdelqty < 0) currentdelqty = 0;
	//console.log("currentdelqty#1:" + currentdelqty);
	$target.text(currentdelqty);

	$("#totalbatdelqty")
		.data("totalbatdelqty", chkBatSnVtCount)
		.val(chkBatSnVtCount);
	// chkBatSnVtCount = 0;
	//console.log("chkBatSnVtCount:" + chkBatSnVtCount);
	if (chkBatSnVtCount == todelqty) {
		$("#tblBatch tbody .chkbatsnvt").prop("disabled", true);
	}
});
$(document).on("change", ".batdelqty", function () {
	let $localTR = $(this).parent("div").parent("td").parent("tr");

	batdelqtychange = true;
	let newbdq = Number($(this).val());
	//console.log("newbdq#0:" + newbdq);
	const batqty = Number($(this).data("batqty"));

	if (newbdq > batqty) {
		newbdq = batqty;
		$(this).val(newbdq);
	}
	//console.log("newbdq#1:" + newbdq);
	$(this).data("currentbdq", newbdq);

	$target = $localTR.find(".currentbattypeqty");
	let currentbattypeqty: number = Number($target.text());
	currentbattypeqty -= newbdq;
	//if (currentbattypeqty < 0) currentbattypeqty = 0;
	$target.text(currentbattypeqty);

	$target = $localTR.find("td.batdelqtytxt").find(".row").find(".batdeledqty");
	let currentdelqty = Number($target.text());
	//console.log("currentdelqty:" + currentdelqty);
	newbdq += currentdelqty;

	//console.log("newdelqty#0:" + newdelqty);
	if (newbdq > batqty) {
		let _newdelqty = newbdq - batqty;
		//console.log("_newdelqty:" + _newdelqty);
		$(this).val(_newdelqty);
		newbdq = batqty;
	}
	//console.log("newdelqty#1:" + newdelqty);
	$target.text(newbdq);

	let totalbatdelqty: number = 0;

	$("#tblBatch tbody tr").each(function (i, e) {
		/* console.log("batdelqty:" + Number($(e).find(".batdelqty").val()));*/
		totalbatdelqty += Number($(e).find(".batdelqty").val());
	});
	$("#totalbatdelqty")
		.data("totalbatdelqty", totalbatdelqty)
		.val(totalbatdelqty);
});

$(document).on("change", ".vtdelqty", function () {
	let $localTR = $(this).parent("div").parent("td").parent("tr");

	vtdelqtychange = true;
	let newvdq = Number($(this).val());
	//console.log("newvdq#0:" + newvdq);
	const vtqty = Number($(this).data("vtqty"));

	if (newvdq > vtqty) {
		newvdq = vtqty;
		$(this).val(newvdq);
	}
	//console.log("newvdq#1:" + newvdq);
	$(this).data("currentvdq", newvdq);

	$target = $localTR.find(".currentvttypeqty");
	let currentvttypeqty: number = Number($target.text());
	currentvttypeqty -= newvdq;
	//if (currentvttypeqty < 0) currentvttypeqty = 0;
	$target.text(currentvttypeqty);

	$target = $localTR.find("td.vtdelqtytxt");
	let currentdelqty = Number($target.text());
	//console.log("currentdelqty:" + currentdelqty);
	newvdq += currentdelqty;

	$target.text(newvdq);

	let totalvtdelqty: number = 0;

	$("#tblVt tbody tr").each(function (i, e) {
		/* console.log("vtdelqty:" + Number($(e).find(".vtdelqty").val()));*/
		totalvtdelqty += Number($(e).find(".vtdelqty").val());
	});
	$("#totalvtdelqty").data("totalvtdelqty", totalvtdelqty).val(totalvtdelqty);
});


//for those items with variations but without batch
$(document).on("change", ".ivdelqty", function () {
	let $ivdelqty = $(this);
	let $localTR = $ivdelqty.parent("div").parent("td").parent("tr");
	let tridx = $localTR.data("idx");

	ivdelqtychange = true;
	let newivdq = Number($ivdelqty.val());
	//console.log("newvdq#0:" + newvdq);
	const ivqty = Number($ivdelqty.data("ivqty"));
	console.log("ivqty:" + ivqty);
	//console.log("newivdq#0:" + newivdq);
	if (newivdq > ivqty) {
		//console.log("here");
		newivdq = ivqty;
		//console.log("newivdq#1:" + newivdq);
		$ivdelqty.val(newivdq);
		//console.log("this val:" + $ivdelqty.val());
		$("#tblIv tbody tr").each(function (i, e) {
			if (Number($(e).data("idx")) !== tridx) {
				$(e).find("td").find(".form-control").prop("readonly", true);
			}
		});
	}
	//console.log("newivdq#1:" + newivdq);
	$ivdelqty.data("currentivdq", newivdq);

	$target = $localTR.find(".currentivtypeqty");
	let currentivtypeqty: number = Number($target.text());
	currentivtypeqty -= newivdq;
	//if (currentivtypeqty < 0) currentivtypeqty = 0;
	$target.text(currentivtypeqty);

	$target = $localTR.find("td.ivdelqtytxt");
	let currentdelqty = Number($target.text());
	//console.log("currentdelqty:" + currentdelqty);
	newivdq += currentdelqty;

	$target.text(newivdq);

	let totalivdelqty = 0;
	$("#tblIv tbody tr").each(function (i, e) {
		/* console.log("ivdelqty:" + Number($(e).find(".ivdelqty").val()));*/
		totalivdelqty += Number($(e).find(".ivdelqty").val());
	});

	if (totalivdelqty >= ivqty) {
		$(".ivdelqty").prop("readonly", true);
	}

	$("#totalivdelqty").data("totalivdelqty", totalivdelqty).val(totalivdelqty);
});

//for non-itemoptions items only:
$(document).on("change", ".nonitemoptions", function () {
	let val = $(this).val() as string;
	if (val !== "") {
		let $localTR = $(this).parent("td").parent("tr");
		let type = $(this).data("type") as string;
		let batch: string = "";
		let sn: string = "";
		let vt: string = "";
		switch (type) {
			case "bat":
				batch = val;
				sn = $localTR.find("td:eq(6)").find(".serialno").val() as string;
				vt = $localTR.find("td:eq(8)").find(".validthru").val() as string;
				break;
			case "sn":
				sn = val;
				getRemoteData(
					"/Api/CheckIfDuplicatedSN",
					{ sn: sn },
					checkIfDuplicatedSNOk,
					getRemoteDataFail
				);
				batch = $localTR.find("td:eq(5)").find(".batch").val() as string;
				vt = $localTR.find("td:eq(8)").find(".validthru").val() as string;
				break;
			case "vt":
				vt = val;
				batch = $localTR.find("td:eq(5)").find(".batch").val() as string;
				sn = $localTR.find("td:eq(6)").find(".serialno").val() as string;
				break;
		}

		selectedItemCode = $localTR.find("td:eq(1)").find(".itemcode").val() as string;
		currentY = Number($localTR.data("idx"));
		seq = currentY + 1;
		let qty: number = Number($localTR.find("td:eq(4)").find(".qty").val());
		let dlcode = `${selectedItemCode}_${seq}`;

		const idx =
			DeliveryItems.length > 0
				? DeliveryItems.findIndex((item) => { return item.dlCode == dlcode; })
				: -1;

		if (idx === -1) {
			deliveryItem = initDeliveryItem();
			deliveryItem.dlCode = dlcode;
			deliveryItem.seq = seq;
			deliveryItem.itmCode = selectedItemCode;
		} else {
			deliveryItem = DeliveryItems[idx];
		}
		deliveryItem.dlBatch = batch;
		deliveryItem.dlHasSN = sn !== "";
		deliveryItem.snoCode = sn;
		deliveryItem.JsVt = vt;
		deliveryItem!.dlQty = qty;
		getItemInfo4BatSnVtIv();
		deliveryItem.dlAmtPlusTax = deliveryItem.dlAmt = Number(
			$localTR.find("td:last").find(".amount").val()
		);

		if (idx === -1) DeliveryItems.push(deliveryItem);
	}
});

function handleItemDescChange(this: any) {
	getRowCurrentY.call(this);
	seq = currentY + 1;
	//console.log("seq:", seq);
	//seq = parseInt($(this).parent("td").parent("tr").find("td:eq(0)").text());
	if (selectedSalesLn) {
		selectedSalesLn = $.grep(SalesLnList, function (e: ISalesLn, i) {
			return e.rtlSeq == seq;
		})[0];
		//console.log('selectedsalesitem:', selectedSalesLn);
		selectedSalesLn.Item.itmDesc = <string>$(this).val();
	}
	if (Purchase && Purchase.PurchaseItems.length > 0) {
		SelectedPurchaseItem = $.grep(Purchase.PurchaseItems, function (e: IPurchaseItem, i) {
			return e.piSeq == seq;
		})[0];
		SelectedPurchaseItem.itmNameDesc = <string>$(this).val();
	}
}

function setInput4NumberOnly(clsname: string) {
	setInputsFilter(document.getElementsByClassName(clsname)!, function (value) {
		return /^-?[\d,\/.]*$/.test(value);
	}, numberonlytxt);
}
function setInputs4NumberOnly(clsnames: string[]) {
	clsnames.forEach((clsname) => {
		setInputsFilter(document.getElementsByClassName(clsname)!, function (value) {
			return /^-?[\d,\/.]*$/.test(value);
		}, numberonlytxt);
	});
}

function getTotalAmt4Order(): number {
	let totalamt = ServiceChargeAmt;
	$(`#${gTblId} tbody tr`).each(function (i, e) {
		if ($(e).find(".itemcode").val() !== "")
			totalamt += Number($(e).find(".amount").val());
	});
	//return totalamt / exRate;
	return totalamt;
}

//for item edit:
$(document).on("change", ".stqty", function () {
	let _qty = 0;
	$(".stqty").each(function (i, e) {
		_qty += Number($(e).val());
	});
	let shop = $(this).data("location");
	if (_qty < 0) {
		$.fancyConfirm({
			title: "",
			message: $infoblk.data("stockqtyerr"),
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$(".stqty").eq(0).val(1).trigger("focus");
				}
			},
		});
	} else {
		if (selectedItem) selectedItem!.DicLocQty[shop] = Number($(this).val());
		if (ItemVari) ItemVari!.DicLocQty[shop] = Number($(this).val());
	}
});

$(document).on("change", ".form-control.mobile", function () {
	//text-decoration-underline
	$target = $(this).next(".whatsappphone");
	if ($(this).val() !== "") {
		$target.addClass("pointer text-decoration-underline");
	} else {
		$target.removeClass("pointer text-decoration-underline");
	}
});

$(document).on("click", ".whatsappphone.pointer", function (e) {
	handleWhatsappClick.call(this, e);
});

//popupCenter({url: 'http://www.xtf.dk', title: 'xtf', w: 900, h: 500});
const popupCenter = ({ url, title, w, h }) => {
	// Fixes dual-screen position                             Most browsers      Firefox
	const dualScreenLeft =
		window.screenLeft !== undefined ? window.screenLeft : window.screenX;
	const dualScreenTop =
		window.screenTop !== undefined ? window.screenTop : window.screenY;

	const width = window.innerWidth
		? window.innerWidth
		: document.documentElement.clientWidth
			? document.documentElement.clientWidth
			: screen.width;
	const height = window.innerHeight
		? window.innerHeight
		: document.documentElement.clientHeight
			? document.documentElement.clientHeight
			: screen.height;

	const systemZoom = width / window.screen.availWidth;
	const left = (width - w) / 2 / systemZoom + dualScreenLeft;
	const top = (height - h) / 2 / systemZoom + dualScreenTop;
	const newWindow = window.open(
		url,
		title,
		`
      scrollbars=yes,
      width=${w / systemZoom},
      height=${h / systemZoom},
      top=${top},
      left=${left}
      `
	);

	newWindow!.focus();
};

const initItemAttr = (itemcode): IItemAttribute => {
	return {
		Id: 0,
		tmpId: "",
		itmCode: itemcode,
		iaName: "",
		iaValue: "",
		iaShowOnSalesPage: true,
		iaUsed4Variation: true,
		CreateTimeDisplay: "",
		ModifyTimeDisplay: "",
	};
};
const initCustomerFollowUp = (): ICustomerFollowUp => {
	return {
		Id: 0,
		CustomerID: $("#CustomerId").val() as number,
		AccountProfileId: 0,
		CompanyId: 0,
		CustomerCode: "",
		Content: "",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: null,
		CustomerName: "",
	};
};

const addItemAttrRow = () => {
	let html = `<div class="row my-2">
                <div class="col-12 col-md-4">
                    <input type="text" class="form-control attrname" placeholder="${attrnametxt}" />
                </div>
                <div class="col-12 col-md-8">
                    <input type="text" class="form-control attrval" placeholder="${attrvalstxt} (${separatedbytxt})" />
                </div>
            </div>`;
	if (itemAttrModal.find(".row").length)
		itemAttrModal.find(".row").last().after(html);
	else itemAttrModal.find(".fa").after(html);

	itemAttrModal.find(".attrname").last().trigger("focus");
};

$(document).on("click", ".fa-plus.attr", function () {
	addItemAttrRow();
});

$(document).on("click", ".fa-plus.open", function () {
	if (ItemAttrList.length === 0) {
		openItemAttrModal();
		if (
			!itemAttrModal.find(".form-control").length ||
			itemAttrModal.find(".form-control").last().val() !== ""
		)
			addItemAttrRow();
	} else {
		populateIaAccordion(true);
	}
});

const updateItemAttr = (tmpId: string, type: string, v: boolean) => {
	for (let i in ItemAttrList) {
		if (ItemAttrList[i].tmpId === tmpId) {
			if (type === "show") ItemAttrList[i].iaShowOnSalesPage = v;
			else ItemAttrList[i].iaUsed4Variation = v;
			break;
		}
	}
};

$(document).on("change", ".chkvonsales", function () {
	updateItemAttr($(this).val() as string, "show", $(this).is(":checked"));
});
$(document).on("change", ".chkused4v", function () {
	updateItemAttr($(this).val() as string, "used", $(this).is(":checked"));
});


const populateIaAccordion = (addRow: boolean) => {
	let html: any[] = [];
	html = ItemAttrList.map((c) => {
		if (!c.iaName && !c.iaValue) return false;

		const chkshow = c.iaShowOnSalesPage ? "checked" : "";
		const chkused = c.iaUsed4Variation ? "checked" : "";

		return `
            <h3>${c.iaName}<span class="small danger float-right" data-id="${c.tmpId}" onclick="toggleAccordionState(1);removeItemAttr(this);" style="background-color:white;border-radius:3px;padding:1px;">${removetxt}</span></h3>
                <div class="row">
                    <div class="col-12 col-md-3">
                        <label>${nametxt}</label>
                        <input type="text" class="form-control attrname" placeholder="${attrnametxt}" value="${c.iaName}" />
                    </div>
                    <div class="col-12 col-md-5">
                        <label>${valuestxt}</label>
                        <input type="text" class="form-control attrval" placeholder="${attrvalstxt} (${separatedbytxt})" value="${c.iaValue}" style="max-width:none;"  />
                    </div>
                    <div class="col-12 col-md-3">
                        <div class="my-1 small">
                            <div class="form-check mb-2">
                              <input class="form-check-input my-auto chkvonsales" type="checkbox" value="${c.tmpId}" ${chkshow}>
                              <label class="form-check-label">
                                ${visibleonsalespagetxt}
                              </label>
                            </div>
                            <div class="form-check">
                              <input class="form-check-input my-auto chkused4v" type="checkbox" value="${c.tmpId}" ${chkused}>
                              <label class="form-check-label">
                                ${used4variationstxt}
                              </label>
                            </div>
                        </div>
                     </div>
                    <div class="col-12 col-md-1 small">

                    </div>
            </div>`;
	});

	if (addRow) {
		let latestId = `attr#${ItemAttrList.length}`;
		html.push(`<h3>${customattributetxt}<span class="small danger float-right" data-id="${latestId}" onclick="toggleAccordionState(1);removeItemAttr(this);" style="background-color:white;border-radius:3px;padding:1px;">${removetxt}</span></h3>
                <div class="row">
                    <div class="col-12 col-md-3">
                        <label>${nametxt}</label>
                        <input type="text" class="form-control attrname" placeholder="${attrnametxt}" value="" />
                    </div>
                    <div class="col-12 col-md-5">
    <label>${valuestxt}</label>
                        <input type="text" class="form-control attrval" placeholder="${attrvalstxt} (${separatedbytxt})" value="" style="max-width:none;"  />
                    </div>
                    <div class="col-12 col-md-3 small">
                        <div class="my-1">
                            <div class="form-check">
                              <input class="form-check-input my-auto chkvonsales" type="checkbox" value="" checked>
                              <label class="form-check-label">
                                ${visibleonsalespagetxt}
                              </label>
                            </div>
                            <div class="form-check">
                              <input class="form-check-input my-auto chkused4v" type="checkbox" value="" checked>
                              <label class="form-check-label">
                                ${used4variationstxt}
                              </label>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-1">

                    </div>
                </div>`);
	}

	if ($("#itemAttr").find(".row").hasClass("ui-accordion-content")) {
		$("#itemAttr").empty().accordion("destroy");
	}

	$("#itemAttr").append(html);
	$("#itemAttr").accordion({
		collapsible: true,
		active: "none",
		activate: function (event, ui) {
			$(ui.newPanel).find(".form-control").first().trigger("focus");
		},
	});
};

const confirmItemAttr = () => {
	itemAttrModal.find(".row").each(function (i, e) {
		let $ianame = $(e).find("input").eq(0);
		let $iaval = $(e).find("input").eq(1);

		if ($ianame.val() !== "" && $iaval.val() !== "") {
			let tmpId = `attr#${i}`;
			let attr: IItemAttribute = {} as IItemAttribute;
			attr = {
				...attr,
				tmpId,
				itmCode: selectedItem!.itmCode,
				iaName: $ianame.val() as string,
				iaValue: $iaval.val() as string,
				iaUsed4Variation: true,
				iaShowOnSalesPage: true,
			};
			if (!itemAttrTmpIds.includes(tmpId)) {
				ItemAttrList.push(attr);
				itemAttrTmpIds.push(tmpId);
			}
		}
	});

	closeItemAttrModal();

	if (ItemAttrList.length > 0) {
		populateIaAccordion(false);
		$("#btnSaveItemAttr").removeClass("hide");
	}
};

const resetItemAttrModal = () => {
	itemAttrModal.find(".row").remove();
};

function SaveItemAttr() {
	$target = $("#itemAttr");
	$target.find(".row").each(function (i, e) {
		let $ianame = $(e).find("input").eq(0);
		let $iaval = $(e).find("input").eq(1);
		let isshow = $(e).find(".chkvonsales").is(":checked");
		let isused = $(e).find(".chkused4v").is(":checked");
		let $h3 = $(e).prev("h3");
		let currenth3 = $h3.html();

		if ($ianame.val() !== "" && $iaval.val() !== "") {
			let newh3 = currenth3.replace(
				customattributetxt,
				$ianame.val() as string
			);
			$h3.html(newh3);
			let tmpId = `attr#${i}`;
			let attr: IItemAttribute = {} as IItemAttribute;
			attr = {
				...attr,
				tmpId,
				itmCode: selectedItem!.itmCode,
				iaName: $ianame.val() as string,
				iaValue: $iaval.val() as string,
				iaShowOnSalesPage: isshow,
				iaUsed4Variation: isused,
			};

			if (!itemAttrTmpIds.includes(tmpId)) {
				ItemAttrList.push(attr);
				itemAttrTmpIds.push(tmpId);
			}
		}
	});

	if (selectedItem) {
		selectedItem!.AttrList = ItemAttrList.slice(0);
		$.ajax({
			//contentType: 'application/json; charset=utf-8',
			type: "POST",
			url: "/Item/SaveAttr",
			data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), model: selectedItem },
			success: function (data) {
				if (data) {
					setTimeout(
						function () { $target.accordion({ active: "none" }); }, 3000
					);
				}
			},
			dataType: "json"
		});
	}




}
$(document).on("click", "#btnSaveItemAttr", function () {
	SaveItemAttr();
});

const toggleAccordionState = (state: number) => {
	const currentactive = $("#itemAttr").find("h3").hasClass(".ui-state-active");
	if (!currentactive)
		$("#itemAttr").accordion({
			active: "none",
			disabled: state == 1 ? true : false,
		});
};

const removeItemAttr = (ele) => {
	let tmpId = $(ele).data("id") as string;
	let $ianame = $(ele)
		.parent("button")
		.parent("div")
		.prev("div")
		.prev("div")
		.prev("div")
		.find("form-control")
		.first();
	$.fancyConfirm({
		title: "",
		message: confirmremovetxt,
		shownobtn: true,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				let idx = ItemAttrList.findIndex((x) => { return x.tmpId === tmpId; });
				if (idx >= 0) {
					ItemAttrList.splice(idx, 1);
				}
				populateIaAccordion(false);
			} else {
				$ianame.trigger("focus");
				toggleAccordionState(0);
			}
		},
	});
};

$(document).on("click", "#btnSaveItem", function () {
	let itemeditfrm: ItemEditFrm = new ItemEditFrm(editmode);
	if (itemeditfrm.validform()) {
		itemeditfrm.submitForm();
	}
});

$(document).on("change", "#BaseSellingPrice", function () {
	const sellingprice: number = Number($(this).val());
	const buyingcost: string = formatnumber(sellingprice * 0.6);
	$("#BuyStdCost").val(buyingcost);
});


$(document).on("keypress", "input[type=number]", function (event) {
	return blockSpecialChar(event);
});

function handleWhatsappClick(
	this: any,
	e: JQuery.ClickEvent<Document, undefined, any, any>
) {
	e.preventDefault();
	let lnk = $appInfo.data("whatsappapilnk");
	const txt = $appInfo.data("whatsappapidefaulttxt");
	if (forcustomer) $target = $(this).prev("input");
	else {
		$target = $(this).hasClass("fa")
			? $(this).next("input")
			: $(this).prev("input");
	}
	let phoneno = $target.val();
	if (phoneno) {
		phoneno = (phoneno as string).trim();
		if (!phoneno.startsWith("852")) {
			phoneno = `852${phoneno}`;
			$target.val(phoneno);
		}
		lnk = lnk.replace("{0}", $target.val()).replace("{1}", txt);
		popupCenter({ url: lnk, title: "", w: 900, h: 500 });
	}

}

const fillInItemForm = (setDrpItemAttrVal: boolean) => {
	if (setDrpItemAttrVal) {
		$(".drpItemAttr").each(function (i, e) {
			$(e).val(ItemVari!.DicIvNameValList[$(e).data("name")]);
		});
	}

	$("#itmCode").val(selectedItem!.itmCode);
	// console.log("selecteditem.catid:" + selectedItem?.catId);
	$("#drpCategory").val(selectedItem?.catId == 0 ? 1 : selectedItem!.catId);

	$("#itmSupCode").val(selectedItem!.itmSupCode);
	$("#itmName").val(selectedItem!.itmName);
	$("#BaseSellingPrice").val(Number(selectedItem!.itmBaseSellingPrice));
	$("#BuyStdCost").val(Number(selectedItem!.itmBuyStdCost));
	$("#itmDesc").val(selectedItem!.itmDesc);
	$("#replacing").prop("checked", selectedItem!.itmUseDesc);

	$("#PLA").val(selectedItem!.PLA);
	$("#PLB").val(selectedItem!.PLB);
	$("#PLC").val(selectedItem!.PLC);
	$("#PLD").val(selectedItem!.PLD);
	$("#PLE").val(selectedItem!.PLE);
	$("#PLF").val(selectedItem!.PLF);

	$("#itmWeight").val(Number(selectedItem!.itmWeight));
	$("#itmWidth").val(Number(selectedItem!.itmWidth));
	$("#itmHeight").val(Number(selectedItem!.itmHeight));
	$("#itmLength").val(Number(selectedItem!.itmLength));

	$("#txtBuyUnit").val(selectedItem!.itmBuyUnit);
	$("#txtSellUnit").val(selectedItem!.itmSellUnit);
	$("#txtItmSellUnitQuantity").val(Number(selectedItem!.itmSellUnitQuantity));

	if (selectedItem) {
		if (!NonABSS) {
			if (selectedItem!.ExpenseAccountID > 0) {
				itemAcId = selectedItem!.ExpenseAccountID;
				getAccountList();
				getAccountClassificationID();
				getItemAccountNumber();
				fillAccountNumber("buy");
				$("#drpCOS").val(accountList[0].AccountClassificationID);
			}
			if (selectedItem!.IncomeAccountID > 0) {
				itemAcId = selectedItem!.IncomeAccountID;
				getAccountList();
				getAccountClassificationID();
				getItemAccountNumber();
				fillAccountNumber("sell");
				$("#drpIncome").val(accountList[0].AccountClassificationID);
			}
			if (selectedItem!.InventoryAccountID > 0) {
				itemAcId = selectedItem!.InventoryAccountID;
				getAccountList();
				getAccountClassificationID();
				getItemAccountNumber();
				fillAccountNumber("inventory");
				$("#drpInventory").val(accountList[0].AccountClassificationID);
			}
		}

		ItemAttrList = $infoblk.data("jsonattrlist");
		if (ItemAttrList.length) {
			populateIaAccordion(false);
			$(".drpItemAttr").first().trigger("focus");
		} else {
			ItemAttrList = [];
		}
		selectedItem!.SelectedAttrList4V = [];
	}

	$("#chkBatch").prop("checked", selectedItem!.chkBat);
	$("#chkSN").prop("checked", selectedItem!.chkSN);
	$("#chkExpiry").prop("checked", selectedItem!.chkVT);

	$("#isActive").prop("checked", selectedItem!.itmIsActive);

	//fill in values for hidden fields:
	$("#itmItemID").val(Number(selectedItem!.itmItemID));
	$("#ChkSN").val(selectedItem!.chkSN ? "True" : "False");
	$("#ChkBatch").val(selectedItem!.chkBat ? "True" : "False");
	$("#ChkExpiry").val(selectedItem!.chkVT ? "True" : "False");
	$("#codeinuse").val(selectedItem!.itmCode);
	$("#scodeinuse").val(selectedItem!.itmSupCode);
	$("#ReplacingItemNameOnReceipt").val(
		selectedItem!.itmUseDesc ? "True" : "False"
	);
};


if ($("#isActive").length) {
	$(document).on("change", "#isActive", function () {
		if (selectedItem) selectedItem!.itmIsActive = $(this).is(":checked");
	});
}


$(document).on("change", "#itmSupCode", function () {
	let code: string = <string>$(this).val();
	if (selectedItem && code !== "") {
		selectedItem!.itmSupCode = code;
	}
});

$(document).on("click", "#btnCopyFrm", function () {
	GetItems(1);
});

$(document).on("change", "#itmCode", function () {
	let $code = $(this);
	let code: string = <string>$code.val();
	if (code) {
		trimByMaxLength($code);
		if (code !== $("#codeinuse").val()) {
			if (CodeNameList && CodeNameList.length > 0) {
				let idx = CodeNameList.findIndex(x => { return x.Code.toLowerCase() == code.toLowerCase(); });
				if (idx >= 0) {
					$.fancyConfirm({
						title: "",
						message: itemcodeduplicatederr,
						shownobtn: false,
						okButton: oktxt,
						noButton: notxt,
						callback: function (value) {
							if (value) {
								$code.val("").trigger("focus");
							}
						}
					});
				} else {
					if (selectedItem) {
						selectedItem!.itmCode = code;
					}
				}
			}
		}
	}
});
$(document).on("change", "#itmName", function () {
	let $name = $(this);
	let name: string = <string>$name.val();
	if (name) {
		trimByMaxLength($name);

		if (CodeNameList && CodeNameList.length > 0) {
			let idx = CodeNameList.findIndex(x => { return x.Name.toLowerCase() == name.toLowerCase(); });
			if (idx >= 0) {
				$.fancyConfirm({
					title: "",
					message: duplicatednamewarning,
					shownobtn: false,
					okButton: oktxt,
					noButton: notxt,
					callback: function (value) {
						if (value) {
							$name.val("").trigger("focus");
						}
					}
				});
			} else {
				if (selectedItem) {
					selectedItem!.itmName = name;
				}
			}
		}
	}
});
$(document).on("change", "#itmDesc", function () {
	let $desc = $(this);
	let desc: string = <string>$desc.val();
	if (desc) {
		trimByMaxLength($desc);
		if (selectedItem) selectedItem!.itmDesc = desc;
	}

});
$(document).on("change", "#BaseSellingPrice", function () {
	let _val: number = <number>$(this).val();
	if (selectedItem) {
		selectedItem!.itmBaseSellingPrice = _val;
	}
	$("#PLA").val(_val);
});
$(document).on("click", "#btnClone", function () {
	let sellingprice: number = <number>$("#BaseSellingPrice").val();
	if (sellingprice > 0) {
		$.fancyConfirm({
			title: "",
			message: clonebasesellingpriceconfirm,
			shownobtn: true,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					$(".itemprice").val(sellingprice);
					if (selectedItem)
						selectedItem!.PLA =
							selectedItem!.PLB =
							selectedItem!.PLC =
							selectedItem!.PLD =
							selectedItem!.PLE =
							selectedItem!.PLF =
							sellingprice;
				} else {
					$("#BaseSellingPrice").trigger("focus");
				}
			},
		});
	}
});

$(document).on("click", "#btnBuySellUnits", function () {
	forItem = true;
	openItemBuySellUnitsModal();
});

$(document).on("change", "#isTaxed", function () {
	if (selectedItem) selectedItem!.itmIsTaxedWhenSold = $(this).is(":checked");
	if (ItemVari) ItemVari!.itmIsTaxedWhenSold = $(this).is(":checked");
});

$(document).on("change", "#txtKeyword4Account", function () {
	keyword = <string>$(this).val();
	if (keyword !== "") {
		searchAccount();
	} else {
		filteredAccountList = [];
		changeAccountPage(1);
		resetAccountRow();
	}
});

$(document).on("click", "#btnSearchAccount", function () {
	if (keyword !== "") {
		searchAccount();
	}
});

$(document).on("change", ".positive", function () {
	if (!selectedItem) {
		return;
	}
	let pl: string = <string>$(this).attr("id")?.toLowerCase();
	let plp: number = <number>$(this).val();
	switch (pl) {
		case "plb":
			selectedItem!.PLB = plp;
			break;
		case "plc":
			selectedItem!.PLC = plp;
			break;
		case "pld":
			selectedItem!.PLD = plp;
			break;
		case "ple":
			selectedItem!.PLE = plp;
			break;
		case "plf":
			selectedItem!.PLF = plp;
			break;
		default:
		case "pla":
			selectedItem!.PLA = plp;
			break;
	}
});

$(document).on("change", "#replacing", function () {
	if ($(this).is(":checked")) {
		$("#ReplacingItemNameOnReceipt").val(1);
		isreplacing = true;
	} else {
		$("#ReplacingItemNameOnReceipt").val(0);
		isreplacing = false;
	}
	if (selectedItem) selectedItem!.itmUseDesc = isreplacing;
});

$(document).on("change", "#chkExpiry", function () {
	if ($(this).is(":checked")) {
		$("#ChkExpiry").val(1);
	} else {
		$("#ChkExpiry").val(0);
	}
	if (selectedItem) selectedItem!.chkVT = $(this).is(":checked");
});
$(document).on("change", "#chkSN", function () {
	if ($(this).is(":checked")) {
		$("#ChkSN").val(1);
	} else {
		$("#ChkSN").val(0);
	}
	if (selectedItem) selectedItem!.chkSN = $(this).is(":checked");
});
$(document).on("change", "#chkBatch", function () {
	if ($(this).is(":checked")) {
		$("#ChkBatch").val(1);
	} else {
		$("#ChkBatch").val(0);
	}
	if (selectedItem) selectedItem!.chkBat = $(this).is(":checked");
});
$(document).on("click", ".iapage", function () {
	//console.log('page:' + $(this).data('page'));
	let page = parseInt(<string>$(this).data("page"));
	changeAccountPage(page);
});
function trimByMaxLength($obj: JQuery<HTMLElement>) {
	let maxlength = Number($obj.data("maxlength"));
	let obj = $obj.val() as string;
	if (obj!.length > maxlength) {
		obj = obj.substring(0, maxlength);
		$obj.val(obj);
	}
}

function numAccountPages(): number {
	if (filteredAccountList.length > 0) {
		return Math.ceil(filteredAccountList.length / records_per_page);
	} else {
		return Math.ceil(accountList.length / records_per_page);
	}
}
let localStore = window["localStorage"];
$(document).on("click", "#btnEditItemAttr", function () {
	$("#itemattrblk").show();
	ItemAttrList = $infoblk.data("jsonattrlist");
	if (ItemAttrList.length) {
		populateIaAccordion(false);
		$(".drpItemAttr").first().trigger("focus");
	} else {
		ItemAttrList = [];
	}
	selectedItem!.SelectedAttrList4V = [];
	$(this).hide();
});

function setExRateDropDown() {
	if (UseForexAPI) {
		if (localStore.getItem("apicurrencydata") === null) {
			$.ajax({
				type: "GET",
				url: "https://api.freecurrencyapi.com/v1/latest?apikey=HDs6UlKfcrhu5qov6S1YSjtIF5xlPHeWK7zUw08p&currencies=USD%2CCNY%2CEUR%2CGBP%2CAUD%2CHKD&base_currency=HKD",
				data: {},
				success: function (data) {
					if (data) {
						//console.log("data:", data.data);
						for (const [key, value] of Object.entries(data.data)) {
							const exrate = Number(value);
							//console.log("exrate:", exrate);
							DicCurrencyExRate[key] = exrate;
							_setExRateDropDown(value, key, exrate);
							localStore.setItem(
								"apicurrencydata",
								JSON.stringify(DicCurrencyExRate)
							);
						}

						$("#drpCurrency").niceSelect();
						//currencyModal.find("#tblCurrency tbody").empty().html(html);
					}
				},
				dataType: "json",
			});
		} else {
			DicCurrencyExRate = JSON.parse(
				<string>localStore.getItem("apicurrencydata")
			);
			for (const [key, value] of Object.entries(DicCurrencyExRate)) {
				const exrate = value;
				_setExRateDropDown(value, key, exrate);
			}
			$("#drpCurrency").niceSelect();
		}
	} else {
		for (const [key, value] of Object.entries(DicCurrencyExRate)) {
			//console.log("key:" + key + ";value:" + value);
			const displaytxt = GetCurrencyDisplayTxt(key, value);
			//console.log("displaytxt:" + displaytxt);
			$("#drpCurrency").append(
				$("<option>", {
					value: value,
					text: displaytxt,
				})
			);
		}
		$("#drpCurrency").niceSelect();
	}
}

const fillInCurrencyModal = (currcode: string = "") => {
	if (UseForexAPI) {
		// console.log("use api");
		$.ajax({
			type: "GET",
			url: "https://api.freecurrencyapi.com/v1/latest?apikey=HDs6UlKfcrhu5qov6S1YSjtIF5xlPHeWK7zUw08p&currencies=USD%2CCNY%2CEUR%2CGBP%2CAUD%2CHKD&base_currency=HKD",
			data: {},
			success: function (data) {
				if (data) {
					//console.log("data:", data.data);
					let html = "";
					for (const [key, value] of Object.entries(data.data)) {
						const exrate = Number(value);
						//console.log("exrate@fill:" + exrate);
						DicCurrencyExRate[key] = exrate;
						html += `<tr class="currency" data-key="${key}" data-value="${exrate}"><td>${key}</td><td>${formatexrate(
							exrate.toString()
						)}</td></tr>`;
					}
					currencyModal.find("#tblCurrency tbody").empty().html(html);
				}
			},
			dataType: "json",
		});
	} else {
		if (currcode === "") {
			let html = "";
			for (const [key, value] of Object.entries(DicCurrencyExRate)) {
				// console.log("key:" + key + ";value:" + value);
				html += `<tr class="currency" data-key="${key}" data-value="${value}"><td>${key}</td><td>${formatexrate(
					value.toString()
				)}</td></tr>`;
			}
			currencyModal.find("#tblCurrency tbody").html(html);
		} else {
			exRate = DicCurrencyExRate[currcode];
			if (forpurchase) {
				if (Purchase) Purchase.pstExRate = exRate;
				$("#pstExRate").val(exRate);
			}
			if (forwholesales) {
				if (WholeSales) WholeSales.wsExRate = exRate;
				$("#wsExRate").val(exRate);
			}
			if (forsales || forpreorder || fordeposit || forrefund) {
				if (Sales) Sales.rtsExRate = exRate;
				if (PreSales) PreSales.rtsExRate = exRate;
				$("#rtsExRate").val(exRate);
			}
		}
	}
};

function GetCurrencyDisplayTxt(key: string, value: number) {
	return `${DicCurrencySym[key]} ${key} (${formatexrate(value.toString())})`;
}

function _setExRateDropDown(value: any, key: string, exrate: number) {
	let selected = false;
	selected = exRate == value;
	const displaytxt = GetCurrencyDisplayTxt(key, value);
	$("#drpCurrency").append(
		$("<option>", {
			value: exrate,
			text: displaytxt,
			selected: selected,
		})
	);
}



function fillInItemModal() {
	$tr
		.find("td:eq(1)")
		.text(ItemVari ? ItemVari!.NameDesc : selectedItem!.NameDesc);
	$tr
		.find("td:eq(2)")
		.text(ItemVari ? ItemVari!.DicLocQty[shop] : selectedItem!.DicLocQty[shop]);
	let _price = 0;
	if (ItemVari) {
		_price =
			Number(ItemVari!.itmBaseSellingPrice) ??
			Number(ItemVari!.itmLastSellingPrice);
	} else {
		_price =
			Number(selectedItem!.itmBaseSellingPrice) ??
			Number(selectedItem!.itmLastSellingPrice);
	}
	$tr.find("td:eq(3)").text(_price);
}

function confirmDateTime() {
	let strdate = $("#strDateTime").val();
	if (forcustomer) {
		$.ajax({
			type: "POST",
			url: "/Customer/UpdateFollowUpDate",
			data: {
				__RequestVerificationToken: $(
					"input[name=__RequestVerificationToken]"
				).val(),
				cusCode,
				followupdate: strdate,
			},
			success: function (data) {
				if (data) window.location.href = "/Customer/Index";
			},
			dataType: "json",
		});
	}
}

$(document).on("change", "textarea#itmDesc", function () {
	const charcount: number = ($(this).val() as string).length;
	const maxlength: number = Number($(this).attr("maxlength"));
	const msgstyle = charcount > maxlength ? "color:red;" : "color:blue;";
	const html: string = `<span style="${msgstyle}">${charcount}</span>`;
	$("#charcount").html(html);
});
$(document).on("change", "#txtItem", function () {
	if ($(this).val() !== "") $("#btnSearchItem").trigger("click");
	else GetItems(1);
});

function getKeyByValue(object, value) {
	return Object.keys(object).find((key) => object[key] === value);
}


$(document).on("dblclick", ".exrate", function () {
	if (!$(this).hasClass("disabled")) {
		currencyReferrer = $(this).attr("id") as string;
		fillInCurrencyModal();
		openCurrencyModal();
	}
});

$(document).on("click", ".currency", function () {
	$(this).addClass("selectedtr");
	let $currency: JQuery = $(`#${currencyReferrer}`);
	// console.log("$currency:", $currency);
	// console.log(
	//   "currency key:" +
	//     $(this).data("key") +
	//     ";currency val:" +
	//     $(this).data("value")
	// );
	$currency.val($(this).data("key")).trigger("change");
	let $exrate: any;
	if (forsales) $exrate = $("#rtsExRate");
	if (forwholesales) $exrate = $("#wsExRate");
	if (forpurchase) $exrate = $("#pstExRate");
	$exrate.val(<string>$(this).data("value"));
	// console.log("exrateval:" + $exrate.val());
	currencyCode = $(this).data("key") as string;
	closeCurrencyModal();
});
$(document).on("change", ".exrate", function (e) {
	//console.log("exrate changed");
	const cardcode = $(this).val() as string;
	if (cardcode in DicCurrencyExRate) {
		handleExRateChange(cardcode, true);
	}
});

function handleExRateChange(cardcode: string, triggerCardChange: boolean) {
	//let cardcode: string = <string>$(event.target).val();
	$target = $(`#${gTblId} tbody tr`);

	let cardcount: number = 0;
	DicFilteredCards = {};

	if (forpurchase) {
		Purchase.pstCurrency = cardcode;
		exRate = Purchase.pstExRate = DicCurrencyExRate[Purchase.pstCurrency];
		$("#pstExRate").val(exRate);
		//console.log("Purchase.pstextate:" + Purchase.pstExRate);
		currentY = 0;
		$target.each(function (i, e) {
			if ($(e).find("td:eq(1)").find(".itemcode").val() !== "") {
				//console.log("updating row...");
				updateRow(getRowPrice(), getRowDiscPc());
				currentY++;
			}
		});
		currentY = 0;

		if (triggerCardChange) {
			if (SupplierOptionList.length > 0)
				$("#drpSupplier").empty().append(SupplierOptionList.join(""));
			$("#drpSupplier > option").each(function (i, e) {
				const _cardcode = $(e).val() as string;
				var currkey = GetForeignCurrencyFrmCode(_cardcode);
				// console.log("currkey:" + currkey);
				if (currkey && currkey == Purchase.pstCurrency) {
					cardcode = _cardcode;
					if (!(currkey in DicFilteredCards)) {
						cardcount++;
						DicFilteredCards[cardcode] = $(e).text();
					}
				}
			});

			if (cardcount > 0) {
				if (cardcount === 1)
					$("#drpSupplier")
						.val(cardcode)
						.trigger("change")
						.prop("disabled", true);
				else {
					$("#drpSupplier").empty();
					for (const [key, value] of Object.entries(DicFilteredCards)) {
						$("#drpSupplier").append(
							$("<option>", {
								value: key,
								text: value,
							})
						);
					}
					$("#drpSupplier").select2();
				}
			} else {
				$("#drpSupplier").val("").trigger("change").prop("disabled", false);
			}
		}
	}
	if (forwholesales) {
		WholeSales.wsCurrency = cardcode;
		exRate = WholeSales.wsExRate = DicCurrencyExRate[WholeSales.wsCurrency];
		$("#wsExRate").val(exRate);
		//console.log("exrate#0:" + exRate);
		currentY = 0;
		$target.each(function (i, e) {
			if ($(e).find("td:eq(1)").find(".itemcode").val() !== "") {
				updateRow();
				currentY++;
			}
		});
		currentY = 0;

		if (triggerCardChange) {
			$("#drpCustomer").empty().append(CustomerOptionList.join(""));

			$("#drpCustomer > option").each(function (i, e) {
				const _cardcode = $(e).val() as string;
				var currkey = GetForeignCurrencyFrmCode(_cardcode);
				if (currkey && currkey == WholeSales.wsCurrency) {
					cardcode = _cardcode;
					if (!(currkey in DicFilteredCards)) {
						cardcount++;
						DicFilteredCards[cardcode] = $(e).text();
					}
				}
			});
			//console.log("cardcount:" + cardcount);

			if (cardcount > 0) {
				if (cardcount === 1)
					$("#drpCustomer")
						.val(cardcode)
						.trigger("change")
						.prop("disabled", true);
				else {
					$("#drpCustomer").empty();
					for (const [key, value] of Object.entries(DicFilteredCards)) {
						$("#drpCustomer").append(
							$("<option>", {
								value: key,
								text: value,
							})
						);
					}
					$("#drpCustomer").select2();
				}
			} else {
				$("#drpCustomer").val("").trigger("change").prop("disabled", false);
			}
		}
	}
	//console.log("exRate#1:" + exRate);
	displayExRate(exRate);
}

function backUpCardDrpOptions() {
	if (forpurchase) {
		$("#drpSupplier > option").each(function (i, e) {
			DicOriCards[$(e).val() as string] = $(e).text();
		});
	}
	if (forwholesales) {
		$("#drpConsumer > option").each(function (i, e) {
			DicOriCards[$(e).val() as string] = $(e).text();
		});
	}
	// console.log("diccards:", DicOriCards);
}
function fillInCategory() {
	Category = {} as ICategory;
	Category.Id = editmode ? Number($("#Id").val()) : 0;
	Category.catName = $("#catName").val() as string;
	Category.catDesc = $("#catDesc").val() as string;
	Category.catNameTC = $("#catNameTC").val() as string;
	Category.catDescTC = $("#catDescTC").val() as string;
	Category.catNameSC = $("#catNameSC").val() as string;
	Category.catDescSC = $("#catDescSC").val() as string;
	Category.Removable = editmode ? $("#Removable").val() == "True" : true;
	Category.displayOrder = Number($("#displayOrder").val());
}

function getCustomers() {
	openWaitingModal();
	SearchCustomers();
}

function SearchCustomers() {
	$.ajax({
		url: "/Api/SearchCustomersAjax",
		type: "GET",
		data: { pageIndex: 1, forRetail: forretailcustomer, keyword: keyword.toLowerCase() },
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: OnSearchCustomersOK,
		error: onAjaxFailure,
	});
}

function OnSearchCustomersOK(data) {
	closeWaitingModal(); // console.log(data);

	if (data.Customers.length === 0) {
		$("#norecord").removeClass("hide");
		$("#tblCustomer").hide();
		$("#pagingblk").hide();
	} else {
		$("#norecord").addClass("hide");
		$("#pagingblk").hide();
		customerlist = data.Customers.slice(0);
		$target = $("#tblCustomer tbody");
		let html = "";
		$.each(customerlist, function (i, customer) {
			let email =
				customer.cusEmail == null || customer.cusEmail == ""
					? "N/A"
					: customer.cusEmail;
			let cname = customer.cusName;
			html += `<tr>

                <td style="width:110px;max-width:110px;" class="text-center">${cname}</td>
                <td style="width:100px;max-width:100px;" class="text-center">${customer.cusContact}</td>
                <td style="width:110px;max-width:110px;" class="text-center">${email}</td>`;

			if (!NonABSS)
				html += `<td style="width:120px;max-width:120px;" class="text-center">${customer.CreateTimeDisplay}</td>`;
			html += `<td style="width:100px;max-width:100px;" class="text-center">${customer.AccountProfileName}</td>`;

			//<td style="width:70px;max-width:70px;"><a href="#" class="btn btn-success detail" role="button" data-id="${customer.cusCustomerID}">${detailtxt}</a></td>

			html += `<td style="width:125px;max-width:125px;">
                    <a class="btn btn-info" role="button" href="/Customer/Edit?customerId=${customer.cusCustomerID}"><span class="small">${edittxt}</span></a>
                    <a class="btn btn-danger remove" role="button" href="#" data-id="${customer.cusCustomerID}"><span class="small">${removetxt}</span></a>
                </td>
            </tr>`;
		});

		$target.empty().html(html);
	}
}

function validCusForm() {
	let msg = "";
	let $contact = $("#cusContact");
	let $phone = $("#cusPhone");
	let $email = $("#cusEmail");

	if (Customer.cusPhone === "" || Customer.cusPhone.length <= 3) {
		msg += $infoblk.data("customerphonerequired") + "<br>";
		$phone.addClass("error");
	} else {
		if (Customer.cusPhone !== <string>$("#phoneinuse").val()!.toString()) {
			if (phonelist.includes(Customer.cusPhone ?? "")) {
				msg += customerphoneduplicatederrtxt + "<br>";
				$phone.addClass("error");
			}
		}
	}

	if (Customer.cusContact === "") {
		msg += $infoblk.data("contactrequired") + "<br>";
		$contact.addClass("error");
	}

	if (Customer.cusEmail !== "") {
		if (!validateEmail(Customer.cusEmail)) {
			msg += emailformaterr + "<br>";
			$email.addClass("error");
		}
	}

	//console.log("msg:" + msg);
	if (msg !== "") {
		$.fancyConfirm({
			title: "",
			message: msg,
			shownobtn: false,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				//console.log("duplicated:" + duplicated);
				if (value) {
					$(".error").first().trigger("focus");
				}
			},
		});
	}
	return msg === "";
}

function FillInCustomer() {
	Customer = {} as ICustomer;
	Customer.cusCustomerID = Number($("#cusCustomerID").val());
	/*Customer.cusCode = editmode ? $("#cusCode").val() as string : phone;*/
	Customer.cusCode = $("#cusCode").val() as string;
	Customer.cusPhone = $("#cusPhone").val() as string;

	Customer.cusName = <string>$("#cusName").val();
	Customer.cusSaleComment = <string>$salecomment.val();
	Customer.PaymentIsDue = Number($("#PaymentIsDue").val());
	Customer.BalanceDueDays = Number($("#BalanceDueDays").val());
	Customer.cusPointsSoFar = Number($("#cusPointsSoFar").val());
	Customer.cusEmail = <string>$("#cusEmail").val();
	Customer.cusContact = <string>$("#cusContact").val();

	Customer.cusAddrCountry = <string>$("#drpCountry").val();
	Customer.CountryTxt = $("#drpCountry option:selected").text() as string;

	Customer.cusAddrCity = Customer.cusAddrCountry == "3" ? $("#txtCity").val() as string : <string>$("#city").val(); //NOT $("#drpCity").val()!
	Customer.CityTxt = Customer.cusAddrCountry == "3" ? $("#txtCity").val() as string : $("#drpCity option:selected").text() as string;

	Customer.cusAddrWeb = <string>$("#cusAddrWeb").val();
	Customer.AddressList = [];
	for (let i = 1; i <= 5; i++) {
		let address: IAddressView = initAddressView();
		address.cusAddrLocation = i.toString();
		address.StreetLine1 = $(`#addr${i}`).find(".address").eq(0).val() as string;
		address.StreetLine2 = $(`#addr${i}`).find(".address").eq(1).val() as string;
		Customer.AddressList.push(address);
	}

	Customer.cusAddrStreetLine1 = <string>$("#cusAddrStreetLine1").val();
	Customer.cusAddrStreetLine2 = <string>$("#cusAddrStreetLine2").val();
	Customer.cusAddrStreetLine3 = <string>$("#cusAddrStreetLine3").val();
	Customer.cusAddrStreetLine4 = <string>$("#cusAddrStreetLine4").val();

	Customer.cusAddrPhone1 = <string>$("#cusAddrPhone1").val();
	let $phone2 = $("#cusAddrPhone2");
	if ($phone2.length) {
		Customer.cusAddrPhone2 = <string>$("#cusAddrPhone2").val();
	}
	let $phone3 = $("#cusAddrPhone3");
	if ($phone3.length) {
		Customer.cusAddrPhone3 = <string>$("#cusAddrPhone3").val();
	}

	Customer.IsLastSellingPrice = $("#IsLastSellingPrice").is(":checked");

	if (!Customer.FollowUpDateInfo) Customer.FollowUpDateInfo = { Id: 0 } as ICustomerInfo;
	if (Customer.FollowUpDateInfo) {
		Customer.FollowUpDateInfo.type = "date";
		Customer.FollowUpDateInfo.status = $(".followup:checked").val() as string;
		Customer.FollowUpDateInfo.JsFollowUpDate = $("#followUpDate").val() as string;
		Customer.FollowUpDateInfo.Id = Number($("#followUpInfoId").val());
	}

	Customer.cusUnsubscribe = $("#chkUnSubscribe").is(":checked");
	Customer.assignedSalesId = $("#assignedSalesId").val() as number;
}

$(document).on("click", ".itemremove", function () {
	let itemCode = $(this).data("code");
	$.fancyConfirm({
		title: "",
		message: confirmremovetxt,
		shownobtn: true,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				$.ajax({
					//contentType: 'application/json; charset=utf-8',
					type: "POST",
					url: "/Item/Delete",
					data: {
						__RequestVerificationToken: $(
							"input[name=__RequestVerificationToken]"
						).val(),
						itemCode,
					},
					success: function (data) {
						window.location.reload();
					},
					dataType: "json",
				});
			} else {
				$("#txtKeyword").trigger("focus");
			}
		},
	});
});
function setFullPage() {

	$("body")
		.find(".body-content")
		.removeClass("container")
		.addClass("container-fluid");
}


function fillPromotion(): IPromotion {
	return {
		Id: Number($("#Id").val()),
		proName: $("#proName").val() as string,
		proDesc: $("#proDesc").val() as string,
		proNameTC: $("#proNameTC").val() as string,
		proDescTC: $("#proDescTC").val() as string,
		proNameSC: $("#proNameSC").val() as string,
		proDescSC: $("#proDescSC").val() as string,
		pro4Period: ($("input[name=protype]:checked").val() as string) === "period",
		JsDateFrm: $("#proDateFrm").length
			? ($("#proDateFrm").val() as string)
			: null,
		JsDateTo: $("#proDateTo").length ? ($("#proDateTo").val() as string) : null,
		proPrice: $("#proPrice").length ? Number($("#proPrice").val()) : null,
		proQty: $("#proQty").length ? Number($("#proQty").val()) : null,
		proDiscPc:
			Number($(".prodiscpc").val()) === 0
				? Number($(".prodiscpc.pd").val())
				: Number($(".prodiscpc").val()),
		IsObsolete: $("#IsObsolete").val() === "True",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: null,
	};
}

function initPromotion(): IPromotion {
	return {
		Id: 0,
		proName: "",
		proDesc: "",
		proNameTC: null,
		proDescTC: null,
		proNameSC: null,
		proDescSC: null,
		pro4Period: false,
		JsDateFrm: null,
		JsDateTo: null,
		proPrice: 0,
		proQty: 0,
		proDiscPc: 0,
		IsObsolete: false,
		CreateTimeDisplay: "",
		ModifyTimeDisplay: null,
	};
}
function fillItemPeriodPromotion(): IItemPeriodPromotion {
	var itemperiodpromotion = {
		// Id: Number($("#ItemPromotion_Id").val()),
		proId: Number($("#drpPromotion").val()),
		itemCodes: $("#drpItems").val() as string[],
		itemCode: "",
		proNameDisplay: "",
		proDescDisplay: "",
		JsDateFrm: "",
		JsDateTo: "",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: null,
		ipIds: $("#ipIds").val() as string,
		DicPromotionItems: {},
	};
	itemperiodpromotion.itemCode = itemperiodpromotion.itemCodes.join(",");
	return itemperiodpromotion;
}
function fillItemQtyPromotion(): IItemQtyPromotion {
	var itemqtypromotion = {
		// Id: Number($("#ItemPromotion_Id").val()),
		proId: Number($("#drpPromotion").val()),
		itemCodes: $("#drpItems").val() as string[],
		itemCode: "",
		proNameDisplay: "",
		proDescDisplay: "",
		JsDateFrm: "",
		JsDateTo: "",
		CreateTimeDisplay: "",
		ModifyTimeDisplay: null,
		ipIds: $("#ipIds").val() as string,
		DicPromotionItems: {},
	};
	itemqtypromotion.itemCode = itemqtypromotion.itemCodes.join(",");
	return itemqtypromotion;
}
function initItemPromotion(): IItemPromotion {
	return {
		proId: 0,
		itemCode: "",
		IPCreateTimeDisplay: "",
		IPModifyTimeDisplay: null,
		DateFrmDisplay: null,
		DateToDisplay: null,
		proQty: 0,
		proPrice: 0,
		proDiscPc: 0,
		pro4Period: false,
		NameDisplay: "",
		DescDisplay: "",
		PriceDisplay: "",
		DiscPcDisplay: "",
		proDesc: "",
		proDescSC: "",
		proDescTC: "",
		proName: "",
		proNameSC: "",
		proNameTC: "",
	};
}
function selectCus() {
	selectcus();

	setupForexInfo();

	if (!forsimplesales) {
		let $rows = $(`#${gTblId} tbody tr`);
		//console.log('rows length:' + $rows.length + ';currentY:' + currentY);
		if ($rows.length === 0) {
			addRow();
		} else {
			if ($rows.last().find(".itemcode").val() !== "") {
				addRow();
			} else {
				focusItemCode($rows.length - 1);
			}
			//reset sales rows:
			resetPay(false); //reset all variables first
			itotalamt = 0;
			//console.log('SalesList#selectCus#1:', SalesList);
			$rows.each(function (i, e) {
				currentY = $(e).index();
				let _seq = currentY + 1;
				//console.log('currentY:' + currentY);
				$target = $rows.eq(currentY);

				let _itemcode: any = $target.find(".itemcode").val();
				let _selectedItemCode: string = _itemcode.toString();
				//console.log('_selectedItemCode:' + _selectedItemCode);
				if (_selectedItemCode !== "") {
					let salesln: ISalesLn = $.grep(SalesLnList, function (v, k) {
						return (
							v.rtlSeq == _seq && v.Item.itmCode.toString() == _selectedItemCode
						);
					})[0];
					//console.log('salesln:', salesln);

					if (typeof salesln !== "undefined") {
						let price = getActualPrice(salesln!.Item);
						//let qty = salesln.rtlQty;
						let discount = salesln.rtlLineDiscPc as number;
						//let taxrate = salesln.taxrate;
						//console.log('qty:' + qty + ';price:' + price + ';disc:' + discount + ';tax:' + taxrate);
						updateRow(price, discount);
						_selectedItemCode = "";
						currentY = -1;
					}
				}
			});
		}
	}

	$("#txtCustomerName").trigger("focus");

	if (Sales) Sales.rtsCusCode = selectedCus.cusCode;
}

function setupForexInfo() {
	if (!comInfo) comInfo = $infoblk.data("cominfo");
	if ($.isEmptyObject(DicCurrencyExRate))
		DicCurrencyExRate = $infoblk.data("diccurrencyexrate");
	UseForexAPI = comInfo.UseForexAPI;
	exRate = 1;
	let currcode = "";
	if (!UseForexAPI) currcode = GetForeignCurrencyFrmCode(selectedCus.cusCode!);
	//console.log("currcode:" + currcode);
	if (currcode !== "") {
		$("#rtsCurrency").val(currcode).prop("readonly", true);
		fillInCurrencyModal(currcode);
	}
	displayExRate(exRate);
	$("#rtsExRate").val(1);
}

function selectcus() {
	selectedCusCodeName = selectedCus.cusCustomerID.toString();
	//console.log('selectedcuscodename:' + selectedCusCodeName);
	if (selectedCusCodeName === "") {
		$.fancyConfirm({
			title: "",
			message: customerrequiredtxt,
			shownobtn: false,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					$("#txtCustomerName").trigger("focus");
				}
			},
		});
	} else {
		if (
			typeof CusList !== "undefined" &&
			CusList.length > 1 &&
			(typeof selectedCus === "undefined" || selectedCus === null)
		) {
			selectedCus = $.grep(CusList, function (n, i) {
				return n.cusCustomerID.toString() == selectedCusCodeName;
			})[0];
		}

		let $drpaddr = fillInAddressList();
		deliveryAddressId = <number>$drpaddr.val();

		if (selectedCus) {
			selectedCusCodeName = selectedCus.cusCustomerID.toString();

			let $cusname = $("#txtCustomerName");
			$cusname.off("change");
			$cusname.val(selectedCus.cusName);
			$cusname.off("focus").on("change", handleCustomerNameChange);

			if (selectedCus.cusName.toLowerCase() !== "guest") {
				$("#txtPhone").val(selectedCus.cusPhone ?? "");
				$("#txtPoints").val(Number(selectedCus.cusPointsActive ?? 0));
				//setCustomerPriceLevel();
				$("#txtPriceLevel").val(<string>selectedCus.cusPriceLevelDescription);
				//console.log("cus joblist:", selectedCus.JobList);
				if (enableTax && !inclusivetax && selectedSalesLn) {
					//console.log("here");
					updateRows4Tax();
				}
			} else {
				$("#txtPhone").val("");
				$("#txtPoints").val(0);
				$("#txtPriceLevel").val("");
			}

			$(".cuscode").text(selectedCus.cusCode);

			if (!UseForexAPI && selectedCus.ExchangeRate)
				exRate = selectedCus.ExchangeRate!;
		}
	}
}

function searchCustomer(_keyword: string) {
	if (_keyword !== "") {
		keyword = _keyword.toLowerCase();
		searchcusmode = true;
		GetCustomers4Sales(1, "search");
	} else {
		falert(onlyalphanumericallowedtxt, oktxt);
	}
}

function getCustomersOk(data) {
	closeWaitingModal();
	keyword = "";
	//console.log('getcustomerok data:', data);
	$(".warning").empty();
	let html = "";
	if (data.Customers.length > 0) {
		CusList = data.Customers.slice(0);
		//console.log('cuslist:', cuslist);
		if (CusList.length === 1) {
			selectedCus = CusList[0];
			selectCus();
		} else if (CusList.length > 1) {
			$.each(CusList, function (i, e) {
				html +=
					'<tr class="cuscode" data-code="' +
					e.cusCode +
					'"><td>' +
					e.cusCode +
					"</td><td>" +
					e.cusName +
					"</td></tr>";
			});

			$("#tblCus tbody").empty().append(html);
			selectCus();
		} else {
			openCusModal();
		}
	} else {
		openCusModal();
	}
}

function handleCustomerNameChange(e: any) {
	selectedCusCodeName = <string>e.currentTarget.value;
	searchCustomer(selectedCusCodeName);
}

$(document).on("change", ".itemcode", handleItemCodeChange);

function handleItemCodeChange(this) {
	//console.log("here");
	getRowCurrentY.call(this);

	selectedItemCode = $(this).val() as string;

	if (forsales) selectedSalesLn = GetSetSelectedSalesLn();
	console.log("selectedSalesLn:", selectedSalesLn);
	if (forpreorder) selectedPreSalesLn = GetSetSelectedPreSalesLn();
	if (forwholesales) SelectedWholeSalesLn = GetSetSelectedWholeSalesLn();
	if (forpurchase) SelectedPurchaseItem = GetSetSelectedPurchaseItem();

	if (selectedItemCode !== "") {
		searchItemMode = true;
		keyword = selectedItemCode.toString();
		// console.log("here");
		searchItem();
		// }
	} else {
		//console.log("ready for reset row...");
		resetRow();
	}
}

function handleReversePayment(salescode: string) {
	setTimeout(disableReverse, 3000000); //inactivate the link after 15 mins
	$("#reverseEpay").removeClass("isDisabled"); //activate the link
	$.ajax({
		type: "POST",
		url: "/POSFunc/ReversePayment",
		data: { salescode },
		success: function (data) {
			$.fancyConfirm({
				title: "",
				message: data.msg,
				shownobtn: false,
				okButton: oktxt,
				noButton: notxt,
				callback: function (value) {
					if (value) {
						if (data.epaystatus == 1) {
							window.location.reload();
						} else {
						}
					}
				},
			});
		},
		dataType: "json",
	});
}
function disableTR() {
	$("#transactionEpay").addClass("isDisabled");
}
function disableReverse() {
	$("#reverseEpay").addClass("isDisabled");
}


function UpdatePreSales() {
	//PreSales.rtsServiceChargePc = ServiceChargePC;
	//PreSales.rtsServiceChargeAmt = ServiceChargeAmt;

	let totalamt = 0;
	let $rows = $(`#${gTblId} tbody tr`);
	$rows.each(function (i, e) {
		let _seq = i + 1;
		let itemcode: string = $(e)
			.find(".itemcode")
			.val() as string;

		if (itemcode) {
			let presalesln: IPreSalesLn | null;
			if (PreSalesLnList.length === 0) {
				presalesln = {} as IPreSalesLn;
				presalesln.rtlSeq = _seq;
			} else {
				let idx = PreSalesLnList.findIndex((x) => { return x.rtlSeq == _seq; });
				if (idx >= 0) presalesln = PreSalesLnList[idx];
				else {
					presalesln = {} as IPreSalesLn;
					presalesln.rtlSeq = _seq;
				}
			}

			if (presalesln) {
				presalesln.rtlSeq = _seq;
				let idx = 0;
				presalesln.rtlQty = Number($(e).find(".qty").val());

				idx = PriceIdx4Sales;
				presalesln.rtlSellingPrice = Number(
					$(e).find(".price").val()
				);
				idx++;
				presalesln.rtlLineDiscPc = Number(
					$(e).find(".discpc").val()
				);

				idx++;
				if (enableTax && !inclusivetax) {
					presalesln.rtlTaxPc = Number(
						$(e).find(".taxpc").val()
					);
				}

				presalesln.rtlSalesLoc = presalesln.rtlStockLoc = <string>(
					$(e).find(".location").val()
				);
				presalesln.JobID = Number($(e).find("td").eq(-2).find(".job").val());
				//console.log("presalesln.jobid:" + presalesln.JobID);
				const amt: number = Number(
					$(e).find(".amount").val()
				);
				// console.log("amt:" + amt);
				presalesln.rtlSalesAmt = amt;
				totalamt += amt;
			}

			if (PreSalesLnList.length > 0) {
				let idx = PreSalesLnList.findIndex((x) => { return x.rtlSeq == _seq; });
				if (idx >= 0) {
					PreSalesLnList[idx] = structuredClone(presalesln);
				} else {
					PreSalesLnList.push(presalesln);
				}
			} else {
				PreSalesLnList.push(presalesln);
			}
		}
	});
	//console.log("totalamt#updatesales:" + totalamt);
	$("#txtTotal").val(formatnumber(totalamt));
	//console.log("PreSalesLnList@updatesales:", PreSalesLnList);

	//reset variables:
	isPromotion = !isPromotion;
}

function UpdateSimpleSales() {
	//Sales.rtsCusID = Number($("#rtsCusID").val());
	Sales.authcode = authcode;
	Sales.rtsCurrency = $("#rtsCurrency").val() as string;
	Sales.rtsExRate = exRate;
	Sales.rtsServiceChargePc = ServiceChargePC;
	Sales.rtsServiceChargeAmt = ServiceChargeAmt;

	SimpleSalesLns = [];
	$(".product-lists").each(function (i, e) {
		let salesLn: ISimpleSalesLn = {
			rtlItemCode: $(e).data("code"), rtlLineDiscPc: Number($(e).data("discpc")), rtlLineDiscAmt: Number($(e).data("disc")), rtlQty: Number($(e).find(".simpleqty").val()), rtlSellingPrice: Number($(e).data("price")), rtlDesc: $(e).data("desc"), rtlSalesAmt: Number($(e).data("amt")), rtlSalesLoc: comInfo.Shop, rtlStockLoc: comInfo.Shop, rtlNote: $(e).find(".note").val()
		} as ISimpleSalesLn;
		SimpleSalesLns.push(salesLn);
	});
}

function UpdateSales() {
	Sales.rtsServiceChargePc = ServiceChargePC;
	//Sales.rtsServiceChargeAmt = ServiceChargeAmt;
	let totalamt = 0;
	let $rows = $("#tblSales tbody tr");

	//console.log("SalesLnList@updatesales#0:", SalesLnList);
	$rows.each(function (i, e) {
		let _seq = i + 1;
		//console.log("_seq:" + _seq);
		let itemcode: string = $(e)
			.find(".itemcode")
			.val() as string;
		//console.log("itemcode:" + itemcode);
		let idx = -1;

		if (itemcode) {
			let salesln: ISalesLn | ISimpleSalesLn = {} as ISalesLn | ISimpleSalesLn;

			if (forsales) {
				if (SalesLnList.length === 0) salesln = initSalesLn(_seq);
				else {
					idx = SalesLnList.findIndex((x) => { return x.rtlSeq == _seq; });
					if (idx >= 0) salesln = SalesLnList[idx];
					else salesln = initSalesLn(_seq);
				}
			}

			if (forReservePaidOut) {
				//console.log("_seq:" + _seq);
				idx = SalesLnList.findIndex((x) => { return x.rtlSeq == _seq; });
				//console.log("idx:" + idx);
				if (idx >= 0) salesln = SalesLnList[idx];
				//console.log("salesln:", salesln);
			}

			if (salesln! && !editmode) { //not for salesorderlist here
				salesln.rtlSeq = _seq;
				salesln.rtlItemCode = itemcode;
				let _idx = ItemList.findIndex(
					(x) => { return x.itmCode.toString() == salesln!.rtlItemCode.toString(); }
				);

				if (_idx >= 0) {
					salesln.Item = ItemList[_idx];
				}

				salesln.rtlQty = Number($(e).find(".qty").val());

				salesln.rtlSellingPrice = Number(
					$(e).find(".price").val()
				);

				salesln.rtlLineDiscPc = Number(
					$(e).find(".discpc").val()
				);


				if (enableTax && !inclusivetax) {
					salesln.rtlTaxPc = Number(
						$(e).find(".taxpc").val()
					);
				}

				salesln.rtlSalesLoc = salesln.rtlStockLoc = <string>(
					$(e).find(".location").val()
				);
				salesln.JobID = Number($(e).find(".job").val());
				//console.log("salesln.jobid:" + salesln.JobID);
				const amt: number = Number(
					$(e).find(".amount").val()
				);
				//console.log("amt:" + amt);
				salesln.rtlSalesAmt = amt;
				totalamt += amt;
			}

			if (SalesLnList.length > 0 && !editmode) {//not for salesorderlist here				
				if (idx >= 0) {
					SalesLnList[idx] = structuredClone(salesln! as ISalesLn);
				} else {
					if (forsales)
						SalesLnList.push(salesln! as ISalesLn);
				}
			} else {
				if (forsales)
					SalesLnList.push(salesln! as ISalesLn);
			}
		}
	});
	//console.log("totalamt#updatesales:" + totalamt);
	$("#txtTotal").val(formatnumber(totalamt));
	//console.log("SalesLnList@updatesales:", SalesLnList);

	//reset variables:
	isPromotion = !isPromotion;
}
function getItemsDisplayStart() {
	return ItemList.length + 1;
}
function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
function fillInAddressList(): JQuery<HTMLElement> {
	let $drpaddr = $("#drpDeliveryAddr");
	$drpaddr.empty();
	// console.log("selectedcus#fillinaddress:", selectedCus);
	if (selectedCus && selectedCus.AddressList) {
		$.each(selectedCus.AddressList, function (i, item) {
			let address: string = `${item.StreetLine1 ?? ""} ${item.StreetLine2 ?? ""
				} ${item.StreetLine3 ?? ""} ${item.StreetLine4 ?? ""} ${item.City ?? ""
				} ${item.State ?? ""} ${item.Country ?? ""}`.trim();
			if (address !== "") {
				$drpaddr.append(
					$("<option>", {
						value: item.Id,
						text: address,
						selected: WholeSales && WholeSales.wsDeliveryAddressId == item.Id,
					})
				);
			}
		});
	}
	return $drpaddr;
}
function initRecurOrder(): IRecurOrder {
	return {
		wsUID: 0,
		wsCode: "",
		IsRecurring: 1,
		Name: "",
		TotalSalesAmt: 0,
		LastPostedDate: new Date(),
		LastPostedDateDisplay: "",
		ItemsNameDesc: "",
		Mode: "",
		pstUID: 0,
		pstCode: "",
		rtsUID: 0,
	};
}

function handleMGTmails(pageIndex: number = 1, latestRecordCount: number = 300) {
	//console.log("latestRecordCount:", latestRecordCount);
	if (forenquiry) {
		const enquiryacc: string = $infoblk.data("enquiryacc") as string;
		EnquiryList = [];

		let mgtEmail = document.getElementById("mgt-email");
		configMGTResource(enquiryacc, latestRecordCount);

		$("#mgt-email").attr("resource", resource);

		if (mgtEmail) {
			let enqlist: IEnquiry[] = [];
			mgtEmail.addEventListener("dataChange", (e: any) => {
				const response = e.detail.response;
				//console.log("response value:", response.value);				
				response.value.forEach((x) => {
					EnquiryList.push(x);
					DicEnqContent[x.id] = `${x.body.content} ReceivedDateTime:${x.receivedDateTime}`;
				});
				parseEnquiries(DicEnqContent);

				if (EnquiryList.length > 0) {
					//console.log("enqIdList:", enqIdList);					
					EnquiryList.forEach((x) => {
						if (!EnIdList.includes(x.id)) {
							enqlist.push(x);
						}
					});
				}

				sortCol = 8;
			});
			if (enqlist.length > 0)
				saveEnquiries(enqlist);

			GetEnquiries(pageIndex);

		}
	}

	if (forattendance) {
		//console.log("here");
		AttendanceList = [];
		const attendanceacc: string = $infoblk.data("attendanceacc") as string;
		//console.log("attendanceacc:", attendanceacc);
		let mgtEmail = document.getElementById("mgt-email");
		configMGTResource(attendanceacc, latestRecordCount);

		$("#mgt-email").attr("resource", resource);

		if (mgtEmail) {
			mgtEmail.addEventListener("dataChange", (e: any) => {
				const response = e.detail.response;
				response.value.forEach((x) => {
					attendance = {
						id: "",
						saId: x.id,
						receivedDateTime: x.receivedDateTime,
						receiveddate: getReceivedDate(x.receivedDateTime),
						saName: "",
						saReceivedDateTime: "",
						saCheckInTime: "",
						saCheckOutTime: "",
						saDate: null,
						DateDisplay: "",
						TotalRecord: 0,
					};

					let idx = AttendanceList.findIndex(a => { return a.saId == x.id; });
					if (idx === -1) {
						AttendanceList.push(attendance);
						DicAttdSubject[x.id] = `${x.subject}`;
					}

				});

				parseAttendances(DicAttdSubject);

				if (AttendanceList.length > 0) {
					//console.log("enqIdList:", enqIdList);
					let attdlist: IAttendance[] = [];
					//console.log("AttendanceList#00:", AttendanceList);
					AttendanceList.forEach((x) => {
						if (!attdIdList.includes(x.saId)) {
							//console.log(x.saId);
							attdlist.push(x);
						}
					});
					//console.log("attdlist:", attdlist);
					if (attdlist.length > 0)
						saveAttendances(attdlist);
				}

				sortCol = 0;
			});

			GetAttendances(pageIndex);
		}
	}

	if (forjob) {
		//console.log("here");
		JobList = [];
		const jobacc: string = $infoblk.data("jobacc") as string;
		//console.log("jobacc:", jobacc);
		let mgtEmail = document.getElementById("mgt-email");
		configMGTResource(jobacc, latestRecordCount);

		$("#mgt-email").attr("resource", resource);

		if (mgtEmail) {
			mgtEmail.addEventListener("dataChange", (e: any) => {
				const response = e.detail.response;

				response.value.forEach((x) => {
					job = {
						id: "",
						joStaffName: x.from.emailAddress.name,
						joStaffEmail: x.from.emailAddress.address,
						joId: x.id,
						receivedDateTime: x.receivedDateTime,
						receiveddate: getReceivedDate(x.receivedDateTime),
						joClient: "",
						joTime: "",
						joWorkingHrs: 0,
						joReceivedDateTime: "",
						joAttachements: "",
						joDate: null,
						DateDisplay: "",
						TotalRecord: 0,
					};
					//console.log("receivedDateTime:", x.receivedDateTime);
					let idx = JobList.findIndex(a => { return a.joId == x.id; });
					if (idx === -1) {
						JobList.push(job);
						//console.log("subject:" + x.subject);
						DicJobSubject[x.id] = `${x.subject}`;
					}

				});
				//console.log("JobList#mgt:", JobList);
				parseJobs(DicJobSubject);

				if (JobList.length > 0) {
					//console.log("enqIdList:", enqIdList);
					let joblist: IJob[] = [];
					//console.log("JobList#00:", JobList);
					JobList.forEach((x) => {
						if (!attdIdList.includes(x.joId)) {
							//console.log(x.joId);
							joblist.push(x);
						}
					});
					//console.log("joblist:", joblist);
					if (joblist.length > 0)
						saveJobs(joblist);
				}

				sortCol = 0;
			});

			GetJobs(pageIndex);
		}
	}

	if (fortraining) {
		//console.log("here");
		TrainingList = [];
		const trainingacc: string = $infoblk.data("trainingacc") as string;
		//console.log("trainingacc:", trainingacc);
		let mgtEmail = document.getElementById("mgt-email");
		configMGTResource(trainingacc, latestRecordCount);

		$("#mgt-email").attr("resource", resource);

		if (mgtEmail) {
			mgtEmail.addEventListener("dataChange", (e: any) => {
				//console.log("e.detail.response:", e.detail.response);
				const response = e.detail.response;

				response.value.forEach((x) => {
					training = {
						id: "",
						trApplicant: "",
						trEmail: "",
						trId: x.id,
						receivedDateTime: x.receivedDateTime,
						receiveddate: getReceivedDate(x.receivedDateTime),
						trCompany: "",
						trIndustry: "",
						trAttendance: 0,
						trIsApproved: (x.subject as string).startsWith("[Confirmed]"),
						trReceivedDateTime: "",
						trPhone: "",
						strDate: "",
						trDate: null,
						DateDisplay: "",
						TotalRecord: 0,
					};
					//console.log("receivedDateTime:", x.receivedDateTime);
					let idx = TrainingList.findIndex(a => { return a.trId == x.id; });
					if (idx === -1) {
						TrainingList.push(training);
						//console.log("content:" + x.body.content);
						DicTrainingContent[x.id] = `${x.body.content}`;
					}

				});
				//console.log("TrainingList#mgt:", TrainingList);
				parseTrainings(DicTrainingContent);

				if (TrainingList.length > 0) {
					//console.log("enqIdList:", enqIdList);
					let traininglist: ITraining[] = [];
					//console.log("TrainingList#00:", TrainingList);
					TrainingList.forEach((x) => {
						if (!attdIdList.includes(x.trId)) {
							//console.log(x.joId);
							traininglist.push(x);
						}
					});
					//console.log("traininglist:", traininglist);
					if (traininglist.length > 0)
						saveTrainings(traininglist);
				}

				sortCol = 0;
			});

			GetTrainings(pageIndex);
		}
	}
}
$(document).on("change", ".todate", function () {
	$target = $(this);
	let todate = $target.val();
	//console.log($(this).val());
	let frmdate = $(".frmdate").first().val();
	//console.log(frmdate);
	if (frmdate! > todate!) {
		/*$(this).trigger("select").trigger("focus"); */
		//$("#proDateTo").datepicker("show");
		//setTimeout("$('#proDateTo').focus();", 320);//ok
		setTimeout(function () { $target.trigger("focus"); }, 320);
	}
});



function configMGTResource(enquiryacc: string, latestRecordCount: number) {
	resource = resource.replace("{0}", enquiryacc).replace("{1}", latestRecordCount.toString());
}

function getReceivedDate(receivedDateTime: string): string {
	return (receivedDateTime).split("T")[0].trim();
}

function initDatePicker(
	selector: string,
	date: Date = new Date(),
	showPastDates: boolean = true,
	format: string = "",
	setDate: boolean = true,
	showToday: boolean = false,
	isClass: boolean = false
) {
	if (format === "") format = jsdateformat;
	//console.log("format:", format);

	let $ele = isClass ? $(`.${selector}`) : $(`#${selector}`);
	//console.log("$ele:", $ele);

	$ele.datepicker({
		dateFormat: format,
		beforeShow: function () {
			setTimeout(function () {
				$(".ui-datepicker").css("z-index", 99999999999999);
			}, 500);
		},
	});

	if (setDate) {
		$ele.datepicker("setDate", date);
	}

	if (!showPastDates) {
		$ele.datepicker("option", {
			minDate: showToday ? new Date() : date,
			autoOpen: false,
		});
	}
	switch (lang) {
		case 2:
			$ele.datepicker($.datepicker.regional[""]);
			break;
		case 1:
			$ele.datepicker($.datepicker.regional["zh-CN"]);
			break;
		default:
		case 0:
			$ele.datepicker($.datepicker.regional["zh-HK"]);
			break;
	}

}
function cleanDatepicker() {
	var old_fn = $.datepicker._updateDatepicker;

	$.datepicker._updateDatepicker = function (inst) {
		old_fn.call(this, inst);

		var buttonPane = $(this).datepicker("widget").find(".ui-datepicker-buttonpane");

		$("<button type='button' class='ui-datepicker-clean ui-state-default ui-priority-primary ui-corner-all'>Delete</button>").appendTo(buttonPane).on("click", function (ev) {
			$.datepicker._clearDate(inst.input);
		});
	}
}
function confirmConvertDate() {
	$target = convertDateModal.find("#txtConvertDate");
	if ($target.val() == "") {
		$.fancyConfirm({
			title: "",
			message: convertdaterequiredtxt,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$target.trigger("focus");
				}
			},
		});
	} else {
		closeConvertDateModal();
		const convertdate: string = $target.val() as string;
		$target = $("#txtDeliveryDate");
		let deldate = new Date(convertdate);
		deldate.setDate(deldate.getDate() + 1);
		$target.datepicker("setDate", deldate);
		if (validSalesForm()) {
			_submitSales();
		}
	}
}
$(document).on("click", ".respond", function () {
	if ($(this).hasClass("disabled")) return false;
	let type: string = $(this).data("type");

	if (forcustomer) {
		cusCode = $(this).data("code") as string;
		selectedCus = {} as ICustomer;
		selectedCus.cusCode = cusCode;
		selectedCus.cusName = $(this).data("name");
	} else {
		if (!receiptno)
			receiptno = frmsearch
				? <string>$("#txtSearch").val()
				: $(this).data("code");
	}
	// console.log("receiptno:" + receiptno);
	// return false;
	if (type == "reject") {
		openTextAreaModal();
		$("#textareaModal").find("#lblField").text(rejectreasontxt);
	} else if (type == "void") {
		$.fancyConfirm({
			title: "",
			message: confirmvoidinvoicetxt,
			shownobtn: true,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$.fancyConfirm({
						title: "",
						message: recreateinvoice4voidtxt,
						shownobtn: true,
						okButton: oktxt,
						noButton: notxt,
						callback: function (value) {
							if (value) {
								recreateOnVoid = 1;
								//forwholesales = true;
							}
							respondReview(type);
							if (forcustomer) window.location.href = "/Customer/Index";
							if (forwholesales)
								window.location.href = "/WholeSales/SalesOrderList";
							if (forpurchase)
								window.location.href = "/Purchase/PurchaseOrderList";
						},
					});
				} else {
					$("#txtSearch").trigger("focus");
				}
			},
		});
	} else {
		respondReview(type);
		// if (forcustomer) window.location.href = "/Customer/Index";
		// if (forsales) window.location.href = "/WholeSales/SalesOrderList";
	}
});

$(document).on("click", ".whatspplink", function () {
	let msg: string = "";
	//console.log("forcustomer:" + forcustomer + ";forsales:" + forsales);
	//console.log("customerurl:" + $(this).data("customerurl"));

	if (forcustomer) {
		msg = requestapproval4customertxt;

		if (forrejectedcustomer) msg = rejectedcustomertxt;
		if (forapprovedcustomer) msg = approvedcustomertxt;

		msg = msg
			.replace("{0}", encodeURIComponent(selectedCus.cusName))
			.replace("{1}", $(this).data("customerurl"));
		if (forrejectedcustomer)
			msg = msg.replace("{2}", encodeURIComponent(rejectreason));
	} else {
		//console.log("salesurl:" + $(this).data("salesurl"));

		if (forsales) msg = requestapproval4invoicetxt;
		if (forrejectedinvoice) msg = rejectedinvoicetxt;
		if (forapprovedinvoice) msg = approvedinvoicetxt;
		if (forpassedtomanager) msg = passedinvoicetxt;

		msg = msg
			.replace("{0}", $(this).data("code"))
			.replace("{1}", $(this).data("salesurl"))
			.replace("{2}", encodeURIComponent(selectedCus.cusName));

		if (forrejectedinvoice) msg = msg.replace("{3}", rejectreason);
	}

	//https://api.whatsapp.com/send?phone={0}&amp;text={1}
	let whatsapplnk: string = decodeURIComponent(
		$infoblk.data("whatsapplinkurl") as string
	);
	whatsapplnk = whatsapplnk
		.replace("{0}", $(this).data("phone"))
		.replace("{1}", msg);

	if (enableWhatsappLnk) window.open(whatsapplnk, "_blank");
	closeWhatsappLinkModal();
});

function handleWhatsAppPhone(phone: string) {
	// console.log("original phone:" + phone);
	if (phone !== "") {
		const regex = new RegExp("^\\+{1}852\\d+|^852\\d+");
		if (!regex.test(phone)) {
			// console.log("phone before concat:" + phone);
			phone = "852".concat(phone);
			// console.log("phone after concat:" + phone);
		}
	}
	// console.log("phone to be returned:" + phone);
	return phone;
}

function respondReview(type) {
	openWaitingModal();
	if (forwholesales) {
		$.ajax({
			type: "POST",
			url: "/Api/RespondSalesOrderReview",
			data: {
				__RequestVerificationToken: $(
					"input[name=__RequestVerificationToken]"
				).val(),
				type,
				receiptno,
				usercode: $infoblk.data("usercode"),
				rejectreason,
				recreateOnVoid,
			},
			success: function (data) {
				closeWaitingModal();
				if (data) {
					selectedCus = data.customer;
					if (type == "approve") {
						forapprovedinvoice = true;
						$(".btnApprove").prop("disabled", true).off("click");
					}
					if (type == "reject") {
						forrejectedinvoice = true;
						$(".btnReject").prop("disabled", true).off("click");
					}
					if (type == "pass") {
						forpassedtomanager = true;
						$(".btnPass").prop("disabled", true).off("click");
					}
					if (type == "void") {
						$("#btnVoid").prop("disabled", true).off("click");
					}
					let phoneno: string = "";

					if (type == "void") {
						let approvers: Array<ISysUser> = data.approvers;
						phoneno = approvers[0].Phone as string;
					} else {
						phoneno = data.salesman.Phone;
					}

					if (enableWhatsappLnk) {
						let msg: string = "";
						msg = requestapproval4invoicetxt;
						if (forrejectedinvoice) msg = rejectedinvoicetxt;
						if (forapprovedinvoice) msg = approvedinvoicetxt;
						if (forpassedtomanager) msg = passedinvoicetxt;

						msg = msg
							.replace("{0}", receiptno)
							.replace("{1}", data.url)
							.replace("{2}", encodeURIComponent(selectedCus.cusName));

						if (forrejectedinvoice)
							msg = msg.replace("{3}", encodeURIComponent(rejectreason));

						whatsapplnk = whatsapplnk
							.replace("{0}", handleWhatsAppPhone(phoneno))
							.replace("{1}", msg);
						window.open(whatsapplnk, "_blank");
					}

					window.location.href = "/WholeSales/SalesOrderList";

					//$("#txtSearch").trigger("focus");
				}
			},
			dataType: "json",
		});
	}
	if (forpurchase) {
		$.ajax({
			type: "POST",
			url: "/Api/RespondPurchaseOrderReview",
			data: {
				__RequestVerificationToken: $(
					"input[name=__RequestVerificationToken]"
				).val(),
				type,
				receiptno,
				usercode: $infoblk.data("usercode"),
				rejectreason,
				recreateOnVoid,
			},
			success: function (data) {
				closeWaitingModal();
				if (data) {
					SelectedSupplier = data.supplier;
					if (type == "approve") {
						forapprovedpo = true;
						$(".btnApprove").prop("disabled", true).off("click");
					}
					if (type == "reject") {
						forrejectedpo = true;
						$(".btnReject").prop("disabled", true).off("click");
					}
					if (type == "pass") {
						forpassedtomanager = true;
						$(".btnPass").prop("disabled", true).off("click");
					}
					if (type == "void") {
						$("#btnVoid").prop("disabled", true).off("click");
					}
					let phoneno: string = "";

					if (type == "void") {
						let approvers: Array<ISysUser> = data.approvers;
						phoneno = approvers[0].Phone as string;
					} else {
						phoneno = data.salesman.Phone;
					}

					if (enableWhatsappLnk) {
						let msg: string = "";
						msg = requestapproval4potxt;
						if (forrejectedpo) msg = rejectedpotxt;
						if (forapprovedpo) msg = approvedpotxt;
						if (forpassedtomanager) msg = passedpotxt;

						msg = msg
							.replace("{0}", receiptno)
							.replace("{1}", data.url)
							.replace("{2}", encodeURIComponent(SelectedSupplier.supName));

						if (forrejectedinvoice)
							msg = msg.replace("{3}", encodeURIComponent(rejectreason));

						whatsapplnk = whatsapplnk
							.replace("{0}", handleWhatsAppPhone(phoneno))
							.replace("{1}", msg);
						window.open(whatsapplnk, "_blank");
					}
					window.location.href = "/Purchase/PurchaseOrderList";
				}
			},
			dataType: "json",
		});
	}
}

function SubmitSimpleSales() {
	UpdateSimpleSales();

	if (selectedCus.CusEmailList) {
		//<a class="btnsmall preview" role="button" data-id="1" data-interval="x" title="Mail Test 1" href="#">Mail Test 1</a>,<a class="btnsmall preview" role="button" data-id="2" title="Mail Test 2" href="#">Mail Test 2</a>
		//促銷電子郵件 {0} 將在 {2} 天後發送至 {1}。
		let msglist: string[] = [];
		selectedCus.CusEmailList.split(",").forEach((x) => {
			let msg = promotionemailmsgformat.replace("{0}", x).replace("{1}", selectedCus.cusName).replace("{2}", $(x).data("interval"));
			msglist.push(msg);
		});
		console.log(msglist.join("<br>"));
		return;

		$.fancyConfirm({
			title: "",
			message: msglist.join("<br>"),
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					_submitSimpleSales();
				}
			}
		});
	} else {
		_submitSimpleSales();
	}
}
function submitSales() {
	if (forsales || forReservePaidOut) {
		UpdateSales();
		//Sales.Roundings = isNumeric(Sales.Roundings) ? Sales.Roundings : 0;
		if (validSalesForm()) {
			_submitSales();
		}
	}
	if (forpreorder) {
		if (!editmode) UpdatePreSales();
		if (validSalesForm()) {
			//console.log("here");
			_submitSales();
		}
	}
}

function _submitSimpleSales() {
	let url = "/POSFunc/ProcessSales";
	let data = { Sales, SimpleSalesLns, Payments };
	//console.log("data:", data);
	//return false;
	openWaitingModal();
	$.ajax({
		type: "POST",
		url: url,
		data: data,
		success: function (data) {
			closeWaitingModal();
			const salescode = data.finalsalescode!;
			printurl += "?issales=1&salesrefundcode=" + salescode;

			if (typeof data.epaystatus === "undefined") {
				if (data.msg === "") {
					window.open(printurl);
					if (forsimplesales)
						window.location.reload();
					if (forpreorder)
						window.location.href = "/Preorder/Index";
				}
			} else {
				//console.log('epaystatus:' + data.epaystatus);
				if (data.epaystatus == 1) {
					$.fancyConfirm({
						title: "",
						message: data.msg,
						shownobtn: false,
						okButton: oktxt,
						noButton: notxt,
						callback: function (value) {
							if (value) {
								//if (data.zerostockItemcodes !== "") {
								//	handleOutOfStocks(data.zerostockItemcodes);
								//} else {
								window.open(printurl);
								window.location.reload();
								//}
							}
						},
					});
				}
				else {
					if (data.epaystatus == -1) {
						//needquery_userpaying
						openPayModal();
						$("#transactionEpay").removeClass("isDisabled"); //activate the link
						selectedSalesCode = salescode;
						//setTimeout(function () {
						//    handleTransactionResult(data.salescode);
						//}, 15000); //reverse payment after payment api called for 15s.
					} else {
						setTimeout(function () {
							handleReversePayment(salescode);
						}, 15000); //reverse payment after payment api called for 15s.
					}
				}
			}
		},
		dataType: "json",
	});
}
function _submitSales() {
	let url = "";
	if (forsales || forReservePaidOut) {
		url = "/POSFunc/ProcessAdvSales";
		if (forsales) {
			Sales.rtsCusCode = selectedCus.cusCode;
			Sales.rtsCode = receiptno ?? $("#rtsCode").val();
			Sales.ireviewmode = reviewmode ? 1 : 0;
			Sales.selectedPosSalesmanCode = selectedPosSalesmanCode;
		}

		Sales.rtsRmks = $("#txtNotes").val() as string;
		Sales.rtsInternalRmks = $("#txtInternalNotes").val() as string;
		Sales.authcode = authcode;
		Sales.rtsCurrency = $("#rtsCurrency").val() as string;
		Sales.rtsExRate = exRate;
		Sales.rtsSalesLoc = $("#drpLocation").val() as string;
		Sales.rtsDvc = $("#drpDevice").val() as string;
		Sales.rtsAllLoc = $("#chkAllLoc").is(":checked");
		Sales.rtsServiceChargePc = ServiceChargePC;
		Sales.rtsServiceChargeAmt = ServiceChargeAmt;
	}
	if (forpreorder) {
		url = "/Preorder/Edit";
		PreSales.rtsCusCode = selectedCus.cusCode;
		PreSales.rtsRmks = $("#txtNotes").val() as string;
		PreSales.rtsInternalRmks = $("#txtInternalNotes").val() as string;
		PreSales.authcode = authcode;
		PreSales.salescode = receiptno ?? $("#rtsCode").val();
		PreSales.rtsCurrency = $("#rtsCurrency").val() as string;
		PreSales.rtsExRate = exRate;
		PreSales.rtsSalesLoc = $("#drpLocation").val() as string;
		PreSales.rtsDvc = $("#drpDevice").val() as string;
		PreSales.rtsAllLoc = $("#chkAllLoc").is(":checked");
		PreSales.rtsServiceChargePc = ServiceChargePC;
		Sales.rtsServiceChargeAmt = ServiceChargeAmt;
	}

	let data = forpreorder
		? { PreSales, PreSalesLnList, Payments, DeliveryItems }
		: { Sales, SalesLnList, Payments, DeliveryItems };
	//console.log("data:", data);
	//return false;
	openWaitingModal();
	$.ajax({
		type: "POST",
		url: url,
		data: data,
		success: function (data) {
			closeWaitingModal();
			const salescode = data.finalsalescode!;
			printurl += "?issales=1&salesrefundcode=" + salescode;

			if (typeof data.epaystatus === "undefined") {
				if (data.msg === "") {
					window.open(printurl);
					if (forsales || forReservePaidOut)
						//window.location.reload();
						if (forpreorder)
							window.location.href = "/Preorder/Index";
				}
			} else {
				//console.log('epaystatus:' + data.epaystatus);
				if (data.epaystatus == 1) {
					$.fancyConfirm({
						title: "",
						message: data.msg,
						shownobtn: false,
						okButton: oktxt,
						noButton: notxt,
						callback: function (value) {
							if (value) {
								//if (data.zerostockItemcodes !== "") {
								//	handleOutOfStocks(data.zerostockItemcodes);
								//} else {
								window.open(printurl);
								window.location.reload();
								//}
							}
						},
					});
				} else {
					if (data.epaystatus == -1) {
						//needquery_userpaying
						openPayModal();
						$("#transactionEpay").removeClass("isDisabled"); //activate the link
						selectedSalesCode = salescode;
						//setTimeout(function () {
						//    handleTransactionResult(data.salescode);
						//}, 15000); //reverse payment after payment api called for 15s.
					} else {
						setTimeout(function () {
							handleReversePayment(salescode);
						}, 15000); //reverse payment after payment api called for 15s.
					}
				}

				isEpay = false;
			}
		},
		dataType: "json",
	});
}
function validSalesForm(): boolean {
	var msg = "";
	if ((forsales || forReservePaidOut) && (!SalesLnList || SalesLnList!.length === 0))
		msg += `${salesinfonotenough}<br>`;
	if (forpreorder && (!PreSalesLnList || PreSalesLnList!.length === 0))
		msg += `${salesinfonotenough}<br>`;

	if ($(`#${gTblId} .focus`).length > 0) {
		msg += `${salesinfonotenough}<br>`;
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
					$(".focus").eq(0).trigger("focus");
				}
			},
		});
	}

	return msg === "";
}

$(document).on("change", "#drpDeliveryAddr", function () {
	deliveryAddressId = <number>$(this).val();
});

function handleRecurOrderList(this: any) {
	closeRecurOrderModal();
	let orderId: number = $(this).data("orderid");
	selectedRecurCode = <string>$(this).data("code");
	$.ajax({
		type: "GET",
		url: "/Api/GetRecurOrder",
		data: { orderId },
		success: function (data) {
			let ws = data.sales as IWholeSales;
			//console.log("recurorder data:", data);
			FillInWholeSales();
			WholeSales.wsCode = ws.wsCode;
			WholeSales.wsCusID = ws.wsCusID;
			WholeSales.wsDvc = ws.wsDvc;
			WholeSales.wsSalesLoc = ws.wsSalesLoc;
			WholeSales.wsRefCode = ws.wsRefCode;
			WholeSales.wsAllLoc = ws.wsAllLoc;

			WholeSales.wsDeliveryAddressId = ws.wsDeliveryAddressId;

			WholeSales.wsCustomerPO = ws.wsCustomerPO;
			$("#txtCustomerPO").val(WholeSales.wsCustomerPO);
			// console.log("data customer#orderid:", data.Customer);
			selectedCus = {} as ICustomer;
			selectedCus.cusCustomerID = ws.Customer.cusCustomerID;
			selectedCus.cusName = ws.Customer.cusName;
			selectedCus.cusPhone = ws.Customer.cusPhone;
			selectedCus.cusPriceLevelID = ws.Customer.cusPriceLevelID;
			selectedCus.cusPointsSoFar = ws.Customer.cusPointsSoFar;
			selectedCus.cusPointsUsed = ws.Customer.cusPointsUsed;
			selectedCus.cusPointsActive = ws.Customer.cusPointsActive;
			selectedCus.cusPriceLevelDescription =
				ws.Customer.cusPriceLevelDescription;
			selectedCus.AddressList = ws.Customer.AddressList;
			selectedCus.cusCode = ws.Customer.cusCode;
			// console.log("cuscode:" + selectedCus.cusCode);
			selectCus();

			currentY = 0;
			$.each(data.wslns as IWholeSalesLn[], function (i, e) {
				seq = currentY + 1;
				selectedItemCode = e.wslItemCode;
				selectedItem = initItem();
				selectedItem.itmCode = selectedItemCode;
				selectedItem.itmDesc = e.Item.itmDesc;
				selectedItem.itmName = e.Item.itmName;
				selectedItem.itmUseDesc = e.Item.itmUseDesc;
				selectedItem.itmBaseSellingPrice = e.Item.itmBaseSellingPrice;
				selectedItem.itmBaseUnitPrice = e.Item.itmBaseUnitPrice;
				selectedItem.itmSellUnit = e.Item.itmSellUnit;
				selectedItem.NameDesc = e.Item.NameDesc;
				SelectedWholeSalesLn = structuredClone(e);
				populateSalesRow();
				currentY++;
			});
		},
		dataType: "json",
	});
}

function calculateSum(array: Array<any>, property: any) {
	const total = array.reduce((accumulator, object) => {
		return accumulator + object[property];
	}, 0);
	return total;
}

function getSalesLnAmt(
	qty: number,
	price: number,
	discpc: number,
	taxamt: number,
	servicecharge: number,
): number {
	return (qty * price * (1 - discpc) + taxamt) + servicecharge;
}
function handleApprovalMode4Sales(data: ISalesReturnMsg) {
	if (enableWhatsappLnk) {
		var msg = requestapproval4invoicetxt; //訂單 {0} (顧客 {2} ) 正在等待您的批准 ({3})。這裡是鏈接 {1}。
		let remark: string = "";
		remark += `;商品行:${data.saleslnlength}`;

		msg = msg
			.replace("{0}", data.salescode ?? "")
			.replace("{1}", data.reviewurl ?? "")
			.replace("{2}", encodeURIComponent(data.cusname ?? ""))
			.replace("{3}", encodeURIComponent(remark));
		// const phoneno: string = specialapproval ? "85261877187" : "85264622867";

		let whatsapplnk: string = decodeURIComponent(
			$infoblk.data("whatsapplinkurl") as string
		);
		whatsapplnk = whatsapplnk
			.replace("{0}", handleWhatsAppPhone(data.approverphone ?? ""))
			.replace("{1}", msg);
		window.open(whatsapplnk, "_blank");
	}

	window.location.href = "/WholeSales/Edit";
}
function handleApprovalMode4Purchase(data: IPurchaseReturnMsg) {
	if (enableWhatsappLnk) {
		var msg = requestapproval4invoicetxt; //訂單 {0} (顧客 {2} ) 正在等待您的批准 ({3})。這裡是鏈接 {1}。
		let remark: string = "";
		remark += `;商品行:${data.purchaselnlength}`;

		msg = msg
			.replace("{0}", data.purchasecode ?? "")
			.replace("{1}", data.reviewurl ?? "")
			.replace("{2}", encodeURIComponent(data.supname ?? ""))
			.replace("{3}", encodeURIComponent(remark));
		// const phoneno: string = specialapproval ? "85261877187" : "85264622867";

		let whatsapplnk: string = decodeURIComponent(
			$infoblk.data("whatsapplinkurl") as string
		);
		whatsapplnk = whatsapplnk
			.replace("{0}", handleWhatsAppPhone(data.approverphone ?? ""))
			.replace("{1}", msg);
		window.open(whatsapplnk, "_blank");
	}
	window.location.href = "/Purchase/Edit";
}
//A function for formatting a date to yyMMdd
function formatDate(d: Date = new Date(), delimeter: string = "-") {
	//get the month
	//var _month = d.getMonth();
	////get the day
	////convert day to string
	//var day = d.getDate().toString().padStart(2, "0");
	////get the year
	//var _year = d.getFullYear();

	////pull the last two digits of the year
	//const year: string = delimeter === "" ? _year.toString().substring(2) : _year.toString();

	////increment month by 1 since it is 0 indexed
	////converts month to a string
	//const month: string = (_month + 1).toString().padStart(2, "0");

	////return the string "MMddyy"
	//return delimeter === "" ? year + month + day : year + delimeter + month + delimeter + day;
	return strftime(`%Y${delimeter}%m${delimeter}%d`, d);
}
function formatDateTime(d: Date = new Date(), delimeter: string = "-"): string {
	//var _h = d.getHours();
	//var _m = d.getMinutes();
	//var _s = d.getSeconds();
	return strftime(`%Y${delimeter}%m${delimeter}%d ${formatTime(d)}`, d);
}

function formatTime(d: Date = new Date()) {
	return strftime(`%H:%M:%S`, d);
}

function GetForeignCurrencyFrmCode(cardCode: string): string {
	currkeys = Object.keys(DicCurrencyExRate);
	let currcode = "HKD";
	// console.log("currkeys:", currkeys);
	if (cardCode.length >= 6 && cardCode.startsWith("CAS", 0)) {
		const _currcode = cardCode.substring(3, 6).toUpperCase();
		if (currkeys.includes(_currcode)) currcode = _currcode;
	}
	return currcode;
}

$(document).on("change", "#cusCountry", function () {
	$("#cusAddrCountry").val($(this).val() as string);
});

$(document).on("dblclick", ".orderId", function () {
	handleRecurOrderList.call(this);
});


function handleCardEmailChange(this: any) {
	let $email = $(this);
	let email = $email.val() as string;

	if (email) {
		trimByMaxLength($email);

		if (!validateEmail(email)) {
			$.fancyConfirm({
				title: "",
				message: emailformaterr,
				shownobtn: false,
				okButton: oktxt,
				noButton: notxt,
				callback: function (value) {
					if (value) {
						$email.val("").trigger("focus");
					}
				}
			});
		}

		if (PhoneNameEmailList && PhoneNameEmailList.length > 0) {
			let idx = PhoneNameEmailList.findIndex(x => { return (x.Email && x.Email.toLowerCase()) == email.toLowerCase(); });
			if (idx >= 0) {
				$.fancyConfirm({
					title: "",
					message: duplicatedemailalert,
					shownobtn: false,
					okButton: oktxt,
					noButton: notxt,
					callback: function (value) {
						if (value) {
							$email.trigger("focus");
						}
					}
				});
			}
		}
	}
}
function handleCardPhoneChange(this: any) {
	let $phone = $(this);
	let phone = $phone.val() as string;
	if (phone) {
		trimByMaxLength($phone);
		if (PhoneNameEmailList && PhoneNameEmailList.length > 0) {
			let idx = PhoneNameEmailList.findIndex(x => { return (x.Phone && x.Phone.toLowerCase()) == phone.toLowerCase(); });
			if (idx >= 0) {
				$.fancyConfirm({
					title: "",
					message: duplicatedphonewarning,
					shownobtn: false,
					okButton: oktxt,
					noButton: notxt,
					callback: function (value) {
						if (value) {
							$phone.val("").trigger("focus");
						}
					}
				});
			}
		}
	}
}

function handleCardNameChange(this: any) {
	let $name = $(this);
	let name = $name.val() as string;

	if (name) {
		trimByMaxLength($name);

		if (name.toUpperCase() === "GUEST") {
			$.fancyConfirm({
				title: "",
				message: guestcantaddedmsg,
				shownobtn: false,
				okButton: oktxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						$name.val("").trigger("focus");
					}
				},
			});
		}

		if (PhoneNameEmailList && PhoneNameEmailList.length > 0) {
			let idx = PhoneNameEmailList.findIndex(x => { return (x.Name && x.Name.toLowerCase()) == name.toLowerCase(); });
			if (idx >= 0) {
				$.fancyConfirm({
					title: "",
					message: duplicatednamewarning,
					shownobtn: false,
					okButton: oktxt,
					noButton: notxt,
					callback: function (value) {
						if (value) {
							$name.val("").trigger("focus");
						}
					}
				});
			}
		}
	}


}
$(document).on("change", "#chkAllLoc", function () {
	if ($(this).is(":checked")) {
		const location = $("#drpLocation").val() as string;
		$(`#${gTblId} tbody tr`)
			.find("td")
			.find(".location")
			.val(location)
			.addClass("disabled")
			.prop("disabled", true);
	} else {
		$(`#${gTblId} tbody tr`)
			.find("td")
			.find(".location")
			.removeClass("disabled")
			.prop("disabled", false);
	}
});
function formatexrate(exrate: string): string {
	return Number.parseFloat(exrate).toFixed(6);
}


$(document).on("click", "#btnFile", function () {
	openUploadFileModal();
});

$(document).on("click", "#btnViewFile", function () {
	openViewFileModal();
});

function initJournalLn(journalno: string) {
		selectedJournalLn = {} as IJournalLn;
		selectedJournalLn.JournalNumber = journalno;
		selectedJournalLn.Seq = currentY;
		selectedJournalLn.AccountNumber = "";
		selectedJournalLn.AccountName = "";
		selectedJournalLn.DebitExTaxAmount = 0;
		selectedJournalLn.CreditExTaxAmount = 0;
}
function filterEnquiry(smail: string): boolean {
	//no-reply@hkdigitalsale.com
	//console.log(";smail:" + smail);
	//const bok1 = /^((?!reply)[\s\S])*$/i.test(fmail);
	const bok2 = smail == "autoreply@united.com.hk";
	//console.log("bok2:", bok2);
	//return bok1&&bok2;
	return bok2;
}

function parseEnquiries(DicEnqContent) {
	//console.log('contents:' + contents);
	let regex =
		/.+(From\:[^\<]+).+(Subject\:[^\<]*).+(Company\:[^\<]*).+(Contact Person\:[^\<]*).+(Email\:[^\<]*)\<br\>(Phone\:[^\<]*)?.+(ReceivedDateTime\:[^\<]*)/gim;
	enquiries = [];
	for (const [key, value] of Object.entries(DicEnqContent)) {
		//console.log(value);
		let found = (value as string).matchAll(regex);
		//console.log('found:', found);
		//return false;
		if (found) {
			enquiry = {} as IEnquiry;
			enquiry.id = key;
			for (const m of found) {
				enquiry.from = m[1].split(":")[1].trim();
				enquiry.subject = m[2].split(":")[1].trim();
				enquiry.company = m[3].split(":")[1].trim();
				enquiry.contact = m[4].split(":")[1].trim();
				enquiry.email = m[5].split(":")[1].trim();
				enquiry.phone =
					typeof m[6] != "undefined" ? m[6].split(":")[1].trim() : "N/A";
				enquiry.receivedDateTime = m[7].replace("ReceivedDateTime:", "");
				enquiry.receiveddate = m[7].split(":")[1].slice(0, -3).trim();
				enquiry.SalesPersonName = "N/A";
				enquiries.push(enquiry);
			}
		}
	}

	if (enquiries.length > 0) {
		/*  if (EnquiryList.length > 0) {*/
		EnquiryList.forEach((x) => {
			var enquiry = enquiries.find((y) => y.id == x.id);
			//console.log("enquiry:", enquiry);
			if (enquiry) {
				x.from = enquiry.from;
				x.subject = enquiry.subject;
				x.email = enquiry.email;
				x.phone = enquiry.phone;
				x.company = enquiry.company;
				x.contact = enquiry.contact;
				x.receivedDateTime = enquiry.receivedDateTime;
				x.receiveddate = enquiry.receiveddate;
			}
		});
		//} else {
		//    EnquiryList = enquiries.slice(0);
		//}
	}
}

function parseJobs(DicJobSubject) {
	//Late arrival report- Testing arrived at 11:38 ReceivedDateTime:2023-11-13T03:39:04Z
	let regex =
		/([^\-]+)(\-+)(.+)(\s+)(\d+\/+\d+\/+\d+)(\s+)(\d+\:+\d+\s+\-+\s+\d+\:+\d+)/gmi;

	for (const [key, value] of Object.entries(DicJobSubject)) {
		let found = (value as string).matchAll(regex);
		if (found) {
			JobList.forEach((x) => {
				if (x.joId == key) {
					for (const m of found) {
						x.joClient = m[3].trim();
						x.joTime = m[7].trim();
					}
				}
			});
		}
	}
	//console.log("JobList#parse:", JobList);
}

function parseTrainings(DicTrainingContent) {
	/*
	<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"></head><body><p><span style=\"font-family:verdana\">Dear </span><span style=\"font-family:verdana\">Fanny Chow</span><span style=\"font-family:verdana\">,<br><br>Thank you for register abss Accounting Software Getting Start Training Course.<br><br>Please find your course details as below:<br>Company: </span><span style=\"font-family:verdana\">Sense-Ware Asia Limited</span><span style=\"font-family:verdana\"><br>Name: </span><span style=\"font-family:verdana\">Fanny Chow</span><span style=\"font-family:verdana\"><br>Industry: </span><span style=\"font-family:verdana\">trading</span><span style=\"font-family:verdana\"><br>Attendance: </span><span style=\"font-family:verdana\">1</span><span style=\"font-family:verdana\"><br>Date: </span><span style=\"font-family:verdana\">2023-11-15</span><span style=\"font-family:verdana\"><br>Time: 9:30 am - 11:30 am (After 11:30 am is Q&amp;A session)<br>Address: Unit 1501, Westlands Center, 20 Westlands Road, Quarry Bay<br><br>Chinese/English notes provided<br><br><br>感謝您註冊 abss 會計軟件入門培訓課程。<br><br>請找到您的課程詳細信息，如下所示：<br>公司: </span><span style=\"font-family:verdana\">Sense-Ware Asia Limited</span><span style=\"font-family:verdana\"><br>名稱: </span><span style=\"font-family:verdana\">Fanny Chow</span><span style=\"font-family:verdana\"><br>行業: </span><span style=\"font-family:verdana\">trading</span><span style=\"font-family:verdana\"><br>出席人數: </span><span style=\"font-family:verdana\">1</span><span style=\"font-family:verdana\"><br>出席日期: </span><span style=\"font-family:verdana\">2023-11-15</span><span style=\"font-family:verdana\"><br>時間: 早上 9:30 至 11:30 (之後 Q&amp;A 為問答環節)<br>地址: 鰂魚涌華蘭路20號華蘭中心15樓1501室<br><br>附送中文/英文筆記<br><br><br><br>United Technologies (Int'l) Ltd.<br>ABSS Hong Kong and Macau Official Technical Service Provider<br>聯訊科技 (國際) 有限公司<br>ABSS 香港及澳門官方指定技術服務供應商<br><br>Email: enquiry@united.com.hk<br>Web: https://united.com.hk<br>Phone: (852) 2960 1002</span></p></body></html>
	*/
	let regex =
		/Company\:[^\<]+\<+[^\>]+\>+[^\>]+\>+([^\<]+)\<+[^\>]+\>+[^\>]+\>+[^\>]+\>+Name\:[^\>]+\>+[^\>]+\>([^\<]+)[^\>]+\>+[^\>]+\>+[^\>]+\>+Industry\:[^\>]+\>+[^\>]+\>+([^\<]+)[^\>]+\>+[^\>]+\>+[^\>]+\>+Attendance\:[^\>]+\>+[^\>]+\>+([^\<]+)[^\>]+\>+[^\>]+\>+[^\>]+\>+Date\:[^\>]+\>+[^\>]+\>+([^\<]+)[^\>]+\>+[^\>]+\>+[^\>]+\>+Time\:([^\(]+)[^\>]+\>+/gmi;

	for (const [key, value] of Object.entries(DicTrainingContent)) {
		let found = (value as string).matchAll(regex);
		if (found) {
			TrainingList.forEach((x) => {
				if (x.trId == key) {
					for (const m of found) {
						x.trCompany = m[1].trim();
						x.trApplicant = m[2].trim();
						x.trIndustry = m[3].trim();
						x.trAttendance = Number(m[4]);
						x.strDate = m[5].trim();
					}
				}
			});
		}
	}
	//console.log("TrainingList#parse:", TrainingList);
}

function parseAttendances(DicAttdSubject) {
	//Late arrival report- Testing arrived at 11:38
	let regex =
		/[^\-]+\-+\s+(.+)\s+arrived\s+at\s+(.+)/gmi;
	for (const [key, value] of Object.entries(DicAttdSubject)) {
		//console.log(value);
		let found = (value as string).matchAll(regex);
		if (found) {
			AttendanceList.forEach((x) => {
				if (x.saId == key) {
					for (const m of found) {
						x.saName = m[1].trim();
						x.saCheckInTime = m[2].trim();
					}
				}
			});
		}
	}
}
function openEnqMail(ele) {
	window.location.href = "mailto:" + $(ele).data("mailto");
}
function strftime(sFormat, date) {
	if (!(date instanceof Date)) date = new Date();
	var nDay = date.getDay(),
		nDate = date.getDate(),
		nMonth = date.getMonth(),
		nYear = date.getFullYear(),
		nHour = date.getHours(),
		aDays = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		],
		aMonths = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		],
		aDayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
		isLeapYear = function () {
			return (nYear % 4 === 0 && nYear % 100 !== 0) || nYear % 400 === 0;
		},
		getThursday = function () {
			var target = new Date(date);
			target.setDate(nDate - ((nDay + 6) % 7) + 3);
			return target;
		},
		zeroPad = function (nNum, nPad) {
			return ("" + (Math.pow(10, nPad) + nNum)).slice(1);
		};
	return sFormat.replace(/%[a-z]/gi, function (sMatch) {
		return (
			{
				"%a": aDays[nDay].slice(0, 3),
				"%A": aDays[nDay],
				"%b": aMonths[nMonth].slice(0, 3),
				"%B": aMonths[nMonth],
				"%c": date.toUTCString(),
				"%C": Math.floor(nYear / 100),
				"%d": zeroPad(nDate, 2),
				"%e": nDate,
				"%F": date.toISOString().slice(0, 10),
				"%G": getThursday().getFullYear(),
				"%g": ("" + getThursday().getFullYear()).slice(2),
				"%H": zeroPad(nHour, 2),
				"%I": zeroPad(((nHour + 11) % 12) + 1, 2),
				"%j": zeroPad(
					aDayCount[nMonth] + nDate + (nMonth > 1 && isLeapYear() ? 1 : 0),
					3
				),
				"%k": "" + nHour,
				"%l": ((nHour + 11) % 12) + 1,
				"%m": zeroPad(nMonth + 1, 2),
				"%M": zeroPad(date.getMinutes(), 2),
				"%p": nHour < 12 ? "AM" : "PM",
				"%P": nHour < 12 ? "am" : "pm",
				"%s": Math.round(date.getTime() / 1000),
				"%S": zeroPad(date.getSeconds(), 2),
				"%u": nDay || 7,
				"%V": (function () {
					const target: any = getThursday();
					const n1stThu = target.valueOf();
					target.setMonth(0, 1);
					var nJan1 = target.getDay();
					if (nJan1 !== 4) target.setMonth(0, 1 + ((4 - nJan1 + 7) % 7));
					return zeroPad(1 + Math.ceil((n1stThu - target) / 604800000), 2);
				})(),
				"%w": "" + nDay,
				"%x": date.toLocaleDateString(),
				"%X": date.toLocaleTimeString(),
				"%y": ("" + nYear).slice(2),
				"%Y": nYear,
				"%z": date.toTimeString().replace(/.+GMT([+-]\d+).+/, "$1"),
				"%Z": date.toTimeString().replace(/.+\((.+?)\)$/, "$1"),
			}[sMatch] || sMatch
		);
	});
}

$(document).on("click", ".dropdown-item", function () {
	//e.preventDefault();
	//console.log($(this).attr("href"));
	window.location.href = $(this).attr("href") as string;
});
//handle #drpCustomer/#drpSupplier change as well
$(document).on("change", ".form-control.card", function () {
	const cardcode = GetForeignCurrencyFrmCode($(this).val() as string);
	//console.log(cardcode);
	//$(".exrate").val(cardcode).trigger("change");
	$(".exrate").val(cardcode);
	handleExRateChange(cardcode, false);
});

$(document).on("change", ".range", function () {
	daterangechange = true;
});

$(document).on("click", ".assign", function (e) {
	e.stopPropagation();
	getRowCurrentY.call(this);
	let codeId = forcustomer ? $(this).data("code") as string : $(this).data("id") as string;
	console.log("codeId:", codeId);
	if (codeId && isNumber(codeId)) { codeId = convertNumToString(codeId).trim(); }
	handleAssign($(this).data("salespersonid"), codeId);
});
function handleAssign(salespersonId: number = 0, codeId: string = "") {
	$.ajax({
		type: "GET",
		url: "/Api/GetSalesInfo",
		data: {},
		success: function (data) {
			//console.log(data);
			if (data.length > 0) {
				openSalesmenModal();
				let html = "";
				$.each(data, function (i, e: ISalesman) {
					let email = formatEmail(e.Email, e.UserName) ?? "N/A";
					let notes = e.surNotes ?? "N/A";
					//let disabled = "";
					let ondblclick = "";
					let onclick = "";
					let trcls = "";
					if (salespersonId != null && salespersonId == e.surUID) {
						//disabled = "disabled";
						trcls = "selected";
					} else {
						trcls = "pointer";
						onclick = `onclick="assignSave(${e.surUID},'${codeId}');"`;
						ondblclick = `ondblclick="assignSave(${e.surUID},'${codeId}');"`;
					}
					html += `<tr data-id="${e.surUID}" class="${trcls}" ${ondblclick}>
					<td>${email}</td>
					<td>${notes}</td><td class="text-center"><span class="">${e.ModifyTimeDisplay}</span></td>
					<td class="text-center"><button type="button" class="btn btn-success" ${onclick}>${assigntxt}</button></td>
					</tr>`;
				});
				$target = $("#tblsalesmen tbody");
				$target.empty().html(html);
			}
		},
		dataType: "json",
	});
}
function assignSave(salesmanId: number, codeId: string | null) {
	closeSalesmenModal();

	if (forcustomer) {
		if (codeId && !CodeList.includes(codeId)) CodeList.push(codeId);
		console.log("CodeList:", CodeList);
		console.log("salesmanId:", salesmanId);
		//return;
		$.fancyConfirm({
			title: "",
			message: sendmail4assignmentprompt,
			shownobtn: true,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				$.ajax({
					type: "POST",
					url: "/Customer/Assign",
					data: {
						__RequestVerificationToken: $(
							"input[name=__RequestVerificationToken]"
						).val(),
						CodeList,
						salesmanId,
						notification: value ? 1 : 0,
					},
					success: function (data) {
						if (data) {
							$.fancyConfirm({
								title: "",
								message: data.msg,
								shownobtn: false,
								okButton: oktxt,
								noButton: notxt,
								callback: function (value) {
									if (value) {
										window.location.reload();
									}
								},
							});
						}
					},
					dataType: "json",
				});
			},
		});
	}

	if (forenquiry) {
		if (codeId && !EnIdList.includes(codeId)) EnIdList.push(codeId);
		//sendmail4assignmentprompt
		$.fancyConfirm({
			title: "",
			message: sendmail4assignmentprompt,
			shownobtn: true,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				$.ajax({
					type: "POST",
					url: "/Enquiry/Assign",
					data: {
						__RequestVerificationToken: $(
							"input[name=__RequestVerificationToken]"
						).val(),
						EnIdList,
						salesmanId,
						notification: value ? 1 : 0,
					},
					success: function (data) {
						if (data) {
							$.fancyConfirm({
								title: "",
								message: data.msg,
								shownobtn: false,
								okButton: oktxt,
								noButton: notxt,
								callback: function (value) {
									if (value) {
										window.location.reload();
									}
								},
							});
						}
					},
					dataType: "json",
				});
			},
		});
	}

}
$(document).on("change", ".itemoption", function () {
	if ($(this).val() === "bat") chkBat = $(this).is(":checked");
	if ($(this).val() === "sn") chkSN = $(this).is(":checked");
	if ($(this).val() === "vt") chkVT = $(this).is(":checked");
});
$(document).on("click", "#btnSaveItemOptions", function () {
	if (IdList.length > 0 && (chkBat || chkSN || chkVT)) {
		/*//console.log('gonna save');*/
		let model: IItemOptionsModel[] = [];
		IdList.forEach((x) => {
			model.push({
				itemId: x,
				ChkBatch: chkBat,
				ChkSN: chkSN,
				WillExpire: chkVT,
				Disabled: false,
			});
		});
		//console.log("model:", model);
		//return;
		$.ajax({
			//contentType: 'application/json; charset=utf-8',
			type: "POST",
			url: "/Item/SaveItemOptions",
			data: {
				__RequestVerificationToken: $(
					"input[name=__RequestVerificationToken]"
				).val(),
				model,
			},
			success: function (data) {
				if (data) {
					window.location.href = "/Item/Stock";
				}
			},
			dataType: "json",
		});
	}
});

function removeAnchorTag(str: string): string {
	return str.replace(/<\/?a[^>]*>/g, "");
}

function makeId(length): string {
	let result = "";
	//0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

const endsWithNumber = (text) => {
	return /\d$/.test(text);
};

$(document).on("click", ".fa-close.record", function () {
	$target = $(this).parent("div").parent(".card").parent(".displayblk");
	let model: ICustomerInfo = {
		Id: Number($target.data("id")),
		cusCode,
	} as ICustomerInfo;
	$.ajax({
		//contentType: 'application/json; charset=utf-8',
		type: "POST",
		url: "/Customer/DeleteRecord",
		data: {
			__RequestVerificationToken: $(
				"input[name=__RequestVerificationToken]"
			).val(),
			model,
		},
		success: function (data) {
			if (data) $target.remove();
		},
		dataType: "json",
	});
});

function handleRecordChange(ele) {
	let $entry = $(ele);
	//console.log("entry:", $entry.val());
	$target = $entry.parent(".txtarea");
	let record: string = $entry.val() as string;
	//console.log("record:", record);
	$entry.addClass("hide");
	if (record) {
		let customerInfo: ICustomerInfo = {} as ICustomerInfo;
		let enquiryInfo: IEnquiryInfo = {} as IEnquiryInfo;
		let url: string = "";
		let data: any = {
			__RequestVerificationToken: $(
				"input[name=__RequestVerificationToken]"
			).val(),
		};
		if (forcustomer) {
			customerInfo = {
				Id: Number($target.data("id")),
				followUpRecord: record,
			} as ICustomerInfo;
			url = "/Customer/EditRecord";
			data.model = customerInfo;
		}
		if (forenquiry) {
			enquiryInfo = {
				Id: $target.data("id").toString(),
				followUpRecord: record,
			} as IEnquiryInfo;
			url = "/Enquiry/EditRecord";
			data.model = enquiryInfo;
		}
		//console.log("data:", data);
		//return;
		$.ajax({
			//contentType: 'application/json; charset=utf-8',
			type: "POST",
			url: url,
			data: data,
			success: function (data: IInfoBase) {
				console.log("data:", data);
				if (data) {
					$target.find("p").text(data.followUpRecord!).show();
					$target
						.find("span")
						.text(
							lasteditedbyformat
								.replace("{0}", data.ModifiedBy ?? data.CreatedBy)
								.replace("{1}", data.ModifyTimeDisplay ?? data.CreateTimeDisplay)
						);
				}
			},
			dataType: "json",
		});
	} else {
		$target
			.find("p")
			.text($entry.data("record") as string)
			.show();
	}
}

$(document).on("click", ".fa-edit.record", function () {
	$target = $(this).parent("div").next(".card-body").find(".txtarea");
	let $p = $target.find("p");
	const record = $p.text() as string;
	$p.hide();
	$target.find("input").val(record).removeClass("hide").trigger("focus");
});

function infoCallBackOk(data: IInfoBase[]) {
	if (data) {
		$(".displayblk").hide();
		let html = "";
		data.forEach((x) => {
			let lastedited: string = lasteditedbyformat
				.replace("{0}", x.ModifiedBy ?? x.CreatedBy)
				.replace("{1}", x.ModifyTimeDisplay == "N/A" ? x.CreateTimeDisplay : x.ModifyTimeDisplay);
			html += `<div class="displayblk col-12 col-sm-4 mb-1" data-enqid="${x.enId}" data-cuscode="${x.cusCode}" data-id="${x.Id}">
                            <div class="card">
                                <div class="text-right small"><span class="fa fa-edit text-info record pointer mr-2"></span><span class="fa fa-close text-danger record pointer"></span></div>
                                <div class="card-body">
                                    <div class="txtarea" data-cuscode="${x.cusCode}" data-id="${x.Id}">
                                        <p class="recorddisplay">${x.followUpRecord}</p>
                                        <input type="text" class="form-control recordentry hide" data-record="${x.followUpRecord}" onchange="handleRecordChange(this);" />
                                        <span class="small d-inline-block lastedited">${lastedited}</span>
                                    </div>
                                </div>
                            </div>
                        </div>`;
		});
		$("#followupRecordBlk .row").append(html);
	}
}
$(document).on("click", ".saverecord", function () {
	$target = $(this)
		.parent(".buttons")
		.parent(".card-body")
		.parent(".card")
		.parent(".recordblk");
	let cusCode: string = forcustomer ? $target.data("cuscode") as string : "";
	//console.log("cusCode:" + cusCode);
	let enqId: string = forenquiry ? $target.data("enqid").toString() : "";
	const record: string = $target.find(".record").val() as string;
	if (record) {
		$target.hide();
		let customerInfo: ICustomerInfo = {} as ICustomerInfo;
		let enquiryInfo: IEnquiryInfo = {} as IEnquiryInfo;
		let data: any = {
			__RequestVerificationToken: $(
				"input[name=__RequestVerificationToken]"
			).val(),
		};
		let url: string = "";
		let callback: any = {};
		if (forcustomer) {
			customerInfo = {
				cusCode,
				followUpRecord: record,
			} as ICustomerInfo;
			data.model = customerInfo;
			url = cusCode ? "/Customer/SaveRecord" : "";
		}
		if (forenquiry) {
			enquiryInfo = {
				enId: enqId,
				followUpRecord: record,
			} as IEnquiryInfo;
			data.model = enquiryInfo;
			url = enqId != "" ? "/Enquiry/SaveRecord" : "";
		}
		callback = infoCallBackOk;
		$target = $target.parent(".row").parent("#followupRecordBlk");
		$.ajax({
			//contentType: 'application/json; charset=utf-8',
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: "json",
		});
	}
});
function handleAddRecordClick(this: any) {
	$target = $(this).parent("label").parent("#followupRecordBlk");
	$target
		.find(".recordblk")
		.first()
		.clone()
		.removeClass("hide")
		.appendTo("#followupRecordBlk .row")
		.find(".record")
		.trigger("focus");
}

function confirmAdvancedSearch() {
	if (advancedSearchModal.find(".attrval").val() !== "") {
		closeAdvancedSearchModal();
		let advSearchItems: IAdvSearchItem[] = [];
		advancedSearchModal.find(".row").each(function (i, e) {
			advSearchItems.push({
				gattrId: $(e).find(".attrName").val() as string,
				Operator: $(e).find(".operator").val() as string,
				attrValue: $(e).find(".attrval").val() as string,
			});
		});
		//console.log("advSearchItems:", advSearchItems);		
		var data = forcustomer ? {
			advSearchItems
		} : { eTrackAdvSearchItem };
		//return;
		// Must not use [HttpGet]!!! (due to the parameter type)
		$.ajax({
			//contentType: 'application/json; charset=utf-8',
			type: "POST",
			url: forcustomer ? "/Customer/AdvancedSearch" : "/eTrack/AdvancedSearch",
			data: data,
			success: function (data: ICustomer[] | IeTrack[]) {
				//console.log("data:", data);
				if (forcustomer) CodeList = (data as ICustomer[]).map((x) => x.cusCode);
				else IdList = (data as IeTrack[]).map((x) => Number(x.ContactId));

				$("#pagingblk").hide();
				if (data.length > 0) {
					let html = "";
					if (forcustomer) {
						(data as ICustomer[]).forEach((customer) => {
							const email = formatEmail(customer.cusEmail ?? "", customer.cusEmail) ?? "N/A";
							const cname = customer.cusName;
							let disabled = (customer.cusCheckout) ? "disabled" : "";
							html += `<tr class="${customer.statuscls} pointer" data-id="${customer.cusCustomerID}" data-code="${customer.cusCode}">
                    <td class="text-center">${cname}</td>
                    <td class="text-center">${customer.cusContact}</td>
                    <td class="text-center">${email}</td>
                    <td class="text-center customattrs">${customer.CustomAttributes ?? "N/A"}</td>                   
                    <td class="text-center">${customer.FollowUpStatusDisplay}</td>
                    <td class="text-center">${customer.FollowUpDateDisplay}</td>
					 <td class="text-center">${customer.AccountProfileName}</td>
					  <td class="text-center">${customer.SalesPersonName ?? "N/A"}</td>
                    <td class="text-center">
                        <a class="btn btn-info btnsmall" role="button" href="/Customer/Edit?cusCode=${customer.cusCode}&referrer=Index">${edittxt}</a>
                        <a class="btn btn-danger btnsmall remove ${disabled}" role="button" href="#" data-code="${customer.cusCode}" data-id="${customer.cusCustomerID}">${removetxt}</a>
                    </td>
					<td class="text-center">
							<input type="checkbox" class="chk" data-code="${customer.cusCode}" value="${customer.cusCode}" />
						</td>
                </tr>`;
						});
					}

					if (foretrack) {
						(data as IeTrack[]).forEach((etrack) => {
							const email = etrack.Email ?? "N/A";
							const cname = etrack.ContactName;
							html += `<tr class="${etrack.statuscls}" data-id="${etrack.ContactId}">
                             <td style="width:110px;max-width:110px;" class="text-left">${etrack.BlastSubject}</td>
                    <td style="width:110px;max-width:110px;" class="text-left">${cname}</td>
                    <td style="width:100px;max-width:100px;" class="text-left">${etrack.Organization}</td>
                    <td style="width:110px;max-width:110px;" class="text-left">${etrack.ViewDateTimeDisplay}</td>
                    <td style="width:110px;max-width:110px;" class="text-left">${etrack.Phone}</td>
                    <td style="width:110px;max-width:110px;" class="text-left">${email}</td>
                    <td style="width:70px;max-width:70px;" class="text-left">${etrack.IP}</td>
                </tr>`;
						});
					}

					$(`#${gTblId}`).show().find("tbody").empty().append(html);
					$("#norecord").addClass("hide");
				}
				else {
					$(`#${gTblId}`).hide();
					$("#norecord").show();
				}
			},
			dataType: "json",
		});
	}
}

function countUnique(iterable) {
	return new Set(iterable).size;
}
$(document).on("change", "#drpCategories", function () {
	const catIds: string = ($(this).val() as string[]).join();
	let currentSelectedItemCodes: string[] = $("#drpItems").val() as string[];

	$.ajax({
		type: "GET",
		url: "/Api/GetItemsByCategories",
		data: { catIds },
		success: function (data: IItem[]) {
			if (data) {
				currentSelectedItemCodes = currentSelectedItemCodes.concat(
					data.map((i) => i.itmCode)
				);
				console.log("currentSelectedItemCodes:", currentSelectedItemCodes);

				$("#drpItems")
					.empty()
					.append(
						data.map(function (i) {
							const selected = currentSelectedItemCodes.includes(i.itmCode);
							return $("<option />", {
								value: i.itmCode,
								text: i.itmName,
								selected: selected,
							});
						})
					);

				$("#drpItems").val(currentSelectedItemCodes);
			}
		},
		dataType: "json",
	});
});

function genItemSeq(itemcode: string, _seq: number): string {
	return itemcode.concat(":").concat(_seq.toString());
}
function getTotalBatDelQty() {
	let totalbatdelqty: number = 0;
	if (DeliveryItems.length > 0) {
		DeliveryItems.forEach((x) => {
			if (x.itmCode == selectedItemCode) totalbatdelqty += x.dlQty;
		});
	}
	return totalbatdelqty;
}

$(document).on("dblclick", ".povari.pointer", function () {
	getRowCurrentY.call(this);
	selectedItemCode = (
		$tr.find(".itemcode").val() as string
	).trim();
	const $bat = $tr.find(".pobatch.pointer");
	if ($bat.hasClass("focus")) {
		$.fancyConfirm({
			title: "",
			message: batchnorequired,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$bat.trigger("focus");
				}
			},
		});
	} else {
		//currentY = $tr.index();
		//seq = currentY + 1;
		$.each(Purchase.PurchaseItems, function (i, e) {
			if (e.piSeq == seq) {
				SelectedPurchaseItem = structuredClone(e);
				return false;
			}
		});
		console.log("SelectedPurchaseItem:", SelectedPurchaseItem);
		openPoItemVariModal($(this).hasClass("focus"));
	}
});
$(document).on("dblclick", ".pobatch.pointer", function () {
	getRowCurrentY.call(this);
	selectedItemCode = (
		$tr.find(".itemcode").val() as string
	).trim();

	if (forpurchase) {
		$.each(Purchase.PurchaseItems, function (i, e) {
			if (e.piSeq == seq) {
				SelectedPurchaseItem = structuredClone(e);
				return false;
			}
		});
		if (!SelectedPurchaseItem) SelectedPurchaseItem = initPurchaseItem();

		if (!$.isEmptyObject(DicItemOptions)) {
			itemOptions = DicItemOptions[selectedItemCode];
			//console.log("itemOptions#dblclick:", itemOptions);
			if (itemOptions) {
				if (itemOptions.ChkBatch && itemOptions.ChkSN) {
					$("#tblPbatch thead tr th").last().hide();
				} else {
					$("#tblPbatch thead tr th").last().show();
				}

				if (
					(itemOptions.ChkSN && itemOptions.WillExpire) ||
					(itemOptions.ChkBatch && !itemOptions.WillExpire)
				) {
					$("#tblPbatch thead tr th:eq(2)").hide();
				} else {
					$("#tblPbatch thead tr th:eq(2)").show();
				}
			}
		}

		if (Purchase.pstStatus == "opened" || Purchase.pstStatus == "partialreceival") {
			$("#tblPbatch thead tr th").last().hide();
		}
	}

	resetPurchaseBatchModal();
	openPurchaseBatchModal(
		true,
		(Purchase.pstStatus === "opened" ||
			Purchase.pstStatus === "partialreceival")
	);

	//if(Purchase.pstStatus=="open")
	toggleBatQty();
});

$(document).on("dblclick", ".posn.pointer", function () {
	getRowCurrentY.call(this);
	selectedItemCode = $tr.find(".itemcode").val() as string;

	if (forpurchase) {
		$.each(Purchase.PurchaseItems, function (i, e) {
			if (e.piSeq == seq) {
				SelectedPurchaseItem = structuredClone(e);
				return false;
			}
		});
		if (!SelectedPurchaseItem) SelectedPurchaseItem = initPurchaseItem();
	}

	resetPurchaseSerialModal();

	itemOptions = DicItemOptions[selectedItemCode];

	let batchList: IBatch[] = forpurchase
		? SelectedPurchaseItem!.batchList
		: selectedSalesLn!.batchList;

	if (itemOptions.ChkBatch && itemOptions.ChkSN && batchList.length === 0) {
		$.fancyConfirm({
			title: "",
			message: batchrequiredtxt,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$tr
						.find(".pobatch")
						.addClass("focus")
						.trigger("focus");
				}
			},
		});
	} else {
		if (!itemOptions.WillExpire) {
			$("#tblPserial thead tr th:eq(2)").hide();
		} else {
			$("#tblPserial thead tr th:eq(2)").show();
		}
		if (forpurchase) {
			openPurchaseSerialModal(
				true,
				Purchase.pstStatus === "opened" ||
				Purchase.pstStatus === "partialreceival"
			);
			if (Purchase.pstStatus == "opened" || Purchase.pstStatus == "partialreceival") $("#tblPserial thead tr th").last().hide();
		}

		setValidThruDatePicker();
	}


});

$(document).on("change", ".validthru", function () {
	getRowCurrentY.call(this);
	let $validthru = $(this);
	let validthru: string = <string>$(this).val();

	if (forpurchase) {
		$target = $tr.find(".received");
		//console.log('received:' + $target.val());
		if (Number($target.val()) == 0) {
			$.fancyConfirm({
				title: "",
				message: receivedqtyrequiredtxt,
				shownobtn: false,
				okButton: oktxt,
				noButton: notxt,
				callback: function (value) {
					if (value) {
						$validthru.val("");
						$target.trigger("focus");
					}
				},
			});
		} else {
			let validthru: string = <string>$(this).val();
			//console.log(seq);
			if (Purchase.PurchaseItems.length > 0) {
				$.each(Purchase.PurchaseItems, function (i, e) {
					if (e.piSeq == seq) {
						e.JsValidThru = validthru;
						SelectedPurchaseItem = structuredClone(e);
						return false;
					}
				});
			}
		}
	}

	if (forwholesales) {
		$target = $tr.find(".delqty");
		let delqty = Number($target.val());
		//console.log('received:' + $target.val());
		if (delqty == 0) {
			$.fancyConfirm({
				title: "",
				message: qtyrequiredtxt,
				shownobtn: false,
				okButton: oktxt,
				noButton: notxt,
				callback: function (value) {
					if (value) {
						$validthru.val("");
						$target.trigger("focus");
					}
				},
			});
		}
		if (WholeSalesLns.length > 0) {
			$.each(WholeSalesLns, function (i, e) {
				if (e.wslSeq == seq) {
					e.JsValidThru = validthru;
					SelectedWholeSalesLn = structuredClone(e);
					return false;
				}
			});
			let idx = -1;
			//update
			DeliveryItems.forEach((x, i) => {
				if (x.seq == seq) {
					idx = i;
					x.JsVt = validthru;
					x.dlQty = delqty;
				}
			});
			//add
			if (idx < 0) {
				let deliveryItem: IDeliveryItem = initDeliveryItem();
				deliveryItem.dlCode = `vt${seq}`;

				deliveryItem.seq = seq;

				deliveryItem.itmCode = $tr
					.find(".itemcode")
					.val() as string;

				deliveryItem.dlBaseUnit = $tr
					.find(".sellunit")
					.val() as string;

				deliveryItem.dlQty = Number(
					$tr.find(".delqty").val()
				);

				deliveryItem.dlUnitPrice = Number(
					$tr.find(".price").val()
				);

				deliveryItem.dlDiscPc = Number(
					$tr.find(".discpc").val()
				);

				if (enableTax && !inclusivetax) {
					deliveryItem.dlTaxPc = Number(
						$tr.find(".taxpc").val()
					);
				}

				deliveryItem.dlStockLoc = $tr
					.find(".location")
					.val() as string;

				deliveryItem.JobID = Number($tr.find(".job").val());


				deliveryItem.dlAmt = deliveryItem.dlAmtPlusTax = Number(
					$tr.find(".amount").val()
				);

				deliveryItem.JsVt = validthru;
				DeliveryItems.push(deliveryItem);
			}
		}
	}

	if (forsales || forpreorder) {
		$target = $tr
			.find(".qty");
		//console.log('received:' + $target.val());
		if (<number>$target.val() == 0) {
			$.fancyConfirm({
				title: "",
				message: qtyrequiredtxt,
				shownobtn: false,
				okButton: oktxt,
				noButton: notxt,
				callback: function (value) {
					if (value) {
						$validthru.val("");
						$target.trigger("focus");
					}
				},
			});
		} else {
			let validthru: string = <string>$(this).val();
			//console.log(seq);
			if (forsales && SalesLnList.length > 0) {
				$.each(SalesLnList, function (i, e) {
					if (e.rtlSeq == seq) {
						e.JsValidThru = validthru;
						selectedSalesLn = structuredClone(e);
						return false;
					}
				});
			}
			if (forpreorder && PreSalesLnList.length > 0) {
				$.each(PreSalesLnList, function (i, e) {
					if (e.rtlSeq == seq) {
						e.JsValidThru = validthru;
						selectedPreSalesLn = structuredClone(e);
						return false;
					}
				});
			}
		}
	}
});
function setTotalQty4IvModal() {
	let totalivdelqty = 0;
	if (DeliveryItems.length > 0) {
		DeliveryItems.forEach((x) => {
			if (x.seq == seq && x.ivIdList) {
				totalivdelqty += x.dlQty;
			}
		});
	}
	$("#totalivdelqty").data("totalivdelqty", totalivdelqty).val(totalivdelqty);
}
function setTotalQty4VtModal() {
	let totalvtdelqty = 0;
	if (DeliveryItems.length > 0) {
		DeliveryItems.forEach((x) => {
			if (x.seq == seq && x.JsVt) {
				totalvtdelqty += x.dlQty;
			}
		});
	}
	$("#totalvtdelqty").data("totalvtdelqty", totalvtdelqty).val(totalvtdelqty);
}
function setTotalQty4BatModal() {
	let totalbatdelqty = 0;
	if (DeliveryItems.length > 0) {
		DeliveryItems.forEach((x) => {
			if (x.seq == seq && x.dlBatch) {
				totalbatdelqty += x.dlQty;
			}
		});
	}
	$("#totalbatdelqty")
		.data("totalbatdelqty", totalbatdelqty)
		.val(totalbatdelqty);
}

function blockSpecialChar(e) {
	var k;
	document.querySelectorAll("*") ? (k = e.keyCode) : (k = e.which);
	return (
		(k > 64 && k < 91) ||
		(k > 96 && k < 123) ||
		k == 8 ||
		k == 32 ||
		(k >= 48 && k <= 57)
	);
}

function isEmptyTd(td) {
	if (
		td.text == "" ||
		td.text() == "" ||
		td.text == " " ||
		td.text() == " " ||
		td.html() == "&nbsp;" ||
		td.is(":not(:visible)")
	) {
		return true;
	}

	return false;
}

function isNumber(evt) {
	var charCode = evt.which ? evt.which : evt.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57)) {
		return false;
	}
	return true;
}

function getItemCodeBySeq(): string {
	return $(`#${gTblId} tbody tr`)
		.eq(seq - 1)
		.find("td:eq(1)")
		.find(".itemcode")
		.val()!
		.toString();
}

function openPayModel_De() {
	payModal.dialog("option", { width: 600, title: processpayments });
	payModal.dialog("open");

	setExRateDropDown();
	//console.log("itotalremainamt:" + itotalremainamt);
	setForexPayment(itotalremainamt);

	$("#totalremainamt").text(formatmoney(itotalremainamt));
	$("#remainamt").text(formatmoney(0));
	let cashtxt = itotalremainamt.toFixed(2);
	$("#Cash").val(cashtxt);
}

function formatEmail(email: string, username: string | null = ""): string {
	return `<a class="simplelnk" href="mailto:${email}" target="_blank">${username ?? email
		}</a>`;
}
$(document).on("dblclick", ".validthru.pointer", function () {
	getRowCurrentY.call(this);
	//console.log("here");	
	selectedItemCode = (
		$tr.find(".itemcode").val() as string
	).trim();

	const hasFocusCls = $(this).hasClass("focus");
	itemOptions = DicItemOptions[selectedItemCode];
	//console.log("itemOptions:", itemOptions);
	if (!itemOptions) return false;

	if (
		(forwholesales &&
			(WholeSales.wsStatus.toLowerCase() === "deliver" ||
				WholeSales.wsStatus.toLowerCase() === "partialdeliver") || reviewmode)
	) {
		DeliveryItems = DicSeqDeliveryItems[seq].slice(0);
		//console.log("DeliveryItems:", DeliveryItems);
		deliveryItem = DeliveryItems[0];

		let html = `<tr><td class="text-right"><div class="row form-inline justify-content-end mx-1 mb-3">
            <label>
                ${deliveryItem.VtDisplay} (${deliveryItem.pstCode})
             </label>
              <input type="text" class="form-control vtdelqty mx-2" style="max-width:80px;" value="${deliveryItem.dlQty}" readonly>
           </div></td></tr>`;

		openValidthruModal(hasFocusCls);

		let salesloc: string = getSalesLoc();
		validthruModal
			.find("#validthruLocSeqItem")
			.html(
				`${salesloc}:${selectedItemCode} <span class="exsmall">${sequencetxt}:${seq}</span>`
			);
		validthruModal.find("#tblVt tbody").html(html);

		//setTotalQty4VtModal();
	} else {
		let html: string = "";
		if ($.isEmptyObject(DicItemVtQtyList)) return false;
		let vtqtylist: IVtQty[] = DicItemVtQtyList[selectedItemCode];
		//console.log("DicItemVtDelQtyList:", DicItemVtDelQtyList);
		let delvtqtylist: IVtDelQty[] = DicItemVtDelQtyList[selectedItemCode];
		// console.log("vtqtylist:", vtqtylist);
		//console.log("delvtqtylist:", delvtqtylist);

		let pocodelist: string[] = [];
		vtqtylist.forEach((x) => {
			if (!pocodelist.includes(x.pocode)) pocodelist.push(x.pocode);
		});

		pocodelist.forEach((pocode) => {
			$.each(vtqtylist, function (i, e: IVtQty) {
				if (e.pocode == pocode) {
					let vtdelqty: number = 0; //用來計算 已出貨數量 use initially only => will be replaced with DeliveryItems later on
					const vtId: number = e.vtId;
					//console.log("vtId:" + vtId);
					let vtdelqtylist: string = "";
					let vtdeledqtylist: string = "";
					let vtInfoList: string = "";
					let currentvttypeqty: number = 0;
					let totalvtqty: number = e.qty;

					let inCurrDel: boolean = false;
					if (DeliveryItems.length > 0) {
						if (!itemOptions!.ChkBatch && !itemOptions!.ChkSN) {
							inCurrDel = DeliveryItems.some((x) => {
								return (
									!x.dlHasSN &&
									!x.dlBatch &&
									x.dlVtId == vtId &&
									x.pstCode == pocode
								);
							});
						}
					}
					//console.log("inCurrDel:", inCurrDel);
					$.each(delvtqtylist, function (k, ele) {
						if (vtId == ele.vtId) {
							vtdelqty = ele.delqty!;
							return false;
						}
					});
					//console.log("ivtdelqty:", ivtdelqty);
					/**
					 * Get vtdeledqty:已出貨數量
					 */
					let vtdeledqty = 0;
					/*console.log("inCurrDel:", inCurrDel);*/
					if (inCurrDel) {
						if (!itemOptions!.ChkBatch && !itemOptions!.ChkSN) {
							DeliveryItems.forEach((x) => {
								if (
									!x.dlHasSN &&
									!x.dlBatch &&
									x.dlVtId == vtId &&
									x.pstCode == pocode
								) {
									vtdeledqty += x.dlQty;
								}
							});
						}
					} else {
						vtdeledqty += vtdelqty;
					}

					vtdeledqtylist += `<div class="row form-inline justify-content-end mx-1 mb-3">
                    <span class="vtdeledqty">${vtdeledqty}</span></div>`;

					/**
					 * Get currentvttypeqty
					 */
					if (inCurrDel) {
						if (!itemOptions!.ChkBatch && !itemOptions!.ChkSN) {
							let currentvttypedelqty: number = 0;
							DeliveryItems.forEach((x) => {
								if (
									!x.dlHasSN &&
									!x.dlBatch &&
									x.dlVtId == vtId &&
									x.pstCode == pocode
								) {
									currentvttypedelqty += x.dlQty;
								}
							});
							currentvttypeqty = e.qty - vtdelqty - currentvttypedelqty;
						}
					} else {
						currentvttypeqty = e.qty - vtdelqty;
					}

					vtInfoList += `<div class="row form-inline justify-content-end mx-1 mb-3"><span class="currentvttypeqty">${currentvttypeqty}</span>/<span class="totalvtqty">${totalvtqty}</span></div>`;

					let vtdelqtyId = `vtdelqty_${selectedItemCode}_${i}`;
					let currentvdq = 0;
					let vtdisplay = e.vt == "" ? "N/A" : e.vt;
					let vtseq: number = i + 1;

					$.each(DeliveryItems, function (idx, ele) {
						if (
							ele.dlCode == vtdelqtyId &&
							ele.seq == seq &&
							ele.dlVtId == vtId &&
							ele.itmCode == selectedItemCode
						) {
							currentvdq = ele.dlQty;
							return false;
						}
					});

					let disabled =
						!hasFocusCls ||
							Number(vtdelqty) == currentvttypeqty ||
							currentvttypeqty == 0
							? "disabled"
							: "";

					vtdelqtylist += `<div class="row form-inline justify-content-end mx-1 mb-3">
            <label for="${vtdelqtyId}">
                ${vtdisplay} (${pocode})
             </label>
              <input type="text" class="form-control vtdelqty mx-2" Id="${vtdelqtyId}" data-vtseq="${vtseq}" data-itemcode="${selectedItemCode}" data-vtid="${vtId}" data-pocode=${pocode} data-vtqty="${e.qty}" data-vt="${e.vt}" min="0" max="${e.qty}" data-currentvdq="${currentvdq}" ${disabled} style="max-width:80px;" value="${currentvdq}">
           </div>`; //don't use number type here => errorpone!!!

					/**
					 * Display
					 */
					html += "<tr>";
					html += `<td class="text-right">${vtdelqtylist}</td>
<td class="text-right vtdelqtytxt">${vtdeledqtylist}</div></td>
<td class="text-right">
${vtInfoList}
</td>`;
					html += "</tr>";
				}
			});
		});

		validthruModal.find("#tblVt tbody").html(html);
		let salesloc: string = getSalesLoc();

		validthruModal
			.find("#validthruLocItem")
			.html(
				`${salesloc}:${selectedItemCode} <span class="exsmall">${sequencetxt}:${seq}</span>`
			);
		openValidthruModal(hasFocusCls);

		setTotalQty4VtModal();
	}
});
$(document).on("dblclick", ".batch", function () {
	getRowCurrentY.call(this);
	selectedItemCode = (
		$tr.find(".itemcode").val() as string
	).trim();

	const hasFocusCls = $(this).hasClass("focus");
	itemOptions = DicItemOptions[selectedItemCode];
	//console.log("itemOptions:", itemOptions);
	if (!itemOptions) return false;
	toggleBatSn();

	if (
		(forwholesales &&
			(WholeSales.wsStatus.toLowerCase() === "deliver" ||
				WholeSales.wsStatus.toLowerCase() === "partialdeliver") || reviewmode)
	) {
		DeliveryItems = DicSeqDeliveryItems[seq].slice(0);

		//console.log("DicIvInfo:", DicIvInfo);

		let html: string = "";
		DeliveryItems.forEach((x) => {
			let chksnlist: string = "";
			let batdelqtylist: string = "";
			const batcode: string = x.dlBatch;
			//const iseq: number = x.seq??0;
			//console.log("iseq:" + iseq);

			html += `<tr data-Seq="${seq}"><td><label>${batcode}</label></td>`;
			/**
			 * Display
			 */
			//batch && sn(vt)
			if (itemOptions!.ChkSN) {
				let _checked = "checked";
				let _disabled = "disabled";
				let vtdisplay = x.VtDisplay ? x.VtDisplay : "N/A";
				chksnlist += `<div class="form-check">
              <input class="chkbatsnvt" type="checkbox" value="${x.snoCode}" ${_checked} ${_disabled}>
              <label class="" for="chkbatsnvt${x.snoCode}">
                ${x.snoCode} (${vtdisplay}) (${x.pstCode})
              </label>
            </div>`;

				//console.log("batch&sn(vt)");
				html += `<td>${chksnlist}</td>`;
			}
			//batch && vt(no sn) or batch only
			else {
				let disabled = "disabled";
				let vtdisplay = x.VtDisplay ? x.VtDisplay : "N/A";
				batdelqtylist += `<div class="row form-inline justify-content-end mx-1 mb-3">
            <label>
                ${vtdisplay} (${x.pstCode})
             </label>
              <input type="text" class="form-control batdelqty mx-2" ${disabled} style="max-width:80px;" value="${x.dlQty}">
           </div>`;
				//console.log("batch && vt(no sn) or batch only");
				html += `<td class="text-right">${batdelqtylist}</td>`;
			}

			html += "<td><ul class='nostylelist'>";
			let ivlist = "";

			if (
				!$.isEmptyObject(DicItemBatDelQty) &&
				selectedItemCode in DicItemBatDelQty
			) {
				var batdelqty: IBatDelQty = DicItemBatDelQty[selectedItemCode].filter(
					(x) => x.seq == seq && x.batcode == batcode
				)[0];
				//console.log("batdelqty:", batdelqty);
				batdelqty.ivIdList?.split(",").forEach((x) => {
					//console.log("x:" + x);
					if (
						!$.isEmptyObject(DicItemGroupedVariations) &&
						selectedItemCode in DicItemGroupedVariations
					) {
						for (const [k, v] of Object.entries(
							DicItemGroupedVariations[selectedItemCode]
						)) {
							//let iv: IItemVariation = v[0];
							//console.log("v:", v);
							let iv = v.filter((y) => {
								return y.Id == Number(x);
							})[0];
							//console.log("iv:", iv);
							if (iv)
								ivlist += `<li><label>${iv.iaName}:${iv.iaValue}</label></li>`;
						}
					}
				});
			}

			html += ivlist + "</ul></td>";

			html += `</tr>`;
		});
		openBatchModal(hasFocusCls);

		let salesloc: string = getSalesLoc();
		batchModal
			.find("#batchLocSeqItem")
			.html(
				`${salesloc}:${selectedItemCode} <span class="exsmall">${sequencetxt}:${seq}</span>`
			);
		batchModal.find("#tblBatch tbody").html(html);

		setTotalQty4BatModal();
	} else {
		if (DicItemBatchQty[selectedItemCode].length > 0) {
			let html: string = "";
			let pbvqlist: IPoBatVQ[] = [];
			let ipoIvList: IPoItemVari[] = [];
			if (
				!$.isEmptyObject(DicIvInfo) &&
				DicIvInfo[selectedItemCode].length > 0
			) {
				ipoIvList = DicIvInfo[selectedItemCode].slice(0);
			}
			//console.log(PoItemBatVQList);
			//console.log("ipoIvList:", ipoIvList);
			$.each(PoItemBatVQList, function (i, e) {
				if (e.itemcode == selectedItemCode) {
					pbvqlist.push({
						pocode: e.pocode,
						batchcode: e.batchcode,
						vt: e.vt,
						batchqty: e.batchqty,
					});
				}
			});

			//console.log("pbvqlist:", pbvqlist);
			let polist: string[] = [];
			pbvqlist.forEach((x) => {
				if (!polist.includes(x.pocode)) polist.push(x.pocode);
			});
			//console.log("polist:", polist);

			let batchqtylist: Array<IBatchQty> = DicItemBatchQty[selectedItemCode];
			let delbatqtylist: Array<IBatDelQty> = DicItemBatDelQty[selectedItemCode];
			//console.log("delbatqtylist:", delbatqtylist);
			//console.log("batchqtylist:", batchqtylist);
			polist.forEach((pocode) => {
				//console.log("pocode:" + pocode);
				let idx = 0;
				$.each(batchqtylist, function (i, e) {
					if (e.pocode == pocode) {
						let ibatdelqty: number = 0; //use initially only => will be replaced with DeliveryItems later on

						const batcode: string = e.batcode;
						//console.log("batcode:" + batcode);
						let ividlist: string[] = [];
						if (ipoIvList.length > 0) {
							ipoIvList.forEach((x) => {
								if (
									x.ivStockInCode == pocode &&
									x.batCode == batcode &&
									x.ivIdList
								) {
									x.ivIdList.split(",").forEach((y) => ividlist.push(y));
								}
							});
						}

						html += `<tr data-idx="${idx}" data-pocode="${pocode}" data-batcode="${batcode}" data-ivids="${ividlist.join()}"><td><label>${batcode}</label></td>`;

						let chksnlist: string = "";
						let batdelqtylist: string = "";
						let batdeledqtylist: string = "";
						let batInfoList: string = "";
						let currentbattypeqty: number = 0;
						const key: string = batcode + ":" + selectedItemCode;
						let totalbatqty: number =
							key in DicBatTotalQty ? DicBatTotalQty[key] : 0;
						//console.log('pbvqlist:', pbvqlist);
						let inCurrDel: boolean = false;
						inCurrDel = getInCurrDel(inCurrDel, batcode, pocode);
						//console.log("inCurrDel:", inCurrDel);
						$.each(pbvqlist, function (k, v) {
							if (v.pocode == pocode && v.batchcode == batcode) {
								$.each(delbatqtylist, function (idx, ele) {
									if (e.batcode == ele.batcode && pocode == ele.pocode) {
										ibatdelqty += ele.batdelqty!;
									}
								});
								//console.log("ibatdelqty:" + ibatdelqty);
								/**
								 * Get batdeledqty:已出貨數量
								 */
								let batdeledqty = 0;
								//let batdeledqty = ibatdelqty;
								//console.log("inCurrDel:", inCurrDel);
								if (inCurrDel) {
									batdeledqty += ibatdelqty;
									//console.log("#inCurrDel batdeledqty#0:" + batdeledqty);
									if (itemOptions!.ChkSN) {
										if (itemOptions!.WillExpire) {
											/* console.log("all");*/
											//all
											DeliveryItems.forEach((x) => {
												if (
													x.seq == seq &&
													x.JsVt &&
													x.dlHasSN &&
													x.dlBatch == batcode &&
													x.pstCode == pocode
												) {
													batdeledqty += x.dlQty;
												}
											});
										}
										//batch && sn (no vt)
										else {
											DeliveryItems.forEach((x) => {
												if (
													x.seq == seq &&
													!x.JsVt &&
													x.dlHasSN &&
													x.dlBatch == batcode &&
													x.pstCode == pocode
												) {
													batdeledqty += x.dlQty;
												}
											});
										}
									} else {
										if (itemOptions!.WillExpire) {
											DeliveryItems.forEach((x) => {
												if (
													x.seq == seq &&
													!x.dlHasSN &&
													x.JsVt &&
													x.JsVt &&
													x.dlBatch == batcode &&
													x.pstCode == pocode
												) {
													batdeledqty += x.dlQty;
												}
											});
										} else {
											//batch only
											DeliveryItems.forEach((x) => {
												if (
													x.seq == seq &&
													!x.dlHasSN &&
													!x.JsVt &&
													x.dlBatch == batcode &&
													x.pstCode == pocode
												) {
													batdeledqty += x.dlQty;
												}
											});
										}
									}
								} else {
									if (itemOptions!.ChkSN) {
										if (itemOptions!.WillExpire) {
											//console.log("all");
										} else {
										}
									} else {
										if (itemOptions!.WillExpire) {
										} else {
											//console.log("batch only");
										}
									}
									//console.log("batdeledqty:" + batdeledqty + ";ibatdelqty:" + ibatdelqty);
									if (v.pocode == pocode && v.batchcode == batcode) {
										batdeledqty += ibatdelqty;
									}
								}

								//console.log("batdeledqty:" + batdeledqty);
								batdeledqtylist += `<div class="row form-inline justify-content-end mx-1 mb-3">
                    <span class="batdeledqty">${batdeledqty}</span></div>`;

								/**
								 * Get currentbattypeqty
								 */
								let currentbattypedelqty: number = 0;
								if (inCurrDel) {
									currentbattypedelqty = 0;
									if (itemOptions!.ChkSN) {
										//all
										if (itemOptions!.WillExpire) {
											DeliveryItems.forEach((x) => {
												if (
													x.seq == seq &&
													x.JsVt &&
													x.dlHasSN &&
													x.dlBatch == batcode &&
													x.pstCode == pocode
												) {
													currentbattypedelqty += x.dlQty;
												}
											});
											currentbattypeqty =
												v.batchqty - ibatdelqty - currentbattypedelqty;
										}
										//batch && sn (no vt)
										else {
											DeliveryItems.forEach((x) => {
												if (
													x.seq == seq &&
													!x.JsVt &&
													x.dlHasSN &&
													x.dlBatch == batcode &&
													x.pstCode == pocode
												) {
													currentbattypedelqty += x.dlQty;
												}
											});
											currentbattypeqty =
												v.batchqty - ibatdelqty - currentbattypedelqty;
										}
									} else {
										currentbattypedelqty = 0;
										if (itemOptions!.WillExpire) {
											DeliveryItems.forEach((x) => {
												if (
													x.seq == seq &&
													!x.dlHasSN &&
													x.JsVt &&
													x.JsVt &&
													x.dlBatch == batcode &&
													x.pstCode == pocode
												) {
													currentbattypedelqty += x.dlQty;
												}
											});
										} else {
											//batch only
											DeliveryItems.forEach((x) => {
												if (
													x.seq == seq &&
													!x.dlHasSN &&
													!x.JsVt &&
													x.dlBatch == batcode &&
													x.pstCode == pocode
												) {
													currentbattypedelqty += x.dlQty;
												}
											});
										}
										//console.log("currentbattypedelqty:" + currentbattypedelqty);
										currentbattypeqty =
											v.batchqty - ibatdelqty - currentbattypedelqty;
										//console.log("currentbattypeqty:" + currentbattypeqty);
									}
								} else {
									//console.log("v.batchqty:", v.batchqty);
									//console.log("ibatdelqty:", ibatdelqty);
									currentbattypeqty = v.batchqty - ibatdelqty;
								}

								batInfoList += `<div class="row form-inline justify-content-end mx-1 mb-3"><span class="currentbattypeqty">${currentbattypeqty}</span>/<span class="totalbatqty">${totalbatqty}</span></div>`;

								let batdelqtyId = `batdelqty_${selectedItemCode}_${k}`;
								let currentbdq = 0;
								let vtdisplay = v.vt == "" ? "N/A" : v.vt;
								let batseq: number = k + 1;

								$.each(DeliveryItems, function (idx, ele) {
									if (
										ele.dlCode == batdelqtyId &&
										ele.seq == seq &&
										ele.dlBatch == e.batcode &&
										ele.itmCode == selectedItemCode
									) {
										currentbdq = ele.dlQty;
										return false;
									}
								});

								//console.log("!hasFocusCls:", !hasFocusCls);
								//console.log("ibatdelqty" + ibatdelqty + ";currentbattypeqty:" + currentbattypeqty + ";totalbatqty:" + totalbatqty);

								let disabled =
									!hasFocusCls ||
										//Number(ibatdelqty) == currentbattypeqty ||									
										currentbattypeqty == 0
										? "disabled"
										: "";

								batdelqtylist += `<div class="row form-inline justify-content-end mx-1 mb-3">
            <label for="${batdelqtyId}">
                ${vtdisplay} (${v.pocode})
             </label>
              <input type="text" class="form-control larger batdelqty mx-2" Id="${batdelqtyId}" data-batseq="${batseq}" data-itemcode="${selectedItemCode}" data-batch="${v.batchcode}" data-pocode=${v.pocode} data-batqty="${v.batchqty}" data-batvt="${v.vt}" min="0" max="${v.batchqty}" data-currentbdq="${currentbdq}" ${disabled} style="max-width:80px;" value="${currentbdq}">
           </div>`;
							}
						}); //don't use number type here => errorpone!!!

						/**
						 * Set Html List
						 */
						//batch && sn(vt)
						if (itemOptions!.ChkSN) {
							//console.log("batch&&sn(vt)");
							let snbatvtlist: Array<IBatSnVt> = [];
							if (batcode in DicItemBatSnVtList[selectedItemCode]) {
								snbatvtlist =
									DicItemBatSnVtList[selectedItemCode][batcode].slice(0);
							}
							//console.log("snbatvtlist:", snbatvtlist);
							$.each(snbatvtlist, function (idx, ele) {
								let _checked = "";
								let _disabled = hasFocusCls ? "" : "disabled";

								if (DeliveryItems.length > 0) {
									let idx = DeliveryItems.findIndex((x, i) => {
										if (hasFocusCls) {
											return (x.snoCode == ele.sn);
										} else {
											return (x.snoCode == ele.sn && x.seq == seq);
										}
									});
									if (idx >= 0) _checked = "checked disabled";
								}

								if (ele.batcode == e.batcode && ele.pocode == pocode) {
									let vtdisplay = ele.vt ? ele.vt : "N/A";
									chksnlist += `<div class="form-check">
              <input class="chkbatsnvt" type="checkbox" value="${ele.sn}" data-itemcode="${selectedItemCode}" data-pocode="${pocode}" data-batcode="${ele.batcode}" data-snvt="${ele.vt}" Id="chkbatsnvt${ele.sn}" ${_checked} ${_disabled}>
              <label class="" for="chkbatsnvt${ele.sn}">
                ${ele.sn} (${vtdisplay}) (${ele.pocode})
              </label>
            </div>`;
								}
							});
						}

						//batch && vt (no sn)
						if (!itemOptions!.ChkSN && itemOptions!.WillExpire) {
							//console.log("batch&&vt(no sn)");
							let snbatvtlist: Array<IBatSnVt> = [];
							if (batcode in DicItemBatSnVtList[selectedItemCode]) {
								snbatvtlist =
									DicItemBatSnVtList[selectedItemCode][batcode].slice(0);
							}
							//console.log("snbatvtlist:", snbatvtlist);
							$.each(snbatvtlist, function (idx, ele) {
								let _checked = "";
								let _disabled = hasFocusCls ? "" : "disabled";

								if (DeliveryItems.length > 0) {
									let idx = DeliveryItems.findIndex((x, i) => {
										if (hasFocusCls) {
											return (x.snoCode == ele.sn);
										} else {
											return (x.snoCode == ele.sn && x.seq == seq);
										}
									});
									if (idx >= 0) _checked = "checked disabled";
								}

								if (ele.batcode == e.batcode && ele.pocode == pocode) {
									let vtdisplay = ele.vt ? ele.vt : "N/A";
									chksnlist += `<div class="form-check">
              <input class="chkbatsnvt" type="checkbox" value="${ele.sn}" data-itemcode="${selectedItemCode}" data-pocode="${pocode}" data-batcode="${ele.batcode}" data-snvt="${ele.vt}" Id="chkbatsnvt${ele.sn}" ${_checked} ${_disabled}>
              <label class="" for="chkbatsnvt${ele.sn}">
                ${ele.sn} (${vtdisplay})
              </label>
            </div>`;
								}
							});
						}

						/**
						 * Display
						 */
						//batch && sn(vt)
						if (itemOptions!.ChkSN) {
							//console.log("batch&sn(vt)");
							html += `<td>${chksnlist}</td>`;
						}
						//batch && vt(no sn) or batch only
						else {
							//console.log("batch && vt(no sn) or batch only");
							html += `<td class="text-right">${batdelqtylist}</td>`;
						}

						let ivlist: string = "";
						if (ipoIvList.length > 0) {
							ivlist = `<ul class="nostylelist">`;
							ipoIvList.forEach((x) => {
								if (x.ivStockInCode == pocode && x.batCode == batcode) {
									ivlist += `<li data-ivcomboids="${x.ivIdList}"><label>${x.iaName}:${x.iaValue}</label></li>`;
								}
							});
							ivlist += `</ul>`;
						}

						html += `<td class="text-right variInfo">${ivlist}</td>`;

						html += `<td class="text-right batdelqtytxt">${batdeledqtylist}</td>`;

						html += `<td class="text-right batInfo">${batInfoList}</td>`;
						html += `</tr>`;
						idx++;
					}
				});
			});

			//change save btn to close btn if !hasFocusCls
			openBatchModal(hasFocusCls);

			let salesloc: string = getSalesLoc();

			batchModal
				.find("#batchLocSeqItem")
				.html(
					`${salesloc}:${selectedItemCode} <span class="exsmall">${sequencetxt}:${seq}</span>`
				);
			batchModal.find("#tblBatch tbody").html(html);

			//hide tr if currentbattypeqty = 0
			//$("#tblBatch tbody tr").eq(1).find("td.batInfo").find(".currentbattypeqty").text();
			$("#tblBatch tbody tr").each(function (i, e) {
				if (
					Number($(e).find("td.batInfo").find(".currentbattypeqty").text()) <= 0
				) {
					$(e).hide();
				}
			});

			batchModal.find(".batdelqty").each(function (i, e) {
				if ($(e).val() == 0) {
					$(e).trigger("focus");
					return false;
				}
			});
		} else {
			$target = $(this);
			$.fancyConfirm({
				title: "",
				message: nobatchfoundwitemtxt,
				shownobtn: false,
				okButton: oktxt,
				noButton: notxt,
				callback: function (value) {
					if (value) {
						$target.trigger("focus");
					}
				},
			});
		}

		setTotalQty4BatModal();
	}
});
function getSalesLoc() {
	let salesloc: string = "";
	if (forsales) reviewmode ? salesloc = SalesOrder.rtsSalesLoc : salesloc = Sales.rtsSalesLoc;
	if (forpreorder) salesloc = PreSales.rtsSalesLoc;
	if (forwholesales) salesloc = WholeSales.wsSalesLoc;
	return salesloc;
}

function getInCurrDel(inCurrDel: boolean, batcode: string, pocode: string) {
	if (DeliveryItems.length > 0) {
		if (itemOptions!.ChkSN) {
			//all
			if (itemOptions!.WillExpire) {
				inCurrDel = DeliveryItems.some((x) => {
					return (
						x.seq == seq &&
						x.JsVt &&
						x.dlHasSN &&
						x.dlBatch == batcode &&
						x.pstCode == pocode
					);
				});
			}

			//batch && sn (no vt)
			else {
				inCurrDel = DeliveryItems.some((x) => {
					return (
						x.seq == seq &&
						!x.JsVt &&
						x.dlHasSN &&
						x.dlBatch == batcode &&
						x.pstCode == pocode
					);
				});
			}
		} else {
			//batch && vt (no sn)
			if (itemOptions!.WillExpire) {
				inCurrDel = DeliveryItems.some((x) => {
					return (
						x.seq == seq &&
						!x.dlHasSN &&
						x.JsVt &&
						x.dlBatch == batcode &&
						x.pstCode == pocode
					);
				});
			} else {
				//batch only
				inCurrDel = DeliveryItems.some((x) => {
					return (
						x.seq == seq &&
						!x.dlHasSN &&
						!x.JsVt &&
						x.dlBatch == batcode &&
						x.pstCode == pocode
					);
				});
			}
		}
	}
	return inCurrDel;
}

//for those items with vari but without batch
function addItemVariRow(hasFocusCls: boolean, maxqty: number) {
	if ($.isEmptyObject(DicIvQtyList) || $.isEmptyObject(DicIvDelQtyList) || $.isEmptyObject(DicIvInfo) || !selectedItemCode || !itemOptions) return false;
	//console.log("here");
	//console.log("DicIvQtyList:", DicIvQtyList);
	let html = "";
	//let itemcode = selectedItemCode;
	let ivqtylist: IIvQty[] = DicIvQtyList[selectedItemCode];
	let delivqtylist: IIvDelQty[] = DicIvDelQtyList[selectedItemCode];

	let ivInfo = DicIvInfo[selectedItemCode];
	//console.log("ivInfo:", ivInfo);

	let pocodelist: string[] = [];
	ivqtylist.forEach((x) => {
		if (!pocodelist.includes(x.pocode)) pocodelist.push(x.pocode);
	});

	if (pocodelist.length > 0) {
		pocodelist.forEach((pocode) => {
			ivqtylist.forEach((e: IIvQty, i: number) => {
				if (e.pocode == pocode) {
					let ivdelqty: number = 0; //用來計算 已出貨數量 use initially only => will be replaced with DeliveryItems later on
					const Id = e.Id;
					let ivdelqtylist = "";
					let ivdeledqtylist: string = "";
					let ivInfoList: string = "";
					let currentivtypeqty: number = 0;
					let totalivqty: number = e.qty;

					let inCurrDel: boolean = false;
					if (DeliveryItems.length > 0) {
						if (!itemOptions?.ChkBatch) {
							inCurrDel = DeliveryItems.some((x) => {
								return (
									x.seq == seq &&
									!x.dlBatch &&
									x.dlCode == Id &&
									x.pstCode == pocode
								);
							});
						}
					}
					//console.log("delivqtylist:", delivqtylist);
					$.each(delivqtylist, function (k, ele) {
						if (ele.pocode == pocode) {
							ivdelqty += ele.delqty!;
						}
					});

					let ivdeledqty = 0;
					if (inCurrDel) {
						if (!itemOptions?.ChkBatch) {
							DeliveryItems.forEach((x) => {
								if (
									x.seq == seq &&
									!x.dlBatch &&
									x.dlCode == Id &&
									x.pstCode == pocode
								) {
									ivdeledqty += x.dlQty;
								}
							});
						}
					} else {
						ivdeledqty += ivdelqty;
					}

					ivdeledqtylist += `<div class="row form-inline justify-content-end mx-1 mb-3">
                    <span class="ivdeledqty">${ivdeledqty}</span></div>`;

					/**
					 * Get currentvttypeqty
					 */
					if (inCurrDel) {
						if (!itemOptions!.ChkBatch) {
							let currentivtypedelqty: number = 0;
							DeliveryItems.forEach((x) => {
								if (
									x.seq == seq &&
									!x.dlBatch &&
									x.dlCode == Id &&
									x.pstCode == pocode
								) {
									currentivtypedelqty += x.dlQty;
								}
							});
							currentivtypeqty = e.qty - ivdelqty - currentivtypedelqty;
						}
					} else {
						//console.log("e.qty:" + e.qty + ";ivdelqty:" + ivdelqty);
						currentivtypeqty = e.qty - ivdelqty;
					}

					ivInfoList += `<div class="row form-inline justify-content-end mx-1 mb-3"><span class="currentivtypeqty">${currentivtypeqty}</span>/<span class="totalivqty">${totalivqty}</span></div>`;

					let ivdelqtyId = `ivdelqty_${selectedItemCode}_${i}`;
					let currentivdq = 0;
					let ivdisplay = `<ul class="nostylelist">`;
					let ivseq: number = i + 1;

					if (ivInfo != null && ivInfo.length > 0) {
						ivInfo.forEach((x) => {
							if (x.Id == Id) {
								ivdisplay += `<li><label>${x.iaName}</label>:<label>${x.iaValue}</label></li>`;
							}
						});
						ivdisplay += "</ul>";
					}

					if (DeliveryItems.length > 0) {
						$.each(DeliveryItems, function (idx, ele) {
							if (
								//ele.dlCode == ivdelqtyId &&
								ele.seq == seq &&
								ele.dlCode == Id &&
								ele.itmCode == selectedItemCode
							) {
								currentivdq = ele.dlQty;
								return false;
							}
						});
					}

					let disabled =
						!hasFocusCls ||
							Number(ivdelqty) == currentivtypeqty ||
							currentivtypeqty == 0
							? "disabled"
							: "";

					ivdelqtylist += `<div class="row form-inline justify-content-center mx-1 mb-3">
            <label for="${ivdelqtyId}">
               ${pocode}
             </label>
              <input type="text" class="form-control ivdelqty mx-2" Id="${ivdelqtyId}" data-ivseq="${ivseq}" data-itemcode="${selectedItemCode}" data-id="${Id}" data-pocode=${pocode} data-ivqty="${maxqty}" data-totalqty="${e.qty}" data-ividlist="${e.ivIdList}" min="0" max="${maxqty}" data-currentivdq="${currentivdq}" ${disabled} style="max-width:80px;" value="${currentivdq}">
           </div>`; //don't use number type here => errorpone!!!

					/**
					 * Display
					 */
					html += `<tr data-idx="${i}" data-maxqty="${maxqty}">`;
					html += `<td class="text-left">${ivdelqtylist}</td>
                    <td class="text-left">${ivdisplay}</td>
<td class="text-right ivdelqtytxt">${ivdeledqtylist}</div></td>
<td class="text-right">
${ivInfoList}
</td>`;
					html += "</tr>";
				}
			});
		});
	}

	$target = itemVariModal.find("#tblIv tbody");
	$target.empty().append(html);
	$("#tblIv tbody tr")
		.find(".ivdelqty")
		.each(function (i, e) {
			if (Number($(e).val()) == 0) {
				setTimeout(function () {
					$(e).trigger("focus");
				}, 1000);
				return false;
			}
		});
}
$(document).on("dblclick", ".vari.pointer", function () {
	getRowCurrentY.call(this);
	const hasFocusCls: boolean = $(this).hasClass("focus");
	selectedItemCode = $tr.find("input.itemcode").val() as string;
	let qtycls = forwholesales ? "input.delqty" : "input.qty";
	const maxqty = Number($tr.find(qtycls).val());
	seq = currentY + 1;
	itemOptions = DicItemOptions[selectedItemCode];

	if (
		(forwholesales &&
			(WholeSales.wsStatus.toLowerCase() === "deliver" ||
				WholeSales.wsStatus.toLowerCase() === "partialdeliver")) && reviewmode || (SalesOrder && (SalesOrder.rtsStatus.toLowerCase() == SalesStatus.created.toString() || SalesOrder.rtsStatus.toLowerCase() == SalesStatus.presettled.toString()))
	) {
		DeliveryItems = DicSeqDeliveryItems[seq].slice(0);
		deliveryItem = DeliveryItems[0];
		//console.log("deliveryItem:", deliveryItem);

		let ivList: string = "<ul class='nostylelist'>";
		if (selectedItemCode in DicIvInfo) {
			let ivInfo = DicIvInfo[selectedItemCode];
			//console.log(ivInfo);
			ivInfo.forEach((x) => {
				if (x.ivIdList == deliveryItem!.ivIdList!) {
					ivList += `<li><label>${x.iaName}</label>:<label>${x.iaValue}</label></li>`;
				}
			});
		}
		ivList += "</ul>";

		let html = `<tr><td class="text-right"><div class="row form-inline justify-content-end mx-1 mb-3">
            <label>
                ${deliveryItem.pstCode}
             </label>
              <input type="text" class="form-control ivdelqty mx-2" style="max-width:80px;" value="${deliveryItem.dlQty}" readonly>
           </div></td><td>${ivList}</td></tr>`;

		itemVariModal.find("#tblIv tbody").html(html);
	} else {
		//console.log("here");
		addItemVariRow(hasFocusCls, maxqty);
	}

	let salesloc: string = getSalesLoc();
	itemVariModal
		.find("#ivLocSeqItem")
		.html(
			`${salesloc}:${selectedItemCode} <span class="exsmall">${sequencetxt}:${seq}</span>`
		);
	openItemVariModal(hasFocusCls);

	setTotalQty4IvModal();
});
function removeEmptyRow() {
	$tr = $(`#${gTblId} tbody tr`).last();
	if ($tr.find("td").eq(1).find(".itemcode").val() === "") $tr.remove();
}

function showMsg4Cls(clsname: string, msg: string, alertCls: string = "", timeout: number = 3000, fadeout: number = 1000) {
	$(`.${clsname}`).addClass(`${alertCls}`).html(msg);
	setTimeout(function () {
		//reset the msg tag	
		$(`.${clsname}`).removeClass(`${alertCls}`).text("");
	}, timeout);
}
function showMsg(Id: string, msg: string, alertCls: string = "info", timeout: number = 3000, fadeout: number = 1000) {
	$(`#${Id}`).addClass(`small alert alert-${alertCls}`).html(msg);
	setTimeout(function () {
		//reset the msg tag	
		$(`#${Id}`).removeClass(`small alert alert-${alertCls}`).text("");
	}, timeout);


}

$(document).on("click", ".btnVoid", function () {
	if (forpurchase) {
		openVoidPaymentModal();
	}
});

$(document).on("click", ".btnUpload", function () {
	forpurchasepayments = $(this).data("forpurchasepayments") == "1";
	if (forpurchasepayments) {
		forpurchase = false;
		triggerReferrer = ($(this).parent("td").length) ? TriggerReferrer.Row : TriggerReferrer.Modal;
		ppId = Number($(this).data("id"));
		getPurchasePayment();
		openUploadFileModal();
	}
});

function addPayRow() {
	let Id: number = lastppId + 1;
	$tr = $(`#${gTblId} tbody tr`).last();
	let lastseq = ($tr.length) ? Number($tr.find("td").first().text()) + 1 : 1;
	//console.log("Id:", Id);
	let strdate: string = formatDate();
	let strdatetime: string = formatDateTime();

	let html = `<tr data-id="${Id}">
	<td class="text-center">${lastseq}</td>
	<td class="text-center"><input type="text" class="form-control text-center chequeno" maxlength="8" /></td>
	<td class="text-center">${populateDrpAccount()}</td>`;
	//<span class="accountno acname" data-accno="@payment.AccountNo">@payment.AccountName</span>
	html += `<td class="text-center"><span class="accountno acname"></span></td>
	<td class="text-right"><input type="number" class="form-control pay text-right" data-id="${Id}" value="${formatnumber(0)}" /></td>
	<td class="text-right"><input type="datetime" class="form-control datepicker ppdate" name="ppDate" value="${strdate}" /></td>
	<td class="text-left text-wrap"></td>
	<td class="text-right">${strdatetime}</td>
	<td class="text-center">${user.UserName}</td>
	<td>
	<button type="button" class="btn btn-success btnsmall80 btnSave mr-1" data-id="${Id}" title="${$infoblk.data("savepaymenttxt")}"><i class="fa fa-save"></i></button>
									<button type="button" class="btn btn-warning btnsmall80 btnUpload mr-1 disabled" data-id="${Id}" title="${uploadfiletxt}"><i class="fa fa-upload"></i></button>
									<button type="button" class="btn btn-danger btnsmall80 btnVoid mr-1 disabled" data-id="${Id}" title="${void4paymenttxt}"><i class="fa fa-trash"></i></button>
								</td>
	`;
	html += `</tr>`;

	$(`#${gTblId} tbody`).append(html);

	initDatePicker("ppdate", today, true, "", true, false, true);

	ppId = Id;
	purchasePayment = { Id } as IPurchasePayment;
}

function updateSelectedPayment() {
	if (forpurchasepayments) {
		getPurchasePayment();
		//console.log("!purchasePayment:", !purchasePayment);
		if (!purchasePayment) {
			validPayment = false; return;
		}
		$(`#${gTblId} tbody tr`).each(function (i, e) {
			let Id: number = Number($(e).data("id"));
			//console.log("Id:" + Id);
			let chequeno: string = $(e).find(".chequeno").val() as string;
			let acno: string = $(e).find(".acname").data("acno") as string;
			let amt: number = Number($(e).find(".pay").val());
			let jsdate: string = $(e).find(".ppdate").val() as string;
			let jstime: string = $(e).find("td").eq(-3).text();

			if (chequeno != "" && acno != "" && amt > 0 && purchasePayment.Id == Id) {
				purchasePayment.pstCode = Purchase.pstCode;
				purchasePayment.supCode = Purchase.supCode;
				purchasePayment.ChequeNo = chequeno.trim();
				purchasePayment.AccountNo = acno.trim();
				purchasePayment.Amount = Number(amt);
				purchasePayment.JsCreateDate = jsdate;
				purchasePayment.JsOpTime = jstime;

				$(e).find("td").last().find(".btnSave").removeClass("disabled");
				validPayment = true;
			} else {
				$(e).find("td").last().find(".btnSave").addClass("disabled");
				validPayment = false;
			}
		});
	}
}
$(document).on("click", ".filelnk", function () {
	popupCenter({
		url: $(this).data("lnk"),
		title: `${$(this).data("name")}`,
		w: "1080",
		h: "900"
	});
});

function getPurchasePayment() {
	if (PurchasePayments.length > 0) {
		purchasePayment = PurchasePayments.find(x => x.Id == ppId)!;
		if (!purchasePayment)
			purchasePayment = { Id: ppId } as IPurchasePayment;
	} else {
		purchasePayment = { Id: ppId } as IPurchasePayment;
	}
}

function handleVoidPayment() {
	if (NamesMatch) {
		voidPaymentModal.find("span").addClass("hide");
		if (forpurchase) {
			//todo:handleVoidPayment
			console.log("handleVoidPayment");
		}
	} else {
		voidPaymentModal.find("span").removeClass("hide");
	}

}

function populateDrpAccount(): string {
	let selectedEQ = addMode ? "" : AcClfID && AcClfID == "EQ" ? "selected" : "";
	let selectedEXP = addMode ? "" : AcClfID && AcClfID == "EXP" ? "selected" : "";
	let selectedL = addMode ? "" : AcClfID && AcClfID == "L" ? "selected" : "";
	let selectedOEXP = addMode ? "" : AcClfID && AcClfID == "OEXP" ? "selected" : "";
	let selectedOI = addMode ? "" : AcClfID && AcClfID == "OI" ? "selected" : "";
	let selectedCOS = addMode ? "" : AcClfID && AcClfID == "COS" ? "selected" : "";
	let selectedI = addMode ? "" : AcClfID && AcClfID == "I" ? "selected" : "";
	let selectedA = addMode ? "" : AcClfID && AcClfID == "A" ? "selected" : "";
	return `<select class="drpAccount form-control flex">
			<option value="">- ${selecttxt} -</option>
			<option value="A" ${selectedA}>${assettxt}</option>
			<option value="L" ${selectedL}>${liabilitytxt}</option>
			<option value="EQ" ${selectedEQ}>${equitytxt}</option>
			<option value="I" ${selectedI}>${incometxt}</option>
			<option value="COS" ${selectedCOS}>${costxt}</option>
			<option value="EXP" ${selectedEXP}>${expensetxt}</option>
			<option value="OI" ${selectedOI}>${otherincometxt}</option>
			<option value="OEXP" ${selectedOEXP}>${otherexpensetxt}</option>
		</select>`;
}
$(document).on("change", ".drpAccount", function () {
	currentY = $(this).parent("td").parent("tr").index();

	if (forjournal) GetSetJournalLn();

	AcClfID = $(this).val()!.toString();
	if (AcClfID !== "") {
		accountList = DicAcAccounts[AcClfID];
		changeAccountPage(1);

		if (forjournal) toggleJournalAmt(currentY, true);
	}
});
$(document).on("change", "#txtUserName", function () {
	UserName = $(this).val();
	//console.log("name:", name);
	if (UserName) {
		if (forpurchase) {
			NamesMatch = UserName == $(this).data("name")
			if (NamesMatch) {
				voidPaymentModal.find("span").addClass("hide");
			} else {
				voidPaymentModal.find("span").removeClass("hide");
			}
		}
	} else {
		voidPaymentModal.find("span").removeClass("hide");
	}
});

function setAccName(tr: JQuery<Element>, acno: string, acname: string) {
	let idx = 0;
	if (forIA) idx = 5;
	if (forjournal || forIA) {
		let $td = tr.find("td").eq(idx);
		$td.find(".drpAccount").remove();
		$td.html(`<input type="text" readonly class="form-control acno" value="${acno}">`);
	}


	if (forjournal || forIA)
		tr.find(".acname").attr("title", acname).val(acname);
	if (forpurchase) {
		tr.find(".acname").attr("title", acname).text(acname.concat(` (${acno})`)).data("acno", acno);
		purchasePayment.AccountNo = acno;
	}
}
function handleUploadedFile(result: any) {
	closeWaitingModal();
	closeUploadFileModal();
	closeViewFileModal();
	UploadedFileList = structuredClone(result.FileList);
	//console.log("UploadedFileList:", UploadedFileList);
	if (forpurchase) {
		if (Purchase) Purchase.UploadFileList = structuredClone(UploadedFileList);
	}

	if (forpurchasepayments) populateFileList4PurchasePayments(UploadedFileList);
	else populateFileList(UploadedFileList);
}
function populateFileList(files: string[]) {
	if (files.length > 0) {
		let html = "";
		const pdfthumbnail = getPdfThumbnail();
		console.log("pdfthumbnail:", pdfthumbnail);
		console.log("files:", files);
		files.forEach((x) => {
			let removefilelnk = "", filelnk = "";
			if (forpurchase) {
				removefilelnk = getRemoveFileLnk(x, Purchase.pstCode);
				filelnk = `<a href="#" class="filelnk" data-lnk="/Purchase/${apId}/${Purchase.pstCode}/${x}">${pdfthumbnail}${x}</a> ${removefilelnk}`;
			}
			if (forenquiry) {
				removefilelnk = getRemoveFileLnk(x, enquiry.enId);
				filelnk = `<a href="#" class="filelnk" data-lnk="/Enquiry/${apId}/${enquiry.enId}/${x}">${pdfthumbnail}${x}</a> ${removefilelnk}`;
			}
			if (forcustomer) {
				removefilelnk = getRemoveFileLnk(x, Customer.cusCode);
				filelnk = `<a href="#" class="filelnk" data-lnk="/Customer/${apId}/${Customer.cusCode}/${x}">${pdfthumbnail}${x}</a> ${removefilelnk}`;
			}
			if (forsupplier) {
				removefilelnk = getRemoveFileLnk(x, Supplier.supCode);
				filelnk = `<a href="#" class="filelnk" data-lnk="/Supplier/${apId}/${Supplier.supCode}/${x}">${pdfthumbnail}${x}</a> ${removefilelnk}`;
			}
			html += `<li>${filelnk}</li>`;
		});

		if (forpurchase || forpurchasepayments) {
			$(".viewfileblk").find(".file").empty().append(html);
		}
		else {
			//console.log("here");
			viewFileModal.find(".file").empty().append(html);
		}

	}
}
function populateFileList4PurchasePayments(fileList: string[]) {
	$("#uploadmsg").fadeIn("slow");

	let paymentId = purchasePayment.Id;
	purchasePayment.fileName = fileList.join();
	//<li class="p-2" data-file="Project_Requirements.pdf"><a href="#" class="filelnk" data-lnk="/Purchase/1/Project_Requirements.pdf"><img src="/images/pdf.jpg" class="thumbnail">Project_Requirements.pdf</a> <i class="fa fa-trash removefile" data-file="Project_Requirements.pdf" data-payid="1"></i></li>
	let html = "";
	fileList.forEach((x) => {
		html += `<li class="p-2" data-file="${x}"><a href="#" class="filelnk" data-lnk="/Purchase/${paymentId}/${x}"><img src="/images/pdf.jpg" class="thumbnail">${x}</a> <i class="fa fa-trash removefile" data-file="${x}" data-payid="${paymentId}"></i></li>`;
	});
	viewFileModal.find(".file").empty().append(html);
}

function setInputFilter(textbox: Element, inputFilter: (value: string) => boolean, errMsg: string): void {
	["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function (event) {
		textbox.addEventListener(event, function (this: (HTMLInputElement | HTMLTextAreaElement) & { oldValue: string; oldSelectionStart: number | null, oldSelectionEnd: number | null }) {
			if (inputFilter(this.value)) {
				this.oldValue = this.value;
				this.oldSelectionStart = this.selectionStart;
				this.oldSelectionEnd = this.selectionEnd;
			}
			else if (Object.prototype.hasOwnProperty.call(this, "oldValue")) {
				this.value = this.oldValue;

				if (this.oldSelectionStart !== null &&
					this.oldSelectionEnd !== null) {
					this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
				}
			}
			else {
				this.value = "";
			}
		});
	});
}

function setInputsFilter(textboxes: any, inputFilter: (value: string) => boolean, errMsg: string): void {
	["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function (event) {
		for (let textbox of textboxes) {
			textbox.addEventListener(event, function (this: (HTMLInputElement | HTMLTextAreaElement) & { oldValue: string; oldSelectionStart: number | null, oldSelectionEnd: number | null }) {
				if (inputFilter(this.value)) {
					this.oldValue = this.value;
					this.oldSelectionStart = this.selectionStart;
					this.oldSelectionEnd = this.selectionEnd;
				}
				else if (Object.prototype.hasOwnProperty.call(this, "oldValue")) {
					this.value = this.oldValue;

					if (this.oldSelectionStart !== null &&
						this.oldSelectionEnd !== null) {
						this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
					}
				}
				else {
					this.value = "";
				}
			});
		}
	});
}

function getRowCurrentY(this: any, forTd: boolean = false) {
	//console.log("this:", this);
	$tr = forTd ? $(this).parent("tr") : $(this).parent("td").parent("tr");
	//console.log("td:", $(this).parent("td"));
	//console.log("$tr:", $tr);
	currentY = $tr.index();
	seq = currentY + 1;
}

function getPdfThumbnail(cls: string = ""): string {
	return `<img src="/images/pdf.jpg" class="${cls} thumbnail">`;
}

function getRemoveFileLnk(file: string, code: string): string {
	return `<i class="fa fa-trash removefile" data-file="${file}" data-code="${code}"></i>`;
}

$(document).on("click", ".filelnk", function () {
	//let url = ($(this).data("lnk") as string).replace("{0}", $(this).data("supcode"));
	popupCenter({
		url: $(this).data("lnk"),
		title: `${$(this).data("name")}`,
		w: "1080",
		h: "900"
	});
});

$(document).on("click", ".removefile", function () {
	let url = "", data = {};
	let file = $(this).data("file");
	if (forpurchase) {
		if ($(this).hasClass("ppay")) {
			url = "/Purchase/RemoveFile4Payment";
			let Id = Number($(this).data("payid"));
			$(this).parent("li").remove();
			data = { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), Id, filename: file };
		}
		else {
			url = "/Purchase/RemoveFile";
			let idx = Purchase.FileList.findIndex(x => { return x == file; });
			if (idx >= 0) Purchase.FileList.splice(idx, 1);
			populateFileList(Purchase.FileList);
			let pstCode = $(this).data("code");
			data = { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), pstCode, filename: file };
		}
	}
	if (forcustomer) {
		url = "/Customer/RemoveFile";
		let idx = Customer.UploadFileList.findIndex(x => { return x == file; });
		if (idx >= 0) Customer.UploadFileList.splice(idx, 1);
		populateFileList(Customer.UploadFileList);
		let cusCode = $(this).data("code");
		data = { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), cusCode, filename: file };
	}
	if (forsupplier) {
		url = "/Supplier/RemoveFile";
		let idx = Supplier.UploadFileList.findIndex(x => { return x == file; });
		if (idx >= 0) Supplier.UploadFileList.splice(idx, 1);
		populateFileList(Supplier.UploadFileList);
		let cusCode = $(this).data("code");
		data = { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), cusCode, filename: file };
	}
	if (forenquiry) {
		url = "/Enquiry/RemoveFile";
		let idx = enquiry.UploadFileList.findIndex(x => { return x == file; });
		if (idx >= 0) enquiry.UploadFileList.splice(idx, 1);
		populateFileList(enquiry.UploadFileList);
		let enqId = $(this).data("code");
		data = { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), enqId, filename: file };
	}

	handleRemoveFile(url, data);
});

function handleRemoveFile(url: string, data: any) {
	openWaitingModal();
	$.ajax({
		//contentType: 'application/json; charset=utf-8',
		type: "POST",
		url: url,
		data: data,
		success: function (data) {
			if (data) {
				closeWaitingModal();
			}
		},
		dataType: "json"
	});
}


function ReadonlyDisableEntries() {
	$("input:not([type='file'],[id='txtUserName'],.ip,.povari)").prop("isadmin", true).prop("disabled", true);
	$("input.ip,input.povari").prop("readonly", true);
	$("select").prop("disabled", true);
	$("textarea").not("#txtField").prop("isadmin", true).prop("disabled", true);
}


function triggerMenuByCls(dashmenucls: string, submenuIdx: number) {
	$(".dash__menu").find("ul").find(".btn_expand").each(function () {
		if ($(this).hasClass(dashmenucls)) {
			$(this).find(".submenu").first().addClass("show").find("a").removeClass("active").parent("li").parent(".submenu").find("li").eq(submenuIdx).find("a").addClass("active");
			return false;
		}
	});
}
//function triggerMenu(dashmenuIdx: number, submenuIdx: number) {	
//	$(".dash__menu").find("ul").find(".btn_expand").eq(dashmenuIdx).find(".submenu").first().addClass("show").find("a").removeClass("active").parent("li").parent(".submenu").find("li").eq(submenuIdx).find("a").addClass("active");
//}

function initCityDropDown(selectedCity: string = "", lang: number = 1) {
	let regionfile: string = "";
	let $lblcity = $("#lblCity");
	//console.log("SelectedCountry:" + SelectedCountry);
	let txtCity = `<input type="text" id="txtCity" class="form-control">`;
	let drpCity = `<select id="drpCity" class="form-control"></select>`;
	if (SelectedCountry == 1) {
		regionfile = "/scripts/hongkong_regions.json";
		//console.log($lblcity.data("area"));
		$lblcity.text($lblcity.data("area"));
		if ($("#txtCity").length) $("#txtCity").replaceWith(drpCity);
	}
	if (SelectedCountry == 2) {
		regionfile = "/scripts/macau_regions.json";
		$lblcity.text($lblcity.data("area"));
		if ($("#txtCity").length) $("#txtCity").replaceWith(drpCity);
	}
	if (SelectedCountry == 3) {
		regionfile = "";
		/*$("#drpCity").empty().trigger("change");*/
		$("#drpCity").select2("destroy").replaceWith(txtCity);
		$lblcity.text($lblcity.data("city"));

	}

	if (regionfile) {
		$.ajax({
			type: "GET",
			url: regionfile,
			data: {},
			success: function (data) {
				let html = "<option value=''>---</option>";
				//console.log(data.data);
				data.data.map((d: string[]) => {
					//   console.log(d[1]);
					const region = d[lang];
					const selected = ((selectedCity) && (d[0] == selectedCity!)) ? "selected" : "";
					html += `<option value="${d[0]}" ${selected}>${region}</option>`;
				});
				$("#drpCity").empty().append(html).select2();
			},
			dataType: "json",
		});
	}

}

$(document).on("change", "#drpCountry", function () {
	SelectedCountry = Number($(this).val());
	//console.log("SelectedCountry:" + SelectedCountry);
	let $lblcountry = $("#lblCountry");
	let countrytxt = (SelectedCountry == 3) ? $lblcountry.data("country") : $lblcountry.data("region");
	//console.log($lblcountry.data("country"));
	$lblcountry.text(countrytxt);
	initCityDropDown("", lang);
});

$(document).on("change", "#drpCity", function () {
	$("#city").val($(this).val());
});

function handlePaymentTypeSaved() {
	let url = ptmode === 0 ? '/PaymentTypes/Create' : '/PaymentTypes/Edit';
	let Id = ptmode === 1 ? PayType.Id : 0;
	PayType = {
		Id: Id,
		pmtCode: PayType.pmtCode,
		pmtName: $('#pmtName').val(),
		pmtServiceChargePercent: Number($("#pmtSCR").val()),
		pmtIsCash: $('#pmtIsCash1').is(':checked'),
		pmtIsActive: $('#pmtIsActive1').is(':checked'),
	} as IPaymentType;

	if (PayType.pmtName === '') {
		$.fancyConfirm({
			title: '',
			message: $infoblk.data("namerequiredtxt"),
			shownobtn: false,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					$('#pmtName').trigger("focus");
				}
			}
		});
	} else {
		if (ptmode === 0) {
			if (checkIfDuplicatedPayTypeName(PayType.pmtName)) {
				$.fancyConfirm({
					title: '',
					message: $infoblk.data("duplicatednamewarningtxt"),
					shownobtn: false,
					okButton: oktxt,
					noButton: canceltxt,
					callback: function (value) {
						if (value) {
							$('#pmtName').trigger("focus");
						}
					}
				});
				return false;
			}
		}
	}


	let data = { model: PayType, __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val() }
	//console.log("data:", data);
	//return;
	$.ajax({
		type: "POST",
		url: url,
		data: data,
		success: function (data) {
			if (data.msg) {
				window.location.reload();
			}
		},
		dataType: 'json'
	});
}

function GetHotLists(pageIndex) {
	let data = `PageNo=${pageIndex}`;
	data += `&keyword=${keyword}`;
	console.log("data:", data);
	/*return false;*/
	openWaitingModal();
	$.ajax({
		url: "/Api/GetHotListsAjax",
		type: "GET",
		data: data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: OnGetHotListSuccess,
		error: onAjaxFailure,
	});
}
function OnGetHotListSuccess(response) {
	keyword = "";
	closeWaitingModal();
	//console.log("response:", response);
	var model = response;
	HotLists = model.hotlists.slice(0);
	//console.log("hotlists:", HotlLists);

	if (HotLists.length > 0) {
		hotlistModal.find("#norecord").addClass("hide");
		let html = ``;
		//row.addClass("hotid pointer").attr("data-id", hotlist.Id);
		HotLists.forEach((e) => {
			html += `<tr class="hotid pointer" data-id="${e.Id}">
			<td>${e.hoName}</td>
			<td>${e.SalesPersonName}</td>
			<td>${e.hoDescription}</td>
			<td>${e.CreateTimeDisplay}</td>
			</tr>`;
		});
		hotlistModal.find("#tblhotlist tbody").append(html);

		$(".Pager").ASPSnippets_Pager({
			ActiveCssClass: "current",
			PagerCssClass: "pager",
			PageIndex: model.PageIndex,
			PageSize: model.PageSize,
			RecordCount: model.RecordCount,
		});
		openHotListModal();
	} else {
		hotlistModal.find("#tblhotlist").hide();
	}
}
$(document).on("click", "#hotlistModal .Pager .page", function () {
	PageNo = parseInt(<string>$(this).attr("page"));
	GetHotLists(PageNo);
});
$(document).on("click", "#tblHotList th a", function () {
	sortName = $(this).data("category");
	sortDirection = sortDirection == "ASC" ? "DESC" : "ASC";
	/* console.log('sortname:' + sortName + ';sortdir:' + sortDirection);*/
	PageNo = 1;
	GetHotLists(PageNo);
});

function getBalance(this: any, onhandstock: number) {
	console.log("onhandstock:" + onhandstock);
	let totalqty: number = 0;
	$target = $(this).parent("td").parent("tr");
	$target.find("td.locqty").each(function (i, e) {
		let $input = $(e).find("input");
		if ($input.hasClass("locqty")) {
			//console.log("inputval:" + $input.val());
			totalqty += Number($input.val());
		}
	});
	//console.log("qty:" + totalqty);
	let balance: number = onhandstock - totalqty;
	console.log("balance:" + balance);
	let $balance = $target.find("td:last").find(".balance");
	return { $balance, balance };
}

function initVariablesFrmInfoblk() {
	enableTax = $infoblk.data("enabletax") === "True";
	DicLocation = $infoblk.data("jsondiclocation");
	if (forwholesales || forsales)
		MyobJobList = $infoblk.data("jsonjoblist");
	//console.log("MyobJobList:", MyobJobList);
	DicBatTotalQty = $infoblk.data("jsondicbattotalqty");
	DicItemBatchQty = $infoblk.data("jsondicitembatchqty");
	DicItemBatDelQty = $infoblk.data("jsondicitembatdelqty");
	PoItemBatVQList = $infoblk.data("jsonpoitembatvqlist");
	DicItemBatSnVt = $infoblk.data("jsondicitembatsnvt");
	DicItemBatSnVtList = $infoblk.data("jsondicitembatsnvtlist");
	DicItemSnVtList = $infoblk.data("jsondicitemsnvtlist");
	DicItemVtQtyList = $infoblk.data("jsondicitemvtqtylist");
	DicItemVtDelQtyList = $infoblk.data("jsondicitemvtdelqtylist");
	DicItemOptions = $infoblk.data("jsondicitemoptions");

	DicIvInfo = $infoblk.data("jsondicivinfo");
	DicItemGroupedVariations = $infoblk.data("dicitemgroupedvariations");
	DicIvQtyList = $infoblk.data("dicivqtylist");
	DicIvDelQtyList = $infoblk.data("dicivdelqtylist");

	uploadsizelimit = Number($infoblk.data("uploadsizelimit"));
	uploadsizelimitmb = Number($infoblk.data("uploadsizelimitmb"));
	shop = $infoblk.data("shop") as string;
	UseForexAPI = $infoblk.data("useforexapi") === "True";
	approvalmode = $infoblk.data("approvalmode") == "True";
	comInfo = $infoblk.data("cominfo");

	Sales = $infoblk.data("sales");
	SalesLnList = $infoblk.data("saleslnlist");
	ItemList = $infoblk.data("itemlist");
	DicCurrencyExRate = $infoblk.data("diccurrencyexrate");
}

$(document).on("click", ".btnReload", function (e) {
	handleReload(e);
});
$(document).on("click", "#btnReload", function (e) {
	handleReload(e);
});
function handleReload(e: JQuery.ClickEvent<Document, undefined, any, any>) {
	e.preventDefault();
	let _url = getPathFromUrl(window.location.href); //remove querystring first, if any...
	let url = new URL(_url);
	url.searchParams.set("reload", "1");
	window.location.href = url.href;
}
$(document).on("click", "#btnSearch", function (e) {
	e.preventDefault();
	//console.log("sortorder:" + $("#sortorder").val());
	let sortorder = $("#sortorder").val() == "desc" ? "asc" : "desc";
	$("#sortorder").remove();
	let $sortorder = $("<input>").attr({
		type: "hidden",
		name: "SortOrder",
		value: sortorder,
	});
	//console.log("gfrmId:", gFrmId);
	//return;
	if (gFrmId)
		$(`#${gFrmId}`).append($sortorder).trigger("submit");
});

$(document).on("click", ".colheader", function () {
	let $sortcol = $("<input>").attr({
		type: "hidden",
		name: sortByName ? "SortName" : "SortCol",
		value: $(this).data("col"),
	});

	if (gFrmId)
		$(`#${gFrmId}`).append($sortcol).trigger("submit");
});


function ConfigSimpleSortingHeaders() {
	let $sortorder = $("#sortorder");

	if (sortByName) {
		let sortname = $("#sortname").val() as string;
		//console.log("sortname:" + sortname);
		$(".colheader").each(function (i, e) {
			if ($(e).data("col") as string == sortname) {
				$target = $(e);
				return false;
			}
		});
	}
	else {
		let $sortcol = $("#sortcol");
		$target = $(".colheader").eq(Number($sortcol.val()));
		//console.log('sortorder:' + $sortorder.val() + ';sortcol:' + $sortcol.val());
	}
	//console.log("sortorder:", $sortorder.val());
	let sortcls = $sortorder.val() === "desc" ? "fa fa-sort-up" : "fa fa-sort-down";
	$target.addClass(sortcls);

	$target = $(".pagination");
	$target
		.wrap('<nav aria-label="Page navigation"></nav>')
		.find("li")
		.addClass("page-item")
		.find("a")
		.addClass("page-link");

	let keyword = getParameterByName("Keyword");
	if (keyword !== null) {
		$("#txtKeyword").val(keyword);
	}
	$(".pagination li").addClass("page-item");

	if ($("#txtKeyword").length)
		$("#txtKeyword").trigger("focus");
}

function handleReserveSaved() {
	if (forCreateReserve) {
		Reserve.cusCode = reserveModal.find("#drpCustomer").val() as string;
		Reserve.riRemark = reserveModal.find("#txtRemark").val() as string;
		closeReserveModal();

		//console.log("Reserve:", Reserve);
		//console.log("ReserveLnList:", ReserveLnList);
		//return false;

		if (Reserve && ReserveLnList.length > 0) {
			$.ajax({
				type: "POST",
				url: "/Reserve/ProcessReserve",
				data: {
					__RequestVerificationToken: $(
						"input[name=__RequestVerificationToken]"
					).val(),
					Reserve,
					ReserveLnList,
				},
				success: function (data) {
					if (data) {
						$.fancyConfirm({
							title: "",
							message: data.msg,
							shownobtn: false,
							okButton: oktxt,
							noButton: notxt,
							callback: function (value) {
								if (value) {
									window.location.reload();
									window.open("/Reserve/Print", "_blank");
								}
							},
						});
					}
				},
				dataType: "json",
			});
		}
	}

	if (forEditReserve) {
		let $drp = reserveModal.find("#drpCustomer");
		Reserve.cusCode = $drp.val() as string;
		Reserve.CustomerName = $drp.find("option:selected").text();
		Reserve.riRemark = reserveModal.find("#txtRemark").val() as string;
		closeReserveModal();

		$.ajax({
			//contentType: 'application/json; charset=utf-8',
			type: "POST",
			url: "/Reserve/EditOrder",
			data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), Reserve },
			success: function (data) {
				if (data) {
					//showMsg("saveMsg", data, "warning", 2000, 2000);					
					$("#txtCustomerName").val(Reserve.CustomerName);
					$("#txtRemark").val(GetReserveRemarkDisplay(Reserve.riRemark));
				}
			},
			dataType: "json"
		});
	}
}

function GetReserveRemarkDisplay(remark: string): string {
	if (!remark) return "";
	if (remark.length > 30) remark = remark.substring(0, 25).concat("...");
	return remark;
}

$(document).on("change", ".reserve.locqty", function () {
	getRowCurrentY.call(this);
	let changeqty: number = Number($(this).val());
	//console.log("changeqty:" + changeqty);
	if (changeqty < 0) return false;

	let oldstockqty: number = Number($(this).data("oldstockqty"));
	$(this).data("oldstockqty", changeqty);
	//console.log("oldstockqty:" + oldstockqty + ";changeqty:" + changeqty);
	let diff: number = oldstockqty - changeqty;
	$(this).data("diff", diff);
	//console.log("diff:" + diff);

	let totalReservedQty: number = 0;
	if (diff > 0) {
		let itmcode: string = $(this).data("code") as string;
		let shop: string = convertNumToString($(this).data("shop"));
		let price: number = Number($tr.find("td.itemprice").find("input.itemprice").val());

		if (forCreateReserve) {
			totalReservedQty = Number($tr.find(".reservedQty").val());
			totalReservedQty += diff;
			$tr.find(".reservedQty").val(totalReservedQty);

			ReserveLn = { riCode: Reserve.riCode, itmCode: itmcode, rilSender: shop, itmSellingPrice: price, reserveQty: diff, reservedQty: diff } as IReserveLn;

			if (ReserveLnList.length == 0) ReserveLnList.push(ReserveLn);
			handleReserveLnList(itmcode, shop);
		}
		if (forEditReserve) {
			totalReservedQty = Number($tr.find(".reservedQty").data("totalreservedqty")); //MUST NOT use val()!!!
			//console.log("totalReservedQty#before adding:", totalReservedQty);
			let currentReservedQty = Number($(this).data("currentreservedqty"));
			//console.log("currentReservedQty:" + currentReservedQty);
			let newReservedQty = diff + currentReservedQty;
			//console.log("newReservedQty:", newReservedQty);
			totalReservedQty += diff;
			//console.log("totalReservedQty#after adding:", totalReservedQty);
			$tr.find(".reservedQty").data("totalreservedqty", totalReservedQty);
			$tr.find(".reservedQty").val(totalReservedQty);

			ReserveLn = { riCode: Reserve.riCode, itmCode: itmcode, rilSender: shop, itmSellingPrice: price, reservedQty: newReservedQty, reserveQty: diff } as IReserveLn;
			//console.log("ReserveLn:", ReserveLn);
			handleReserveLnList(itmcode, shop);
		}
	}
	//console.log("ReserveLnList#2:", ReserveLnList);
	function handleReserveLnList(itmcode: string, shop: string) {
		let idx = ReserveLnList.findIndex(x => { return x.itmCode == itmcode && x.rilSender == shop; });
		if (idx >= 0) {
			ReserveLnList[idx] = structuredClone(ReserveLn);
			//console.log("ReserveLnList#1:", ReserveLnList);
		} else {
			ReserveLnList.push(ReserveLn);
		}
	}
});

function handleReservePaidOut(reserveId: number) {
	window.location.href = "/POSFunc/AdvSales?reserveId=" + reserveId;
}
function initDatePickers(startDay = StartDayEnum.Today, format = "") {
	let dateformat = document.getElementById("commonfunc")!.getAttribute("data-dateformat")!.toUpperCase();

	var currentTime = new Date();
	var startDateFrom = new Date();
	var startDateTo = new Date();
	var _format = format === "" ? dateformat : format;
	//console.log("_format:", _format);

	let commonoptions = {
		singleDatePicker: true,
		showDropdowns: true,
		minYear: 1901,
		//maxYear: parseInt(moment().format('YYYY'), 10),
		locale: {
			format: _format
		},
		startDate: new Date(),
	};
	//clone options without reference
	let mindateoptions = Object.assign({}, commonoptions);
	let maxdateoptions = Object.assign({}, commonoptions);

	if (getParameterByName("strfrmdate") == null) {
		if (startDay == StartDayEnum.CurrentMonth) // First Date Of the Month
			startDateFrom = $("#DateFromTxt").val() == "" ? new Date(currentTime.getFullYear(), currentTime.getMonth(), 1) : convertStringToDate($("#DateFromTxt").val() as string);
		if (startDay == StartDayEnum.LastWeek || startDay == StartDayEnum.LastWeekToday) startDateFrom = $("#DateFromTxt").val() == "" ? new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() - 7) : convertStringToDate($("#DateFromTxt").val() as string);
		if (startDay == StartDayEnum.Today) startDateFrom = new Date();
		if (startDay == StartDayEnum.LastMonth || startDay == StartDayEnum.LastMonthToday) startDateFrom = $("#DateFromTxt").val() == "" ? new Date(currentTime.getFullYear(), currentTime.getMonth() - 1, 1) : convertStringToDate($("#DateFromTxt").val() as string);
		if (startDay == StartDayEnum.Last2Month) startDateFrom = $("#DateFromTxt").val() == "" ? new Date(currentTime.getFullYear(), currentTime.getMonth() - 2, 1) : convertStringToDate($("#DateFromTxt").val() as string);
		if (startDay == StartDayEnum.ThisYear) startDateFrom = $("#DateFromTxt").val() == "" ? new Date(currentTime.getFullYear(), 0, 1) : convertStringToDate($("#DateFromTxt").val() as string);
		if (startDay == StartDayEnum.Beginning) convertStringToDate($("#DateFromTxt").val() as string);
	} else {
		startDateFrom = convertStringToDate(getParameterByName("strfrmdate") as string);
	}

	//console.log('startdaynum:' + startDay);
	if (getParameterByName("strtodate") == null) {
		if (startDay == StartDayEnum.CurrentMonth) {
			// Last Date Of the Month
			startDateTo = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0);
		}
		if (startDay == StartDayEnum.LastWeek) {
			startDateTo = tomorrow;
		}
		if (startDay == StartDayEnum.LastWeekToday) {
			startDateTo = new Date();
		}
		if (startDay == StartDayEnum.Today) {
			startDateTo = tomorrow;
		}
		if (startDay == StartDayEnum.LastMonth || startDay == StartDayEnum.Last2Month) {
			startDateTo = $("#DateToTxt").val() == '' ? tomorrow : convertStringToDate($("#DateToTxt").val() as string);
		}
		if (startDay == StartDayEnum.LastMonthToday) {
			startDateTo = $("#DateToTxt").val() == '' ? new Date() : convertStringToDate($("#DateToTxt").val() as string);
		}
	} else {
		startDateTo = convertStringToDate(getParameterByName("strtodate") as string);
	}
	//console.log('frmdate:' + startDateFrom + ';todate:' + startDateTo);
	mindateoptions.startDate = startDateFrom;
	maxdateoptions.startDate = startDateTo;

	$('#datetimesmin').daterangepicker(mindateoptions,
		function (start, end, label) {
			minDate = new Date(start).toDateString();
		});

	$('#datetimesmax').daterangepicker(maxdateoptions,
		function (start, end, label) {
			maxDate = new Date(end).toDateString();
		});
}
function financial(x) {
	return Number(Number.parseFloat(x).toFixed(2));
}

function getFixedDigitNumber(Num: string | number, digit: number = 2) { return Number(Number(Num).toFixed(digit)); }

$(document).on("change", "#drpCurrency", function () {
	exRate = getFixedDigitNumber($(this).val());
	itotalamt = getFixedDigitNumber(Sales && (Sales.rtsFinalTotal ?? 0) / (exRate ?? 1));
	if (forsimplesales) {
		$(".totalamt").text(itotalamt);
	}
	if (forsales) {
		$("#salesamount").text(itotalamt);
	}
});

function toggleNoRecord(show: boolean) {
	if (show)
		$("#norecord").addClass("d-inline-block my-2").show();
	else $("#norecord").removeClass("d-inline-block my-2").hide();
}

//remove querystring from url
function getPathFromUrl(url: string) {
	return url.split(/[?#]/)[0];
}
function addMonths(months, date: Date = new Date()) {
	var d = date.getDate();
	date.setMonth(date.getMonth() + +months);
	if (date.getDate() != d) date.setDate(0);
	return date;
}

function confirmBarCodeClose() {
	let barcode: string = barcodeModal.find("#txtBarCode").val() as string;
	//console.log("barcode:" + barcode);
	if (forsimplesales || forsales) {
		openWaitingModal();
		$.ajax({
			type: "GET",
			url: "/Coupon/GetCouponLn",
			data: { code: barcode },
			success: function (data: ICouponLn) {
				closeWaitingModal();
				if (data) {
					CouponLn = structuredClone(data);
					if (CouponLn.cplIsRedeemed || CouponLn.cplIsVoided || CouponLn.IsExpired) {
						let msg = CouponLn.cplIsRedeemed ? couponredeemedwarning : CouponLn.cplIsVoided ? couponvoidedwarning : couponexpiredwarning;
						$.fancyConfirm({
							title: "",
							message: msg,
							shownobtn: false,
							okButton: oktxt,
							noButton: notxt,
							callback: function (value) {
								if (value) {
									$("#txtBarCode").val("").trigger("focus");
									CouponLn = {} as ICouponLn; //reset couponln
								}
							}
						});
					} else {
						closeBarCodeModal();
						if (forsimplesales) {
							togglePayment("Coupon", true);
							togglePayModeTxt();
							populateOrderSummary();
						}
						if (forsales) {
							let remainamt: number = 0;
							if (Sales!.rtsFinalTotal! > CouponLn.cpPrice) remainamt = Sales!.rtsFinalTotal! - CouponLn.cpPrice;
							$("#tblPay tbody tr").each(function (i, e) {
								if (i == 0) {
									if ($(e).find(".chkpayment").is(":checked")) $(e).find(".paymenttype").val(formatnumber(remainamt));
								} else {
									if (($(e).find(".chkpayment").data("type") as string).toLowerCase() == "coupon") $(e).find(".paymenttype").val(formatnumber(CouponLn.cpPrice));
									else $(e).find(".paymenttype").val(formatnumber(0));
								}
							});
						}
					}
				}
			},
			dataType: "json"
		});
	}
}

$(document).on("click", ".preview", function () {
	let url = (foremail || forcustomer) ? "/Email/Get" : "";
	let Id = $(this).data("id");
	$.ajax({
		type: "GET",
		url: url,
		data: { Id },
		success: function (data: IEmail) {
			if (data) {
				htmlPreviewModal.find("div").html(data.Content);
				openHtmlPreviewModal();
			}
		},
		dataType: "json"
	});
});