$infoblk = $("#infoblk");
editmode = $("#Id").val() != null;
const journalno = $("#journal_JournalNumber").val()!.toString();
const strdate = $("#strDate").val()!.toString();
const dcaccerrtxt: string = $infoblk.data("dcaccerrtxt");
let totalDebit: number = 0;
let totalCredit: number = 0;
let outOfBalance: number = 0;

$(document).on("change", ".amt", function () {
	currentY = $(this).parent("td").parent("tr").index();
	console.log("currentY:" + currentY);
	let amt = Number($(this).val());
	console.log("amt:" + amt);

	let isDebit = $(this).hasClass("debit");
	console.log("isDebit:", isDebit);

	//getJournalPair();

	//console.log("selectedJournalLn1:", selectedJournalLn1);
	//console.log("selectedJournalLn2:", selectedJournalLn2);

	//if (isDebit) {
	//	if (currentY % 2 == 0) {
	//		selectedJournalLn1!.DebitExTaxAmount = amt;
	//	}
	//} else {
	//	if (currentY % 2 == 1) {
	//		selectedJournalLn2!.CreditExTaxAmount = amt;
	//	}
	//}

	console.log("selectedJournalLn1#1:", selectedJournalLn1);
	console.log("selectedJournalLn2#1:", selectedJournalLn2);

	JournalLns.forEach((x) => {
		if (x!.Seq == (currentY + 1)) { x.DebitExTaxAmount = amt; }
		if (x!.Seq == (currentY + 2)) { x.CreditExTaxAmount = amt; }

		console.log("x:", x);
	});

	console.log("JournalLns#updated:", JournalLns);

	if (isDebit) {
		JournalLns.forEach((x) => {
			if ((x!.Seq - 1) % 2 == 0)
				totalDebit += x!.DebitExTaxAmount!;
		});
		$("#debitAmt").val(formatnumber(totalDebit));
	} else {
		JournalLns.forEach((x) => {
			if (x!.Seq % 2 == 0)
				totalCredit += x!.CreditExTaxAmount!;
		});
		$("#creditAmt").val(formatnumber(totalCredit));
	}

	outOfBalance = totalDebit - totalCredit;
	let isDeficit = totalDebit > totalCredit;
	if (isDeficit) {
		$("#outOfBalance").addClass("alert-danger");
	} else {
		$("#outOfBalance").removeClass("alert-danger");
	}
	$("#outOfBalance").val(formatnumber(outOfBalance));
});
function fillInJournal() {
	Journal.JournalNumber = journalno;
	Journal.strDate = strdate;
}
function validJournalForm(): boolean {
	let msg: string = "";

	if (msg !== "") {
		$.fancyConfirm({
			title: "",
			message: msg,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$(".focus").first().trigger("focus");
				}
			},
		});
	}
	return msg === "";
}

$(document).on("click", "#btnSave", function () {
	fillInJournal();
	if (validJournalForm()) {
		// console.log("here");
		console.log(Journal);
		return;
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
	}
});

function populateAccount4Journal(acno: string, acname: string) {
	console.log("acno:" + acno + ";acname:" + acname);
	console.log("currentY:" + currentY);
	$tr = $(`#${gTblName} tbody tr`).eq(currentY);

	getJournalPair();

	if (currentY % 2 == 0) selectedJournalLn1!.AccountNumber = acno;
	else selectedJournalLn2!.AccountNumber = acno;

	if (selectedJournalLn2!.AccountNumber && selectedJournalLn1!.AccountNumber == selectedJournalLn2!.AccountNumber) {
		$.fancyConfirm({
			title: "",
			message: dcaccerrtxt,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$tr.find("td").first().find(".drpAccount").trigger("focus");
				}
			}
		});
	} else {
		//console.log("here");
		let idx = 0;
		let $td = $tr.find("td").eq(idx);
		$td.find(".drpAccount").remove();
		$td.html(`<input type="text" class="form-control acno" value="${acno}">`);
		idx++;
		$tr.find("td").eq(idx).find(".acname").val(acname);
	}
}
function toggleAmt(enabled: boolean) {
	$tr = $(`#${gTblName} tbody tr`).eq(currentY);
	$tr.find("td").find(".amt").prop("readonly", !enabled);

	if (currentY % 2 == 1) {
		let idx = 0;
		$tr = $(`#${gTblName} tbody tr`).eq(currentY - 1);
		let isDebit = $tr.find("td").eq(2).find(".amt").val() != "";
		idx = isDebit ? 3 : 2;
		$tr.find("td").eq(idx).find(".amt").prop("disabled", true);
		idx = isDebit ? 2 : 3;
		$tr = $(`#${gTblName} tbody tr`).eq(currentY);
		$tr.find("td").eq(idx).find(".amt").prop("disabled", true);
	}
}
$(document).on("change", ".drpAccount", function () {
	currentY = $(this).parent("td").parent("tr").index();

	GetSetJournalLnPair();

	AcClfID = $(this).val()!.toString();
	if (AcClfID !== "") {
		accountList = DicAcAccounts[AcClfID];
		changeAccountPage(1);
		toggleAmt(true);
	}
});
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
			console.log("about to setpair");
			setJournalPair();
		}
	} else {
		console.log("about to setpair");
		setJournalPair();
	}
}

function getJournalPair() {
	if (JournalLns.length === 0) return false;
	JournalLns.forEach((x) => {
		JournalLns.forEach((x) => {
			console.log("x.Seq:" + x!.Seq);
			let seq1 = currentY + 1;
			let seq2 = currentY + 2;
			console.log("seq1:" + seq1 + ";seq2:" + seq2);
			if (x!.Seq == seq1) selectedJournalLn1 = structuredClone(x);
			if (x!.Seq == seq2) selectedJournalLn2 = structuredClone(x);
		});
	});
}
function setJournalPair() {
	initJournalLnPair(journalno);
	JournalLns.push(selectedJournalLn1!);
	JournalLns.push(selectedJournalLn2!);
}

function populateDrpAccount(): string {
	let selectedCOS = AcClfID && AcClfID == "COS" ? "selected" : "";
	let selectedI = AcClfID && AcClfID == "I" ? "selected" : "";
	let selectedA = AcClfID && AcClfID == "A" ? "selected" : "";
	return `<select class="drpAccount form-control">
			<option value="">- ${selecttxt} -</option>
			<option value="COS" ${selectedCOS}>${cosaccounttxt}</option>
			<option value="I" ${selectedI}>${incomeaccount4tstxt}</option>
			<option value="A" ${selectedA}>${assetaccount4inventorytxt}</option>
		</select>`;
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
	$tr = $(`#${gTblName} tbody tr`).eq(currentY);
	let $td = $tr.find("td").first();
	$td.find(".acno").remove();
	$td.html(populateDrpAccount());
	$(".drpAccount").trigger("change");
});

$(document).on("click", "#btnAdd", function () {
	if (JournalLns.length === 0) return false;
	addJournalRow();
	currentY = $(`#${gTblName} tbody tr`).length - 2;
	console.log("currentY#btnadd:" + currentY);
	selectedJournalLn1 = null;
	selectedJournalLn2 = null;
	GetSetJournalLnPair();
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

	if (editmode) {

	} else {
		Journal = {} as IJournal;
		JournalLns = [];
	}

	addJournalRow();
});
