$infoblk = $("#infoblk");

enablebuysellunits = $infoblk.data("enablebuysellunits") == "True";

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
	Reserve = {riCode:ReserveCode} as IReserve;
	shops = $infoblk.data("shops") ? (<string>$infoblk.data("shops")).split(",") : [];
	sortByName = true;
	ConfigSimpleSortingHeaders();

	DicIDItemOptions = $infoblk.data("jsondiciditemoptions");

	setInput4NumberOnly("number");	
	
});
