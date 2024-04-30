$infoblk = $("#infoblk");

function populateReserveRow() {
	if (!selectedItemCode) return false;

	$.ajax({
		type: "GET",
		url: "/Api/GetItem4Reserve",
		data: {selectedItemCode},
		success: function (data) {
			//console.log("selectedItemCode:" + selectedItemCode);
			//console.log("itemlist:", ItemList);//ok
			ItemList = data.ItemList.slice(0);
			DicCodeLocQty = data.DicCodeLocQty;
			DicCodeLocId = data.DicCodeLocId;
			//console.log("DicCodeLocQty:", DicCodeLocQty);
			//console.log("DicCodeLocId:", DicCodeLocId);
			let idx = ItemList.findIndex(x => x.itmCode.toLowerCase() == selectedItemCode.toLowerCase());
			if (idx >= 0) selectedItem = ItemList[idx];
			//console.log("selectedItem:", selectedItem);//ok
			if (selectedItem) {
				$tr = $(`#${gTblId} tbody tr`).eq(currentY);
				$tr.find("td.itemcode").find(".itemcode").val(selectedItemCode);
				$tr.find(".itemdesc").attr("title", selectedItem.NameDesc).text(handleItemDesc(selectedItem.NameDesc));
				$tr.find("td.itemprice").find(".itemprice").val(formatnumber(selectedItem.itmBaseSellingPrice ?? 0));
				$tr.find("td.itemoptions").html(selectedItem.ItemOptionsDisplay??"");
				$tr.find("td.itemvari").html(selectedItem.ItemVariDisplay ?? "");
				let stockcls = selectedItem.lstQtyAvailable >= 0 ? `text-secondary` : `text-danger`;
				$tr.find("td.onhandstock").html(`<span class="${stockcls}">${selectedItem.lstQtyAvailable}</span>`);
				//console.log("shops:", shops);
				shops.forEach((shop) => {
					let qty = 0;
					let Id: string = "";
					let disabled: boolean = false;
					if (!$.isEmptyObject(DicCodeLocQty) && selectedItemCode in DicCodeLocQty && shop in DicCodeLocQty[selectedItemCode]) qty = DicCodeLocQty[selectedItemCode][shop];
					/*console.log("qty:" + qty);*/

					if (!$.isEmptyObject(DicCodeLocId) && selectedItemCode in DicCodeLocId && shop in DicCodeLocId[selectedItemCode]) Id = DicCodeLocId[selectedItemCode][shop];
					if (qty <= 0) disabled = true;
					
					$tr.find("td.locqty").each(function (i, e) {
						$target = $(e).find("input.locqty");
						if ($target.data("shop") == shop) {							
							$target.data("id", Id).data("code", selectedItemCode).data("onhandstock", qty).data("oldstockqty", qty).data("itemid", selectedItem!.itmItemID ?? 0).data("currentreservedqty", 0).prop("disabled", disabled).attr("title", qty).val(qty);
							return false;
						}
					});					
				});

				$tr.find(".reservedQty").data("totalreservedqty",0).val(0);
			}
		},
		dataType: "json"
	});
	
	
}
$(document).on("click", "#btnAdd", function () {
	$tr = $(`#${gTblId} tbody tr`).first();
	$tr.clone().appendTo($(`#${gTblId} tbody`));
	$tr = $(`#${gTblId} tbody tr`).last();
	$tr.find(".itemprice").val(formatnumber(0));
	$tr.find(".resetable").attr("title", "").text("");
	$tr.find(".resetable.onhandstock").text(0);
	$tr.find(".locqty").removeClass("selectedshop").val(0);
	$tr.find(".reservedQty").val(0);
	$tr.find("td.itemcode").append(`<input type="text" class="form-control itemcode text-center">`);
	$tr.find(".itemcode").trigger("focus");
	currentY = $tr.index();
	//console.log("currentY:" + currentY);//ok	
	setInput4NumberOnly("number");
});

$(document).on("click", "#btnPaidOut", function () {
	handleReservePaidOut(Number($(this).data("id")));
});
$(document).on("click", "#btnEdit", function () {
	let Id = Number($(this).data("orderid"));
	Reserve = { Id:Id } as IReserve;
	openReserveModal();
});

$(document).on("click", ".save", function () {
	let msgId = $(this).data("msgid") as string;
	//console.log("ReserveLnList#save:", ReserveLnList);
	//return false;
	$.ajax({
		type: "POST",
		url: "/Reserve/EditLines",
		data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), ReserveLnList },
		success: function (data) {
			if (data) {
				showMsg(msgId, data);
			}
		},
		dataType: "json"
	});
});


$(document).on("dblclick", "#txtRemark", function () {
	getRowCurrentY.call(this);
	openTextAreaModal();
});

$(function () {	
	forEditReserve = true;
	gTblId = "tblEdit";
	setFullPage();
	triggerMenu(2, 6);
	initModals();
	/*ReserveLnList = $infoblk.data("linelist");*/
	ReserveLnList = [];
	Reserve = { riCode: $infoblk.data("code") } as IReserve;

	DicItemReservedQty = $infoblk.data("dicitemreservedqty");
	if (!$.isEmptyObject(DicItemReservedQty)) {
		selectedItemCodes = [];
		for (const [key, value] of Object.entries(DicItemReservedQty)) selectedItemCodes.push(key);
	}
	//console.log("selectedItemCodes:", selectedItemCodes);	
	setInput4NumberOnly("number");

	shops = $infoblk.data("shops");
	//console.log("shops:", shops);	
});

