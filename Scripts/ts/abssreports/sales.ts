$infoblk = $("#infoblk");
let strDate: string = "";
let date: Date = new Date();
$(document).on("click", "#btnFilter", function (e) {
	e.preventDefault();
	if ($("#radDay").is(":checked")) {
		strDate = $("#strDay").val() as string;
		SalesDate = { SalesOptions: SalesOptions.Daily, delimeter: "-" } as ISalesDate;
	}
	if ($("#radMonth").is(":checked")) {
		strDate = (Number($(".ui-datepicker-year").val()) + "-" + (Number($(".ui-datepicker-month").val()) + 1)).toString();
		SalesDate = { SalesOptions: SalesOptions.Monthly, delimeter: "-" } as ISalesDate;
	}
	console.log("strDate:" + strDate);
	let arr: string[] = strDate.split("-");

	SalesDate.Year = Number(arr[0]);
	SalesDate.Month = Number(arr[1]);
	SalesDate.Day = SalesDate.SalesOptions == SalesOptions.Daily ? Number(arr[2]) : 1;
	SalesDate.delimeter = "-";

	$(`#${gFrmId}`).append($("<input />").attr("type", "hidden")
		.attr("name", "Year")
		.attr("value", SalesDate.Year)).append($("<input />").attr("type", "hidden")
			.attr("name", "Month")
			.attr("value", SalesDate.Month)).append($("<input />").attr("type", "hidden")
				.attr("name", "Day")
				.attr("value", SalesDate.Day)).append($("<input />").attr("type", "hidden")
					.attr("name", "DateOption")
					.attr("value", SalesDate.SalesOptions == SalesOptions.Daily ? 1 : 0)).trigger("submit");
});

$(document).on("change", ".date", function () {
	cleanDatepicker();
	$(".datepicker").toggle();
	if ($(this).val() == "day") {
		getDateFrmSalesDate();
		SetDate4Day();
	}
	if ($(this).val() == "month") {
		SetDate4Month();
	}
});
function SetDate4Day() {
	initDatePicker("strDay", date, true, "yy-mm-dd");
}

function SetDate4Month() {
	$target = $("#strMonth");
	$target.datepicker({
		dateFormat: "MM yy",
		changeMonth: true,
		changeYear: true,
		showButtonPanel: false,
		onClose: function (dateText, inst) {
			setDate4Month($(this));
		},
	});
	setDate4Month($target, SalesDate.Year, SalesDate.Month-1);
	switch (lang) {
		case 2:
			$target.datepicker($.datepicker.regional[""]);
			break;
		case 1:
			$target.datepicker($.datepicker.regional["zh-CN"]);
			break;
		default:
		case 0:
			$target.datepicker($.datepicker.regional["zh-HK"]);
			break;
	}
}

function setDate4Month($ele, year:any=null, month:any=null) {
	month = month ?? Number($("#ui-datepicker-div .ui-datepicker-month :selected").val());
	year = year ?? Number($("#ui-datepicker-div .ui-datepicker-year :selected").val());
	console.log("month:", month);
	console.log("year:", year);
	$ele.datepicker("setDate", new Date(year, month, 1));
}
function getDateFrmSalesDate() {
	date = new Date(SalesDate.Year, SalesDate.Month - 1, SalesDate.Day ?? 1);
}

$(function () {
	forAbssSales = true;
	setFullPage();
	gTblId = "tblSales";
	gFrmId = "frmSales";
	triggerMenuByCls("sales", 0);
	initModals();
	PageSize = $infoblk.data("pagesize");
	ConfigSimpleSortingHeaders();

	SalesDate = $infoblk.data("salesdate");
	getDateFrmSalesDate();
	if (SalesDate.SalesOptions !== SalesOptions.Monthly) {
		$("#strMonth").hide();
		$("#strDay").show();
		$("#radDay").prop("checked", true);
		SetDate4Day();
	} else {
		//console.log("here");
		$("#strMonth").show();
		$("#strDay").hide();
		$("#radMonth").prop("checked", true);
		SetDate4Month();
	}
});
