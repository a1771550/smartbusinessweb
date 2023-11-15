$infoblk = $('#infoblk');

frmdate = $infoblk.data("frmdate");
todate = $infoblk.data("todate");
currentoldestdate = $infoblk.data("currentoldestdate");

pagesize = Number($infoblk.data("pagesize"));
//from/emailAddress/address ne 'noreply@abssasia.com.hk'
resource = `/users/{2}/mailFolders/Inbox/messages?$filter=receivedDateTime ge {0}T00:00:00Z and receivedDateTime lt {1}T23:59:59Z and startswith(subject, 'Late arrival report')&$count=true&$ConsistencyLevel=eventual&$orderby=receivedDateTime desc`;
attdIdList = $infoblk.data("attdidlist") as string[];
//console.log("attdIdList:", attdIdList);

$(document).on("click", "#btnSearch", function () {
    keyword = $("#txtKeyword").val() as string;
    if (keyword !== "") {
        sortDirection = "DESC";
        GetAttendances(1);
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
        let url: string = `/Attendance/Index?PageNo=${$('#pageno').val()}&SortOrder=${$('#sortorder').val()}&PageSize=${pagesize}&Keyword=${$('#keyword').val()}`;
        window.location.href = url;
    }
});

$(document).on("click", "#btnFilter", function (e) {
    e.preventDefault();
    frmdate = $("#datetimesmin").val() as string;
    todate = $("#datetimesmax").val() as string;
    //window.location.href = `/Attendance/Index?strfrmdate=${frmdate}&strtodate=${todate}`;
    handleMGTmails(frmdate, todate);
});

$(document).on("click", "#btnReload", function () {
    window.location.href = "/Attendance/Index";
});


function saveAttendances(attdlist: IAttendance[]) {
    //console.log("attdlist:", attdlist);
   //  return;
    $.ajax({
        //contentType: 'application/json; charset=utf-8',
        type: "POST",
        url: '/Attendance/Save',
        data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), model: attdlist, frmdate, todate },
        //success: function (data) {
        //},
        dataType: 'json'
    });
}

function attdTemplate(data: IAttendance[]): string {
    let html = "";
    data.forEach((x) => {
        const Id = x.id;    
       
        html += `<tr class="attendance" role="button" data-id="${Id}">`;
       
        html += `<td style="width:180px; max-width:180px;">${(x.DateDisplay)}</td>
         <td style="width:120px;max-width:120px;">${x.saCheckInTime}</td>
                                    <td style="width:120px;max-width:120px;">${x.saName}</td>`;  

        html += `</tr>`;
    });
    return html;
}
function fillInAttdTable() {
    var html = attdTemplate(AttendanceList);
    $("#tblmails tbody").empty().html(html);
}



$(function () {
    forattendance = true;
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
