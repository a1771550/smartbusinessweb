$infoblk = $('#infoblk');

$(document).ready(function () {
    setFullPage();
    initModals();
    triggerMenu(11, 1);
    $('#CompanyName').focus();
});

$(document).on('click', '#btnSave', function () {
    if (validReForm()) {
        $('#frmReceipt').submit();
    }
});

function validReForm() {
    let msg = '';

    return msg === '';
}