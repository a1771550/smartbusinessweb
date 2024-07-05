$infoblk = $("#infoblk");
editmode = Number($("#Id").val()) > 0;

$(document).on("click", "#btnSaveIQ", function () {
	itemQtyPromotion = fillItemQtyPromotion();
	itemQtyPromotion.DicPromotionItems[$("#drpPromotion").val() as string] = $(
		"#drpItems"
	).val() as string[];

	//console.log(itemQtyPromotion);
	//return;

	openWaitingModal();
	$.ajax({
		//contentType: 'application/json; charset=utf-8',
		type: "POST",
		url: "/ItemQtyPromotion/Edit",
		data: {
			__RequestVerificationToken: $(
				"input[name=__RequestVerificationToken]"
			).val(),
			model: itemQtyPromotion,
		},
		success: function (data) {
			if (data) window.location.href = "/ItemQtyPromotion/Index";
		},
		dataType: "json",
	});
});

$(document).on("change", "#drpCategories", function () {
	const catIds: string = ($(this).val() as string[]).join();
	let currentSelectedItemCodes: string[] = $("#drpItems").val() as string[];

	$.ajax({
		type: "GET",
		url: "/Api/GetItemsByCategories",
		data: { catIds },
		success: function (data: IItem[]) {
			if (data) {
				let selectedItemCodes: string[] = (
					$infoblk.data("selecteditemcodes") as string
				).split(",");

				currentSelectedItemCodes =
					currentSelectedItemCodes.concat(selectedItemCodes);

				$("#drpItems")
					.empty()
					.append(
						data.map(function (i) {
							return $("<option/>", { value: i.itmCode, text: i.itmName });
						})
					);

				$("#drpItems").val(currentSelectedItemCodes);
			}
		},
		dataType: "json",
	});
});

$(function () {
	setFullPage();
	initModals();
	triggerMenuByCls("menupromotion", 3);
	$(".s2").select2();
	$("#drpCategories").trigger("focus");
});
