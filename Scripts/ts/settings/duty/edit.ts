$infoblk = $("#infoblk");

$(document).on("click", "#btnSave", function () {
	let model: IDuty = { DutyOn: $("#dutyOn").val() as string, DutyOff: $("#dutyOff").val() as string };
	//console.log("model:", model);
	//return;
	$.ajax({
		type: "POST",
		url: "",
		data: { __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(), model },
		success: function (data) {
			showMsg("msg", data, "success");
		},
		dataType: "json"
	});
});
function setDutyTime(time: string, forDutyOff: boolean): Date {
	let now = new Date();
	let year = now.getFullYear();
	let month = now.getMonth();
	let day = now.getDate();
	let hour = forDutyOff ? (now.getHours() + 8) : now.getHours();
	//console.log("hour:", hour);
	let minute = now.getMinutes();
	let second = now.getSeconds();
	if (time) {
		let _minute = time.split(":")[1];
		hour = Number(time.split(":")[0]);
		if (_minute.indexOf("PM") > 0) hour += 12;
		minute = getNumberFrmString(_minute);
	}
	return new Date(year, month, day, hour, minute, second, 0);
}
$(function () {
	setFullPage();
	initModals();
	triggerMenu(0, 5);

	_setDutyTime("On");
	_setDutyTime("Off");

	function _setDutyTime(id: string) {
		let $date = $(`#${id}`);
		let date = setDutyTime($date.data("time") as string, (id == "Off"));
		$date.datetimepicker({
			format: 'LT',
			icons: {
				up: "fa fa-chevron-up",
				down: "fa fa-chevron-down"
			},
			defaultDate: date
		});
	}
});