$infoblk = $('#infoblk');
$target = $('#tblCustomer tbody');

$(document).on('click', '#btnSave', function () {
    console.log('staff:', staff);
    //return false;
    if (_validform()) {
        $.ajax({
            type: "POST",
            url: '/Staff/Edit',
            data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), model: staff },
            success: function (data) {
                if (data.msg !== '') {
                    window.location.href = '/Staff/Index';
                }
            },
            dataType: 'json'
        });
    }

});

function _validform(): boolean {
    let msg = '';

    let username: string = <string>$('#UserName').val();
    if (username === '') {
        msg += usernamerequiredtxt + '<br>';
    }
    let usernameerr = username === '';

    if (msg !== '') {
        $.fancyConfirm({
            title: '',
            message: msg,
            shownobtn: false,
            okButton: oktxt,
            noButton: notxt,
            callback: function (value) {
                if (value) {
                    if (usernameerr) {
                        $('#UserName').focus();
                    }
                }
            }
        });
    }
    return msg === '';
}

$(document).on('change', '.customer', function () {
    let cusId: number = <number>$(this).val();
    console.log('cusid:' + cusId);
    let $chk: JQuery = $(this);
    if ($(this).is(':checked')) {
        console.log('salesmanid:' + $(this).data('salesmanid'));
        if ($(this).data('salesmanid') > 0) {
            $.fancyConfirm({
                title: '',
                message: $infoblk.data('reassignconfirm'),
                shownobtn: true,
                okButton: oktxt,
                noButton: notxt,
                callback: function (value) {
                    if (value) {
                        staff.AssignedContactIds.push(cusId);
                        console.log(staff.AssignedContactIds);
                    } else {
                        $chk.prop('checked', false);
                        console.log(staff.AssignedContactIds);
                    }
                }
            });
        } else {
            staff.AssignedContactIds.push(cusId);
            console.log(staff.AssignedContactIds);
        }
    } else {
        let idx = -1;
        $.each(staff.AssignedContactIds, function (i, e) {
            if (e == cusId) {
                idx = i;
                return false;
            }
        });
        if (idx >= 0) {
            staff.AssignedContactIds.splice(idx, 1);
            console.log(staff.AssignedContactIds);
        }
    }


});

$(document).ready(function () {
    initModals();

    let $sortorder = $('#sortorder');
    let $sortcol = $('#sortcol');
    console.log('sortorder:' + $sortorder.val() + ';sortcol:' + $sortcol.val());
    $target = $('.colheader').eq(<number>$sortcol.val());
    let sortcls = $sortorder.val() === 'asc' ? 'fa fa-sort-up' : 'fa fa-sort-down';
    $target.addClass(sortcls);
    $('#txtKeyword').focus();

    $target = $('.pagination');
    $target.wrap('<nav aria-label="Page navigation"></nav>').find('li').addClass('page-item').find('a').addClass('page-link');

    let keyword = getParameterByName('Keyword');
    if (keyword !== null) {
        $('#txtKeyword').val(keyword);
    }
    $('.pagination li').addClass('page-item');

    staff = initCrmUser();
    staff.UserCode = <string>$('#UserCode').val();
    staff.surUID = <number>$('#surUID').val();
    staff.AccountProfileId = <number>$('#AccountProfileId').val();

    let assignids: string = <string>$('#AssignedCustomerIds').val();
    //console.log('assignids:' + assignids);
    if (typeof assignids !== 'undefined' && assignids !== '') {
        let idlist = assignids.split(',');
        $.each(idlist, function (i, e) {
            staff.AssignedContactIds.push(parseInt(e));
        });        
    }
    console.log(staff.AssignedContactIds);
});