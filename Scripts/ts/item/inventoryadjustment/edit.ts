$infoblk = $("#infoblk");

function fillInIA() {
	IA.Id = Number($("#Id").val());
	IA.JournalNumber = $("#IA_JournalNumber").val() as string;
	IA.JsJournalDate = $("#strDate").val() as string;
	IA.Memo = $("#memo").val() as string;
}
function UpdateIA() {

	fillInIA();

	var IALs: IIAL[] = fillInIALs();

	if (IALs.length === 0) {
		$.fancyConfirm({
			title: "",
			message: datanotenough4submittxt,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$(`#${gTblId} tbody tr`).last().find(".itemcode").trigger("focus");
				}
			}
		});
		return false;
	}

	IA.IALs = structuredClone(IALs);
}

$(document).on("click", "#btnSave", function () {
	UpdateIA();
	let data = { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), IA };
	console.log("data:", data);
	//return;
	openWaitingModal();
	$.ajax({
		//contentType: 'application/json; charset=utf-8',
		type: "POST",
		url: "/InventoryAdjustment/Edit",
		data: data,
		success: function (data) {
			closeWaitingModal();
			if (data) window.location.href = "/InventoryAdjustment/Index";
		},
		dataType: "json"
	});
});
$(document).on("dblclick", ".memo", function () {
	getRowCurrentY.call(this);
	openTextAreaModal(allocationmemotxt);
});
$(document).on("change", ".memo", function () {
	getRowCurrentY.call(this);
	let memo = $(this).val() as string;
	IALs.forEach((x) => {
		if (x!.Seq == (currentY + 1)) x!.Memo = memo;
	});
});
$(document).on("change", ".job", function () {
	getRowCurrentY.call(this);
	let Id: number = Number($(this).val());
	IALs.forEach((x) => {
		if (x!.Seq == (currentY + 1)) x!.JobID = Id;
	});
});

function fillInIALs() {
	var IALs: IIAL[] = [];
	$(`#${gTblId} tbody tr`).each(function (i, e) {
		let itemcode = $(e).find(".itemcode").val() as string;
		let strqty = $(e).find(".qty").val();
		let qty = Number(strqty);
		let strcost = $(e).find(".unitcost").val();
		let cost = Number(strcost);
		if (itemcode && strqty && strcost) {
			let $memo = $(e).find(".memo");
			let Id = editmode ? Number($(e).data("id")) : 0;
			IALs.push({
				Id: Id,
				Seq: $(e).index()+1,
				itmCode: itemcode,
				Qty: qty,
				UnitCost: cost,
				lstStockLoc: $(e).find(".location").val() as string,
				Amt: Number($(e).find(".amt").val()),
				AccountNumber: $(e).find(".acno").val() as string,
				JobID: Number($(e).find(".job").val()),
				Memo: $memo.val() === "..." ? $memo.data("remark") : $memo.val() as string
			} as IIAL);
		}
	});
	return IALs;
}

function addIALRow() {
	//console.log("addialrow called");
	if (!shop) shop = $appInfo.data("shop");
	let html = `<tr>
							<td><input type="text" class="form-control itemcode" /></td>
							<td><input type="text" class="form-control itemdesc" /></td>
							<td><select class="location form-control flex text-center">${setLocationListOptions(shop)}</select></td>
							<td class="text-right"><input type="text" class="form-control qty text-right" /></td>
							<td class="text-right"><input type="text" class="form-control unitcost text-right" /></td>
							<td class="text-right"><input type="text" class="form-control amt text-right" readonly /></td>						
							<td><input type="text" class="form-control acno" readonly /></td>
							<td><select class="job flex form-control">${setJobListOptions(0)}</select></td>
							<td><input type="text" class="form-control memo" /></td>
						</tr>`;


	$(`#${gTblId} tbody`).append(html).find("tr").last().find(".itemcode").trigger("focus");

	setInputs4NumberOnly(["qty","unitcost","amt"]);
}

function populateAccount4IA(acno: string, acname: string) {
	$tr = $(`#${gTblId} tbody tr`).eq(currentY);

	setAccName($tr, acno, acname);

	if (IALs.length > 0)
		IALs.forEach((x) => {
			if (x!.Seq == currentY + 1) x.AccountNumber = acno;
		});
}
$(document).on("click", "#btnAdd", function () {
	if (IALs.length === 0) return false;
	getRowCurrentY.call(this);
	addIALRow();
});
$(function () {
	setFullPage();
	initModals();
	forIA = true;
	gTblId = "tblIAL";

	MyobJobList = $infoblk.data("joblist");
	DicAcAccounts = $infoblk.data("dicacaccounts");
	DicLocation = $infoblk.data("diclocation");

	triggerMenu(2, 4);

	editmode = $infoblk.data("edit") === "True";
	IA = $infoblk.data("ia");
	
	var date = IA.JournalDateDisplay ? new Date(IA.JournalDateDisplay) : new Date();
	//console.log("datedisplay:" + IA.JournalDateDisplay);
	//console.log("date:", date);
	initDatePicker("strDate", date);

	if (editmode) {
		IALs = $infoblk.data("ials");
		//console.log(IALs);
	} else {
		addIALRow();
		currentY = 0;
		seq = currentY + 1;
	}
});


