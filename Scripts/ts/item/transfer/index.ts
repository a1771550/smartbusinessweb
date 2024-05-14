$infoblk = $("#infoblk");

enablebuysellunits = $infoblk.data("enablebuysellunits") == "True";

$(document).on("click", "#btnTransfer", function () {
	$target = $("#tblTransfer tr");
	let outofbalancefound: boolean = false;
	$target.each(function (i, e) {
		if ($(e).find("td:last").find(".balance").hasClass("outofbalance")) {
			outofbalancefound = true;
			return false;
		}
	});
	//   console.log("outofbalancefound:", outofbalancefound);
	if (outofbalancefound) {
		$.fancyConfirm({
			title: "",
			message: $infoblk.data("outofbalancewarningtxt"),
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$(".outofbalance").addClass("glowing-border").addClass("focus");
				}
			},
		});
	} else {
		$target = $("#tblTransfer tr:gt(0)");
		$target.each(function (i, e) {
			$(e)
				.find("td:gt(3)")
				.each(function (k, v) {
					let $input = $(v).find("input");
					//console.log('has class locqty?', $input.hasClass('locqty'));
					if ($input.hasClass("locqty")) {
						let jsstock: IJsStock = initJsStock();
						let Id: string = $input.data("id") as string;
						let itmCode: string = $input.data("code") as string;
						//console.log('id:' + Id);
						//if (Id > 0) {
						jsstock.Id = Id;
						let shop: any = $input.data("shop");
						if (!isNaN(shop)) {
							shop = Number(shop).toString();
						}
						//   console.log("shop:" + shop);
						jsstock.LocCode = shop;
						jsstock.itmCode = itmCode;
						jsstock.Qty = Number($input.val());
						//   console.log("qty:" + jsstock.Qty);
						JsStockList.push(jsstock);
						//}
					}
				});
		});
		console.log("JsStockList:", JsStockList);
		console.log("transferlist:", TransferList);
		//return false;

		if (JsStockList.length > 0 && TransferList.length > 0) {
			$.ajax({
				type: "POST",
				url: "/Transfer/ProcessTransfer",
				data: {
					__RequestVerificationToken: $(
						"input[name=__RequestVerificationToken]"
					).val(),
					JsStockList,
					TransferList,
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
									window.open("/Transfer/Print", "_blank");
								}
							},
						});
					}
				},
				dataType: "json",
			});
		}
	}
});

$(document).on("change", "input.locqty", function () {
	let itmcode: string = $(this).data("code") as string;
	let shop: string = convertNumToString($(this).data("shop"));
	//console.log('itemcode:' + itmcode + ';shop:' + shop);
	let originalqty: number = Number($(this).data("oldval"));
	let changeqty: number = Number($(this).val());
	$(this).data("oldval", changeqty);
	//console.log("originalqty:" + originalqty + ";changeqty:" + changeqty);
	let diff: number = changeqty - originalqty;

	stocktransfer = initStockTransfer();
	stocktransfer.itmCode = itmcode;
	stocktransfer.stShop = shop;
	stocktransfer.stReceiver = diff > 0 ? shop : "";
	stocktransfer.stSender = diff > 0 ? "" : shop;

	if (diff > 0) {
		stocktransfer.inQty = diff;
		stocktransfer.outQty = 0;
	} else {
		stocktransfer.inQty = 0;
		stocktransfer.outQty = -1 * diff;
	}

	let onhandstock: number = Number($(this).data("onhandstock"));
	console.log("onhandstock:" + onhandstock);
	let {
		$balance,
		balance,
	}: { $balance: JQuery<HTMLElement>; balance: number } = getBalance.call(
		this,
		onhandstock
	);
	$balance.val(balance);
	if (balance < 0) {
		$balance.removeClass("okbalance").addClass("outofbalance");
	} else {
		$balance.removeClass("outofbalance").addClass("okbalance");
	}

	if (TransferList.length > 0) {
		let idx = TransferList.findIndex(x => { return x.itmCode == itmcode && x.stShop == shop; });
		if (idx >= 0) TransferList[idx] = structuredClone(stocktransfer);
		else TransferList.push(stocktransfer);
	} else {
		TransferList.push(stocktransfer);
	}
});

$(document).on("dblclick", ".itemoption.locqty", function () {
	openWaitingModal();
	window.location.href = "/Transfer/Transfer?hasItemOption=1&hasIvOnly=0&itemId=" + $(this).data("itemid") + "&location=" + $(this).data("shop") + "&qty=" + $(this).val() + "&stcode=" + $("#stCode").text();
});
$(document).on("dblclick", ".vari.locqty", function () {
	openWaitingModal();
	window.location.href = "/Transfer/Transfer?hasItemOption=0&hasIvOnly=1&itemId=" + $(this).data("itemid") + "&location=" + $(this).data("shop") + "&qty=" + $(this).val() + "&stcode=" + $("#stCode").text();
});
$(function () {
	setFullPage();
	triggerMenu(2, 2);
	initModals();
	fortransfer = true;
	gTblId = "tblTransfer";
	gFrmId = "frmTransfer";
	stockTransferCode = <string>$("#stCode").text();
	shops = $infoblk.data("shops") ? (<string>$infoblk.data("shops")).split(",") : [];

	sortByName = true;
	ConfigSimpleSortingHeaders();

	DicIDItemOptions = $infoblk.data("jsondiciditemoptions");
	setInput4NumberOnly("number");
});
