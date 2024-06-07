﻿$infoblk = $("#infoblk");
let gattrnamelist: string[] = [];



$(document).on("click", "#addRecord", function () {
	handleAddRecordClick.call(this);
});
$(document).on("change", ".labeltxt", function () {
	let attrname = $(this).val() as string;
	if (attrname) {
		let oldattrname = $(this).data("oldname");
		let gattr: IGlobalAttribute = {
			attrName: attrname,
			oldAttrName: oldattrname
		} as IGlobalAttribute;
		//UpdateGattrName
		$.ajax({
			//contentType: "application/json; charset=utf-8",
			type: "POST",
			url: "/Customer/UpdateGattrName",
			data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), gattr },
			success: function (data: IGlobalAttribute) {
				if (data) {
					//console.log(data);
					$("#gattrblk .form-group").each(function (i, e) {
						let gattrId: string = $(e).find(".info").data("gattrid");
						console.log("gattrid:" + gattrId);
						if (data.gattrId == gattrId) {
							$(e).find("label").text(data.attrName).show();
							$(e).find(".form-control.labeltxt").addClass("hide");
							return false;
						}
					});
				}
			},
			dataType: "json"
		});
	}
});

$(document).on("dblclick", ".pointer.attr", function () {
	$target = $(this).parent(".form-group");
	$(this).hide();
	//$target.find(".form-control.attr").hide();
	$target.find(".labeltxt").removeClass("hide").trigger("focus");
});

$(document).on("click", "#btnSaveCattr", function () {
	saveCattr();
});

$(document).on("click", "#btnEdit", function () {
	FillInCustomer();
	if (validCusForm()) {
		let _url = "/Customer/Edit";	
		//console.log("Customer:", Customer);
		//return false;
		openWaitingModal();
		$.ajax({
			type: "POST",
			url: _url,
			data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), model:Customer},
			success: function () {
				closeWaitingModal();
				let referrer = $infoblk.data("referrer") == "" ? "Index" : $infoblk.data("referrer");
				window.location.href = `/Customer/${referrer}`;
			},
			dataType: "json",
		});
	}
});

$(document).on("click", "#mplus", function () {
	_mobilecount++;
	//console.log("mobilecount:" + _mobilecount);
	if (_mobilecount <= 3) {
		$(".mobile:first")
			.clone()
			.insertAfter(".mobile:last")
			.addClass("my-1")
			.attr("id", `cusAddrPhone${_mobilecount}`)
			.attr("name", `cusAddrPhone${_mobilecount}`);
	}
});

$(document).on("change", "#cusPhone", function () {
	handleCardPhoneChange.call(this);
});
$(document).on("change", "#cusName", function () {
	handleCardNameChange.call(this);
});

$(document).on("change", "#cusEmail", function () {
	handleCardEmailChange.call(this);
});

function removeCattr(cattr: string) {	
	$.ajax({
		//contentType: "application/json; charset=utf-8",
		type: "POST",
		url: "/Customer/RemoveCattr",
		data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), cusCode:$("#cusCode").val(), cattr },
		success: function (data: ICustomAttribute[]) {
			if (data) {
				//console.log("data:", data);
				cAttributes = data.slice(0);
				//console.log("cattrbutes:", cAttributes);
				displayCustomAttributes();
			}
		},
		dataType: "json"
	});
}
$(document).on("click", ".cattr.pointer.fa-close", function () {
	removeCattr($(this).data("cattr"));
});
function handleAttrAccordionActivated() {
	//console.log("cattrlist#handle:", cAttributes);    
	if (cAttributes) {
		displayCustomAttributes();
	}
}
function displayCustomAttributes() {
	//console.log("cAttributes:", cAttributes);
	let html = "";
	cAttributes.forEach((x) => {
		if (x.attrType == "custom") {
			html += `<span class="d-inline-block p-2 alert-info small rounded mx-1 my-2">${x.attrValue} <i class="text-danger cattr fa fa-close pointer" data-cattr="${x.attrValue}"></i></span>`;
		}
	});
	$("#cattrlist").find(".small.rounded").remove();
	$(html).insertBefore(".form-control.cattr");
	cAttributes = [];
	$(".form-control.cattr").first().trigger("focus");
}

$(function () {
	setFullPage();
	triggerMenu(1, 0);
	forcustomer = true;
	apId = Number($infoblk.data("apid"));

	initModals();

	FillInCustomer();

	PhoneNameEmailList = $infoblk.data("phonenameemaillist");
	approvalmode = $infoblk.data("approvalmode") === "True";
	editmode = Customer.cusCustomerID > 0;	

	cAttributes = $infoblk.data("jscustomattributelist") as ICustomAttribute[];
	//console.log("cAttributes:", cAttributes);

	$("#globalattr").accordion({
		collapsible: true,
		active: "none",
		heightStyle: "content",
		activate: function (event, ui) {
			//console.log("ui:", ui);
			//$(ui.newPanel).find(".form-control").first().trigger("focus");            
			handleAttrAccordionActivated();
		},
	});

	if (getParameterByName("saveattr") != null) {
		//console.log("here");
		$(".ui-accordion-header").addClass("ui-state-active");
		$(".ui-accordion-content").show();
		handleAttrAccordionActivated();
	}

	uploadsizelimit = parseInt($infoblk.data("uploadsizelimit"));
	uploadsizelimitmb = parseInt($infoblk.data("uploadsizelimitmb"));
	if ($infoblk.data("uploadfilelist") !== "") {
		Customer.UploadFileList = ($infoblk.data("uploadfilelist").toString()).split(",");
		$("#btnViewFile").removeClass("hide");
	}

	gattrnamelist = $infoblk.data("gattrnamelist").toString().split(",");

	if ($("#FollowUpDateInfo_FollowUpDateDisplay").val() === "") {
		initDatePicker("followUpDate", new Date());
	} else {
		initDatePicker("followUpDate", convertCsharpDateStringToJsDate($("#FollowUpDateInfo_FollowUpDateDisplay").val() as string));
	}

	SelectedCountry = editmode ? Number(Customer.cusAddrCountry) ?? 1 : 1;
	let selectedCity = editmode ? Customer.cusAddrCity ?? "" : "";
	lang = Number($infoblk.data("lang")) + 1;
	//console.log("lang:" + lang);
	initCityDropDown(selectedCity, lang);
	$("#drpCountry").select2();
	$("#drpCity").select2();

	$(".combo.attr").select2({
		width: "resolve",
	});

	$("#cusName").trigger("focus");
});


