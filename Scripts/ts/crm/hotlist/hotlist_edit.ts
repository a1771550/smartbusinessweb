$infoblk = $('#infoblk');

function _validhotlist():boolean {
    let msg: string = '';
    hotlist = initHotList(null);
    console.log('hotlist#valid:', hotlist);
    if (hotlist.hoName === '') {
        msg += `${$infoblk.data('honamerequiredtxt')}<br>`;
    }
    if (hotlist.hoSalesmanResponsible == 0) {
        msg += `${$infoblk.data('salesmanrequiredtxt')}<br>`;
    }

    if (msg !== '') {
        $.fancyConfirm({
            title: '',
            message: msg,
            shownobtn: false,
            okButton: oktxt,
            noButton: notxt,
            callback: function (value) {
                if (value) {
                    if (hotlist.hoName === '') {
                        $('#hoName').addClass('focus');
                    }
                    if (hotlist.hoSalesmanResponsible == 0) {
                        $('#drpSalesmen').addClass('focus');
                    }
                }
            }
        });	
    }

    return msg === '';
}

$(document).on('click', '#btnSave', function () {
    if (_validhotlist()) {
        $.ajax({
            type: "POST",
            url: '/HotList/Edit',
            data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(),model:hotlist },
            success: function (data) {
                if (data) {
                    window.location.href = '/HotList/Index';
                }                
            },
            dataType: 'json'
        });	
    }
});

$(document).ready(function () {
    initModals();
    hotlist = initHotList(null);
    $('#hoName').focus();
});