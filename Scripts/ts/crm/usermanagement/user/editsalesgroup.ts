$infoblk = $('#infoblk');

let candidateOptions: { [Key: string]: string } = {};

function validateSalesGroup():boolean {
    let msg = '';
    if (salesgroup.sgName === '') {
        msg += `${$infoblk.data('salesgroupnamerequiredtxt')}<br>`;
        $('#sgName').addClass('focus');
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
                    $('.focus').eq(0).focus();
                }
            }
        });	
    }
    return msg === '';
}

function fillInSalesGroup() {
    salesgroup = initSalesGroup();
    salesgroup.Id = <number>$('#sgId').val();
    salesgroup.sgName = <string>$('#sgName').val();
    salesgroup.sgDesc = <string>$('#sgDesc').val();
}

$(document).on('click', '.deletegroup', function () {
    let Id = $(this).data('id');
    $.fancyConfirm({
        title: '',
        message: confirmremovetxt,
        shownobtn: true,
        okButton: oktxt,
        noButton: notxt,
        callback: function (value) {
            if (value) {
                $.ajax({
                    type: "POST",
                    url: '/CrmUser/DeleteSalesGroup',
                    data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), Id },
                    success: function (data) {
                        if (data) {
                            window.location.reload();
                            let anchor = savemode == "manager" ? 'assignmanagerblk' : 'assignmemberblk';
                            window.location.href = `/CrmUser/EditSalesGroupMember#${anchor}`;
                        }
                    },
                    dataType: 'json'
                });
            }
        }
    });	
    
});
$(document).on('click', '.editgroup', function () {
    let Id = $(this).data('id');
    $.ajax({
        type: "GET",
        url: '/CrmUser/GetSalesGroup',
        data: { Id },
        success: function (data) {
            console.log('data:', data);
            if (data) {
                salesgroup = data;
                openSalesGroupModal();
                salesgroupModal.find('#sgId').val(salesgroup.Id);
                salesgroupModal.find('#sgName').val(salesgroup.sgName);
                salesgroupModal.find('#sgDesc').val(salesgroup.sgDesc);
            }
        },
        dataType: 'json'
    });
});

$(document).on('click', '#btnSaveGroup', function () {
    closeSalesGroupModal();
    fillInSalesGroup();
    if (validateSalesGroup()) {
        $.ajax({
            type: "POST",
            url: '/CrmUser/EditSalesGroup',
            data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(),'model':salesgroup },
            success: function (data) {
                if (data) {
                    window.location.reload();
                    let anchor = savemode == "manager" ? 'assignmanagerblk' : 'assignmemberblk';
                    window.location.href = `/CrmUser/EditSalesGroupMember#${anchor}`;                   
                }
            },
            dataType: 'json'
        });	
    }
});

$(document).on('click', '#btnAddGroup', function () {
    openSalesGroupModal();
    $('#sgName').focus();
});

$(document).on('click', '#btnNext', function () {
    console.log('savemode#next:' + savemode);    

    if (savemode == 'manager') {
        savemode = 'sales';
        $('#assignmanagerblk').addClass('hide');
        let $assignmemberblk = $('#assignmemberblk');
        $assignmemberblk.removeClass('hide');
        $(this).text($(this).data('assignmanagertxt'));

        //remove selected managers from the options:
        for (const [key, value] of Object.entries(candidateOptions)) {
            for (const [k, v] of Object.entries(DicCrmSalesManager)) {
                if (parseInt(key) == v) {
                    delete candidateOptions[key];
                }
            }
        }        

        console.log('candidateoptions after removal:', candidateOptions);       
        $target = $assignmemberblk.find('.form-group');

        $target.each(function (idx, ele) {
            let html = '';
            let gpId: number = <number>$(ele).data('gpid');            
            DicCrmSalesGroupMembers[gpId.toString()] = [];

            for (const [key, value] of Object.entries(candidateOptions)) {
                let userId: number = parseInt(key);
                if (key != '0') {
                    let _checked = '';
                    for (const [k, v] of Object.entries(DicCrmGroupSalesmen)) {
                        $.each(v, function (i, e) {
                            if (gpId == parseInt(k) && userId == e.surUID) {
                                _checked = 'checked';
                                DicCrmSalesGroupMembers[gpId.toString()].push(userId);
                                return false;
                            }
                        });
                    }
                    html += `<div class="form-check form-check-inline">
  <input class="form-check-input chkmember" type="checkbox" id="${key}" value="${key}" ${_checked} data-gpid="${gpId}" data-userid="${userId}" onchange="handleMemberChange(this);">
  <label class="form-check-label" for="${key}">${value}</label>
</div>`;
                }
            }

            $(ele).empty().html(html);
        });

        console.log('dicmembers:', DicCrmSalesGroupMembers);    

    } else {
        savemode = 'manager';
        $('#assignmanagerblk').removeClass('hide');
        let $assignmemberblk = $('#assignmemberblk');
        $assignmemberblk.addClass('hide');
        $(this).text($(this).data('assignmembertxt'));
    }   
});

function handleMemberChange(ele) {
    let gpId: number = <number>$(ele).data('gpid');
    let userId: number = <number>$(ele).data('userid');

    console.log('before handling:', DicCrmSalesGroupMembers[gpId]);

    if ($(ele).is(':checked')) {
        //console.log('checked');
        if (!DicCrmSalesGroupMembers[gpId].includes(userId)) {
            DicCrmSalesGroupMembers[gpId].push(userId);
        }

        $('#assignmemberblk .form-group').each(function (i, e) {
            let _gpId: number = <number>$(e).data('gpid');
            if (_gpId != gpId) {
                $(e).find('.chkmember').each(function (k, v) {
                    if ($(v).data('userid') == userId) {
                        $(v).prop('checked', false);
                        return false;
                    }
                });

                if (DicCrmSalesGroupMembers[_gpId].includes(userId)) {
                    let idx: number = -1;
                    $.each(DicCrmSalesGroupMembers[_gpId], function (index, ele) {
                        if (ele == userId) {
                            idx = index;
                            return false;
                        }
                    });
                    DicCrmSalesGroupMembers[_gpId].splice(idx, 1);
                }
            }            
        });
    } else {
        //console.log('unchecked');
        if (DicCrmSalesGroupMembers[gpId].includes(userId)) {
            let idx: number = -1;
            $.each(DicCrmSalesGroupMembers[gpId], function (i, e) {
                if (userId == e) {
                    idx = i;
                    return false;
                }
            });
            if (idx >= 0) {
                DicCrmSalesGroupMembers[gpId].splice(idx, 1);
            }
        }
    }

    console.log('after handling:', DicCrmSalesGroupMembers[gpId]);
}

$(document).on('click', '#btnSave', function () {
    if (savemode == 'manager') {
        console.log('diccrmsalesmanager#save:', DicCrmSalesManager);
        if ($.isEmptyObject(DicCrmSalesManager)) {
            $.fancyConfirm({
                title: '',
                message: $infoblk.data('assignmanagertxt'),
                shownobtn: false,
                okButton: oktxt,
                noButton: notxt,
                callback: function (value) {
                    if (value) {
                        $('.assignmanager').addClass('focus');
                    }
                }
            });
        } else {
            $.ajax({
                type: "POST",
                url: '/CrmUser/EditSalesGroupManager',
                data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), DicCrmSalesManager },
                success: function (data) {
                    if (data) {
                        $.fancyConfirm({
                            title: '',
                            message: data,
                            shownobtn: false,
                            okButton: oktxt,
                            noButton: notxt,
                            callback: function (value) {
                                if (value) {
                                    $('#btnNext').focus();                                    
                                }
                            }
                        });	
                    }
                },
                dataType: 'json'
            });	
           
        }
    } else {
        console.log('diccrmsalesgroupmembers#save:', DicCrmSalesGroupMembers);
        if ($.isEmptyObject(DicCrmSalesGroupMembers)) {
            $.fancyConfirm({
                title: '',
                message: $infoblk.data('assignsalesmemberstxt'),
                shownobtn: false,
                okButton: oktxt,
                noButton: notxt,
                callback: function (value) {
                    if (value) {
                        $('.assignmanager').addClass('focus');
                    }
                }
            });
        } else {
            console.log(DicCrmSalesGroupMembers);
            //return false;
            $.ajax({
                type: "POST",
                url: '/CrmUser/EditSalesGroupMembers',
                data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), DicCrmSalesGroupMembers },
                success: function (data) {
                    if (data) {
                        $.fancyConfirm({
                            title: '',
                            message: data,
                            shownobtn: false,
                            okButton: oktxt,
                            noButton: notxt,
                            callback: function (value) {
                                if (value) {
                                    $('#btnNext').focus();
                                }
                            }
                        });	
                    }
                },
                dataType: 'json'
            });
            
        }
    }
});

$(document).on('change', '.assignmanager', function () {
    let Id: number = parseInt(<string>$(this).val());
    let gpId: string = <string>$(this).data('gpid');

    console.log('gpId:' + gpId + ';userId:'+Id);

    if (Id != 0) {
        DicCrmSalesManager[gpId] = Id;

        $('#assignmanagerblk').find('.assignmanager').each(function (i, e) {
            let _gpId: string = $(e).data('gpid');
            console.log('_gpId:' + _gpId);
            if (_gpId != gpId) {
                $(e).find('option').remove();                
                for (const [key, value] of Object.entries(candidateOptions)) {
                    //console.log(`${key}: ${value}`);                   
                    if (parseInt(key) != Id) {
                        $(e).append($('<option>', {
                            value: key,
                            text: value
                        }));
                    }
                }
                console.log(DicCrmSalesManager[_gpId]+';'+Id);
                if (typeof DicCrmSalesManager[_gpId] === 'undefined') {                    
                    $(e).val('0');
                } else {
                    if (DicCrmSalesManager[_gpId] == Id) {
                        $(e).val('0');
                    } else {
                        $(e).val(DicCrmSalesManager[_gpId]);
                    }                  
                }
            }
        });
    }
});

$(function () {
    initModals();

    $('.assignmanager').eq(0).find('option').each(function (i, e) {
        candidateOptions[<string>$(e).val()] = $(e).text();
    });
    console.log(candidateOptions);

    DicCrmGroupSalesmen = $infoblk.data('jsondicgroupmemberlist');
    DicCrmSalesManager = $infoblk.data('jsondiccrmsalesmanager');
    console.log('diccrmgroupsalesmens#ready:', DicCrmGroupSalesmen);
    console.log('DicCrmSalesManager#ready:', DicCrmSalesManager);

    savemode = 'manager';
});