﻿$infoblk = $("#infoblk");

$(document).on("dblclick", ".hotid", function () {
	closeHotListModal();
	if (CodeList.length > 0) {
		handleHotListCustomer(Number($(this).data('id')));
	} 
});

function handleHotListCustomer(id) {
	//console.log('CodeList:', CodeList);
	if (CodeList.length > 0) {
		openWaitingModal();
		$.ajax({
			type: "POST",
			url: '/HotList/AddCustomers',
			data: { __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(), cusCodes: CodeList, hotlistId: id },
			success: function (data) {
				if (data) {
					$.fancyConfirm({
						title: '',
						message: data,
						shownobtn: false,
						okButton: oktxt,
						noButton: notxt,
						callback: function (value) {
							if (value) {
								closeWaitingModal();
								$('#txtKeyword').trigger("focus");
							}
						}
					});
				}
			},
			dataType: 'json'
		});
	}
}
$(document).on('click', '#btnHotList', function () {
	//console.log('codelist:', CodeList);
	if (CodeList.length === 0) {
		$.fancyConfirm({
			title: '',
			message: $infoblk.data('selectatleastonecustomertxt'),
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$('#txtKeyword').trigger("focus");
				}
			}
		});
	} else {
		GetHotLists(1);
	}
});

$(document).on("click", "#btnBlast", function (e) {
	e.preventDefault();
	e.stopPropagation();
	//console.log('CodeList:', CodeList);
	//return false;
	if (CodeList.length === 0) {
		$.fancyConfirm({
			title: '',
			message: $infoblk.data('selectatleastonecustomertxt'),
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$('#txtKeyword').trigger("focus");
				}
			}
		});
	} else {
		handleEblastCustomers();
	}
});

function handleEblastCustomers() {
	openWaitingModal();
	$.ajax({
		type: "POST",
		url: '/Customer/AddToEblast',
		data: { __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(), cusCodes: CodeList },
		success: function (data) {
			closeWaitingModal();
			if (data) {
				$.fancyConfirm({
					title: '',
					message: data,
					shownobtn: false,
					okButton: oktxt,
					noButton: notxt,
					callback: function (value) {
						if (value) {
							closeWaitingModal();
							$('#txtKeyword').trigger("focus");
						}
					}
				});
			}
		},
		dataType: 'json'
	});
}

$(document).on("click", ".customattrs", function () {
	if($(this).text()!=="" && $(this).text().trim()!=="")
		openDescModal($(this).html().trim(),customattributetxt,500);
});

$(document).on("dblclick", `#tblCustomer tbody tr`, function () {
	window.location.href = "/Customer/Edit?customerId=" + $(this).data("id");///Customer/Edit?customerId=@customer.cusCustomerID
});

$(document).on("click", ".btnminus", function () {
	let $ele = $(this).parent("div").parent("form");
	$target = $ele.prev("form");
	if (advancedSearchModal.find(".row").length > 1) {
		$ele.remove();
		$target.find(".attrval").trigger("focus");
	}
});
$(document).on("click", ".btnplus", function () {
	$(this).parent("div").parent("form").clone().appendTo(".default-border").find(".attrval").first().trigger("focus");
});
$(document).on("click", "#btnAdvSearch", function () {
	openAdvancedSearchModal();
});

$(document).on("click", ".remove", function () {
	cusCode = $(this).data("code");
	let token = $("input[name=__RequestVerificationToken]").val();
	$.fancyConfirm({
		title: "",
		message: confirmremove,
		shownobtn: true,
		okButton: oktxt,
		noButton: canceltxt,
		callback: function (value) {
			if (value) {
				$.ajax({
					type: "POST",
					url: "/Customer/Delete",
					data: {
						cusCode,
						__RequestVerificationToken: token,
					},
					success: function () {
						window.location.reload();
					},
					dataType: "json",
				});
			}
		},
	});
});

$(document).on("click", "#btnReload", function () {
	window.location.href = "/Customer/Index";
});

$(document).on("click", "#btnSearch", function (e) {
	e.preventDefault();
	//$("#sortorder").val("desc");
	$("#frmCustomer").trigger("submit");
});
$(document).on("click", ".colheader", function () {
	let $sortcol = $("<input>").attr({
		type: "hidden",
		name: "SortCol",
		value: $(this).data("col"),
	});
	let $keyword = $("<input>").attr({
		type: "hidden",
		name: "Keyword",
		value: $(this).data("keyword"),
	});

	let $sortcol_a = $("<input>").attr({
		type: "hidden",
		name: "SortCol_a",
		value: $(this).data("col"),
	});
	let $keyword_a = $("<input>").attr({
		type: "hidden",
		name: "Keyword_a",
		value: $(this).data("keyword"),
	});

	$("#frmCustomer")
		.append($sortcol)
		.append($keyword)
		.append($sortcol_a)
		.append($keyword_a)
		.trigger("submit");
});
$(function () {
	forcustomer = true;
	setFullPage();
	gTblName = "tblCustomer";
	triggerMenu(1, 0);
	initModals();

	let $sortorder = $("#sortorder");
	let $sortcol = $("#sortcol");
	//console.log('sortorder:' + $sortorder.val() + ';sortcol:' + $sortcol.val());
	$target = $(".colheader").eq(<number>$sortcol.val());
	let sortcls =
		$sortorder.val() === "desc" ? "fa fa-sort-up" : "fa fa-sort-down";
	$target.addClass(sortcls);

	let $sortorder_a = $("#sortorder_a");
	let $sortcol_a = $("#sortcol_a");
	let $target_a = $(".colheader_a").eq(<number>$sortcol_a.val());
	let sortcls_a =
		$sortorder_a.val() === "desc" ? "fa fa-sort-up" : "fa fa-sort-down";
	$target_a.addClass(sortcls_a);
	
	$target = $(".pagination");
	$target
		.wrap('<nav aria-label="Page navigation"></nav>')
		.find("li")
		.addClass("page-item")
		.find("a")
		.addClass("page-link");

	let keyword = getParameterByName("Keyword");
	if (keyword !== null) {
		$("#txtKeyword").val(keyword);
	}
	$(".pagination li").addClass("page-item");

	var checkall = getParameterByName("CheckAll");
	if (checkall !== null) {
		//console.log("checkall:" + checkall);
		let checked = checkall == "1";
		$(".chk").prop("checked", checked);
		handleCheckall(checked);
	}
	
	if ($infoblk.data('returnmsg')) {
		$.fancyConfirm({
			title: '',
			message: $infoblk.data('returnmsg'),
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$('#txtKeyword').trigger("focus");
				}
			}
		});
	}

	$("#norecord").addClass("hide"); //hide() methods not work!!!
	$("#txtKeyword").trigger("focus");
});