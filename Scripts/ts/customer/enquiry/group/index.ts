$infoblk = $("#infoblk");
$(document).on("click", ".remove", function () {
	handleEnquiryGroupRemove(Number($(this).data("id")), true);
});


function editEnquiryGroup(Id: number) {
	let idx = -1;
	if (EnquiryGroupList.length > 0) {
		idx = EnquiryGroupList.findIndex(x => x.Id == Id);
		if (idx >= 0) EnquiryGroup = structuredClone(EnquiryGroupList[idx]);
		//console.log("EnquiryGroup:", EnquiryGroup);
		if (EnquiryGroup) {
			enquiryGroupModal.find("#txtGroupName").val(EnquiryGroup.egName);
			enquiryGroupModal.find("#txtRemark").val(EnquiryGroup.Remark);
		}
	}
}

function handleEnquiryGroupRemove(Id: number, frmGroupIndex: boolean = false) {
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
					url: "/EnquiryGroup/Remove",
					data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), Id, PageNo },
					success: function (data) {
						closeWaitingModal();
						if (data) {
							if (frmGroupIndex) window.location.href = "/EnquiryGroup/Index";
							else {
								resetEnquiryGroupModal();
								EnquiryGroupList = data.List.slice(0);
								RecordCount = data.RecordCount;
								populateEnquiryGroupList();
							}
						}
					},
					dataType: "json"
				});
			} else {
				if (!frmGroupIndex)
					enquiryGroupModal.find("#txtGroupName").trigger("focus");
			}
		}
	});
}
$(function () {
	forenquirygroup = true;
	setFullPage();
	gTblId = "tblEnquiryGroup";
	gFrmId = "frmEnquiryGroup";
	triggerMenuByCls("menucustomer", 5);
	initModals();

	ConfigSimpleSortingHeaders();
});