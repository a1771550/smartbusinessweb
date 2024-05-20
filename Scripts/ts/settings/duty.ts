$infoblk = $("#infoblk");

$(function () {
	setFullPage();
	initModals();
	triggerMenu(11, 6);


	$(".time").datetimepicker({
		format: 'LT',
		icons: {
			up: "fa fa-chevron-up",
			down: "fa fa-chevron-down"
		},
		defaultDate: new Date(),
	});
});