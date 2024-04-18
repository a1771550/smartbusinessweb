$infoblk = $("#infoblk");

enablebuysellunits = $infoblk.data("enablebuysellunits") == "True";

function handleReserveSaved() {
	$(`${gTblName} tbody tr`).each(function (i, e) {
		$(e)
			.find("td:gt(3)")
			.each(function (k, v) {
				let $input = $(v).find("input");
				//console.log('has class locqty?', $input.hasClass('locqty'));
				if ($input.hasClass("locqty")) {
					let jsstock: IJsStock = initJsStock();
					let Id: number = <number>$input.data("id");
					let itmCode: string = $input.data("code") as string;
					//console.log('id:' + Id);
					//if (Id > 0) {
					jsstock.Id = Id;
					let shop: any = $input.data("shop");
					if (!isNaN(shop)) {
						shop = Number(shop).toString();
					}
					//   console.log("shop:" + shop);
					jsstock.LocCode = shop;
					jsstock.itmCode = itmCode;
					jsstock.Qty = Number($input.val());
					//   console.log("qty:" + jsstock.Qty);
					JsStockList.push(jsstock);
					//}
				}
			});
	});
	console.log("JsStockList:", JsStockList);
	console.log("Reserve:", Reserve);
	console.log("ReserveLnList:", ReserveLnList);
	return false;

	if (JsStockList.length > 0 && ReserveLnList.length > 0) {
		$.ajax({
			type: "POST",
			url: "/Reserve/ProcessReserve",
			data: {
				__RequestVerificationToken: $(
					"input[name=__RequestVerificationToken]"
				).val(),
				JsStockList,
				Reserve,
				ReserveLnList,
			},
			success: function (data) {
				if (data) {
					$.fancyConfirm({
						title: "",
						message: data.msg,
						shownobtn: false,
						okButton: oktxt,
						noButton: notxt,
						callback: function (value) {
							if (value) {
								window.location.reload();
								window.open("/Reserve/Print", "_blank");
								//window.location.href = '/Reserve/Print';
							}
						},
					});
				}
			},
			dataType: "json",
		});
	}

}

$(document).on("click", "#btnReserve", function () {
	let qty = 0;

	$(`${gTblName} tbody tr`).each(function (i, e) {
		qty += Number($(e).find(".reserve").val());
	});

	if (qty === 0) {
		$.fancyConfirm({
			title: "",
			message: $infoblk.data("reserveitemqtyrequired"),
			shownobtn: false,
			okButton: oktxt,
			noButton: notxt,
			callback: function (value) {
				if (value) {
					$(`${gTblName} tbody tr`).first().find(".locqty").first().trigger("focus");
				}
			}
		});
	} else {
		openReserveModal();
	}

});

$(document).on("click", "#btnReload", function () {
	window.location.href = "/Reserve/Index";
});
$(document).on("dblclick", ".itemoption.locqty", function () {
	openWaitingModal();
	window.location.href = "/Reserve/Reserve?hasItemOption=1&hasIvOnly=0&itemId=" + $(this).data("itemid") + "&location=" + $(this).data("shop") + "&qty=" + $(this).val() + "&stcode=" + $("#stCode").text();
});
$(document).on("dblclick", ".vari.locqty", function () {
	openWaitingModal();
	window.location.href = "/Reserve/Reserve?hasItemOption=0&hasIvOnly=1&itemId=" + $(this).data("itemid") + "&location=" + $(this).data("shop") + "&qty=" + $(this).val() + "&stcode=" + $("#stCode").text();
});

$(document).on("click", "#btnReload", function () {
	window.location.href = "/Reserve/Index";
});

$(document).on("click", "#btnSearch", function (e) {
	e.preventDefault();
	$("#frmReserve").trigger("submit");
});
$(document).on("click", ".colheader", function () {
	let $sortcol = $("<input>").attr({
		type: "hidden",
		name: "SortCol",
		value: $(this).data("col"),
	});
	$("#txtKeyword").val($(this).data("keyword"));

	$("#frmReserve")
		.append($sortcol)
		.trigger("submit");
});
$(function () {
	setFullPage();
	triggerMenu(2, 5);
	initModals();
	forreserve = true;
	gTblName = "tblReserve";
	gFrmName = "frmReserve";
	ReserveCode = <string>$("#rvCode").text();
	shops = $infoblk.data("shops") ? (<string>$infoblk.data("shops")).split(",") : [];

	let $sortorder = $("#sortorder");
	let $sortcol = $("#sortcol");
	console.log('sortorder:' + $sortorder.val() + ';sortcol:' + $sortcol.val());
	$target = $(".colheader").eq(Number($sortcol.val()));
	let sortcls =
		$sortorder.val() === "desc" ? "fa fa-sort-up" : "fa fa-sort-down";
	$target.addClass(sortcls);

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


	DicIDItemOptions = $infoblk.data("jsondiciditemoptions");

	$("#norecord").addClass("hide"); //hide() methods not work!!!
	$("#txtKeyword").trigger("focus");
});
