$infoblk = $('#infoblk');

frmdate = $infoblk.data("frmdate");
todate = $infoblk.data("todate");
currentoldestdate = $infoblk.data("currentoldestdate");

pagesize = Number($infoblk.data("pagesize"));
//from/emailAddress/address ne 'noreply@abssasia.com.hk'
resource = `/users/{2}/mailFolders/Inbox/messages?$filter=receivedDateTime ge {0}T00:00:00Z and receivedDateTime lt {1}T23:59:59Z and startswith(subject, '%5BConfirmed%5D')&$count=true&$ConsistencyLevel=eventual&$orderby=receivedDateTime desc`;
trainingIdList = $infoblk.data("trainingidlist") as string[];

$(document).on("click", "#btnSearch", function () {
    keyword = $("#txtKeyword").val() as string;
    if (keyword !== "") {
        sortDirection = "DESC";
        GetTrainings(1);
    }
});

$(document).on("change", "#iPageSize", function () {
    let pagesize: number = <number>$(this).val();
    if (pagesize <= 0) {
        $.fancyConfirm({
            title: '',
            message: $infoblk.data('pagesizenoltzerotxt'),
            shownobtn: false,
            okButton: oktxt,
            noButton: notxt,
            callback: function (value) {
                if (value) {
                    $('#iPageSize').trigger("focus");
                }
            }
        });
    } else {
        let url: string = `/Training/Index?PageNo=${$('#pageno').val()}&SortOrder=${$('#sortorder').val()}&PageSize=${pagesize}&Keyword=${$('#keyword').val()}`;
        window.location.href = url;
    }
});

$(document).on("click", "#btnFilter", function (e) {
    e.preventDefault();
    frmdate = $("#datetimesmin").val() as string;
    todate = $("#datetimesmax").val() as string;
    //window.location.href = `/Training/Index?strfrmdate=${frmdate}&strtodate=${todate}`;
    handleMGTmails();
});

$(document).on("click", "#btnReload", function () {
    window.location.href = "/Training/Index";
});


function saveTrainings(traininglist: ITraining[]) {
    //console.log("traininglist:", traininglist);
    //return;
    $.ajax({
        //contentType: 'application/json; charset=utf-8',
        type: "POST",
        url: '/Training/Save',
        data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), model: traininglist, frmdate, todate },
        //success: function (data) {
        //},
        dataType: 'json'
    });
}

function trainingTemplate(data: ITraining[]): string {
    let html = "";
    data.forEach((x) => {
        const Id = x.id;
        
        html += `<tr class="training" role="button" data-Id="${Id}">`;

        html += `<td style="width:180px; max-width:180px;">${(x.DateDisplay)}</td>
        <td style="width:120px;max-width:120px;">${x.trCompany}</td>
        <td style="width:120px;max-width:120px;">${x.trApplicant}</td>
         <td style="width:120px;max-width:120px;">${formatEmail(x.trEmail, x.trApplicant)}</td>
          <td style="width:120px;max-width:120px;">${x.trIndustry}</td>
           <td style="width:120px;max-width:120px;">${x.trAttendance}</td>
            <td style="width:120px;max-width:120px;">${x.trIsApproved?approvedtxt:rejectedtxt}</td>`;
        html += `</tr>`;
    });
    return html;
}
function fillInTrainingTable() {
    var html = trainingTemplate(TrainingList);
    $("#tblmails tbody").empty().html(html);
}

$(function () {
    fortraining = true;
    daterangechange = false;
    setFullPage();
    initModals();

    let keyword = getParameterByName('Keyword');
    if (keyword !== null) {
        $('#txtKeyword').val(keyword);
    }

    $('#txtKeyword').trigger("focus");

   
        handleMGTmails();
  

});
