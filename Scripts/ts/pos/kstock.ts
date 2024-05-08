$infoblk = $('#infoblk');

let _orderby: string = 'itemName';
let _direction: string = 'asc';
let warehouseId: number;

$(document).on('click', '#btnSearch', function () {
    keyword = <string>$('#txtKeyword').val();
    if (keyword !== '') {
        GetKStocks(1);
    }
});

$(document).on('change', '#drpWarehouse', function () {
    warehouseId = <number>$(this).val();
    GetKStocks(1);
});

function GetKStocks(pageIndex: number) {
    //must not use json here!!!
    let data = '{PageNo:' + pageIndex + ',pagesize:' + $infoblk.data('pagesize') + ',orderBy:"' + _orderby + '",direction:"' + _direction + '",stockId:' + warehouseId + ',keyword:"' + keyword + '"}';
    console.log('data:', data);
    /*return false;*/
    openWaitingModal();
    $.ajax({
        url: "/Api/GetKStocksAjax",
        type: "POST",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: OnGetKStocksOK,
        error: onAjaxFailure,
    });
};
function OnGetKStocksOK(response) {
    keyword = '';
    closeWaitingModal();
    console.log('response:', response);
    var model = response;
    let stocklist: Array<IKItemStock> = model.ItemStockList.slice(0);
    console.log('modelitems:', stocklist);

    if (stocklist.length > 0) {
        $('#tblStock').show();
        $('#lastupdatetime').text(stocklist[0].ModifyTimeDisplay);

        var row = $("#tblStock tr:last-child").removeAttr("style").clone(false);
        $("#tblStock tr").not($("#tblStock tr:first-child")).remove();

        $.each(stocklist, function (i, e: IKItemStock) {
            $("td", row).eq(0).html(e.ItemName);
            $("td", row).eq(1).text(e.Qty);

            $("#tblStock").append(row);
            row = $("#tblStock tr:last-child").clone(false);
        });
        $(".StockPager").ASPSnippets_Pager({
            ActiveCssClass: "current",
            PagerCssClass: "pager",
            PageIndex: model.PageIndex,
            PageSize: model.PageSize,
            RecordCount: model.RecordCount
        });
    }
    else {
        $('#tblStock').hide();
    }
    console.log('stocklist length:' + stocklist.length);
    stocklist.length == 0 ? $('#norecord').show() : $('#norecord').hide();
};
$(document).on("click", ".StockPager .page", function () {
    PageNo = parseInt(<string>$(this).attr('page'));
    GetKStocks(PageNo);
});

$(document).on('click', '#btnReload', function () {
    window.location.href = '/POSFunc/Stock';
});

$(document).ready(function () {
    console.log('sortorder:' + $('#sortorder').val() + ';sortcol:' + $('#sortcol').val());
    $target = $('.colheader').eq(parseInt(<string>$('#sortcol').val()));
    let sortcls = $('#sortorder').val() === 'asc' ? 'fa fa-sort-up' : 'fa fa-sort-down';
    $target.addClass(sortcls);

    initModals();
    $('#txtKeyword').focus();

    keyword = '';    
    $('#drpWarehouse').val($infoblk.data('defaultwarehouseid'));
    warehouseId = <number>$('#drpWarehouse').val();
    GetKStocks(1);
});