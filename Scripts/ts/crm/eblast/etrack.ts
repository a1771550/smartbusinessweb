$infoblk = $('#infoblk');
let _url: string = $infoblk.data('url');

$(document).on("click", "#btnAdvSearch", function () {
    eTrackAdvSearchItem = {
        strfrmdate: $("#datetimesmin").val() as string,
        strtodate: $("#datetimesmax").val() as string,
        blastId: $("#blastId").val() as string
    };
    openAdvancedSearchModal();
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
        //let url: string = `${_url}?PageNo=${$('#pageno').val()}&SortOrder=${$('#sortorder').val()}&PageSize=${pagesize}&Keyword=${$('#keyword').val()}`;
        window.location.href = `${_url}&PageSize=${pagesize}`;
    }
});

$(document).on('click', '#btnFilter', function () {
    let url = _url;    
    let datefrm: string = <string>$('#datetimesmin').val();
    let dateto: string = <string>$('#datetimesmax').val();
    let blastid: string = <string>$('#blastid').val();
    let contact: string = <string>$('#contact').val();
    let organ: string = <string>$('#organ').val();
    let viewdate: string = <string>$('#viewdate').val();
    console.log('viewdate:' + viewdate);
    //return false;
    if (datefrm !== null) {
        url += '&strfrmdate=' + datefrm;
    }
    if (dateto !== null) {
        url += '&strtodate=' + dateto;
    }
    if (blastid !== null) {
        url += '&blastid=' + blastid;
    }
    if (contact !== null) {
        url += '&contactname=' + contact;
    }
    if (organ !== null) {
        url += '&organization=' + organ;
    }
    if (viewdate !== null) {
        url += '&viewdate=' + viewdate;
    }
    console.log('url:' + url);
    //return false;
    //url += '&strfrmdate=' + $('#datetimesmin').val() + '&strtodate=' + $('#datetimesmax').val() + '&blastid=' + $('#blastid').val() + '&contactname=' + $('#contact').val() + '&organization=' + $('#organ').val() + '&viewdate=' + $('#viewdate').val();
    openWaitingModal();
    window.location.href = url;
});
$(document).on('click', '#btnReset', function () {
    $('input[type=search]').val('');
    $('.select2multiple').empty();
    $('#blastid').trigger("focus");
});
$('#btnReload').on('click', function () {
    window.location.href = $infoblk.data("reloadurl");
});

$(function () {
    foretrack = true;
    setFullPage();
    gTblName = "tblTrack";
    eTrackToken = $infoblk.data("token");
    initModals();   
    $('.select2multiple').select2({
        allowClear: true,
        width: 'resolve',
    });
    $('#blastid').select2({
        placeholder: subjecttxt,
    });
    $('#contact').select2({
        placeholder: contacttxt,
    });
    $('#organ').select2({
        placeholder: organizationtxt,
    });
    $('#viewdate').select2({
        placeholder: $infoblk.data('viewdatetxt'),
    });

    console.log('sortorder:' + $('#sortorder').val() + ';sortcol:' + $('#sortcol').val());
    $target = $('.colheader').eq(<number>$('#sortcol').val());
    let sortcls = $('#sortorder').val() === 'asc' ? 'fa fa-sort-up' : 'fa fa-sort-down';
    $target.addClass(sortcls);

    $target = $('.pagination');
    $target.wrap('<nav aria-label="Page navigation"></nav>').find('li').addClass('page-item').find('a').addClass('page-link');

    $("#iPageSize").trigger("focus");
});