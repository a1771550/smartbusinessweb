$infoblk = $('#infoblk'); 

function validKCustomer():boolean {
    let msg: string = '';
    fillInKCustomer();

    if (kCustomer.CustName === '') {
        msg += `${$infoblk.data('customernamerequiredtxt')}<br>`;
        $('#CustName').addClass('focus');
    }
    if (kCustomer.CustCurrency === '') {
        msg += `${$infoblk.data('currencyrequiredtxt')}<br>`;
        $('#drpCurrency').addClass('focus');
    }
    if (kCustomer.CustEmail !== '' && !validateEmail(kCustomer.CustEmail)) {
        msg += emailformaterr + '<br>';
        $('#CustEmail').addClass('focus');
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
                    $('.focus:first').focus();
                }
            }
        });	
    }
    return msg === '';
}

$(document).on('click', '#btnSave', function () {
    console.log('kcustomer:', kCustomer);
    //return false;
    const url: string = '/Customer/KEdit';
    if (validKCustomer()) {
        $.ajax({
            type: "POST",
            url: url,
            data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(),'model':kCustomer },
            success: function (data) {
                if (data) {
                    window.location.href = '/Customer/Index';
                }
            },
            dataType: 'json'
        });
    }
});

function fillInKCustomer() {
    kCustomer = initKCustomer();
    kCustomer.Id = <number>$('#id').val();
    kCustomer.CustName = <string>$('#CustName').val();
    kCustomer.CustCurrency = <string>$('#drpCurrency').val();
    kCustomer.CustEmail = <string>$('#CustEmail').val();
    kCustomer.CustPhone = <string>$('#CustPhone').val();
    kCustomer.CustMobile = <string>$('#CustMobile').val();
    kCustomer.CustFax = <string>$('#CustFax').val();
    kCustomer.CustAddressLine1 = <string>$('#CustAddress1').val();
    kCustomer.CustAddressLine2 = <string>$('#CustAddress2').val();
    kCustomer.CustAddressLine3 = <string>$('#CustAddress3').val();
    kCustomer.CustCity = <string>$('#CustCity').val();
    kCustomer.CustCountry = <string>$('#drpCountry').val();
    kCustomer.CustZip = <string>$('#CustZip').val();
    kCustomer.CustWebsite = <string>$('#CustWebsite').val();
    kCustomer.CustBankName = <string>$('#CustBankName').val();
    kCustomer.CustBankCode = <string>$('#CustBankCode').val();
    kCustomer.CustBankAccountName = <string>$('#CustBankAccountName').val();
    kCustomer.CustBankAccountCode = <string>$('#CustBankAccountCode').val();
    let $points = $('#points');
    let newpoints: number = <number>$points.val();
    let oldpoints: number = <number>$points.data('oldpoints');
    kCustomer.CustPointsSoFar += (newpoints - oldpoints);
}

$(document).ready(function () {
    initModals();
    fillInKCustomer();
    $('#CustName').focus();
});