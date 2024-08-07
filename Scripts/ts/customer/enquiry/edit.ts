﻿$infoblk = $('#infoblk');

$(document).on("dblclick", "#SalesPersonName", function () {
	handleAssign($("#enAssignedSalesId").val() as number);
});
function _validenquiryform(): boolean {

	let msg: string = '';

	let $frm = $('#enFrom');
	if ($frm.val() === '') {
		msg += `${requiredinputtxt.replace('{0}', frmtxt)} <br>`;
	}
	let $subject = $('#enSubject');
	if ($subject.val() === '') {
		msg += `${requiredinputtxt.replace('{0}', subjecttxt)} <br>`;
	}

	let emailerr: boolean = false;
	let $email = $('#enEmail');
	if ($email.val() === '') {
		msg += `${requiredinputtxt.replace('{0}', emailtxt)} <br>`;
		emailerr = true;
	} else if (!validateEmail($email.val())) {
		msg += `${emailformaterr} <br>`;
		emailerr = true;
	}

	let $phone = $('#enPhone');
	if ($phone.val() === '') {
		msg += `${requiredinputtxt.replace('{0}', phonetxt)} <br>`;
	}
	let $organ = $('#enOrganization');
	if ($organ.val() === '') {
		msg += `${requiredinputtxt.replace('{0}', companynametxt)} <br>`;
	}
	let $contact = $('#enContact');
	if ($contact.val() === '') {
		msg += `${requiredinputtxt.replace('{0}', contacttxt)} <br>`;
	}

	if (msg !== '') {
		$.fancyConfirm({
			title: '',
			message: msg,
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {					
					if (emailerr) {
						$email.trigger("focus");
					}
					else if ($phone.val() === '') {
						$phone.trigger("focus");
					}
					else if ($organ.val() === '') {
						$organ.trigger("focus");
					}
					else if ($contact.val() === '') {
						$contact.trigger("focus");
					}
				}
			}
		});
	}
	return msg === '';
}

$(document).on('click', '#btnSave', function () {
	fillInEnquiry();
	if (_validenquiryform()) {
		//console.log('enquiry:', enquiry);
		//return false;
		$.ajax({
			type: "POST",
			url: '/Enquiry/Edit',
			data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), model: enquiry },
			success: function (data) {
				if (data) {
					window.location.href = '/Enquiry/Index';
				}
			},
			dataType: 'json'
		});
	}
});

$(function () {
	setFullPage();
	forenquiry = true;
	initModals();
	triggerMenuByCls("menucustomer", 3);

	fillInEnquiry();

	uploadsizelimit = parseInt($infoblk.data("uploadsizelimit"));
	uploadsizelimitmb = parseInt($infoblk.data("uploadsizelimitmb"));
	if ($infoblk.data("uploadfilelist") !== "") {
		enquiry.UploadFileList = ($infoblk.data("uploadfilelist").toString()).split(",");
		$("#btnViewFile").removeClass("hide");
	}

	if (enquiry.Id == "") {
		$("#addRecord").off("click");
	} else {
		$("#addRecord").on("click", handleAddRecordClick);
	}

	EnIdList.push($("#Id").val() as string);

	$('#enFrom').trigger("focus");

	if ($("#FollowUpDateInfo_FollowUpDateDisplay").val() === "") {
		initDatePicker("followUpDate", new Date());
	} else {
		initDatePicker("followUpDate", convertCsharpDateStringToJsDate($("#FollowUpDateInfo_FollowUpDateDisplay").val() as string));
	}
});
