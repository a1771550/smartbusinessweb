$infoblk = $('#infoblk');

$(document).ready(function () {
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