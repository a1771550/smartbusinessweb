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
			//todo:
			let idx = ItemList.findIndex(x => x.itmCode.toLowerCase() == selectedItemCode.toLowerCase());
			if (idx >= 0) selectedItem = ItemList[idx];
			//console.log("selectedItem:", selectedItem);//ok
			if (selectedItem) {
				$tr = $(`#${gTblId} tbody tr`).eq(currentY);
				$tr.find("td.itemcode").find(".itemcode").val(selectedItemCode);
				$tr.find(".itemdesc").attr("title", selectedItem.NameDesc).text(handleItemDesc(selectedItem.NameDesc));
				$tr.find("td.itemprice").find(".itemprice").val(formatnumber(selectedItem.itmBaseSellingPrice ?? 0));
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
	$tr.find(".rilqty").val(0);
	$tr.find("td.itemcode").append(`<input type="text" class="form-control itemcode text-center">`);
	$tr.find(".itemcode").trigger("focus");
	currentY = $tr.index();
	//console.log("currentY:" + currentY);//ok	
	setInput4NumberOnly("number");
});

$(document).on("click", "#btnPaidOut", function () {
	//todo:
});
$(document).on("click", "#btnEdit", function () {
	let Id = Number($(this).data("orderid"));
	Reserve = { Id:Id } as IReserve;
	openReserveModal();
});

$(document).on("click", ".save", function () {
	let msgId = $(this).data("msgid") as string;
	console.log("ReserveLnList#save:", ReserveLnList);
	return false;
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
	ReserveLnList = $infoblk.data("linelist");
	//console.log("ReserveLnList#load:", ReserveLnList);
	Reserve = { riCode: ReserveLnList[0].riCode } as IReserve;
	//DicLocCodeResQty = $infoblk.data("diccodelocresqty");
	//console.log("DicLocCodeResQty:", DicLocCodeResQty);
	setInput4NumberOnly("number");
});

