$infoblk = $('#infoblk');
let _getlinktxt = $infoblk.data('getlinktxt');

$('#btnReload').on('click', function (e) {    
    e.stopPropagation();
    $('#txtKeyword').val('');
    window.location.href = `/OneDrive/Index`;
});

$(document).on( 'click', '#btnReset', function () {
    $('#txtKeyword').val('').focus();
});


function populateTblonedrives(response) {
    console.log('response#pop:', response);
    let dataHtml: string = '';
    $.each(response, function (i, e) {
        var tagfile = `<a href='${e.odFileWebUrl}' class='filelnk' target='_blank'>${e.odFileName}</a>`;
        dataHtml += `<tr><td>${tagfile}</td><td>${e.CreateTimeDisplay}</td><td><a href="#" class="btn btn-primary getlink" role="button" data-link="${e.odFileWebUrl}" data-Id="${e.Id}">${_getlinktxt}</td></tr>`;
    });
    $('#pagingblk').hide();//hide mvc paging
    $('#tblonedrive tbody').empty().html(dataHtml);

    $('#totalcount').text(response.length);
}

function fillInOneDrive(_file: IOneDrive, e) {
    _file.Id = e.id;
    _file.odFileName = e.name;
    _file.odFileLink = e['@microsoft.graph.downloadUrl'];
    _file.odFileWebUrl = e.webUrl;
    _file.odFileSize = e.size;
    _file.odFileType = e.file.mimeType;
    _file.UploadTimeDisplay = (<string>e.createdDateTime).replace('T', ' ').replace('Z', '');
    return _file;
}

function fillInOneDriveFiles(files) {
    onedrivefiles = [];
    $.each(files, function (i, e) {
        if (!e.package && !e.folder) {
            onedrivefile = initOneDrive();
            onedrivefile = fillInOneDrive(onedrivefile, e);
            onedrivefiles.push(onedrivefile);
        }
    });
    console.log('onedrivefiles:', onedrivefiles);
}

function displayFiles() {
    console.log('onedrivefiles:', onedrivefiles);   

    if (onedrivefiles.length > 0) {
        //save onedrivefiles to db:
        let startdate = $('#datetimesmin').val();
        let enddate = $('#datetimesmax').val();
        console.log('onedrivefiles:', onedrivefiles);
        //console.log(startdate + ';' + enddate);
        //return false;
        $.ajax({
            type: "POST",
            url: '/OneDrive/Save',
            data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), model: onedrivefiles, startdate, enddate },
            success: function (data) {
                if (data) {
                    console.log('data:', data);
                    onedrivefiles = data.onedrivefiles.slice(0);
                    pagingRecords(onedrivefiles, 'onedrive');
                    $('#txtKeyword').focus();
                }
            },
            dataType: 'json'
        });
    }
}

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
                    $('#iPageSize').focus();
                }
            }
        });
    } else {
        let url: string = `/OneDrive/Index?PageNo=${$('#pageno').val()}&SortOrder=${$('#sortorder').val()}&PageSize=${pagesize}&Keyword=${$('#keyword').val()}`;
        window.location.href = url;
    }
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