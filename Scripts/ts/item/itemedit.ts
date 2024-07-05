$infoblk = $("#infoblk");

$(function () {    	
	setFullPage();
	triggerMenuByCls("menuitem", 0);  
    EditItem = $infoblk.data("edititem") == "True";
    CodeNameList = $infoblk.data("codenamelist");  
    supcodelist = $infoblk.data("supcodelist").split(",");
	initModals();

	$("#itmCode").trigger("focus");
	//console.log('codelist:', codelist);
	DicAcAccounts = $infoblk.data("jsondicacaccounts");
	//console.log('dicacaccounts:', dicAcAccounts);
	editmode = <number>$("#itmItemID").val() > 0;
	if (editmode) {
		ItemVariations = $infoblk.data("jsonitemvariations");
		SelectedIVList = $infoblk.data("jsonselectedivlist");

		//console.log(ItemVariations);
		if (ItemVariations.length === 0) {
			selectedItem = $infoblk.data("jsonitem");
			fillInItemForm(true);
		} else {
			$("#itemattrblk").hide();
			DicIVLocQty = $infoblk.data("jsondicivlocqty");
			// console.log(DicIVLocQty);

			if (!EditItem && SelectedIVList.length) {
				ItemVari = $infoblk.data("jsonitemvari");
				//console.log(ItemVari);
				fillInItemForm(true);
				$("#lblIVStatus").css({ color: "green" }).text(savedtxt);
				ItemVari!.SelectedAttrList4V = [];
			} else {
				//ItemVari = ItemVariations[0];
				selectedItem = $infoblk.data("jsonitem");
				//console.log(selectedItem);
				fillInItemForm(false);
				$("#lblIVStatus")
					.css({ color: "red" })
					.text(unsavedtxt)
					.parent("label")
					.removeClass("alert-info")
					.addClass("alert-danger");
				selectedItem!.SelectedAttrList4V = [];
			}
			$(".drpItemAttr").first().trigger("focus");
		}
		ItemAttrList = []; //only when btnEditItemAttr is clicked is filled the itemattrlist for accordion...
	} else {
		selectedItem = initItem();
		selectedItem!.itmIsNonStock = false;
		selectedItem!.itmIsActive = true;
		if (!NonABSS) {
			$("#drpInventory").val("A");
			$(".accountno").eq(2).val("1-3000");
			selectedItem!.InventoryAccountID = 117;
		}
		$("#drpCategory").val(1);
	}

});
