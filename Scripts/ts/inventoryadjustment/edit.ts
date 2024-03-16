$infoblk = $("#infoblk");

function fillInIA() {
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
					$(`#${gTblName} tbody tr`).last().find(".itemcode").trigger("focus");
				}
			}
		});	
		return false;
	}

	IA.IALs = structuredClone(IALs);
}

$(document).on("click", "#btnSave", function () {
	UpdateIA();
	let data = { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(),IA };
	console.log("data:", data);
	return;
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
    $(`#${gTblName} tbody tr`).each(function(i, e) {
        let itemcode = $(e).find(".itemcode").val() as string;
        let qty = Number($(e).find(".qty").val());
        let cost = Number($(e).find(".unitcost").val());
        if (itemcode && qty > 0 && cost > 0) {
            let ial = initIAL();
            ial.itmCode = itemcode;
            ial.Qty = qty;
            ial.UnitCost = cost;
            ial.lstStockLoc = $(e).find(".location").val() as string;
            ial.Amt = Number($(e).find(".amt").val());
            ial.AccountNumber = $(e).find(".acno").val() as string;
            ial.JobID = Number($(e).find(".job").val());
            ial.Memo = $(e).find(".memo").val() === "..." ? $(e).find(".memo").data("memo") : $(e).find(".memo").val() as string;
            IALs.push(ial);
        }
    });
    return IALs;
}

function addIALRow() {
	let html = `<tr>
							<td><input type="text" class="form-control itemcode" /></td>
							<td><input type="text" class="form-control itemdesc" /></td>
							<td><select class="location flex text-center">${setLocationListOptions(shop) }</select></td>
							<td class="text-right"><input type="number" class="form-control qty" /></td>
							<td class="text-right"><input type="number" class="form-control unitcost" /></td>
							<td class="text-right"><input type="number" class="form-control amt" /></td>						
							<td><input type="text" class="form-control acno" readonly /></td>
							<td><select class="job flex form-control">${setJobListOptions(0)}</select></td>
							<td><input type="text" class="form-control memo" /></td>
						</tr>`;


	$(`#${gTblName} tbody`).append(html).find("tr").last().find(".itemcode").trigger("focus");

	SelectedIAL = initIAL();
	IALs.push(SelectedIAL);
}

function initIAL(): IIAL {
	var ial = {} as IIAL;
	ial.JounralNumber = IA.JournalNumber;
	ial.Seq = $(`#${gTblName} tbody tr`).index()+1;
	return ial;
}
function populateAccount4IA(acno: string, acname: string) {	
	$tr = $(`#${gTblName} tbody tr`).eq(currentY);

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
	gTblName = "tblIAL";
	

	MyobJobList = $infoblk.data("joblist");
	DicAcAccounts = $infoblk.data("dicacaccounts");
	DicLocation = $infoblk.data("diclocation");

	triggerMenu(2,4);

	editmode = $infoblk.data("edit") === "True";
	IA = $infoblk.data("ia");
	//todo:
	var date = new Date(IA.JsJournalDate);
	initDatePicker("strDate", date);

	if (!editmode) {
		addIALRow();
		seq = currentY + 1;
		IALs.push({ Seq: seq } as IIAL);
	}
});


