$infoblk = $("#infoblk");

$(function () {
	setFullPage();
	initModals();
	triggerMenu(0,4);
	$target = $('.pagination');
	$target.wrap('<nav aria-label="Page navigation"></nav>').find('li').addClass('page-item').find('a').addClass('page-link');
});