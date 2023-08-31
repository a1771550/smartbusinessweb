$infoblk = $('#infoblk');

$(document).on('click', '.remove', function () {
    let Id: number = <number>$(this).data('id');
    $.fancyConfirm({
        title: '',
        message: confirmremovetxt,
        shownobtn: true,
        okButton: oktxt,
        noButton: notxt,
        callback: function (value) {
            if (value) {
                $.post({
                    url: "/CallHistory/Delete",
                    data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), 'Id': Id, 'contactId':$('#contactId').val() }
                }).done(function () {
                    window.location.reload();
                });
            } else {
                //$('#txtKeyword').focus();
            }
        }
    });
});

$('#btnReload').on('click', function (e) {
    e.stopPropagation();
    window.location.href = '/CallHistory/Index?contactId=' + $('#contactId').val();
});


$(document).ready(function () {
    initModals();    
    $target = $('.pagination');
    $target.wrap('<nav aria-label="Page navigation"></nav>').find('li').addClass('page-item').find('a').addClass('page-link');

    let keyword = getParameterByName('Keyword');
    if (keyword !== null) {
        $('#txtKeyword').val(keyword);
    }
    $('.pagination li').addClass('page-item');
    $('#txtKeyword').focus();
});