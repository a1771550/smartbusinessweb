$infoblk = $('#infoblk');

function _validhotlist():boolean {
    let msg: string = '';
    HotList = initHotList(null);
    console.log('HotList#valid:', HotList);
    if (HotList.hoName === '') {
        msg += `${$infoblk.data('honamerequiredtxt')}<br>`;
    }
    if (HotList.hoSalesmanResponsible == 0) {
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
                    if (HotList.hoName === '') {
                        $('#hoName').addClass('focus');
                    }
                    if (HotList.hoSalesmanResponsible == 0) {
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
            data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(),model:HotList },
            success: function (data) {
                if (data) {
                    window.location.href = '/HotList/Index';
                }                
            },
            dataType: 'json'
        });	
    }
});

$(function () {
    setFullPage();
    triggerMenuByCls("menucustomer", 3);
    initModals();
    HotList = initHotList(null);
    $('#hoName').trigger("focus");
});