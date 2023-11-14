$infoblk = $("#infoblk");
SalesLns = [];
$(function () {
	forsales = true;
	setFullPage();
	initModals();

	salesType = SalesType.retail;
	batchidx = 5;
	snidx = batchidx + 1;
	vtidx = snidx + 1;

	SalesOrder = $infoblk.data("sales");
	console.log("SalesOrder:", SalesOrder);
	gTblName = "tblSales";

	cpplList = $infoblk.data("customerpointpricelevels");

	DicPayTypes = $infoblk.data("dicpaytypes");
	defaultcustomer = $infoblk.data("defaultcustomer");
	taxModel = $infoblk.data("taxmodel");
	inclusivetax = $infoblk.data("inclusivetax") == "True";
	inclusivetaxrate = $infoblk.data("inclusivetaxrate");
	enableTax = $infoblk.data("enabletax") == "True";
	DicLocation = $infoblk.data("diclocation");
	MyobJobList = $infoblk.data("joblist");

	$(".NextSalesInvoice").val(SalesOrder.rtsCode);
	$("#txtNotes").val(SalesOrder.rtsRmks);

	shop = SalesOrder.rtsSalesLoc;
	device = SalesOrder.rtsDvc;
	$("#drpLocation").val(shop);
	$("#drpDevice").val(device);

	editmode = SalesOrder.rtsUID > 0;
	if (editmode) {
		$("#txtNotes").val(SalesOrder.rtsRmks);
		$("#txtInternalNotes").val(SalesOrder.rtsInternalRmks);

		selectedCus = $infoblk.data("customer");
		//console.log("selectedCus:", selectedCus);
		selectCus();

		SalesLns = $infoblk.data("saleslnlist");
		//console.log("SalesLns:", SalesLns);
		DicItemSNs = $infoblk.data("dicitemsns");

		DicItemOptions = $infoblk.data("dicitemoptions");
		//console.log(DicItemOptions);
		DicBatTotalQty = $infoblk.data("jsondicbattotalqty");
		DicItemBatchQty = $infoblk.data("jsondicitembatchqty");
		DicItemBatDelQty = $infoblk.data("jsondicitembatdelqty");

		PoItemBatVQList = $infoblk.data("jsonpoitembatvqlist");

		DicItemBatSnVt = $infoblk.data("jsondicitembatsnvt");

		DicItemBatSnVtList = $infoblk.data("jsondicitembatsnvtlist");
		DicItemSnVtList = $infoblk.data("jsondicitemsnvtlist");

		DicItemVtQtyList = $infoblk.data("jsondicitemvtqtylist");
		DicItemVtDelQtyList = $infoblk.data("jsondicitemvtdelqtylist");
		//SimpleItemList = [];
		itemsnlist = [];
		$.each(SalesLns, function (i, e) {
			currentY = i;
			//console.log(e.Item);
			selectedItemCode = e.itmCode;
			//console.log("selectedItemCode:" + selectedItemCode);
			selectedSaleLn = structuredClone(e);
			populateItemRow();
		});

		//remove empty row:
		removeEmptyRow();

		//console.log("finaltotal:" + SalesOrder.rtsFinalTotal + ";payamt:" + SalesOrder.PayAmt);
		let depositamt = 0;
		if (SalesOrder.rtsStatus.toLowerCase() == SalesStatus.presettling.toString()) {
			depositamt = SalesOrder.PayAmt;
			itotalremainamt = SalesOrder.rtsFinalTotal! - SalesOrder.PayAmt;
		}
		if (SalesOrder.rtsStatus.toLowerCase() == SalesStatus.presettled.toString()) {
			depositamt = SalesOrder.rtsFinalTotal! - SalesOrder.PayAmt;
			itotalremainamt = SalesOrder.PayAmt!;

			$target = $(`#${gTblName} tbody tr`);
			$target.find("input").prop("disabled", true).prop("readonly", true);
			$target.find("select").prop("disabled", true).prop("readonly", true);
			$("textarea").prop("disabled", true).prop("readonly", true);
			$(".btnPayment").prop("disabled", true);
		}
		$("#txtDepositAmt").val(formatnumber(depositamt));
		$("#txtTotalRemain").val(formatnumber(itotalremainamt));

	} else {
		if (defaultcustomer !== null) {
			selectedCus = defaultcustomer;
			selectedCusCodeName = defaultcustomer.cusCode;
			selectCus();
		} else {
			$("#txtCustomerName").trigger("focus");
		}
	}
});