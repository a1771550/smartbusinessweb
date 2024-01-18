$(".bar").on("click", function () {
	$(".dash__left, .overlay, .dash__body").addClass("active");
	$('.dash__left, .dash__body').toggleClass('activee');
	$('.bar').toggleClass('toggle');
	return false;
});

$(".cross").on("click", function () {
	$(".dash__left, .overlay, .dash__body").removeClass("active");
});

$(".overlay").on("click", function () {
	$(".dash__left, .overlay, .dash__body").removeClass("active");
});

$(document).on("click", ".btn_expand", function () {
	let idx = $(this).index();
	console.log("idx:" + idx);

	//$(".btn_expand").each(function (i, e) {
	//	if ($(e).index() !== idx) {
	//		$(e).find(".active_btn").addClass("expand_btn").removeClass("active_btn");
	//		$(e).find(".submenu").removeClass("show");
	//	}
	//});

	//$(this).find(".expand_btn").addClass("active_btn").removeClass("expand_btn");

	//$(".btn_expand").each(function (i, e) {
	//	if ($(e).index() !== idx) {
	//		$(e).find(".active_btn").switchClass("active_btn", "expand_btn", 3000, "easeInOutQuad");
	//		$(e).find(".submenu").switchClass("show", "hide", 1000, "easeInOutQuad");
	//	} else {
	//		$(e).find(".submenu").switchClass("hide", "show", 1000, "easeInOutQuad");
	//	}
	//});

	//$(this).find(".expand_btn").switchClass("expand_btn", "active_btn", 3000, "easeInOutQuad");

	//$(".submenu li a").removeClass("active");
	//$(this).find(".submenu li a").first().addClass("active");

	if (window.innerWidth > 1439) {
		if ($('.dash__left, .dash__body').hasClass('active') && $('.bar').hasClass('toggle')) {
			$('.dash__left, .dash__body').removeClass('active');
			$('.bar').removeClass('toggle');
		}
	}
});


$(document).on("click", ".submenu li a", function () {
	$(".submenu li a").removeClass("active");
	$(this).addClass("active");
});




$('.btn1').on("click", function () {

	$('.add1').toggleClass('activee');
	$('.btn1').toggleClass('toggle');

});
$('.btn2').on("click", function () {

	$('.add2').toggleClass('activee');
	$('.btn2').toggleClass('toggle');

});


$('.btn3').on("click", function () {

	$('.add3').toggleClass('activee');
	$('.btn3').toggleClass('toggle');

});


$('.btn4').on("click", function () {

	$('.add4').toggleClass('activee');
	$('.btn4').toggleClass('toggle');

});

$('.btn5').on("click", function () {

	$('.add5').toggleClass('activee');
	$('.btn5').toggleClass('toggle');

});
$('.btn6').on("click", function () {

	$('.add6').toggleClass('activee');
	$('.btn6').toggleClass('toggle');

});

$('select').niceSelect();

$('.toggle-button').on('click', function () {
	var targetSectionId = $(this).data('target');
	var targetSection = $('#' + targetSectionId);

	// Check if at least two buttons are active
	var activeButtonsCount = $('.toggle-button.active').length;

	// Set 'active' class on the target section based on the condition
	if (activeButtonsCount >= 2) {
		targetSection.addClass('active');
	} else {
		targetSection.removeClass('active');
	}
});