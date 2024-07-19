$infoblk = $("#infoblk");
editmode = $("#journal_Id").val() != "";
const journalno = $("#journal_JournalNumber").val()!.toString();
const strdate = $("#strDate").val()!.toString();
const dcaccerrtxt: string = $infoblk.data("dcaccerrtxt");

$(document).on("change", ".amt", function () {
	getRowCurrentY.call(this);
	console.log("currentY:" + currentY);

	let amt = Number($(this).val());	
	console.log("amt:", amt);

	if (amt) {
		//don't make these three variables global ones!!!
		let totalDebit: number = 0;
		let totalCredit: number = 0;

		if ($(this).hasClass("debit")) { totalDebit += amt; $tr.find(".credit").prop("readonly", true); }
		if ($(this).hasClass("credit")) { totalCredit += amt; $tr.find(".debit").prop("readonly", true); }

		console.log("totaldebit#0:" + totalDebit + ";totalcredit#0:" + totalCredit);

		$(`#${gTblId} tbody tr`).each(function () {
			if ($(this).index() != currentY) {
				let $debit = $(this).find(".debit");
				let $credit = $(this).find(".credit");
				totalDebit += Number($debit.val()??0);
				totalCredit += Number($credit.val()??0);
			}
		});

		console.log("totaldebit#1:" + totalDebit + ";totalcredit#1:" + totalCredit);

		setAmtsDisplay(totalDebit, totalCredit);

		$("#btnSave").prop("disabled", totalDebit != totalCredit);
	} else {
		if ($(this).hasClass("debit")) { $tr.find(".credit").prop("readonly", false); }		
		if ($(this).hasClass("credit")) { $tr.find(".debit").prop("readonly", false); }
		$(this).val(formatzero);
	}
	
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

function setAmtsDisplay(totalDebit: number, totalCredit: number) {
	$("#debitAmt").val(formatnumber(totalDebit));
	$("#creditAmt").val(formatnumber(totalCredit));
	let outOfBalance = totalCredit - totalDebit;		
	if (outOfBalance == 0) {
		$("#outOfBalance").removeClass("alert-danger");		
	} else {
		$("#outOfBalance").addClass("alert-danger");
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
		$(`#${gTblId} tbody tr`).each(function (i, e) {
			/*
			 Seq = item.Seq,
									AccountNumber = item.AccountNumber,
									DebitExTaxAmount = item.DebitExTaxAmount,
									CreditExTaxAmount = item.CreditExTaxAmount,
									JobID = item.JobID,
									AllocationMemo = item.AllocationMemo,
			*/
			if ($(e).find(".acno").length) {
				JournalLns.push({ Seq: $(e).index() + 1, AccountNumber: $(e).find(".acno").val(), DebitExTaxAmount: Number($(e).find(".debit").val()), CreditExTaxAmount: Number($(e).find(".credit").val()), JobID: Number($(e).find(".job").val()), AllocationMemo: $(e).find(".memo").val() } as IJournalLn);
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
	$tr = $(`#${gTblId} tbody tr`).eq(currentY);

	setAccName($tr, acno, acname);

	JournalLns.forEach((x) => {
		if (x!.Seq == currentY + 1) x.AccountNumber = acno;
	});
}

function toggleJournalAmt(idx: number, enabled: boolean) {
	$tr = $(`#${gTblId} tbody tr`).eq(idx);
	if (enabled) {
		$tr.find("td").find(".amt").prop("readonly", !enabled);
	} else {
		let isDebit = Number($tr.find("td").eq(2).find(".amt").val()) > 0;
		if (isDebit) $tr.find("td").eq(3).find(".amt").prop("disabled", true);
		else $tr.find("td").eq(2).find(".amt").prop("disabled", true);

		if (idx % 2 == 0) {
			$tr = $(`#${gTblId} tbody tr`).eq(idx + 1);
			if (isDebit) $tr.find("td").eq(2).find(".amt").prop("disabled", true);
			else $tr.find("td").eq(3).find(".amt").prop("disabled", true);
		} else {
			$tr = $(`#${gTblId} tbody tr`).eq(idx - 1);
			if (isDebit) $tr.find("td").eq(2).find(".amt").prop("disabled", true);
			else $tr.find("td").eq(3).find(".amt").prop("disabled", true);
		}
	}

}

$(document).on("dblclick", ".memo", function () {
	getRowCurrentY.call(this);
	openTextAreaModal(allocationmemotxt);
});

function GetSetJournalLn() {
	//console.log("JournalLns#getset:", JournalLns);
	//console.log("currentY#getset:" + currentY);
	if (JournalLns.length > 0) {
		getJournalLn();
		if (selectedJournalLn == null) {
			handleJournalLnList();
		}
	} else {
		handleJournalLnList();
	}
}

function getJournalLn() {
	if (JournalLns.length === 0) return false;
	JournalLns.forEach((x) => {
		if (x.Seq == (currentY + 1))
			selectedJournalLn = structuredClone(x);
	});
}
function handleJournalLnList() {
	initJournalLn(journalno);
	JournalLns.push(selectedJournalLn!);
}
function addJournalRow() {
		let html = "";
	html += `<tr>`;
	html += `<td>${populateDrpAccount()}</td>`;
	html += `<td><input type="text" class="acname form-control" readonly></td><td class="text-right"><input type="text" class="form-control debit amt number text-right" value="${formatzero}" readonly></td><td class="text-right"><input type="text" class="form-control credit amt number text-right" value="${formatzero}" readonly></td><td><select class="job flex form-control">${setJobListOptions(0)}</select></td><td><input type="text" class="memo form-control"></td>`;
	html += "</tr>";
	$(`#${gTblId} tbody`).append(html);

	setInput4NumberOnly("number");
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
	$tr = $(`#${gTblId} tbody tr`).eq(currentY);
	let $td = $tr.find("td").first();
	$td.find(".acno").remove();
	$td.html(populateDrpAccount());
	$td.find(".drpAccount").trigger("change");
});

$(document).on("click", "#btnAdd", function () {
	addMode = true;
	addJournalRow();
	currentY = $(`#${gTblId} tbody tr`).index();
	selectedJournalLn = null;
	handleJournalLnList();
	addMode = false;
});

$(function () {
	forjournal = true;
	setFullPage();
	gTblId = "tblJournal";
	initModals();
	triggerMenuByCls("menuabssreports", 0);

	initDatePicker("strDate");

	records_per_page = 10;

	MyobJobList = $infoblk.data("joblist");

	DicAcAccounts = $infoblk.data("dicacaccounts");

	Journal = {} as IJournal;
	if (editmode) {
		fillInJournal();
		JournalLns = $infoblk.data("journallnlist");
		//console.log(JournalLns);	

		let totalDebit = 0;
		let totalCredit = 0;
		JournalLns.forEach((x, i) => {
			addJournalRow();			
			$tr = $(`#${gTblId} tbody tr`).eq(i);
			setAccName($tr, x.AccountNumber, x.AccountName);
			
			$tr.find(".debit").prop("readonly", (x.DebitExTaxAmount!) == 0).val(formatnumber(x.DebitExTaxAmount!));
			totalDebit += x.DebitExTaxAmount!;
			
			$tr.find(".credit").prop("readonly", (x.CreditExTaxAmount!) == 0).val(formatnumber(x.CreditExTaxAmount!));
			totalCredit += x.CreditExTaxAmount!;
		
			if (x.JobID != null)
				$tr.find(".job").val(x.JobID!);
		
			$tr.find(".memo").val(x.AllocationMemo ?? "");
		});

		setAmtsDisplay(totalDebit, totalCredit);

	} else {
		JournalLns = [];
		addJournalRow();
	}

	setInput4NumberOnly("number");
});
