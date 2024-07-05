$infoblk = $("#infoblk");

$(document).on("change", "#chkAPI", function () {
	const useapi = $(this).is(":checked") ? 1 : 0;
	$("#useapi").val(useapi);
	toggleForEx(useapi);
});

$(document).on("click", "#btnSave", function () {
	initExList();
	//console.log("dicexlist:", DicExList);
	//console.log("useapi:", $("#useapi").val());
	//return false;
	$.ajax({
		type: "POST",
		url: "/BasicSettings/ExchangeRate",
		data: {
			__RequestVerificationToken: $(
				"input[name=__RequestVerificationToken]"
			).val(),
			model: DicExList,
			useapi: $("#useapi").val(),
		},
		success: function (data) {
			console.log("data:", data);
			if (data) {
				$.fancyConfirm({
					title: "",
					message: data,
					shownobtn: false,
					okButton: oktxt,
					noButton: notxt,
					callback: function (value) {
						if (value) {
							window.location.href = "/BasicSettings/ExchangeRate";
						}
					},
				});
			}
		},
		dataType: "json",
	});
});

$(document).on("click", ".remove", function () {
	let idx: number = <number>$(this).parent("td").parent("tr").data("idx");
	console.log("idx:" + idx);
	let currency: string = <string>(
		$(this).parent("td").parent("tr").find("td:first").find(".currency").val()
	);
	$.fancyConfirm({
		title: "",
		message: confirmremovetxt,
		shownobtn: true,
		okButton: oktxt,
		noButton: notxt,
		callback: function (value) {
			if (value) {
				if (DicExList.hasOwnProperty(currency)) delete DicExList[currency];
				$("#tblExRate tbody tr").eq(idx).remove();
				$("#btnSave").trigger("click");
			}
		},
	});
});

$(document).on("click", "#btnAdd", function () {
	$target = $("#tblExRate tbody");
	let idx: number = <number>$target.find("tr:last").data("idx");
	idx++;
	var html = `<tr data-idx="${idx}"><td class="currency"><input type="text" class="form-control currency" /></td><td class="rate"><input type="number" class="form-control rate" value="1" /></td><td><button class="btn btn-danger remove">${$infoblk.data(
		"removetxt"
	)}</button></td></tr>`;
	$target.append(html);
	$target.find("tr:last").find("td:first").find(".currency").trigger("focus");
});

function toggleForEx(useapi: number) {
	if (useapi === 1) {
		//console.log("checked");
		$.ajax({
			type: "GET",
			url: "https://api.freecurrencyapi.com/v1/latest?apikey=HDs6UlKfcrhu5qov6S1YSjtIF5xlPHeWK7zUw08p&currencies=USD%2CCNY%2CEUR%2CGBP%2CAUD%2CHKD&base_currency=HKD",
			data: {},
			success: function (data) {
				if (data) {
					//console.log("data:", data.data);
					let html = "";
					//let exhtml = "";
					for (const [key, value] of Object.entries(data.data)) {
						const exrate = 1 / Number(value);
						DicCurrencyExRate[key] = exrate;
						html += `<tr class="currency api" data-key="${key}" data-value="${exrate}"><td>${key}</td><td>${formatexrate(exrate.toString())}</td></tr>`;
					}
					$("#tblExRate tbody tr").addClass("abss hide");
					$("#btnAdd").hide();
					// $("#tblExRate thead tr").find("th").last().hide();
					$("#tblExRate tbody").append(html);

					// $("#forexoperator").text("*");
				}
			},
			dataType: "json",
		});
	} else {
		$("#tblExRate tbody tr.api").hide();
		$("#btnAdd").show();
		// $("#tblExRate thead tr").find("th").last().show();
		$("#tblExRate tbody tr.abss").removeClass("hide");
		// $("#forexoperator").text("/");
	}
}

function initExList() {
	$target = $("#tblExRate tbody tr");
	$target.each(function (i, e) {
		let currency: string = <string>(
			$(e).find("td:first").find(".currency").val()
		);
		let rate: number = <number>$(e).find("td:eq(1)").find(".rate").val();
		if (currency != null && currency != "" && rate != null && rate != 0) {
			DicExList[currency] = rate;
		}
	});
}
$(function () {
	setFullPage();
	initModals();
	triggerMenuByCls("menusetup", 4);
	const useapi = Number($("#useapi").val());
	toggleForEx(useapi);
});
