$infoblk = $('#infoblk');
let $chksmtpauth = $('#SMTP_Auth');
enableCRM = $infoblk.data('enablecrm') === 'True';

$(document).on('change', '#enableSSL', function () {
    if ($(this).is(':checked')) {
        $('#emSMTP_EnableSSL').val('True');
    } else {
        $('#emSMTP_EnableSSL').val('False');
    }
    emailsetting.emSMTP_EnableSSL = $(this).is(':checked');
});

$(document).on('change', '#chk365', function () {
    if ($(this).is(':checked')) {
        $('#emOffice365').val('True');
    } else {
        $('#emOffice365').val('False');
    }
    emailsetting.emOffice365 = $(this).is(':checked');

    $chksmtpauth.prop('disabled', emailsetting.emOffice365);
    if (emailsetting.emOffice365) {
        emailsetting.emSMTP_Auth = true;
        $chksmtpauth.prop('checked', true);        
    }    
    console.log('365#chk365:' + emailsetting.emOffice365 + ';auth#chk365:' + emailsetting.emSMTP_Auth);
    //$chksmtpauth.trigger('change');
    toggleEmBlks();
});
$(document).on('change', '#SMTP_Auth', function () {
    console.log('checked#auth:' + $(this).is(':checked'));
    if ($(this).is(':checked')) {
        $('#emSMTP_Auth').val('True');
    } else {
        $('#emSMTP_Auth').val('False');
    }
    emailsetting.emSMTP_Auth = $(this).is(':checked');
    console.log('auth#chkauth:' + emailsetting.emSMTP_Auth);
    toggleEmBlks();
});

function toggleEmBlks() {
    console.log('365#0?' + emailsetting.emOffice365 + ';auth#0?' + emailsetting.emSMTP_Auth);
    if (emailsetting.emOffice365) {
        $('#authblk').show();
        $('#emailblk').hide();
    } else {
        if (emailsetting.emSMTP_Auth) {
            $('#authblk').show();
        }
        else {
            $('#authblk').hide();
        }
        $('#emailblk').show();
    }
    console.log('365#1?' + emailsetting.emOffice365 + ';auth#1?' + emailsetting.emSMTP_Auth);
    console.log('val:' + $('#emSMTP_Auth').val());
}

function validform_email(): boolean {
    let msg = '';

    emailsetting = initEmailSetting();
    let $email = $('#emEmail');
    let $server = $('#emSMTP_Server');
    let $port = $('#emSMTP_Port');
    let $emailsec = $('#emEmailsPerSecond');
    let $emailfail = $('#emMaxEmailsFailed');
    let $trackurl = $('#emEmailTrackingURL');
    let $username = $('#emSMTP_UserName');
    let $pass = $('#emSMTP_Pass');
    let $testemail = $('#emTestEmail');

    if (emailsetting.emDisplayName === '') {
        msg += $infoblk.data('displaynamerequiredtxt') + '<br>';
        $('#emDisplayName').addClass('focus');
    }

    if (!emailsetting.emOffice365) {
        if ($email.val() === '') {
            msg += $infoblk.data('emailrequiredtxt') + '<br>';
            $email.addClass('focus');
        } else if (!validateEmail($email.val())) {
            msg += $infoblk.data('emailformaterrtxt') + '<br>';
            $email.addClass('focus');
        }
    }

    if ($server.val() === '') {
        msg += $infoblk.data('smtpserverrequiredtxt') + '<br>';
        $server.addClass('focus');
    }
    if ($port.val() === '') {
        msg += $infoblk.data('smtpportrequiredtxt') + '<br>';
        $port.addClass('focus');
    }

    if (enableCRM) {
        if ($emailsec.val() === '') {
            msg += $infoblk.data('emailspersecondrequiredtxt') + '<br>';
            $emailsec.addClass('focus');
        }
        if ($emailfail.val() === '') {
            msg += $infoblk.data('maxemailsfailedrequiredtxt') + '<br>';
            $emailfail.addClass('focus');
        }
        if ($trackurl.val() === '') {
            msg += $infoblk.data('emailtrackingurlrequiredtxt') + '<br>';
            $trackurl.addClass('focus');
        }
        if ($testemail.val() !== '' && !validateEmail($testemail.val())) {
            msg += $infoblk.data('emailformaterrtxt') + '<br>';
            $testemail.addClass('focus');
        }
    }
    

    if (emailsetting.emOffice365) {
        if ($username.val() === '') {
            msg += $infoblk.data('smtpusernamerequiredtxt') + '<br>';
            $username.addClass('focus');
        }
        if ($pass.val() === '') {
            msg += $infoblk.data('smtppassrequiredtxt') + '<br>';
            $pass.addClass('focus');
        }
    } else {
        if (emailsetting.emSMTP_Auth) {
            if ($username.val() === '') {
                msg += $infoblk.data('smtpusernamerequiredtxt') + '<br>';
                $username.addClass('focus');
            }
            if ($pass.val() === '') {
                msg += $infoblk.data('smtppassrequiredtxt') + '<br>';
                $pass.addClass('focus');
            }
        }
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
    if (validform_email()) {
        console.log('emailsettings:', emailsetting);
        //return false;
        $.ajax({
            type: "POST",
            url: '/EmailSettings/Edit',
            data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), 'emailsettings': emailsetting },
            success: function (data) {
                $.fancyConfirm({
                    title: '',
                    message: data.msg,
                    shownobtn: false,
                    okButton: oktxt,
                    noButton: notxt,
                    callback: function (value) {
                        if (value) {
                            $('#emEmail').focus();
                        }
                    }
                });
            },
            dataType: 'json'
        });
    }
});

$(document).ready(function () {
    initModals();
    emailsetting = initEmailSetting();
    $('#enableSSL').prop('checked', emailsetting.emSMTP_EnableSSL);
    $('#chk365').prop('checked', emailsetting.emOffice365);
    $chksmtpauth.prop('disabled', emailsetting.emOffice365).prop('checked', (emailsetting.emOffice365 || emailsetting.emSMTP_Auth));
    toggleEmBlks();
    $('#emDisplayName').focus();
});