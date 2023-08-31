$infoblk = $('#infoblk');

function populateTblActionLog(response, type: string) {
    console.log('response#pop:', response);
    console.log('type#top:' + type);
    if (type == 'contact') {
        var _response: Array<IContact> = response.slice(0);
        let dataHtml: string = '';
        $.each(_response, function (i, e) {
            //$.each(contactlist, function (i, e) {
            var email = e.cusEmail == null ? "N/A" : e.cusEmail;
            var cname = e.cusIsOrganization ? e.cusName : e.cusFirstName.concat(' ', e.cusName);
            dataHtml += `<tr>
                <td style="width:110px;max-width:110px;" class="text-center">${cname}</td>
                <td style="width:100px;max-width:100px;" class="text-center">${e.cusContact}</td>
                <td style="width:110px;max-width:110px;" class="text-center">${email}</td>              
                <td style="width:110px;max-width:110px;" class="text-center">${e.cusPhone}</td> 
            </tr>`;
            //});
        });
        $('#tblactionlog_contact').removeClass('hide').find('tbody').empty().html(dataHtml);
    }

    openActionLogValModal();
}

function getActionLogVal(Id: number, type: string, actName: string) {
    console.log('type:' + type + ';actname:' + actName);
    $.ajax({
        type: "GET",
        url: '/Api/GetActionLogVal',
        data: { Id: Id, type: type, name: actName },
        success: function (data) {
            //console.log(JSON.parse(data));  
            let actname = actName.toLowerCase();
            let contactlist: Array<IContact> = [];
            if (actname.indexOf('import') >= 0 || actname == 'contact added from enquiry' || actname.indexOf('add to eblast')>=0 || actname.indexOf('add contacts to hotlist')>=0) {
                contactlist = JSON.parse(data).slice(0);
                //console.log(contactlist);
                pagingRecords(contactlist, 'actionlog_contact');
                //actname = '';
                return false;
            }
            if (actname == 'add contact' || actname == 'delete contact' || actname == 'edit contact') {
                console.log('addcontact');
                let contact: IContact = JSON.parse(data);
                contactlist.push(contact);
                pagingRecords(contactlist, 'actionlog_contact');
                //actname = '';
                return false;
            }
            if (actname == 'add callhistory' || 'edit callhistory') {
                console.log('addcallhistory');
                let callhistory: ICallHistory = JSON.parse(data);
                let doc: string = '';
                if (callhistory.chDocumentLink != null && callhistory.chDocumentName != null) {
                    doc = `<a href="${callhistory.chDocumentLink}" target="_blank">${callhistory.chDocumentName}</a>`;
                }
                let html = `<h3>${callhistorytxt}</h3><ul><li>${statustxt}: ${callhistory.chStatus}</li><li>${contacttxt}: ${callhistory.ContactName}</li><li>${doctxt}: ${doc}</li><li>${datetxt}: ${callhistory.chDateTimeDisplay}</li></ul>`;
                $.fancyConfirm({
                    title: '',
                    message: html,
                    shownobtn: false,
                    okButton: oktxt,
                    noButton: notxt,
                    callback: function (value) {
                        if (value) {
                            $('#txtKeyword').focus();
                            //actname = '';
                            return false;
                        }
                    }
                });	
            }
            $('#txtKeyword').focus();
        },
        dataType: 'json'
    });
}

$(document).on('dblclick', '.newpointer', function () {
    getActionLogVal(<number>$(this).data('id'), 'new', <string>$(this).data('name'));
});
$(document).on('dblclick', '.oldpointer', function () {
    getActionLogVal(<number>$(this).data('id'), 'old', <string>$(this).data('name'));
});

$('#btnReload').on('click', function (e) {
    e.stopPropagation();
    $('#txtKeyword').val('');
    window.location.href = `/CrmReport/ActionLog`;
});

$(document).on('click', '#btnReset', function () {
    $('#txtKeyword').val('').focus();
});

$(document).ready(function () {
    initModals();

    $target = $('.pagination');
    $target.wrap('<nav aria-label="Page navigation"></nav>').find('li').addClass('page-item').find('a').addClass('page-link');

    let keyword = getParameterByName('Keyword');
    if (keyword !== null) {
        $('#txtKeyword').val(keyword);
    }
    $('.pagination li').addClass('page-item');
    $('#txtKeyword').focus();
});