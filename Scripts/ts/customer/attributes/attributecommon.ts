$infoblk = $("#infoblk");
class attform extends SimpleForm {
	constructor(edit) {
		super(edit);
	}
	validform(): boolean {
		console.log("selectedattribute:", selectedAttribute);
		let msg: string = "";

		if (selectedAttribute.attrName === "") {
			msg += attrnamerequired + "<br>";
		}
		if (selectedAttribute.attrValue === "") {
			msg += attrvalrequiredtxt + "<br>";
		}

		if (msg !== "") {
			$.fancyConfirm({
				title: "",
				message: msg,
				shownobtn: false,
				okButton: oktxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						//openComboModal();
						if (selectedAttribute.attrName === "") {
							$("#attrName").addClass("focus");
						}
						if (selectedAttribute.attrValue === "") {
							$("#attrValue").addClass("focus");
						}
						$("#frmAttribute").find(".focus").eq(0).focus();
					}
				},
			});
		}
		return msg === "";
	}
	submitForm() {
		console.log("attribute:", selectedAttribute);
		//console.log('edit:', this.edit);
		_submitForm(this.edit);
	}
}

function _submitForm(_edit: boolean = false) {
	let token = $("input[name=__RequestVerificationToken]").val();
	//return false;
	openWaitingModal();
	let contactId = selectedAttribute.contactId;
	let apId = selectedAttribute.AccountProfileId;
	if (contactId > 0 && apId > 0) {
		$.ajax({
			type: "POST",
			url: "/CustomerAttribute/Save",
			data: { __RequestVerificationToken: token, attribute: selectedAttribute },
			success: function (data) {
				closeWaitingModal();
				//selectedAttribute = initAttribute();
				console.log("returned data:", data);
				console.log("edit:", _edit);
				//return false;
				if (_edit) {
					$.fancyConfirm({
						title: "",
						message: data,
						shownobtn: false,
						okButton: oktxt,
						noButton: notxt,
						callback: function (value) {
							if (value) {
							}
						},
					});
				} else {
					window.location.href = `/${$infoblk.data(
						"returnurl"
					)}?contactId=${contactId}&accountProfileId=${apId}`;
				}
			},
			dataType: "json",
		});
	}
}
$(document).on("click", "#comboModal .container .plus", function () {
  if (editmode) {
    addValRows(selectedAttribute, dicAttrVals[selectedAttribute.attrId], true);
  } else {
    if (typeof selectedAttribute !== "undefined") {
      console.log("selectedattribute.attvalues:", selectedAttribute.attrValue);
      addValRows(selectedAttribute, selectedAttribute.attrValue, true);
    } else {
      addValRows(selectedAttribute, "", true);
    }
  }
});
