$infoblk = $('#infoblk');
editmode = <number>$('#id').val() > 0;
let _callhistory: ICallHistory;

function _validCallHistory(): boolean {
    let msg: string = '';

    fillInCallHistory();

    if (msg !== '') {
        $.fancyConfirm({
            title: '',
            message: msg,
            shownobtn: false,
            okButton: oktxt,
            noButton: notxt,
            callback: function (value) {
                if (value) {
                    if (_callhistory.strDateTime === '') {
                        $('#strDateTime').focus();
                    }
                    else if (_callhistory.chStatus === '') {
                        $('#chStatus').focus();
                    }
                  
                }
            }
        });
    }
    return msg === '';
}

$(document).on('click', '#btnSave', function () {
    if (_validCallHistory()) {
        console.log('callhistory:', _callhistory);
        //return false;
        $.ajax({
            type: "POST",
            url: '/CallHistory/Edit',
            data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), model: _callhistory },
            success: function (data) {
                if (data) {
                    window.location.href = '/CallHistory/Index?contactId='+$('#chContactId').val();
                }
            },
            dataType: 'json'
        });
    }
});

$(document).ready(function () {
    initModals();
    let $strDateTime = $('#strDateTime');
    _callhistory = initCallHistory();
    console.log('_callhistory:', _callhistory);
    if (editmode) {
        fillInCallHistory();
        $strDateTime.datetimepicker().val(_callhistory.chDateTimeDisplay);
    } else {
        console.log(getDateString());
        $strDateTime.datetimepicker({format:'Y-m-d H:i'}).val(getDateString());
    }
    
    $('#chStatus').focus();
});

function fillInCallHistory() {
    _callhistory.Id = <number>$('#id').val();
    _callhistory.chContactId = <number>$('#chContactId').val();
    _callhistory.strDateTime = <string>$('#strDateTime').val();
    _callhistory.chStatus = <string>$('#chStatus').val();
    _callhistory.chDocumentName = <string>$('#chDocumentName').val();
    _callhistory.chDocumentLink = <string>$('#chDocumentLink').val();
    _callhistory.chDateTimeDisplay = <string>$('#chDateTimeDisplay').val();
}
