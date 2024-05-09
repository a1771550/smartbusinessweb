$infoblk = $("#infoblk");

$(document).on("dblclick", ".hotid", function () {
	closeHotListModal();
	if (CodeList.length > 0) {
		IdList = [];
		IdList.push(Number($(this).data('id')));
		handleHotListCustomers();
	}
});

function handleHotListCustomers() {
	IdList = [];
	let eblasts: string[] = dropdownModal.find("#drpEblast").val() as string[];
	//console.log(eblasts);
	if (eblasts.length == 1) IdList.push(Number(eblasts[0]));
	else {
		eblasts.forEach((x) => {
			IdList.push(Number(x));
		});
	}
	let groups = dropdownModal.find("#drpCustomerGroup").val() as string[];
	if (groups.length == 1) CodeList.push(groups[0]);
	else {
		groups.forEach((x) => {
			CodeList.push(x);
		});
	}	
	if (CodeList.length > 0) {
		openWaitingModal();
		$.ajax({
			type: "POST",
			url: '/HotList/AddCustomers',
			data: { __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(), cusCodes: CodeList, IdList },
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
$(document).on('click', '#btnHotList', function (e) {
	forhotlist = true;
	e.preventDefault();
	e.stopPropagation();
	populateDropDown4HotListsCusGroupList();
	openDropDownModal();
});

$(document).on("click", "#btnBlast", function (e) {
	e.preventDefault();
	e.stopPropagation();
	populateDropDown4EblastCusGroupList();	
	openDropDownModal();
});



function handleEblastCustomers() {	
	IdList = [];
	let eblasts: string[] = dropdownModal.find("#drpEblast").val() as string[];
	//console.log(eblasts);
	if (eblasts.length == 1) IdList.push(Number(eblasts[0]));
	else {
		eblasts.forEach((x) => {
			IdList.push(Number(x));
		});
	}
	let groups = dropdownModal.find("#drpCustomerGroup").val() as string[];
	if (groups.length == 1) CodeList.push(groups[0]);
	else {
		groups.forEach((x) => {
			CodeList.push(x);
		});
	}	
	//console.log("IdList:", IdList);
	//console.log("CodeList:", CodeList);
	//return;
	openWaitingModal();
	$.ajax({
		type: "POST",
		url: "/Customer/AddToEblast",
		data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), cusCodes: CodeList, IdList },
		success: function (msg) {
			closeWaitingModal();			
			//console.log(msg);
			if (msg) {
				$.fancyConfirm({
					title: "",
					message: msg,
					shownobtn: false,
					okButton: oktxt,
					noButton: notxt,
					callback: function (value) {
						if (value) {
							$("#txtKeyword").trigger("focus");
						}
					}
				});	
			}
		},
		dataType: "json"
	});
}

$(document).on("click", ".customattrs", function () {
	if ($(this).text() !== "" && $(this).text().trim() !== "")
		openDescModal($(this).html().trim(), customattributetxt, 500);
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

$(document).on("click", "#btnSearch", function () {
	$("#frmCustomer").trigger("submit");
});

$(document).on("click", "#btnGroup", function (e) {
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
		openCustomerGroupModal();
	}

});

function populateDropDown4HotListsCusGroupList() {
	$.ajax({
		type: "GET",
		url: "/Api/GetHotListsCusGroupList",
		data: {},
		success: function (data) {
			if (data) {
				HotLists = data.HotLists.slice(0);
				//console.log("EblastList:", EblastList);
				HotLists.forEach((x) => {
					openDropDownModal();
					$target = dropdownModal.find("select").first();
					$target.append($("<option>", {
						value: x.Id,
						text: x.hoName
					}));
				});
				CustomerGroupList = data.CustomerGroupList.slice(0);
				CustomerGroupList.forEach((x) => {
					openDropDownModal();
					$target = dropdownModal.find("#drpCustomerGroup");
					$target.append($("<option>", {
						value: x.Id,
						text: x.cgName
					}));
				});

				dropdownModal.find("select").select2();
			}
		},
		dataType: "json"
	});
}

function populateCustomerGroupList() {
	//console.log("CustomerGroupList#popu:", CustomerGroupList);
	if (CustomerGroupList.length > 0) {
		let html = "";
		CustomerGroupList.forEach((x) => {
			html += `<tr data-id="${x.Id}">`;
			html += `<td class="text-center"><input type="text" class="form-control text-center name" readonly value="${x.cgName}"></td>`;
			html += `<td class="text-center">${x.CustomerNames}</td>`;
			html += `<td class="text-center"><input type="text" class="form-control remark" title="${x.Remark}" value="${x.RemarkDisplay}" readonly></td>`;
			html += `<td class="text-center">${x.CreateTimeDisplay}</td>`;

			html += `<td class="text-center">
				<button type="button" class="btn btn-info edit" onclick="editCustomerGroup(${x.Id})">${edittxt}</button>
				<button type="button" class="btn btn-danger remove" data-id="${x.Id}" onclick="handleCustomerGroupRemove(${x.Id})">${removetxt}</button>
			</td>`;

			html += `<td class="text-center">
						<input type="checkbox" class="chk group" data-id="${x.Id}" value="${x.Id}" />
					</td>`;
			html += "</tr>";
		});
		customerGroupModal.find("#tblCustomerGroup tbody").empty().append(html);

		customerGroupModal.find(".Pager").ASPSnippets_Pager({
			ActiveCssClass: "current",
			PagerCssClass: "pager",
			PageIndex: PageNo,
			PageSize: PageSize,
			RecordCount: RecordCount,
		});
	}
}
function populateDropDown4EblastCusGroupList() {
	$.ajax({
		type: "GET",
		url: "/Api/GetEblastListCusGroupList",
		data: {},
		success: function (data) {
			if (data) {
				EblastList = data.EblastList.slice(0);
				//console.log("EblastList:", EblastList);
				EblastList.forEach((x) => {
					openDropDownModal();
					$target = dropdownModal.find("#drpEblast");
					$target.append($("<option>", {
						value: x.Id,
						text: x.blSubject
					}));
				});
				CustomerGroupList = data.CustomerGroupList.slice(0);
				CustomerGroupList.forEach((x) => {
					openDropDownModal();
					$target = dropdownModal.find("#drpCustomerGroup");
					$target.append($("<option>", {
						value: x.Id,
						text: x.cgName
					}));
				});

				dropdownModal.find("select").select2();
			}
		},
		dataType: "json"
	});
}
function handleCustomerGroupSaved() {
	let $groupname = customerGroupModal.find("#txtGroupName");
	let groupname: string = $groupname.val();
	if (groupname) {
		if (!PageNo) PageNo = 1;
		CustomerGroup = { Id: 0, cgName: groupname, cusCodes: CodeList.join(), Remark: customerGroupModal.find("#txtRemark").val() } as ICustomerGroup;
		//console.log("CustomerGroup:",CustomerGroup)
		//return;
		$.ajax({
			type: "POST",
			url: "/CustomerGroup/Save",
			data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), CustomerGroup, PageNo, IdList, CodeList },
			success: function (data) {
				if (data) {
					resetCustomerGroupModal();
					CustomerGroupList = data.List.slice(0);
					RecordCount = data.RecordCount;
					populateCustomerGroupList();
				}
			},
			dataType: "json"
		});
	} else {
		$groupname.trigger("focus").next(".text-danger").text(groupnamerequiredtxt);
	}
}

function GetCustomerGroupList(pageNo: number) {
	PageNo = pageNo;
	let data = { PageNo };
	openWaitingModal();
	$.ajax({
		url: "/CustomerGroup/GetListAjax",
		type: "GET",
		data: data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: OnGetCustomerGroupListSuccess,
		error: onAjaxFailure,
	});
}

function OnGetCustomerGroupListSuccess(response) {
	closeWaitingModal();

	if (response) {
		CustomerGroupList = response.List.slice(0);

		$target = dropdownModal.find("#drpCustomerGroup");

		RecordCount = response.RecordCount;
		populateCustomerGroupList();

		customerGroupModal.find(".Pager").ASPSnippets_Pager({
			ActiveCssClass: "current",
			PagerCssClass: "pager",
			PageIndex: PageNo,
			PageSize: PageSize,
			RecordCount: RecordCount,
		});
	} else {
		customerGroupModal.find(".Pager").hide();
	}

	keyword = "";
}
$(function () {
	forcustomer = true;
	setFullPage();
	gTblId = "tblCustomer";
	gFrmId = "frmCustomer";
	triggerMenu(1, 0);
	initModals();

	PageSize = $infoblk.data("pagesize");

	var checkall = getParameterByName("CheckAll");
	if (checkall !== null) {
		//console.log("checkall:" + checkall);
		let checked = checkall == "1";
		$(".chk").prop("checked", checked);
		handleCheckAll(checked);
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

	ConfigSimpleSortingHeaders();
});


