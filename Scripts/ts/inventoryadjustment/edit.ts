$infoblk = $("#infoblk");

$(document).on("dblclick", ".memo", function () {
	getRowCurrentY.call(this);	
	openTextAreaModal(allocationmemotxt);
});
$(document).on("change", ".amt", function () {
	getRowCurrentY.call(this);	
	let amt = Number($(this).val());

	//todo:
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

function addIALRow() {
	let html = `<tr>
							<td><input type="text" class="form-control itemcode" /></td>
							<td><input type="text" class="form-control itemname" /></td>
							<td class="text-right"><input type="number" class="form-control ialqty" /></td>
							<td class="text-right"><input type="number" class="form-control unitcost" /></td>
							<td class="text-right"><input type="number" class="form-control amt" /></td>
							<td>${populateDrpAccount()}</td>
							<td><input type="text" class="form-control acname" /></td>
							<td><select class="job flex form-control">${setJobListOptions(0)}</select></td>
							<td><input type="text" class="form-control memo" /></td>
						</tr>`;


	$(`#${gTblName} tbody`).append(html);
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
	IALs.push({ Seq: (currentY + 1) } as IIAL);
});
$(function () {
	setFullPage();
	initModals();
	forIA = true;
	gTblName = "tblIAL";
	initDatePicker("strDate");

	MyobJobList = $infoblk.data("joblist");
	DicAcAccounts = $infoblk.data("dicacaccounts");

	triggerMenu(2,4);

	editmode = $infoblk.data("edit") === "True";

	IA = $infoblk.data("ia");

	if (!editmode) {
		addIALRow();
		seq = currentY + 1;
		IALs.push({ Seq: seq } as IIAL);
		//console.log("IALs:", IALs);
	}

	$(`#${gTblName} tbody tr`).last().find(".ialitemcode").trigger("focus");

	
});


