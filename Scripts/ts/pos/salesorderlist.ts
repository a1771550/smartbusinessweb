$infoblk = $("#infoblk");
frmlist = true;
searchmodes = "";
searchmodelist =
	$("#searchmode").length && $("#searchmode").val() !== ""
		? ($("#searchmode").val() as string).split(",")
		: [];

$(document).on("click", "#btnFilter", function (e: JQuery.Event) {
	e.preventDefault();
	if (isapprover) {
		$("#frmSalesOrder").trigger("submit");
	} else {
		if (searchmodelist.length === 0) searchmodelist.push("0");
		$("#searchmode").val(searchmodelist.join(","));
		$("#frmSalesOrder").trigger("submit");
	}
});

$(document).on("dblclick", ".remark", function () {
	$.fancyConfirm({
		title: "",
		message: $(this).data("remark") as string,
		shownobtn: false,
		okButton: oktxt,
		noButton: notxt,
	});
});

$(document).on("change", "#txtKeyword", function () {
	var keyword = $(this).val() as string;
	if (keyword !== "") {
		$("#searchmode").val(searchmodelist.join(","));
	}
});

$(document).on("change", ".searchmode", function () {
	const _search = $(this).is(":checked");
	const _mode = $(this).val() as string;
	if (_search) {
		searchmodelist.push(_mode);
	} else {
		var idx = searchmodelist.findIndex((x) => { return x == _mode; });
		searchmodelist.splice(idx, 1);
	}
	console.log(searchmodelist);
	//return;
	$("#searchmode").val(searchmodelist.join(","));
});

$(document).on("click", ".whatsapp", function () {
	//訂單 AL100098 (顧客 Chan Sek Hung ) 正在等待您的批准 (跟司機;商品行:1)。
	const orderId = $(this).data("id");
	$.ajax({
		type: "GET",
		url: "/Api/GetWhatsAppMsg",
		data: { orderId },
		success: function (data) {
			if (data) {
				const phoneno: string = data.specialapproval
					? "85261877187"
					: "85264622867";

				let whatsapplnk: string = decodeURIComponent(
					$infoblk.data("whatsapplinkurl") as string
				);
				whatsapplnk = whatsapplnk
					.replace("{0}", phoneno)
					.replace("{1}", data.msg);

				console.log("msg:" + data.msg);
				// return;
				window.open(whatsapplnk, "_blank");
			}
		},
		dataType: "json",
	});
});

$(document).on("click", ".detail", function () {
	let Id = $(this).data("id");
	let status: string = $(this).data("status").toString();
	//  console.log(status);
	let url = "";
	if (status.toLowerCase() == SalesStatus.presettling.toString() || status.toLowerCase() == SalesStatus.depositsettling.toString()) url = `/Preorder/Edit?Id=${Id}`;
	if (status.toLowerCase() == SalesStatus.presettled.toString() || status.toLowerCase() == SalesStatus.depositsettled.toString() || status.toLowerCase() == SalesStatus.created.toString()) url = `/SalesOrder/Get?Id=${Id}`;
	// return false;
	window.open(url,
		"_self"
	);
});

$(document).on("click", ".copy", function () {
	$(this).addClass("disabled").off("click");
	recurOrder = initRecurOrder();
	recurOrder.Mode = "savefrmposted";
	recurOrder.rtsUID = $(this).data("id") as number;
	selectedCus = {} as ICustomer;
	$target = $(this).parent("td").parent("tr").find("td.customer");
	selectedCus.cusCode = $target.data("code");
	selectedCus.cusName = $target.data("name");
	openRecurOrderModal();
});
$(function () {
	forsales = true;
	isapprover = $infoblk.data("isapprover") === "True";
	gFrmId = "frmSalesOrder";
	setFullPage();
	triggerMenu(0, 3);

	ConfigSimpleSortingHeaders();

	initModals();	

	$(".disabled").off("click");

	if (!$("#norecord").length)
		initDatePickers(StartDayEnum.LastMonthToday, 'YYYY-MM-DD');
});
