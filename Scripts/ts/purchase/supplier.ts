$infoblk = $("#infoblk");

function supplierdetail(data: ISupplier) {
	let html =
		"<h3>" +
		supplierdetailtxt +
		"</h3>" +
		'<ul class="list-group list-group-flush">';
	html +=
		'<li class="list-group-item"><strong>' +
		nametxt +
		"</strong>: " +
		data.supName +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		emailtxt +
		"</strong>: " +
		data.supEmail +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		phonetxt +
		"</strong>: " +
		data.supPhone +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		contacttxt +
		"</strong>: " +
		data.supContact +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		websitetxt +
		"</strong>: " +
		data.supAddrWeb +
		"</li>";
	let address: string =
		data.supAddrStreetLine1 ??
		"" + " " + data.supAddrStreetLine2 ??
		"" + " " + data.supAddrStreetLine3 ??
		"" + " " + data.supAddrStreetLine4 ??
		"";
	html +=
		'<li class="list-group-item"><strong>' +
		addresstxt +
		"</strong>: " +
		address +
		"</li>";
	html +=
		'<li class="list-group-item"><strong>' +
		citytxt +
		"</strong>: " +
		data.supAddrCity +
		"</li>";
	//html += '<li class="list-group-item"><strong>' + statetxt + '</strong>: ' + data.supAddrState + '</li>';
	html +=
		'<li class="list-group-item"><strong>' +
		countrytxt +
		"</strong>: " +
		data.supAddrCountry +
		"</li>";
	html += "</ul>";
	//console.log('html:' + html);
	return html;
}

$(document).on("click", ".detail", function () {
	let Id = $(this).data("id");
	$.ajax({
		type: "GET",
		url: "/Supplier/Detail",
		data: { Id: Id },
		success: function (data) {
			console.log("data:", data);
			let html = supplierdetail(data);
			$.fancyConfirm({
				title: "",
				message: html,
				shownobtn: false,
				okButton: oktxt,
				noButton: canceltxt,
				callback: function (value) {
					if (value) {
						$("#txtKeyword").trigger("focus");
					}
				},
			});
		},
		dataType: "json",
	});
});

$(document).on("change", "#txtKeyword", function () {
	keyword = <string>$(this).val();
	if (keyword !== "") {
		openWaitingModal();
		let $sortcol = $("<input>").attr({
			type: "hidden",
			name: "Keyword",
			value: keyword.trim(),
		});
		$("#frmSupplier").append($sortcol).trigger("submit");
	}
});

$(document).on("click", "#btnSearch", function () {
	$("#txtKeyword").trigger("change");
});

$(document).on("click", ".colheader", function () {
	let $sortcol = $("<input>").attr({
		type: "hidden",
		name: "SortCol",
		value: $(this).data("col"),
	});
	let $keyword = $("<input>").attr({
		type: "hidden",
		name: "Keyword",
		value: $(this).data("keyword"),
	});
	$("#frmSupplier").append($sortcol).append($keyword).trigger("submit");
});

$(document).on("click", ".remove", function () {
	let Id = $(this).data("id");
	let token = $("input[name=__RequestVerificationToken]").val();
	$.fancyConfirm({
		title: "",
		message: confirmremove,
		shownobtn: true,
		okButton: oktxt,
		noButton: canceltxt,
		callback: function (value) {
			if (value) {
				$.ajax({
					type: "POST",
					url: "/Supplier/Delete",
					data: { Id: Id, __RequestVerificationToken: token },
					success: function () {
						window.location.reload();
					},
					dataType: "json",
				});
			}
		},
	});
});

$(document).on("click", "#btnReload", function () {
	window.location.href = "/Supplier/Index";
});

$(function () {
	triggerMenu(5, 2);
	setFullPage();
	let $sortorder = $("#sortorder");
	let $sortcol = $("#sortcol");
	console.log("sortorder:" + $sortorder.val() + ";sortcol:" + $sortcol.val());
	$target = $(".colheader").eq(<number>$sortcol.val());
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

	initModals();
	$("#txtKeyword").trigger("focus");

	let keyword = getParameterByName("Keyword");
	if (keyword !== null) {
		$("#txtKeyword").val(keyword);
	}
});
