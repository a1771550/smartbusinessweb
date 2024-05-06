$infoblk = $('#infoblk');
let assigntosales: string = "";
let currentcontactemaillist: string[] = [];
let currentcontactphonelist: string[] = [];

//from/emailAddress/address ne 'noreply@abssasia.com.hk'
//resource = `/users/{2}/mailFolders/Inbox/messages?$filter=receivedDateTime ge {0}T00:00:00Z and receivedDateTime lt {1}T23:59:59Z and from/emailAddress/address ne 'autoreply@abssasia.com.hk' and from/emailAddress/address ne 'enquiry@united.com.hk' and from/emailAddress/name ne 'United Technologies (Int''l) Ltd.' and from/emailAddress/name ne 'Kobee Ho' and from/emailAddress/name ne 'Eddy Mok' and from/emailAddress/name ne 'Kim LEUNG' and from/emailAddress/address ne 'lung@united.com.hk' and from/emailAddress/address ne 'sunnyy@united.com.hk' and sender/emailAddress/address eq 'autoreply@united.com.hk'&$count=true&$ConsistencyLevel=eventual&$orderby=receivedDateTime desc`;
/*resource = `/users/{0}/mailFolders/Inbox/messages?$filter=from/emailAddress/address ne 'autoreply@abssasia.com.hk' and from/emailAddress/address ne 'enquiry@united.com.hk' and from/emailAddress/name ne 'United Technologies (Int''l) Ltd.' and from/emailAddress/name ne 'Kobee Ho' and from/emailAddress/name ne 'Eddy Mok' and from/emailAddress/name ne 'Kim LEUNG' and from/emailAddress/address ne 'lung@united.com.hk' and from/emailAddress/address ne 'sunnyy@united.com.hk' and sender/emailAddress/address eq 'autoreply@united.com.hk'&$count=true&$ConsistencyLevel=eventual&$orderby=receivedDateTime desc`;*/
resource = `/users/{0}/mailFolders/Inbox/messages?$top={1}&$filter=from/emailAddress/address ne 'autoreply@abssasia.com.hk' and from/emailAddress/address ne 'enquiry@united.com.hk' and sender/emailAddress/address eq 'autoreply@united.com.hk'&$count=true&$ConsistencyLevel=eventual&$orderby=from/emailAddress/address,sender/emailAddress/address,receivedDateTime desc`;

let DicAssignedSalesEnqId: { [Key: string]: number } = {};
let assignsalesmanrequiredtxt:string = $infoblk.data("assignsalesmanrequiredtxt");

$(document).on("click", "#btnSearch", function () {
	keyword = $("#txtKeyword").val() as string;
	if (keyword !== "") {
		sortDirection = "DESC";
		GetEnquiries(1);
	}
});
$(document).on("click", ".removeenq", function () {
	const enqId = $(this).data("id");
	$.fancyConfirm({
		title: '',
		message: confirmremovetxt,
		shownobtn: true,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				$.ajax({
					//contentType: 'application/json; charset=utf-8',
					type: "POST",
					url: '/Enquiry/Delete',
					data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), enqId },
					success: function (data) {
						if (data) {
							window.location.href = "/Enquiry/Index";
						}
					},
					dataType: 'json'
				});
			}
		}
	});
});
$(document).on("click", "#addenq", function () {
	window.location.href = "/Enquiry/Add";
});
$(document).on("click", ".convert", function () {
	let _$ele = $(this);
	$.fancyConfirm({
		title: '',
		message: $infoblk.data("confirmconverttocustomertxt"),
		shownobtn: true,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				const assignedsalesId: number = Number(_$ele.data("salesid"));
				//console.log("assignedsalesId:" +assignedsalesId);
				//return;
				if (assignedsalesId == 0) {
					$.fancyConfirm({
						title: '',
						message: assignsalesmanrequiredtxt,
						shownobtn: false,
						okButton: oktxt,
						noButton: notxt,
					});
				} else {
					let _id = _$ele.data("id");
					let _msg = '';

					let _email = _$ele.data('email').toString();
					let _phone = _$ele.data('phone').toString();
					console.log(_email + ";" + _phone);
					_email = _email.trim();
					_phone = _phone.trim();

					let _emailduplicated = false;
					let _phoneduplicated = false;
					if (currentcontactemaillist.includes(_email)) {
						_emailduplicated = true;
					}
					//console.log(currentcontactphonelist.includes(_phone));
					if (currentcontactphonelist.includes(_phone)) {
						_phoneduplicated = true;
					}
					//console.log(`emaildup:${_emailduplicated}; phonedup:${_phoneduplicated}`);
					if (_emailduplicated && _phoneduplicated) {
						let _parameters: string[] = [_email, _phone];
						//console.log('parameters:', _parameters);
						//return false;
						$.ajax({
							type: "GET",
							url: '/Api/SearchContact',
							traditional: true,//must add this if passing string array
							data: { type: 'emailphone', parameters: _parameters },
							success: function (data: IContact) {
								if (data) {
									var name = data.cusIsOrganization ? data.cusName : data.cusFirstName + " " + data.cusName;
									var mailinusetxt = (<string>$infoblk.data('emailinusetxt')).replace('{0}', `: ${name}`).replace('{1}', `: ${_email}`);
									var phoneinusetxt = (<string>$infoblk.data('phoneinusetxt')).replace('{0}', `: ${name}`).replace('{1}', `: ${_phone}`);
									_msg = `${mailinusetxt}<br>${phoneinusetxt}<br>${$infoblk.data('confirmprompt')}`;
									$.fancyConfirm({
										title: '',
										message: _msg,
										shownobtn: true,
										okButton: oktxt,
										noButton: notxt,
										callback: function (value) {
											if (value) {
												window.location.href = `/Enquiry/AddToCustomer?enqId=${_id}&overwrite=1`;
											} else {
												_$ele.trigger("focus");
											}
										}
									});
								}
							},
							dataType: 'json'
						});
					}
					else if (_emailduplicated) {
						$.ajax({
							type: "GET",
							url: '/Api/SearchContact',
							data: { type: 'Email', parameters: _email },
							success: function (data: IContact) {
								if (data) {
									var name = data.cusIsOrganization ? data.cusName : data.cusFirstName + " " + data.cusName;
									var mailinusetxt = (<string>$infoblk.data('emailinusetxt')).replace('{0}', `: ${name}`).replace('{1}', `: ${_email}`);
									_msg = `${mailinusetxt}<br>${$infoblk.data('confirmprompt')}`;
									$.fancyConfirm({
										title: '',
										message: _msg,
										shownobtn: true,
										okButton: oktxt,
										noButton: notxt,
										callback: function (value) {
											if (value) {
												window.location.href = `/Enquiry/AddToCustomer?enqId=${_id}&overwrite=1`;
											} else {
												_$ele.trigger("focus");
											}
										}
									});
								}
							},
							dataType: 'json'
						});
					}
					else if (_phoneduplicated) {
						$.ajax({
							type: "GET",
							url: '/Api/SearchContact',
							data: { type: 'phone', parameters: _phone },
							success: function (data: IContact) {
								if (data) {
									var name = data.cusIsOrganization ? data.cusName : data.cusFirstName + " " + data.cusName;
									var phoneinusetxt = (<string>$infoblk.data('phoneinusetxt')).replace('{0}', `: ${name}`).replace('{1}', `: ${_phone}`);
									_msg = `${phoneinusetxt}<br>${$infoblk.data('confirmprompt')}`;
									$.fancyConfirm({
										title: '',
										message: _msg,
										shownobtn: true,
										okButton: oktxt,
										noButton: notxt,
										callback: function (value) {
											if (value) {
												window.location.href = `/Enquiry/AddToCustomer?enqId=${_id}&overwrite=1`;
											} else {
												_$ele.trigger("focus");
											}
										}
									});
								}
							},
							dataType: 'json'
						});
					}
					else {
						window.location.href = `/Enquiry/AddToCustomer?enqId=${_id}`;
					}
				}
			}
		}
	});
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
		let url: string = `/Enquiry/Index?PageNo=${$('#pageno').val()}&SortOrder=${$('#sortorder').val()}&PageSize=${pagesize}&Keyword=${$('#keyword').val()}`;
		window.location.href = url;
	}
});

$(document).on("dblclick", ".enquiry", function () {
	let Id: number = <number>$(this).data("id");
	if ($(this).hasClass("disabled")) {
		window.location.href = '/Customer/Edit?enqId=' + Id;
	} else {
		window.location.href = '/Enquiry/Edit?Id=' + Id;
	}
});

$(document).on("click", ".assign", function (e) {
	e.stopPropagation();
	$(this).parent("td").parent("tr").find("td").first().find(".enqchk").prop("checked", true).trigger("change");
	//console.log("salespersonid:" + $(this).data("salespersonid"));
	handleAssign($(this).data("salespersonid"));
});
$(document).on("click", '#btnAssign', function () {
	$target = $(this);
	if (assignEnqIdList.length === 0) {
		let msg = <string>$infoblk.data('selectatleastoneenquirytxt');
		$.fancyConfirm({
			title: '',
			message: msg,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$target.trigger("focus");
				}
			}
		});
	} else {
		handleAssign(null);
	}
});

function filterEnquiries(enquiryies: IEnquiry[]): IEnquiry[] {
	let uniqueEmailSubjects: string[] = [];
	let filterlist: IEnquiry[] = [];
	enquiryies.forEach((x) => {
		if (x.email && x.subject) {
			let emailsubject = x.email.trim() + x.subject.trim();
			if (!uniqueEmailSubjects.includes(emailsubject)) {
				uniqueEmailSubjects.push(emailsubject);
				filterlist.push(x);
			}
		}		
	});

	filterlist.sort((a, b) => Date.parse(b.receiveddate) - Date.parse(a.receiveddate));

	return filterlist;
}

function saveEnquiries(enqlist: IEnquiry[]) {
	enqlist = filterEnquiries(enqlist);
	//console.log("filtered list:", enqlist);
	//return;
	$.ajax({
		//contentType: 'application/json; charset=utf-8',
		type: "POST",
		url: '/Enquiry/Save',
		data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), model: enqlist },
		dataType: 'json'
	});
}

function enqTemplate(data: IEnquiry[]): string {
	let html = "";
	data.forEach((x) => {
		const Id = x.id ?? x.Id;
		let salespersonId: number = 0;
		let assigned: boolean = false;
		let converted: boolean = x.enAddedToContact!;
		for (const [key, value] of Object.entries(DicAssignedSalesEnqId)) {
			if (Id == key) {
				salespersonId = value;
				assigned = true;
			}
		}

		let trcls = converted ? "disabled" : "";
		
		html += `<tr class="enquiry ${trcls} ${x.statuscls}" role="button" data-Id="${Id}">`;

		if (isassignor) {
			let _checked = assigned ? "checked" : "";
			let _disabled = assigned ? "disabled" : "";
			html += `<td style="width:10px;max-width:10px;"><input type="checkbox" class="form-check enqchk" data-Id="${Id}" ${_checked} ${_disabled} data-salespersonid="${salespersonId}" ${trcls}></td>`;
		}

		let from = converted ? removeAnchorTag(x.from) : x.from;
		html += `<td style="width:100px; max-width:100px;">${(x.enReceivedDateTime) ?? formatDateTime(new Date(x.receivedDateTime))}</td>
                                    <td style="width:120px;max-width:120px;">${x.subject}</td>
                                    <td style="width:120px;max-width:120px;">${from}</td>
                                    <td style="width:120px;max-width:120px;">${x.emailDisplay}</td>
                                    <td style="width:100px;max-width:100px;">${x.phone}</td>
                                    <td style="width:120px;max-width:120px;">${x.company}</td>
                                    <td style="width:100px;max-width:100px;">${x.contact}</td>`;

		html += `<td style="width:60px;max-width:60px;">${x.FollowUpStatusDisplay}</td>`;
		html += `<td style="width:100px;max-width:100px;">${x.FollowUpDateDisplay}</td>`;
		html += `<td style="width:100px;max-width:100px;">${x.SalesPersonName}</td>`;
		//assignsalesmanrequiredtxt
		html += `<td style="width:120px;min-width:130px;">`;

		if (converted) {
			html += `<a href="#" data-Id="${Id}" title="${removetxt}" role='button' class='btn btn-danger removeenq mx-1'><span class="fa-solid fa-trash"></span></a>`;
		} else {
			if (isassignor)
				html += `<a href="#" data-email="${x.email}" data-Id="${Id}" data-salespersonid="${salespersonId}" title="${assigntosales}" role='button' class='btn btn-info assign ${trcls} mx-1'><span class="fa fa-user"></span></a>`;

			html += `<a href="#" data-salesid="${x.enAssignedSalesId}" data-email="${x.email}" data-phone="${x.phone}" data-Id="${Id}" title="${converttocustomertxt}" role='button' class='btn btn-warning convert mx-1 ${trcls}'><span class="fa-solid  fa-hand-point-right"></span></a><a href="#" data-Id="${Id}" title="${removetxt}" role='button' class='btn btn-danger removeenq mx-1 ${trcls}'><span class="fa-solid fa-trash"></span></a>`;
		}

		html += `</td></tr>`;
	});
	return html;
}
function fillInEnqTable() {
	var html = enqTemplate(EnquiryList);
	$("#tblmails tbody").empty().html(html);
}
function initInfoBlkVariables4Enquiry() {
	assigntosales = $infoblk.data("assignsalestxt");
	isassignor = $infoblk.data("isassignor") === "True";
	pagesize = Number($infoblk.data("pagesize"));
	enqIdList = $infoblk.data("enqidlist") as string[];
	currentcontactemaillist = ($infoblk.data('currentcontactemaillist').toString()).split(',');
	currentcontactphonelist = ($infoblk.data('currentcontactphonelist').toString()).split(',');
	assignsalesmanrequiredtxt = $infoblk.data("assignsalesmanrequiredtxt");
	DicAssignedSalesEnqId = $infoblk.data("jsondicassignedsalesenqid");
}
$(function () {
	forenquiry = true;
	setFullPage();
	initModals();
	triggerMenu(1, 3);

	initInfoBlkVariables4Enquiry();

	let keyword = getParameterByName('Keyword');
	if (keyword !== null) {
		$('#txtKeyword').val(keyword);
	}

	$('#txtKeyword').trigger("focus");

	sortCol = 8;

	handleMGTmails(1, Number($("#drpLatestRecordCount").val()));
});
