$infoblk = $("#infoblk");
phonelist = $infoblk.data("phonelist").split(",");
maillist = $infoblk.data("maillist").split(",");
editmode = $infoblk.data("edit") === "True";
approvalmode = $infoblk.data("approvalmode") === "True";

$(document).on("change", "#cusSaleComment", function () {
	let salecomment = <string>$(this).val();
	if (salecomment !== null && salecomment !== "") {
		let pattern =
			/^BR\:(0?[1-9]|[12][0-9]|3[01])\/{1}(0?[1-9]|1[012])\/{1}\d{4}\;{1}.+$/gm;
		let result: boolean = <boolean>pattern.test(salecomment);
		if (!result) {
			$.fancyConfirm({
				title: "",
				message: $infoblk.data("formaterrwarning"),
				shownobtn: false,
				okButton: oktxt,
				noButton: notxt,
				callback: function (value) {
					if (value) {
						$("#cusSaleComment").trigger("focus");
					}
				},
			});
		}
	}
});

$(document).on("click", "#btnEdit", function () {
	fillInCustomer();
	let _formdata: ICustomerFormData = initCustomerFormData(customer);
	_formdata.model = structuredClone(customer);
	if (validCusForm()) {
		let _url = "/PGCustomer/Edit";
		// console.log("formdata:", _formdata);
		// return false;

		openWaitingModal();
		$.ajax({
			type: "POST",
			url: _url,
			data: _formdata,
			success: function () {
				closeWaitingModal();
				window.location.href = "/PGCustomer/Index";
			},
			dataType: "json",
		});
	}
});

$(document).on("click", "#mplus", function () {
	_mobilecount++;
	console.log("mobilecount:" + _mobilecount);
	if (_mobilecount <= 3) {
		$(".mobile:first")
			.clone()
			.insertAfter(".mobile:last")
			.addClass("my-1")
			.attr("id", `cusAddrPhone${_mobilecount}`)
			.attr("name", `cusAddrPhone${_mobilecount}`);
	}
});

$(document).on("change", "#cusName", function () {
	let $cusname = $(this);
	let _cname = <string>$cusname.val();
	if (_cname !== "" && _cname.toUpperCase() === "GUEST") {
		$.fancyConfirm({
			title: "",
			message: guestcantaddedmsg,
			shownobtn: false,
			okButton: oktxt,
			noButton: canceltxt,
			callback: function (value) {
				if (value) {
					$cusname.val("").trigger("focus");
				}
			},
		});
	}
});

$(document).on("change", "#cusFirstName", function () {
	_firstname = <string>$(this).val();
	fillFullName();
});
$(document).on("change", "#cusLastName", function () {
	_lastname = <string>$(this).val();
	fillFullName();
});

$(document).on("change", "#cusEmail", function () {
	let $email = $(this);
	let _email: string = <string>$email.val();
	if (_email !== "") {
		if (maillist.includes(_email)) {
			$.fancyConfirm({
				title: "",
				message: $infoblk.data("duplicatedemailalert"),
				shownobtn: true,
				okButton: oktxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						$email.trigger("focus");
					} else {
						$email.val("").trigger("focus");
					}
				},
			});
		}
	}
});

$(document).on("change", "#isActive", function () {
	if ($(this).is(":checked")) {
		$("#IsActive").val(1);
	} else {
		$("#IsActive").val(0);
	}
});

$(function () {
	setFullPage();
	$target = $(".colheader").eq(parseInt(<string>$("#sortcol").val()));
	let sortcls =
		$("#sortorder").val() === "asc" ? "fa fa-sort-up" : "fa fa-sort-down";
	$target.addClass(sortcls);
	$target = $(".pagination");
	$target
		.wrap('<nav aria-label="Page navigation"></nav>')
		.find("li")
		.addClass("page-item")
		.find("a")
		.addClass("page-link");

	initModals();
	triggerMenu(1, 2);

	fillInCustomer();
	fillInCities();

	let $cusname = $("#cusName");
	let $salecomment = $("#cusSaleComment");
	if (approvalmode) {
		if (!editmode) {
			$salecomment.val("BR:");
		}
		$salecomment.trigger("focus");
	} else {
		$cusname.trigger("focus");
	}
	$cusname.attr("maxlength", maxconamelength);
});
