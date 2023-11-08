$infoblk = $("#infoblk");
PreSalesLnList = [];
$(function () {
	forpreorder = true;
	setFullPage();
	initModals();

	salesType = SalesType.preorder;
	batchidx = 5;
	snidx = batchidx + 1;
	vtidx = snidx + 1;

	PreSales = $infoblk.data("sales");
	//console.log("PreSales:", PreSales);
	gTblName = "tblSales";

	cpplList = $infoblk.data("customerpointpricelevels");

	DicPayTypes = $infoblk.data("dicpaytypes");
	defaultcustomer = $infoblk.data("defaultcustomer");
	taxModel = $infoblk.data("taxmodel");
	inclusivetax = $infoblk.data("inclusivetax") == "True";
	inclusivetaxrate = $infoblk.data("inclusivetaxrate");
	enableTax = $infoblk.data("enabletax") == "True";
	DicLocation = $infoblk.data("diclocation");
	JobList = $infoblk.data("joblist");

	$(".NextSalesInvoice").val(PreSales.rtsCode);
	$("#txtNotes").val(PreSales.rtsRmks);

	shop = PreSales.rtsSalesLoc;
	device = PreSales.rtsDvc;
	$("#drpLocation").val(shop);
	$("#drpDevice").val(device);

	editmode = PreSales.rtsUID > 0;
	if (editmode) {
		$("#txtNotes").val(PreSales.rtsRmks);
		$("#txtInternalNotes").val(PreSales.rtsInternalRmks);
	
		selectedCus = $infoblk.data("customer");
		//console.log("selectedCus:", selectedCus);
		selectCus();

		PreSalesLnList = $infoblk.data("saleslnlist");
		//console.log("PreSalesLnList:", PreSalesLnList);
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
		$.each(PreSalesLnList, function (i, e) {
			currentY = i;
			//console.log(e.Item);
			selectedItemCode = e.itmCode;
			//console.log("selectedItemCode:" + selectedItemCode);
			selectedPreSalesLn = structuredClone(e);
			populateItemRow();
		});

		//remove empty row:
		$tr = $(`#${gTblName} tbody tr`).last();
		if ($tr.find("td").eq(1).find(".itemcode").val() === "") $tr.remove();

		//console.log("finaltotal:" + PreSales.rtsFinalTotal + ";payamt:" + PreSales.PayAmt);
		let depositamt = 0;
		if (PreSales.rtsStatus.toLowerCase() == SalesStatus.presettling.toString()) {
			depositamt = PreSales.PayAmt;			
			itotalremainamt = PreSales.rtsFinalTotal! - PreSales.PayAmt;			
		}
		if (PreSales.rtsStatus.toLowerCase() == SalesStatus.presettled.toString()) {
			depositamt = PreSales.rtsFinalTotal! - PreSales.PayAmt;			
			itotalremainamt = PreSales.PayAmt!;

			$target = $(`#${gTblName} tbody tr`);
			$target.find("input").prop("disabled", true).prop("readonly", true);
			$target.find("select").prop("disabled", true).prop("readonly", true);
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