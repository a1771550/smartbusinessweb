$infoblk = $("#infoblk");
$(document).on("click", ".export", function () {
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
				let url = "/DataTransfer/DoExportFrmShopAsync";
				$.ajax({
					type: "POST",
					url: url,
					data: $("#frmExport").serialize(),
					success: function (data) {
						//console.log("returned data:", data);
						$.fancyConfirm({
							title: "",
							message: data.msg,
							shownobtn: false,
							okButton: oktxt,
							noButton: canceltxt,
							callback: function (value) {
								if (value) {
									if (data.PendingInvoices == 1) {
										window.location.href = "/POSFunc/PendingInvoices";
									}
									if (data.ExcludedInvoices == 1 || data.ExcludedWS == 1) {
										window.location.href = "/POSFunc/ExcludedInvoices";
									}
									if (data.ExcludedPO == 1) {
										window.location.href = "/Purchase/ExcludedOrders";
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
	lang = parseInt($infoblk.data("lang"));	
	setFullPage();
	initModals();
	triggerMenu(6, 1);
	initDatePickers();
});

