$infoblk = $('#infoblk');

$(document).on('click', '#btnAdd', function () {
    let $ele = $(this);
    let msg = $ele.data('userlicensefullprompt');
    if ($(this).hasClass('linkdisabled')) {
        $.fancyConfirm({
            title: '',
            message: msg,
            shownobtn: false,
            okButton: oktxt,
            noButton: notxt,
            callback: function (value) {
                if (value) {
                    $ele.focus();
                }
            }
        });
    } else {
        window.location.href = $(this).data('href');
    }
});
$('#btnAdd').hover(function () {
    console.log('hover');
    if ($(this).hasClass('linkdisabled')) {
        $(this).attr('title', $(this).data('userlicensefullprompt'));
    }
});

$(document).on('click', '#btnReset', function () {
    //var frm = <HTMLFormElement>document.getElementById('frmcrmuser');
    //frm.reset();
    $('#Keyword').val('');
    window.location.href = '/CrmUser/Index';
});

$(document).on('click', '.btnedit', function () {
    window.location.href = '/CrmUser/Edit?userId=' + $(this).data('userid');
});
$(document).on('click', '.btnremove', function () {
    let userId = $(this).data('userid');
    $.fancyConfirm({
        title: '',
        message: confirmremovetxt,
        shownobtn: true,
        okButton: oktxt,
        noButton: notxt,
        callback: function (value) {
            if (value) {
                window.location.href = '/CrmUser/Delete?userId=' + userId;
            }
        }
    });
});
$(document).ready(function () {
	let $sortorder = $('#sortorder');
	let $sortcol = $('#sortcol');
	console.log('sortorder:' + $sortorder.val() + ';sortcol:' + $sortcol.val());
	$target = $('.colheader').eq(<number>$sortcol.val());
	let sortcls = $sortorder.val() === 'asc' ? 'fa fa-sort-up' : 'fa fa-sort-down';
	$target.addClass(sortcls);
	$target = $('.pagination');
	$target.wrap('<nav aria-label="Page navigation"></nav>').find('li').addClass('page-item').find('a').addClass('page-link');
	$('.pagination li').addClass('page-item');

	initModals();
	let keyword = getParameterByName('Keyword');
	if (keyword !== null) {
		$('#txtKeyword').val(keyword);
	}
    $('#txtKeyword').focus();
    
});