$infoblk = $("#infoblk");

$(document).on("change", ".counted", function () {
	let counted: number = $(this).val() as number;
	$target = $(this).parent("td").parent("tr");
	let inqty: number = Number($target.find("td").eq(5).find(".inqty").text());
	let diff: number = counted - inqty;
	let $variance = $target.find("td").eq(7).find(".variance");	
	if (diff >= 0) {
		$variance.removeClass("outofbalance").addClass("okbalance");
	} else {
		$variance.removeClass("okbalance").addClass("outofbalance");
	}	
	$variance.val(diff);
});

$(document).on("click", ".save", function () {
	fillInStockTransfer(this);
	console.log(stocktransfer);
	//return false;
	$.ajax({
		type: "POST",
		url: "/Transfer/Edit",
		data: { "__RequestVerificationToken": $("input[name=__RequestVerificationToken]").val(), stocktransfer },
		success: function (data) {
			if (data) {
				$.fancyConfirm({
					title: "",
					message: data,
					shownobtn: false,
					okButton: oktxt,
					noButton: notxt,
					callback: function (value) {
						if (value) {							
							window.location.href = "/Transfer/Index";
						}
					}
				});	
            }
		},
		dataType: "json"
	});
});

$(document).on("change", ".signup", function () {
	let val: number = $(this).is(":checked") ? 1 : 0;
	$(this).val(val);
});

$(document).on("dblclick", ".remark", function () {	
	currentY = $(this).parent("td").parent("tr").data("idx");
	openTextAreaModal();
});

$(document).on("click", "#btnPrint", function () {
    window.open("/Transfer/PrintByCode?code=" + $(this).data("code"), "_blank");
})
function fillInStockTransfer(ele) {
	$target = $(ele).parent("td").parent("tr");
	let Id: number = <number>$target.data("id");
	stocktransfer = initStockTransfer();
	stocktransfer.Id = Id;
	stocktransfer.stSignedUp_Sender = $target.find("td:first").find(".signedbyshipper").is(":checked");
	stocktransfer.stCounted = Number($target.find("td").eq(6).find(".counted").val());
	stocktransfer.stVariance = Number($target.find("td").eq(7).find(".variance").val());
	stocktransfer.stSignedUp_Receiver = $target.find("td").eq(8).find(".signedbyreceiver").is(":checked");
	stocktransfer.stRemark = $target.find("td").eq(9).find(".remark").data("remark") as string;
	stocktransfer.stChecked = true;
}
$(function () {    
	stockTransferEditMode = true;
	gFrmId = "StockTransfer";
	gTblId = "tblTransferEdit";
	setFullPage();
	triggerMenuByCls("menuitem", 3);
    initModals();
});
