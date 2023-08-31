$infoblk = $('#infoblk');

let _enabletax: boolean;
let _ispriceinclusivetax: boolean;

function _submitKForm() {
    $('.required').each(function (i, e) {
        $target = $(e).find('.form-control');
        if ($target.val() != '') {
            console.log($('#frmKAccountInfo').serialize());
            //return false;
            $('#frmKAccountInfo').submit();
            //$.ajax({
            //    type: "POST",
            //    url: '',
            //    data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val() },
            //    success: function (data) {


            //    },
            //    dataType: 'json'
            //});
        }
    });
}

$(document).on('click', '#btnSave', function () {
    let $taxrate = $('#TaxRate');

    if (_enabletax) {
        //if ($taxrate.val() == '') {
        //    $('#taxratemsg').removeClass('hide');
        //    $taxrate.focus();
        //} else {
        //$('#taxratemsg').addClass('hide');
        if (_ispriceinclusivetax) {
            $('#PriceInclusiveTaxRate').val(<number>$taxrate.val());
        } else {
            $('#PriceExclusiveTaxRate').val(<number>$taxrate.val());
        }
        _submitKForm();
        //}        
    } else {
        _submitKForm();
    }
});

$(document).on('change', '#chkEnableTax', function () {
    _enabletax = $(this).is(':checked');
    _toggleShowBlk();
});

$(document).on('change', '#rdoExTax', function () {
    _ispriceinclusivetax = !$(this).is(':checked');
    $('#IsPriceInclusiveTax').val('False');
    $('#TaxRate').focus();
});
$(document).on('change', '#rdoInTax', function () {
    _ispriceinclusivetax = $(this).is(':checked');
    $('#IsPriceInclusiveTax').val('True');
    $('#TaxRate').focus();
});

function _toggleShowBlk() {
    console.log('enabletax:' + _enabletax);
    if (_enabletax) {
        $('#taxblk').removeClass('hide');
        $('#TaxRate').focus();
        $('#EnableTax').val('True');
    } else {
        $('#taxblk').addClass('hide');
        $('#EnableTax').val('False');
    }
}

$(document).ready(function () {
    _enabletax = $('#EnableTax').val() == 'True';
    _ispriceinclusivetax = $('#IsPriceInclusiveTax').val() == 'True';
    _toggleShowBlk();
    $('#CloudUrl').focus();
});