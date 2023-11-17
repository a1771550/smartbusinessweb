$infoblk = $("#infoblk");
editmode = $("#Id").val()!=null;
const journalno = $("#journal_JournalNumber").val()!.toString();
const strdate = $("#strDate").val()!.toString();

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

function populateAccount4Journal(acno:string, acname:string) {
    //console.log("acno:" + acno + ";acname:" + acname);
    $tr = $(`#${gTblName} tbody tr`).eq(currentY);
    let idx = 0;
    let $td = $tr.find("td").eq(idx);
    $td.find(".drpAccount").remove();
    $td.html(`<input type="text" class="form-control acno" value="${acno}">`);
    idx++;
    $tr.find("td").eq(idx).find(".acname").val(acname);

    selectedJournalLn.AccountNumber = acno;
}
$(document).on("change", ".drpAccount", function () {
    currentY = $(this).parent("td").parent("tr").index();

    if (JournalLns.length > 0) {
        JournalLns.forEach((x) => {
            if (x.Seq == currentY + 1) selectedJournalLn = structuredClone(x);
        });        
    } else {
        initJournalLn(journalno);
    }

    AcClfID = $(this).val()!.toString();
    if (AcClfID !== "") {
        accountList = DicAcAccounts[AcClfID];
        changeAccountPage(1);
    }
});
$(document).on("dblclick", ".memo", function () {
    openTextAreaModal();
});

function populateDrpAccount():string {
    return `<select class="drpAccount form-control">
			<option value="">- ${selecttxt} -</option>
			<option value="COS">${cosaccounttxt}</option>
			<option value="I">${incomeaccount4tstxt}</option>
			<option value="A">${assetaccount4inventorytxt}</option>
		</select>`;
}
function addJournalRow() {
    let html = "<tr>";

    html += `<td>${populateDrpAccount()}</td>`;

    html += `<td><input type="text" class="acname form-control" readonly></td><td><input type="number" class="form-control debit"></td><td><input type="number" class="form-control credit"></td><td><select class="job flex form-control">${setJobListOptions(0)}</select></td><td><input type="text" class="memo form-control"></td>`;

    html += "</tr>";
    $(`#${gTblName} tbody`).empty().html(html);
}

$(document).on("dblclick", ".acno", function () {
    currentY = $(this).parent("td").parent("tr").index();
    //todo:
    //$tr = $(`#${}`)
});

$(document).on("click", "#btnAdd", function () {
    if (JournalLns.length === 0) return false;
    JournalLns.forEach((x) => {
        if (x.Seq == currentY + 1) selectedJournalLn = structuredClone(x);
    });   
    addJournalRow();
});
$(function () {
    forjournal = true;
    setFullPage();
    gTblName = "tblJournal";
    initModals();
    initDatePicker("strdate");

    records_per_page = 10;

    MyobJobList = $infoblk.data("joblist");
    //dicacaccounts
    DicAcAccounts = $infoblk.data("dicacaccounts");

    if (editmode) {

    } else {
        Journal = {} as IJournal;        
        JournalLns = [];
    }

    addJournalRow();
});
