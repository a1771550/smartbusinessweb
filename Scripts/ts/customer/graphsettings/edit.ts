$infoblk = $('#infoblk');
editmode = <number>$('#id').val() == 0;

$(document).on('click', '#btnSave', function () {
    if (_validgraphsettings()) {
        console.log('graphsettings:', graphsettings);

        $.ajax({
            type: "POST",
            url: '/GraphSettings/Edit',
            data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), model: graphsettings },
            success: function (data) {
                if (data) {
                    window.location.href = '/GraphSettings/Index';
                }
            },
            dataType: 'json'
        });
    }
});

function _validgraphsettings():boolean {
    let msg: string = '';

    fillInGraphSettings();
    
    if (graphsettings.gsAppName == '') {
        msg += $infoblk.data('namerequiredtxt') + '<br>';
        $('#gsAppName').addClass('focus');
    }
    if (graphsettings.gsAuthority == '') {
        msg += $infoblk.data('authorityrequiredtxt') + '<br>';
        $('#gsAuthority').addClass('focus');
    }
    if (graphsettings.gsEmailResponsible == '') {
        msg += $infoblk.data('emailrequiredtxt') + '<br>';
        $('#gsEmailResponsible').addClass('focus');
    } else if (!validateEmail(graphsettings.gsEmailResponsible)) {
        msg += emailformaterr + '<br>';
        $('#gsEmailResponsible').val('').addClass('focus');
    }

    if (graphsettings.gsClientId == '') {
        msg += $infoblk.data('clientidrequiredtxt') + '<br>';
        $('#gsClientId').addClass('focus');
    }
    if (graphsettings.gsRedirectUri == '') {
        msg += $infoblk.data('redirecturirequiredtxt') + '<br>';
        $('#gsRedirectUri').addClass('focus');
    }
    //if (graphsettings.gsClientSecretVal == '') {
    //    msg += $infoblk.data('secretvalrequiredtxt') + '<br>';
    //    $('#gsClientSecretVal').addClass('focus');
    //}

    if (msg !== '') {
        $.fancyConfirm({
            title: '',
            message: msg,
            shownobtn: false,
            okButton: oktxt,
            noButton: notxt,
            callback: function (value) {
                if (value) {
                    $('#gsAppName').focus();
                }
            }
        });
    }

    return msg === '';
}

$(document).ready(function () {
    initModals();   
    graphsettings = initGraphSettings();
    if (editmode) {
        fillInGraphSettings();
    }
    $('#gsAppName').focus();
});


function fillInGraphSettings() {
    graphsettings.Id = <number>$('#id').val();
    graphsettings.gsAppName = <string>$('#gsAppName').val();
    graphsettings.gsClientId = <string>$('#gsClientId').val();
    graphsettings.gsTenantId = <string>$('#gsTenantId').val();
    graphsettings.gsEmailResponsible = <string>$('#gsEmailResponsible').val();
    graphsettings.gsAuthority = <string>$('#gsAuthority').val();
    graphsettings.gsRedirectUri = <string>$('#gsRedirectUri').val();
    graphsettings.gsClientSecretVal = <string>$('#gsClientSecretVal').val();
    graphsettings.CreateTimeDisplay = <string>$('#JsCreateDate').val();
    graphsettings.ModifyTimeDisplay = <string>$('#ModifyTimeDisplay').val();
}
