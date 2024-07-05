$infoblk = $('#infoblk');

$(document).on('click', '.content', function () {
    let _content = $(this).parent('td').find('.blcontent').val();
    let html = eblastcontent(_content);
    $.fancyConfirm({
        title: '',
        message: html,
        shownobtn: false,
        okButton: closetxt,
        noButton: canceltxt,
        callback: function (value) {
            if (value) {
                $('#txtKeyword').focus();
            }
        }
    });
});

function eblastcontent(content) {
    let html = '<ul class="list-group list-group-flush">';
    html += '<li class="list-group-item">' + content + '</li>';
    html += '</ul>';
    return html;
}

$(document).on('click', '#btnReload', function () {
    window.location.href = '/eBlast/Log/?Id='+ $infoblk.data('id');
});

$(document).on('click', '.colheader', function () {
    let $sortcol = $('<input>').attr({ type: 'hidden', name: 'SortCol', value: $(this).data('col') });
    let $keyword = $('<input>').attr({ type: 'hidden', name: 'Keyword', value: $(this).data('keyword') });
    let $Id = $('<input>').attr({ type: 'hidden', name: 'Id', value: $infoblk.data('id') });
    $('#tbleBlastLog tbody tr').each(function (i,e) {
        $(e).find('td:eq(6)').find('.blcontent').val('');
    });
    $('#frmBlast').append($sortcol).append($keyword).append($Id).submit();
});

$(document).ready(function () {
    let $sortorder = $('#sortorder');
    let $sortcol = $('#sortcol');
    console.log('sortorder:' + $sortorder.val() + ';sortcol:' + $sortcol.val());
    $target = $('.colheader').eq(<number>$sortcol.val());
    let sortcls = $sortorder.val() === 'asc' ? 'fa fa-sort-up' : 'fa fa-sort-down';
    $target.addClass(sortcls);

    initModals();
    $('#txtKeyword').focus();

    $target = $('.pagination');
    $target.wrap('<nav aria-label="Page navigation"></nav>').find('li').addClass('page-item').find('a').addClass('page-link');

    let keyword = getParameterByName('Keyword');
    if (keyword !== null) {
        $('#txtKeyword').val(keyword);
    }
    $('.pagination li').addClass('page-item');
});

$(document).on('change', '#txtKeyword', function () {
    keyword = <string>$(this).val();
    if (keyword !== '') {
        openWaitingModal();
        let $sortcol = $('<input>').attr({ type: 'hidden', name: 'Keyword', value: keyword.trim() });
        $('#frmBlast').append($sortcol).submit();
    }
});
$(document).on('click', '#btnSearch', function () {
    $('#txtKeyword').trigger('change');
});