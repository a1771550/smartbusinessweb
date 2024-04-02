$infoblk = $('#infoblk');
$target = $('#tblcontact tbody');
let assignedcontactlist: { [Key: string]: string };
function handleEblastContacts() {
    openWaitingModal();
    $.ajax({
        type: "POST",
        url: '/Customer/AddToEblast',
        data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), contactIds: IdList },
        success: function (data) {
            closeWaitingModal();
            if (data) {
                $.fancyConfirm({
                    title: '',
                    message: data,
                    shownobtn: false,
                    okButton: oktxt,
                    noButton: notxt,
                    callback: function (value) {
                        if (value) {
                            closeWaitingModal();
                            $('#txtKeyword').trigger("focus");
                        }
                    }
                });
            }
        },
        dataType: 'json'
    });
}
$(document).on('dblclick', '.sgid', function () {
    AssignContactsToGroup($(this).data("id"));
});

function AssignContactsToGroup(sgId: number) {
    console.log('ids:', IdList);
    closeSalesGroupMemberModal();
    openWaitingModal();

    $.ajax({
        type: "POST",
        url: '/Api/AssignContactsToGroup',
        data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), IdList: IdList.join(), GroupId: sgId },
        success: function (data) {
            if (data) {
                closeWaitingModal();
                $.fancyConfirm({
                    title: '',
                    message: data,
                    shownobtn: false,
                    okButton: oktxt,
                    noButton: notxt,
                    callback: function (value) {
                        if (value) {
                            $('#txtKeyword').trigger("focus");
                        }
                    }
                });
            }
        },
        dataType: 'json'
    });

}

$(document).on('click', '#btnAssign', function () {
    if (IdList.length === 0) {
        $.fancyConfirm({
            title: '',
            message: $infoblk.data('selectatleastonecontacttxt'),
            shownobtn: false,
            okButton: oktxt,
            noButton: notxt,
            callback: function (value) {
                if (value) {
                    $('#txtKeyword').trigger("focus");
                }
            }
        });
    } else {
        GetSalesGroups(1);
    }
});
function GetSalesGroups(pageIndex) {
    let data = '{pageIndex: ' + pageIndex + '}';
    if (typeof (keyword) !== 'undefined' && keyword !== '') {
        data = '{pageIndex: ' + pageIndex + ', keyword: "' + keyword + '"}';
    } else {
        data = '{pageIndex: ' + pageIndex + ', keyword: "' + '' + '"}';
    }
    console.log('data:', data);
    /*return false;*/
    openWaitingModal();
    $.ajax({
        url: "/Api/GetSalesGroupsAjax",
        type: "POST",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: OnGetSalesGroupSuccess,
        error: onAjaxFailure,
    });
};
function OnGetSalesGroupSuccess(response) {
    keyword = '';
    closeWaitingModal();
    console.log('response:', response);
    DicSalesGroup = response.DicSalesGroup;
    assignedcontactlist = response.AssignedContactList;

    console.log('DicSalesGroup:', DicSalesGroup);
    console.log('assignedcontactlist:', assignedcontactlist);

    if (typeof DicSalesGroup !== 'undefined' && DicSalesGroup != null) {
        var row = $("#tblSalesGroup tr:last-child").removeAttr("style").clone(false);
        $("#tblSalesGroup tr").not($("#tblSalesGroup tr:first-child")).remove();
        for (const [key, value] of Object.entries(DicSalesGroup)) {
            let salesgroup = value[0];
            row.addClass('sgid pointer').attr('data-Id', salesgroup.Id);
            let salesnamelist: string[] = [];
            $.each(value, function (i, e) {
                salesnamelist.push(e.UserName);
            });
            //console.log('salesgroup:', salesgroup);
            let btn = `<a href='#' class='assigncontact btn btn-info' data-sgid='${salesgroup.Id}' onclick='javascript:AssignContactsToGroup(${salesgroup.Id});'>${assigntxt}</a>`;
            $("td", row).eq(0).html(key);
            $("td", row).eq(1).html(salesnamelist.join());
            $("td", row).eq(2).html(salesgroup.CreateTimeDisplay);
            $("td", row).eq(3).html(<string>salesgroup.ModifyTimeDisplay);
            $("td", row).eq(4).html(btn);

            $("#tblSalesGroup").append(row);
            row = $("#tblSalesGroup tr:last-child").clone(false);
        }

        $(".Pager").ASPSnippets_Pager({
            ActiveCssClass: "current",
            PagerCssClass: "pager",
            PageIndex: response.PageIndex,
            PageSize: response.PageSize,
            RecordCount: response.RecordCount
        });

        let assignedcontactnamelist: string[] = [];
        if (typeof assignedcontactlist !== 'undefined' && assignedcontactlist != null) {
            let assignedcontactIds: Array<number> = [];
            for (const [key, value] of Object.entries(assignedcontactlist)) {
                assignedcontactIds.push(parseInt(key));
            }

            const filteredArray = IdList.filter(value => assignedcontactIds.includes(value));
            if (filteredArray.length > 0) {
                $.each(filteredArray, function (i, e) {
                    assignedcontactnamelist.push(assignedcontactlist[e.toString()]);

                    //remove id from IdList:
                    $.each(IdList, function (idx, Id) {
                        if (Id == e) {
                            IdList.splice(idx, 1);
                        }
                    });

                    //uncheck the contacts:
                    $('#tblcontact tbody tr').each(function (k, v) {
                        $target = $(v).find('td:first').find('.chk');
                        let contactId: number = $target.data("id");
                        if (e == contactId) {
                            $target.prop('checked', false);
                        }
                    });
                });
            }
        }

        if (assignedcontactnamelist.length > 0) {
            let msg = `<h4>${$infoblk.data('assignedcontactstxt')}</h4><ul>`;
            $.each(assignedcontactnamelist, function (i, e) {
                msg += `<li>${e}</li>`;
            });
            msg += `</ul>`;
            $.fancyConfirm({
                title: '',
                message: msg,
                shownobtn: false,
                okButton: oktxt,
                noButton: notxt,
                callback: function (value) {
                    if (value) {

                    }
                }
            });
        }

        if (IdList.length > 0) {
            openSalesGroupMemberModal();
        }

    } else {
        salesgroupMemberModal.find('#norecord').removeClass('hide');
    }
};
$(document).on("click", "#salesgroupMemberModal .Pager .page", function () {
    pageindex = parseInt(<string>$(this).attr('page'));
    GetSalesGroups(pageindex);

});
$(document).on("click", "#tblSalesGroup th a", function () {
    sortName = $(this).data('category');
    sortDirection = sortDirection == "ASC" ? "DESC" : "ASC";
    /* console.log('sortname:' + sortName + ';sortdir:' + sortDirection);*/
    pageindex = 1;
    GetSalesGroups(pageindex);
});


$(document).on('change', '#iPageSize', function () {
    let pagesize: number = <number>$(this).val();
    if (pagesize <= 0) {
        $.fancyConfirm({
            title: '',
            message: $infoblk.data('pagesizenoltzerotxt'),
            shownobtn: false,
            okButton: oktxt,
            noButton: notxt,
            callback: function (value) {
                if (value) {
                    $('#iPageSize').trigger("focus");
                }
            }
        });
    } else {
        let url: string = `/Contact/Index?PageNo=${$('#pageno').val()}&SortOrder=${$('#sortorder').val()}&PageSize=${pagesize}&Keyword=${$('#keyword').val()}`;
        window.location.href = url;
    }
});

$('#drpGattr').on('change', function () {
    let gattr: string = <string>$(this).val();
    console.log('attr:' + gattr);
    if (gattr.toLowerCase().indexOf('date') >= 0) {
        $('#nondateblk').hide();
        $('#dateblk').removeClass('hide');
    } else {
        $('#nondateblk').show();
        $('#dateblk').addClass('hide');
    }
});

$('#btnSearchAttr').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    gattrfilteropener = 'contact';
    openGattrFilterModal();
});


$(document).on('dblclick', '.hotid', function () {
    closeHotListModal();
    let id: number = <number>$(this).data("id");
    console.log('hotid:' + id);
    console.log('IdList:', IdList);
    console.log('dicHotListContacts:', dicHotListContacts);

    let hotlistaddedcontactIds: Array<number> = [];

    for (const [key, value] of Object.entries(dicHotListContacts)) {
        if (id == parseInt(key)) {
            $.each(IdList, function (i, e) {
                if (value.includes(e)) {
                    hotlistaddedcontactIds.push(e);
                }
            });
            //remove id from idlist:
            IdList = IdList.filter(function (e) { return !value.includes(e); });
        }
    }

    console.log('hotlistaddedcontactIds:', hotlistaddedcontactIds);

    if (hotlistaddedcontactIds.length > 0) {
        $.ajax({
            type: "GET",
            url: '/Api/GetContactNamesByIds',
            data: { 'contactIds': hotlistaddedcontactIds.join() },
            success: function (data) {
                console.log(data);
                var html = `<h4>${$infoblk.data('contactaddedhotlistmsg')}</h4><ol>`;
                var namelist: Array<string> = data.split(',');
                $.each(namelist, function (i, e) {
                    html += `<li>${e}</li>`;
                });
                html += '</ol>';
                $.fancyConfirm({
                    title: '',
                    message: html,
                    shownobtn: false,
                    okButton: oktxt,
                    noButton: notxt,
                    callback: function (value) {
                        if (value) {
                            handleHotListContact(id);
                        }
                    }
                });
            },
            dataType: 'json'
        });
    } else {
        handleHotListContact(id);
    }
});

function handleHotListContact(id) {
    console.log('idlist:', IdList);

    if (IdList.length > 0) {
        openWaitingModal();
        $.ajax({
            type: "POST",
            url: '/HotList/AddContacts',
            data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), contactIds: IdList, hotlistId: id },
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
                                closeWaitingModal();
                                $('#txtKeyword').trigger("focus");
                            }
                        }
                    });
                }
            },
            dataType: 'json'
        });
    }
}

function GetHotLists(pageIndex) {
    let data = '{pageIndex: ' + pageIndex + '}';
    if (typeof (keyword) !== 'undefined' && keyword !== '') {
        data = '{pageIndex: ' + pageIndex + ', keyword: "' + keyword + '"}';
    } else {
        data = '{pageIndex: ' + pageIndex + ', keyword: "' + '' + '"}';
    }
    console.log('data:', data);
    /*return false;*/
    openWaitingModal();
    $.ajax({
        url: "/Api/GetHotListsAjax",
        type: "POST",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: OnGetHotListSuccess,
        error: onAjaxFailure,
    });
};
function OnGetHotListSuccess(response) {
    keyword = '';
    closeWaitingModal();
    console.log('response:', response);
    var model = response;

    console.log('modelhotlists:', model);

    if (model.length > 0) {
        let modelhotlistlist: Array<IHotList> = model.slice(0);
        if (typeof hotlistlist !== 'undefined' && hotlistlist.length > 0) {

            let filteredmodelhotlistlist: Array<IHotList> = [];
            $.each(modelhotlistlist, function (i, e: IHotList) {
                let _hotlist = $.grep(hotlistlist, function (v, k) {
                    return e.Id == v.Id;
                })[0];

                if (typeof _hotlist === 'undefined') {
                    filteredmodelhotlistlist.push(e);
                }
            });

            hotlistlist = [...hotlistlist, ...filteredmodelhotlistlist];
            console.log('hotlistlist after merge:', hotlistlist);
        } else {
            hotlistlist = model.slice(0);
        }

        var row = $("#tblHotList tr:last-child").removeAttr("style").clone(false);
        $("#tblHotList tr").not($("#tblHotList tr:first-child")).remove();

        $.each(modelhotlistlist, function () {
            var hotlist = this;
            row.addClass('hotid pointer').attr('data-Id', hotlist.Id);
            //console.log('hotlist:', hotlist);
            $("td", row).eq(0).html(hotlist.hoName);
            $("td", row).eq(1).html(hotlist.SalesPersonName);
            $("td", row).eq(2).html(hotlist.hoDescription);
            $("td", row).eq(3).html(hotlist.CreateTimeDisplay);
            let modifytime = hotlist.ModifyTimeDisplay ?? 'N/A';
            $("td", row).eq(4).html(modifytime);

            $("#tblHotList").append(row);
            row = $("#tblHotList tr:last-child").clone(false);
        });
        $(".Pager").ASPSnippets_Pager({
            ActiveCssClass: "current",
            PagerCssClass: "pager",
            PageIndex: model.PageIndex,
            PageSize: model.PageSize,
            RecordCount: model.RecordCount
        });
        openHotListModal();
    } else {
        togglePaging('hotlist', false);
    }
};
$(document).on("click", "#hotlistModal .Pager .page", function () {
    pageindex = parseInt(<string>$(this).attr('page'));
    GetHotLists(pageindex);

});
$(document).on("click", "#tblHotList th a", function () {
    sortName = $(this).data('category');
    sortDirection = sortDirection == "ASC" ? "DESC" : "ASC";
    /* console.log('sortname:' + sortName + ';sortdir:' + sortDirection);*/
    pageindex = 1;
    GetHotLists(pageindex);
});

$(document).on('click', '#btnHotList', function () {
    console.log('cusldlist:', IdList);
    if (IdList.length === 0) {
        $.fancyConfirm({
            title: '',
            message: $infoblk.data('selectatleastonecontacttxt'),
            shownobtn: false,
            okButton: oktxt,
            noButton: notxt,
            callback: function (value) {
                if (value) {
                    $('#txtKeyword').trigger("focus");
                }
            }
        });
    } else {
        GetHotLists(1);
    }
});

$('#btnBlast').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('cusldlist:', IdList);
    //return false;
    if (IdList.length === 0) {
        $.fancyConfirm({
            title: '',
            message: $infoblk.data('selectatleastonecontacttxt'),
            shownobtn: false,
            okButton: oktxt,
            noButton: notxt,
            callback: function (value) {
                if (value) {
                    $('#txtKeyword').trigger("focus");
                }
            }
        });
    } else {
        console.log('IdList:', IdList);
        console.log('dicEblastContacts:', dicEblastContacts);

        let elbastaddedcontactIds: Array<number> = [];

        for (const [key, value] of Object.entries(dicEblastContacts)) {
            if (CurrentEblastId == parseInt(key)) {
                $.each(IdList, function (i, e) {
                    if (value.includes(e)) {
                        elbastaddedcontactIds.push(e);
                    }
                });
                //remove id from idlist:
                IdList = IdList.filter(function (e) { return !value.includes(e); });
            }
        }

        console.log('elbastaddedcontactIds:', elbastaddedcontactIds);

        if (elbastaddedcontactIds.length > 0) {
            $.ajax({
                type: "GET",
                url: '/Api/GetContactNamesByIds',
                data: { 'contactIds': elbastaddedcontactIds.join() },
                success: function (data) {
                    console.log(data);
                    var html = `<h4>${$infoblk.data('contactaddedeblastmsg')}</h4><ol>`;
                    var namelist: Array<string> = data.split(',');
                    $.each(namelist, function (i, e) {
                        html += `<li>${e}</li>`;
                    });
                    html += '</ol>';
                    $.fancyConfirm({
                        title: '',
                        message: html,
                        shownobtn: false,
                        okButton: oktxt,
                        noButton: notxt,
                        callback: function (value) {
                            if (value) {
                                handleEblastContacts();
                            }
                        }
                    });
                },
                dataType: 'json'
            });
        } else {
            handleEblastContacts();
        }
    }
});


$(document).on('click', '.detail', function () {
    let contactId = $(this).data("id");
    $.ajax({
        type: "GET",
        url: '/Contact/Detail',
        data: { contactId: contactId },
        success: function (data) {
            console.log('data:', data);
            let html = contactdetail(data);
            $.fancyConfirm({
                title: '',
                message: html,
                shownobtn: false,
                okButton: oktxt,
                noButton: canceltxt,
                callback: function (value) {
                    if (value) {
                        $('#txtKeyword').trigger("focus");
                    }
                }
            });
        },
        dataType: 'json'
    });
});

$(document).on('click', '.remove', function () {
    let cusId = $(this).data("id");
    let apId = $(this).data('apid');
    let token = $('input[name=__RequestVerificationToken]').val();
    $.fancyConfirm({
        title: '',
        message: confirmremove,
        shownobtn: true,
        okButton: oktxt,
        noButton: canceltxt,
        callback: function (value) {
            if (value) {
                $.ajax({
                    type: "POST",
                    url: '/Contact/Delete',
                    data: { contactId: cusId, accountProfileId: apId, '__RequestVerificationToken': token },
                    success: function () {
                        window.location.reload();
                    },
                    dataType: 'json'
                });
            }
        }
    });
});

$(document).on('click', '#btnSearchAttr', function () {
    $('#txtKeyword').attr('name', 'CustomerAttribute');
    openWaitingModal();
    $('#frmContact').trigger("submit");
});

$('#btnReload').on('click', function (e) {
    window.location.href = '/Contact/Index';
});


$(document).on('click', '.colheader', function () {
    let $sortcol = $('<input>').attr({ type: 'hidden', name: 'SortCol', value: $(this).data('col') });
    let $keyword = $('<input>').attr({ type: 'hidden', name: 'Keyword', value: $(this).data('keyword') });

    let $sortcol_a = $('<input>').attr({ type: 'hidden', name: 'SortCol_a', value: $(this).data('col') });
    let $keyword_a = $('<input>').attr({ type: 'hidden', name: 'Keyword_a', value: $(this).data('keyword') });

    $('#frmContact').append($sortcol).append($keyword).append($sortcol_a).append($keyword_a).trigger("submit");
});

$(function () {
    let $sortorder = $('#sortorder');
    let $sortcol = $('#sortcol');
    //console.log('sortorder:' + $sortorder.val() + ';sortcol:' + $sortcol.val());
    $target = $('.colheader').eq(<number>$sortcol.val());
    let sortcls = $sortorder.val() === 'asc' ? 'fa fa-sort-up' : 'fa fa-sort-down';
    $target.addClass(sortcls);

    initModals();
    closeWaitingModal();
    $('#txtKeyword').trigger("focus");

    $target = $('.pagination');
    $target.wrap('<nav aria-label="Page navigation"></nav>').find('li').addClass('page-item').find('a').addClass('page-link');

    let keyword = getParameterByName('Keyword');
    if (keyword !== null) {
        $('#txtKeyword').val(keyword);
    }
    $('.pagination li').addClass('page-hotlist');

    var checkall = getParameterByName('CheckAll');
    if (checkall !== null) {
        console.log('checkall:' + checkall);
        let checked = checkall == '1';
        $('.chk').prop('checked', checked);
        handleCheckall(checked);
    }

    console.log('totalcontactcount:' + $infoblk.data('totalcontactcount'));
    dicHotListContacts = $infoblk.data('jsonhotlistcontactlist');
    dicEblastContacts = $infoblk.data('jsoneblastcontactlist');
    CurrentEblastId = <number>$infoblk.data('currenteblastid');

    console.log('dichotlistcontacts:', dicHotListContacts);
    console.log('dicEblastContacts:', dicEblastContacts);
    console.log(CurrentEblastId);

    $('#txtAttrVal_d').datepicker({});
    $('#txtAttrVal_d').datepicker('setDate', new Date());

    if ($infoblk.data('returnmsg') !== '') {
        $.fancyConfirm({
            title: '',
            message: $infoblk.data('returnmsg'),
            shownobtn: false,
            okButton: oktxt,
            noButton: notxt,
            callback: function (value) {
                if (value) {
                    $('#txtKeyword').trigger("focus");
                }
            }
        });
    }

});