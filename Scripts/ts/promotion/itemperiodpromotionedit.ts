$infoblk = $("#infoblk");
editmode = Number($("#Id").val()) > 0;

$(document).on("click", "#btnSaveIP", function () {
	itemPeriodPromotion = fillItemPeriodPromotion();
	itemPeriodPromotion.DicPromotionItems[$("#drpPromotion").val() as string] = $(
		"#drpItems"
	).val() as string[];

	openWaitingModal();
	$.ajax({
		//contentType: 'application/json; charset=utf-8',
		type: "POST",
		url: "/ItemPeriodPromotion/Edit",
		data: {
			__RequestVerificationToken: $(
				"input[name=__RequestVerificationToken]"
			).val(),
			model: itemPeriodPromotion,
		},
		success: function (data) {
			if (data) window.location.href = "/ItemPeriodPromotion/Index";
		},
		dataType: "json",
	});
});


$(function () {
	setFullPage();
	initModals();
	triggerMenuByCls("menupromotion", 2);
	$(".s2").select2({
		tags: true,
	});
	$("#drpCategories").trigger("focus");
});
