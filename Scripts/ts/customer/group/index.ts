$infoblk = $("#infoblk");
$(document).on("click", ".remove", function () {
	handleCustomerGroupRemove(Number($(this).data("id")), true);
});


function editCustomerGroup(Id: number) {
	let idx = -1;
	if (CustomerGroupList.length > 0) {
		idx = CustomerGroupList.findIndex(x => x.Id == Id);
		if (idx >= 0) CustomerGroup = structuredClone(CustomerGroupList[idx]);
		//console.log("CustomerGroup:", CustomerGroup);
		if (CustomerGroup) {
			customerGroupModal.find("#txtGroupName").val(CustomerGroup.cgName);
			customerGroupModal.find("#txtRemark").val(CustomerGroup.Remark);
		}
	}
}

function handleCustomerGroupRemove(Id: number, frmGroupIndex: boolean = false) {
	if (!PageNo) PageNo = 1;
	$.fancyConfirm({
		title: "",
		message: confirmremovetxt,
		shownobtn: true,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				openWaitingModal();
				$.ajax({
					type: "POST",
					url: "/CustomerGroup/Remove",
					data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), Id, PageNo },
					success: function (data) {
						closeWaitingModal();
						if (data) {
							if (frmGroupIndex) window.location.href = "/CustomerGroup/Index";
							else {
								resetCustomerGroupModal();
								CustomerGroupList = data.List.slice(0);
								RecordCount = data.RecordCount;
								populateCustomerGroupList();
							}
						}
					},
					dataType: "json"
				});
			} else {
				if (!frmGroupIndex)
					customerGroupModal.find("#txtGroupName").trigger("focus");
			}
		}
	});
}
$(function () {
	forcustomergroup = true;
	setFullPage();
	gTblId = "tblCustomerGroup";
	gFrmId = "frmCustomerGroup";
	triggerMenu(1, 4);
	initModals();

	ConfigSimpleSortingHeaders();
});