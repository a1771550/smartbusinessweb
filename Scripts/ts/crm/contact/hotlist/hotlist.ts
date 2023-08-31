$infoblk = $('#infoblk');

$(document).on('click', '.remove', function () {
    let Id: number = <number>$(this).data('id');
    $.fancyConfirm({
        title: '',
        message: confirmremovetxt,
        shownobtn: true,
        okButton: oktxt,
        noButton: notxt,
        callback: function (value) {
            if (value) {
                $.post({
                    url: "/HotList/Delete",
                    data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), 'Id': Id }                    
                }).done(function () {
                    window.location.reload();
                });
            } else {
                $('#txtKeyword').focus();
            }
        }
    });
});

$('#btnReload').on('click', function (e) {
    e.stopPropagation();
    $('#txtKeyword').val('');
    window.location.href = `/HotList/Index`;
});

$(document).on('click', '#btnReset', function () {
    $('#txtKeyword').val('').focus();
});

$(document).on('click', '.detail', function () {
    $target = $('#txtKeyword');
    hotlist = initHotList(this);
    console.log('hotlist:', hotlist);

    $.ajax({
        type: "GET",
        url: '/Api/GetContactsByHotListId',
        data: {'hotlistId':hotlist.Id},
        success: function (data:Array<IContact>) {
            console.log(data);
            let hotlistdetailtxt = $infoblk.data('hotlistdetailtxt');
            let html = '<h2>' + hotlistdetailtxt + '</h2>' + '<ul class="list-group list-group-flush">';
            html += `<h5>${desctxt}</h4><p>${hotlist.hoDescription}</p>`;
            //html += `<p><span class="mx-3">${createtimetxt}:</span>${hotlist.CreateTimeDisplay}<p>`;
            //html += `<p><span class="mx-3">${modifytimetxt}:</span>${hotlist.ModifyTimeDisplay}<p>`;
            html += `<table class="table table-bordered table-striped table-hover table-condensed">`;
            html += `<thead class="gray-header">
        <tr>
            <th>
                ${contacttxt}
            </th>           
<th>${emailtxt}</th>
<th>${phonetxt}</th>
<th>${mobiletxt}</th>
<th>${organizationtxt}</th>           
        </tr>
    </thead>`;
            html += '<tbody>';
            $.each(data, function (i, e: IContact) {
                let mobile = e.cusMobile ?? 'N/A';
                html += `<tr><td>${e.cusContact}</td><td>${e.cusEmail}</td><td>${e.cusPhone}</td><td>${mobile}</td><td>${e.NameDisplay}</td></tr>`;
            });
           
            html += '</tbody>';
            html += '</table>';
            $.fancyConfirm({
                title: '',
                message: html,
                shownobtn: false,
                okButton: oktxt,
                noButton: notxt,
                callback: function (value) {
                    if (value) {
                        $target.focus();
                    }
                }
            });
        },
        dataType: 'json'
    });	

    
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
