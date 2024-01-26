$infoblk = $("#infoblk");
editmode = $("#journal_Id").val() != "";
const journalno = $("#journal_JournalNumber").val()!.toString();
const strdate = $("#strDate").val()!.toString();
const dcaccerrtxt: string = $infoblk.data("dcaccerrtxt");

$(document).on("change", ".amt", function () {
	getRowCurrentY.call(this);
	//console.log("currentY#amtchange:" + currentY);
	let amt = Number($(this).val());
	//console.log("amt:" + amt);

	let isDebit = $(this).hasClass("debit");

	if (isDebit) {
		JournalLns.forEach((x) => {
			if (x!.Seq == currentY + 1) {
				//console.log("isdebit 1");
				if (editmode) x.DebitExTaxAmount = amt;
				else if (x.DebitExTaxAmount == 0) x.DebitExTaxAmount = amt;
			}
		});
	} else {
		JournalLns.forEach((x) => {
			if (x!.Seq == currentY + 1) {
				//console.log("iscredit 1");
				if (editmode) x.CreditExTaxAmount = amt;
				else if (x.CreditExTaxAmount == 0) x.CreditExTaxAmount = amt;
			}
		});
	}
	//console.log("JournalLns#amtchange:", JournalLns);

	//don't make these three variables global ones!!!
	let totalDebit: number = 0;
	let totalCredit: number = 0;

	JournalLns.forEach((x) => {
		//console.log("x.creditamt:"+ x!.CreditExTaxAmount+";x.debitamt:"+x!.DebitExTaxAmount);
		if (x!.CreditExTaxAmount == 0) totalDebit += x!.DebitExTaxAmount!;
		if (x!.DebitExTaxAmount == 0) totalCredit += x!.CreditExTaxAmount!;
		//console.log("totaldebit:" + totalDebit + ";totalcredit:" + totalCredit);
	});

	//console.log("totaldebit:" + totalDebit + ";totalcredit:" + totalCredit);

	setAmts(totalDebit, totalCredit);
	//toggleJournalAmt(currentY, false);

	$("#btnSave").prop("disabled", totalDebit != totalCredit);
});
$(document).on("change", ".memo", function () {
	let memo = $(this).val() as string;
	currentY = $(this).parent("td").parent("tr").index();
	JournalLns.forEach((x) => {
		if (x!.Seq == (currentY + 1)) x!.AllocationMemo = memo;
	});
});
$(document).on("change", ".job", function () {
	let Id: number = Number($(this).val());
	currentY = $(this).parent("td").parent("tr").index();
	JournalLns.forEach((x) => {
		if (x!.Seq == (currentY + 1)) x!.JobID = Id;
	});
});

function setAmts(totalDebit: number, totalCredit: number) {
	$("#debitAmt").val(formatnumber(totalDebit));
	$("#creditAmt").val(formatnumber(totalCredit));
	let outOfBalance = totalDebit - totalCredit;
	let isDeficit = totalDebit > totalCredit;
	if (isDeficit) {
		$("#outOfBalance").addClass("alert-danger");
	} else {
		$("#outOfBalance").removeClass("alert-danger");
	}
	$("#outOfBalance").val(formatnumber(outOfBalance));
	return outOfBalance;
}

function fillInJournal() {
	Journal.Id = editmode ? $("#journal_Id").val() as string : "";
	Journal.JournalNumber = journalno;
	Journal.strDate = $("#strDate").val() as string;
	Journal.Memo = $("#memo").val() as string;

	if (!editmode) {
		JournalLns = [];
		$("#tblJournal tbody tr").each(function (i, e) {
			/*
			 Seq = item.Seq,
                                    AccountNumber = item.AccountNumber,
                                    DebitExTaxAmount = item.DebitExTaxAmount,
                                    CreditExTaxAmount = item.CreditExTaxAmount,
                                    JobID = item.JobID,
                                    AllocationMemo = item.AllocationMemo,
			*/
			if ($(e).find(".acno").length) {
				JournalLns.push({ Seq: $(e).index() + 1, AccountNumber: $(e).find(".acno").val(), DebitExTaxAmount: Number($(e).find(".debit").val()), CreditExTaxAmount: Number($(e).find(".credit").val()), JobID: Number($(e).find(".job").val()), AllocationMemo:$(e).find(".memo").val() } as IJournalLn);
			}			
		});
	}	
}

$(document).on("click", "#btnSave", function () {
	fillInJournal();
	// console.log("here");
	//console.log("Journal:", Journal);
	//console.log("JournalLns:", JournalLns);
	//return;
	openWaitingModal();
	$.ajax({
		//contentType: 'application/json; charset=utf-8',
		type: "POST",
		url: "/Journal/Edit",
		data: {
			__RequestVerificationToken: $(
				"input[name=__RequestVerificationToken]"
			).val(),
			model: Journal,
			JournalLns
		},
		success: function (data) {
			if (data == "") {
				window.location.href = "/Journal/Index";
			}
		},
		dataType: "json",
	});

});

function populateAccount4Journal(acno: string, acname: string) {
	//console.log("acno:" + acno + ";acname:" + acname);
	//console.log("currentY:" + currentY);
	$tr = $(`#${gTblName} tbody tr`).eq(currentY);

	setAccName($tr, acno, acname);

	JournalLns.forEach((x) => {
		if (x!.Seq == currentY + 1) x.AccountNumber = acno;
	});
}

function toggleJournalAmt(idx: number, enabled: boolean) {
	$tr = $(`#${gTblName} tbody tr`).eq(idx);
	if (enabled) {
		$tr.find("td").find(".amt").prop("readonly", !enabled);
	} else {
		let isDebit = Number($tr.find("td").eq(2).find(".amt").val()) > 0;
		if (isDebit) $tr.find("td").eq(3).find(".amt").prop("disabled", true);
		else $tr.find("td").eq(2).find(".amt").prop("disabled", true);

		if (idx % 2 == 0) {
			$tr = $(`#${gTblName} tbody tr`).eq(idx + 1);
			if (isDebit) $tr.find("td").eq(2).find(".amt").prop("disabled", true);
			else $tr.find("td").eq(3).find(".amt").prop("disabled", true);
		} else {
			$tr = $(`#${gTblName} tbody tr`).eq(idx - 1);
			if (isDebit) $tr.find("td").eq(2).find(".amt").prop("disabled", true);
			else $tr.find("td").eq(3).find(".amt").prop("disabled", true);
		}
	}

}

$(document).on("dblclick", ".memo", function () {
	openTextAreaModal();
});

function GetSetJournalLnPair() {
	//console.log("JournalLns#getset:", JournalLns);
	//console.log("currentY#getset:" + currentY);
	if (JournalLns.length > 0) {
		getJournalPair();
		//console.log("selectedJournal1==null:", selectedJournalLn1 == null);
		//console.log("selectedJournal2==null:", selectedJournalLn2 == null);
		if (selectedJournalLn1 == null && selectedJournalLn2 == null) {
			//console.log("about to setpair");
			setJournalPair();
		}
	} else {
		//console.log("about to setpair");
		setJournalPair();
	}
}

function getJournalPair() {
	if (JournalLns.length === 0) return false;
	//console.log("JournalLns#getpair:", JournalLns);
	JournalLns.forEach((x) => {
		if (currentY % 2 == 0) selectedJournalLn1 = structuredClone(x);
		//selectedJournalLn1 = x;
		if (currentY % 2 == 1) selectedJournalLn2 = structuredClone(x);
		//selectedJournalLn2 = x;		
	});
}
function setJournalPair() {
	initJournalLnPair(journalno);
	JournalLns.push(selectedJournalLn1!);
	JournalLns.push(selectedJournalLn2!);
}


function addJournalRow() {
	let html = "";
	for (let i = 0; i <= 1; i++) {

		html += `<tr>`;

		html += `<td>${populateDrpAccount()}</td>`;

		html += `<td><input type="text" class="acname form-control" readonly></td><td><input type="number" class="form-control debit amt" readonly></td><td><input type="number" class="form-control credit amt" readonly></td><td><select class="job flex form-control">${setJobListOptions(0)}</select></td><td><input type="text" class="memo form-control"></td>`;

		html += "</tr>";
	}

	$(`#${gTblName} tbody`).append(html);
}

$(document).on("dblclick", ".acno", function () {
	currentY = $(this).parent("td").parent("tr").index();
	//console.log("currentY:" + currentY);

	let accno = $(this).val();

	for (const [key, value] of Object.entries(DicAcAccounts)) {
		//console.log(`${key}: ${value}`);
		value.forEach((x: IAccount) => {
			//console.log(x.AccountClassificationID + ":" + x.AccountNumber);
			if (x.AccountNumber == accno) AcClfID = x.AccountClassificationID;
		});
	}
	//console.log("AcClfID:" + AcClfID);	
	$tr = $(`#${gTblName} tbody tr`).eq(currentY);
	let $td = $tr.find("td").first();
	$td.find(".acno").remove();
	$td.html(populateDrpAccount());
	$td.find(".drpAccount").trigger("change");
});

$(document).on("click", "#btnAdd", function () {
	if (JournalLns.length === 0) return false;
	addMode = true;
	addJournalRow();
	currentY = $(`#${gTblName} tbody tr`).length - 2;
	//console.log("currentY#btnadd:" + currentY);
	selectedJournalLn1 = null;
	selectedJournalLn2 = null;
	setJournalPair();
	addMode = false;
});
$(function () {
	forjournal = true;
	setFullPage();
	gTblName = "tblJournal";
	initModals();
	initDatePicker("strDate");

	records_per_page = 10;

	MyobJobList = $infoblk.data("joblist");

	DicAcAccounts = $infoblk.data("dicacaccounts");

	Journal = {} as IJournal;
	if (editmode) {
		fillInJournal();
		JournalLns = $infoblk.data("journallnlist");
		//console.log(JournalLns);
		for (let i = 0; i < (JournalLns.length / 2); i++) {
			addJournalRow();
		}

		let totalDebit = 0;
		let totalCredit = 0;
		JournalLns.forEach((x, i) => {
			currentY = i;
			$tr = $(`#${gTblName} tbody tr`).eq(currentY);
			setAccName($tr, x.AccountNumber, x.AccountName);
			let idx = 2;
			$tr.find("td").eq(idx).find(".amt").prop("readonly", (x.DebitExTaxAmount!) == 0).val(formatnumber(x.DebitExTaxAmount!));
			totalDebit += x.DebitExTaxAmount!;
			idx++;
			$tr.find("td").eq(idx).find(".amt").prop("readonly", (x.CreditExTaxAmount!) == 0).val(formatnumber(x.CreditExTaxAmount!));
			totalCredit += x.CreditExTaxAmount!;
			idx++;
			if (x.JobID != null)
				$tr.find("td").eq(idx).find(".job").val(x.JobID!);
			idx++;
			$tr.find("td").eq(idx).find(".memo").val(x.AllocationMemo ?? "");
		});

		setAmts(totalDebit, totalCredit);

	} else {
		JournalLns = [];
		addJournalRow();
	}
});
