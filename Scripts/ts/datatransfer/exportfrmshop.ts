$infoblk = $("#infoblk");
lang = parseInt($infoblk.data("lang"));
checkoutportal = $infoblk.data("checkoutportal");

$(document).on("change", "#kingdee", function () {
	changeCheckoutPortal("kingdee", "export");
});
$(document).on("change", "#abss", function () {
	changeCheckoutPortal("abss", "export");
});

$(document).on("click", ".export", function () {
	let offline: boolean = $infoblk.data("isoffline") == "1";
	let type = $(this).data("type") as string;
	$("#exportType").val(type);
	$.ajax({
		type: "GET",
		url: "/Api/CheckIfFileLocked",
		data: { file: "" },
		success: function (data) {
			if (data == "1") {
				$.fancyConfirm({
					title: "",
					message: abssfilelockedalerttxt,
					shownobtn: false,
					okButton: oktxt,
					noButton: notxt,
				});
			}
			else {
				openWaitingModal();
				let url = offline
					? "/DataTransfer/DoExportFrmShop"
					: "/DataTransfer/DoExportFrmShopAsync";
				$.ajax({
					type: "POST",
					url: url,
					data: $("#frmExport").serialize(),
					success: function (data) {
						//console.log("returned data:", data);
						$.fancyConfirm({
							title: "",
							message: $infoblk.data("importdonemsg"),
							shownobtn: false,
							okButton: oktxt,
							noButton: canceltxt,
							callback: function (value) {
								if (value) {
									if (data.PendingInvoices == 1) {
										window.location.href = "/POSFunc/PendingInvoices";
									}
									if (data.ExcludedInvoices == 1) {
										window.location.href = "/POSFunc/ExcludedInvoices";
									}
									else {
										if (data.PendingInvoices == 1) {
											url = "/POSFunc/PendingInvoices";
											if (forproview) url = "/WholeSales/ZeroStocks";
											window.open(url);
										} else {
											$(`.export.${type}`).addClass("disabled").off("click");
										}
									}
								}
							},
						});
						closeWaitingModal();
					},
					dataType: "json",
				});
			}
		},
		dataType: "json",
	});
});

$(function () {
	setFullPage();
	initModals();
});

