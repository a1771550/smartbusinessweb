$infoblk = $("#infoblk");

enablebuysellunits = $infoblk.data("enablebuysellunits") == "True";

$(document).on("change", "input.locqty", function () {
	getRowCurrentY.call(this);	

	let originalqty: number = Number($(this).data("oldval"));
	let changeqty: number = Number($(this).val());
	$(this).data("oldval", changeqty);
	//console.log("originalqty:" + originalqty + ";changeqty:" + changeqty);
	let diff: number = originalqty - changeqty;	
	//console.log("diff:" + diff);
	if (diff > 0) {
		let itmcode: string = $(this).data("code") as string;
		let shop: string = convertVarNumToString($(this).data("shop"));
		let price: number = Number($tr.find("td.itemprice").find("input.itemprice").val());

		var result = ReserveLnList.filter(function (v, i) {
			return v.itmCode == itmcode && v.rilSender == shop;
		});

		let ReserveLn = {} as IReserveLn;
		if (result.length == 0) {
			ReserveLn.itmCode = itmcode;			
			ReserveLn.rilSender = shop;
		} else {
			ReserveLn = structuredClone(result[0]);
		}		
		ReserveLn.itmSellingPrice = price;
		ReserveLn.rilQty = diff;		

		$tr.find(".rilqty").val(diff);

		if (result.length == 0) {
			ReserveLnList.push(ReserveLn);
		} else {
			$.each(ReserveLnList, function (i, e) {
				if (e.itmCode == itmcode && e.rilSender == shop) {
					e = structuredClone(ReserveLn);
					return false;
				}
			});
		}
	}
});


$(document).on("click", "#btnReserve", function () {
	let qty = 0;

	$(`#${gTblId} tbody tr`).each(function (i, e) {
		qty += Number($(e).find(".rilqty").val());
	});
	//console.log("qty:" + qty);

	if (qty === 0) {
		$.fancyConfirm({
			title: "",
			message: $infoblk.data("reserveitemqtyrequired"),
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$(`${gTblId} tbody tr`).first().find(".locqty").first().trigger("focus");
				}
			}
		});
	} else {
		openReserveModal();
	}

});


$(document).on("dblclick", ".itemoption.locqty", function () {
	openWaitingModal();
	window.location.href = "/Reserve/Reserve?hasItemOption=1&hasIvOnly=0&itemId=" + $(this).data("itemid") + "&location=" + $(this).data("shop") + "&qty=" + $(this).val() + "&stcode=" + $("#stCode").text();
});
$(document).on("dblclick", ".vari.locqty", function () {
	openWaitingModal();
	window.location.href = "/Reserve/Reserve?hasItemOption=0&hasIvOnly=1&itemId=" + $(this).data("itemid") + "&location=" + $(this).data("shop") + "&qty=" + $(this).val() + "&stcode=" + $("#stCode").text();
});

$(function () {
	setFullPage();
	triggerMenu(2, 5);
	initModals();
	forCreateReserve = true;
	gTblId = "tblReserve";
	gFrmId = "frmReserve";
	ReserveCode = <string>$("#riCode").text();
	shops = $infoblk.data("shops") ? (<string>$infoblk.data("shops")).split(",") : [];
	sortByName = true;
	ConfigSimpleSortingHeaders();

	DicIDItemOptions = $infoblk.data("jsondiciditemoptions");

	setInput4NumberOnly("number");	
	
});
