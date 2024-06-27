$infoblk = $("#infoblk");


$(document).on("change", "#chkEnableBuySellUnits", function () {
	$target = $(this);
	if ($target.is(":checked")) {
		enablebuysellunits = true;
	}
});

$(document).on("change", ".taxtype", function () {
	$("#TaxType").val(<string>$(this).val());
});

$(document).on("change", "#DefaultSalesNotes", function () {
	if ($(this).is(":checked")) {
		$("#UseDefaultNote").val(1);
	} else {
		$("#UseDefaultNote").val(0);
	}
});

$(document).on("change", "#EnableLogoReceipt", function () {
	if ($(this).is(":checked")) {
		$(this).val("1");
		$("#LogoReceipt").val("1");
		openLogoModal();
	} else {
		$(this).val("0");
		$("#LogoReceipt").val("0");
	}
});

$(document).on("click", "#btnSave", function () {
	if (validForm()) {
		if (enablebuysellunits) {
			$.fancyConfirm({
				title: "",
				message: $infoblk.data("confirmirreversibletxt"),
				shownobtn: true,
				okButton: oktxt,
				noButton: notxt,
				callback: function (value) {
					if (value) {
						$("#frmOS").trigger("submit");
					} else {
						$target.trigger("focus");
					}
				},
			});
		} else {
			$("#frmOS").trigger("submit");
		}
	}
});

function validForm() {
	let msg = "";

	if (msg !== "") {
		falert(msg, oktxt);
	}
	return msg === "";
}

$(document).on("click", "#btnUpload", function () {

	// Checking whether FormData is available in browser
	if (window.FormData !== undefined) {

		var fileUpload =( $("#FileUpload1")).get(0) as any;		
		if (fileUpload) {
			
			var files = fileUpload.files;

			// Create FormData object
			var fileData = new FormData();

			// Looping over all files and add it to FormData object
			for (var i = 0; i < files.length; i++) {
				if (files[i].size > uploadsizelimit) {
					falert("@exceeduploadfilelimittxt", oktxt);
					closeWaitingModal();
					return false;
				}
				fileData.append(files[i].name, files[i]);
			}

			closeLogoModal();
			openWaitingModal();
			// Adding one more key to FormData object
			let _token = logoModal.find("input[name=__RequestVerificationToken]").val();
			fileData.append("__RequestVerificationToken", _token);

			$.ajax({
				url: "/BasicSettings/UploadLogo",
				type: "POST",
				contentType: false, // Not to set any content header
				processData: false, // Not to process data
				data: fileData,
				success: function (result) {
					closeWaitingModal();
					falert(result.msg, oktxt);
					$("#receiptlogo").attr("src", result.imgpath);
				},
				error: function (err) {
					alert(err.statusText);
				}
			});
		}
	
	} else {
		alert("FormData is not supported.");
	}
});
$(function () {
	setFullPage();
	initModals();
	triggerMenu(0, 0);

	uploadsizelimit = parseInt($infoblk.data("uploadsizelimit"));
	uploadsizelimitmb = parseInt($infoblk.data("uploadsizelimitmb"));

	$("input[type=file]").filestyle({
		image: "/Images/selectlogo.png",
		imageheight: 22,
		imagewidth: 82,
		width: 250
	});
});