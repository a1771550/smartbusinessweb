﻿$infoblk = $('#infoblk');

frmdate = $infoblk.data("frmdate");
todate = $infoblk.data("todate");
currentoldestdate = $infoblk.data("currentoldestdate");

pagesize = Number($infoblk.data("pagesize"));
//from/emailAddress/address ne 'noreply@abssasia.com.hk'
resource = `/users/{2}/mailFolders/Inbox/messages?$filter=receivedDateTime ge {0}T00:00:00Z and receivedDateTime lt {1}T23:59:59Z and startswith(subject, 'UT Service Report')&$count=true&$ConsistencyLevel=eventual&$orderby=receivedDateTime desc`;
jobIdList = $infoblk.data("jobidlist") as string[];

$(document).on("click", "#btnSearch", function () {
    keyword = $("#txtKeyword").val() as string;
    if (keyword !== "") {
        sortDirection = "DESC";
        GetJobs(1);
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
        let url: string = `/Job/Index?PageNo=${$('#pageno').val()}&SortOrder=${$('#sortorder').val()}&PageSize=${pagesize}&Keyword=${$('#keyword').val()}`;
        window.location.href = url;
    }
});

$(document).on("click", "#btnFilter", function (e) {
    e.preventDefault();
    frmdate = $("#datetimesmin").val() as string;
    todate = $("#datetimesmax").val() as string;
    //window.location.href = `/Job/Index?strfrmdate=${frmdate}&strtodate=${todate}`;
    handleMGTmails(frmdate, todate);
});

$(document).on("click", "#btnReload", function () {
    window.location.href = "/Job/Index";
});


function saveJobs(joblist: IJob[]) {
    //console.log("joblist:", joblist);
    //return;
    $.ajax({
        //contentType: 'application/json; charset=utf-8',
        type: "POST",
        url: '/Job/Save',
        data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), model: joblist, frmdate, todate },
        //success: function (data) {
        //},
        dataType: 'json'
    });
}

function jobTemplate(data: IJob[]): string {
    let html = "";
    data.forEach((x) => {
        const Id = x.id;
        /*
        <th scope="col" class="colheader" data-col="0">@Resources.Resource.ReceivedDateTime</th>
			<th scope="col" class="colheader" data-col="1">@Resources.Resource.StaffName</th>
			<th scope="col" class="colheader" data-col="2">@Resources.Resource.Client</th>
			<th scope="col" class="colheader" data-col="3">@Resources.Resource.TimeRange</th>
        */
        html += `<tr class="job" role="button" data-Id="${Id}">`;

        html += `<td style="width:180px; max-width:180px;">${(x.DateDisplay)}</td>
        <td style="width:120px;max-width:120px;">${x.joTime}</td>
        <td style="width:120px;max-width:120px;">${x.joWorkingHrs}</td>
         <td style="width:120px;max-width:120px;">${formatEmail(x.joStaffEmail, x.joStaffName)}</td>
          <td style="width:120px;max-width:120px;">${x.joClient}</td>`;
        html += `</tr>`;
    });
    return html;
}
function fillInJobTable() {
    var html = jobTemplate(JobList);
    $("#tblmails tbody").empty().html(html);
}

$(function () {
    forjob = true;
    daterangechange = false;
    setFullPage();
    initModals();

    let keyword = getParameterByName('Keyword');
    if (keyword !== null) {
        $('#txtKeyword').val(keyword);
    }

    $('#txtKeyword').trigger("focus");

    let strfrmdate = getParameterByName("strfrmdate");
    //openWaitingModal();
    if (strfrmdate) {
        frmdate = strfrmdate;
        //console.log("frmdate:" + frmdate);
        if (frmdate < currentoldestdate) {
            //todate = currentoldestdate;
            handleMGTmails(frmdate, currentoldestdate);
        }
        if (frmdate == currentoldestdate) {
            handleMGTmails(frmdate, todate);
        }
    } else {
        handleMGTmails(frmdate, todate);
    }

});
