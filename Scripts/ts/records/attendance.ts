$infoblk = $('#infoblk');
//from/emailAddress/address ne 'noreply@abssasia.com.hk'
resource = `/users/{0}/mailFolders/Inbox/messages?$top={1}&$filter=startswith(subject, 'Late arrival report')&$count=true&$ConsistencyLevel=eventual&$orderby=subject,receivedDateTime desc`;

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
	handleMGTmails();
});




function saveAttendances(attdlist: IAttendance[]) {
	//console.log("attdlist:", attdlist);
	//  return;
	$.ajax({
		//contentType: 'application/json; charset=utf-8',
		type: "POST",
		url: '/Attendance/Save',
		data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), model: attdlist },
		//success: function (data) {
		//},
		dataType: 'json'
	});
}

function attdTemplate(data: IAttendance[]): string {
	let html = "";
	data.forEach((x) => {
		const Id = x.id;

		html += `<tr class="attendance" role="button" data-Id="${Id}">`;

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

function initInfoBlkVariables4Attendence() {
	PageSize = Number($infoblk.data("pagesize"));
	attdIdList = $infoblk.data("attdidlist") as string[];
}

$(function () {
	forattendance = true;
	daterangechange = false;
	setFullPage();
	initModals();
	triggerMenu(9, 0);

	initInfoBlkVariables4Attendence();

	let keyword = getParameterByName('Keyword');
	if (keyword !== null) {
		$('#txtKeyword').val(keyword);
	}

	$('#txtKeyword').trigger("focus");

	handleMGTmails(1, Number($("#drpLatestRecordCount").val()));
});