$infoblk = $("#infoblk");
enablebuysellunits = $infoblk.data("enablebuysellunits") == "True";


$(document).on("change", "#drpLocation", function () {
    stocklocation = <string>$(this).val();
    GetStocks(1);
});

$(document).on("click", "#btnReload", function () {
    window.location.href = "/Item/Stock";
});

$(document).on("click", "#btnSearch", function () {
    $("#txtStock").trigger("change");
});

$(function () {
    setFullPage();
    forstock = true;
    gTblName = gFrmName = "Stock";
    shops = (<string>$infoblk.data("shops")).split(",");
    //console.log('sortorder:' + $('#sortorder').val() + ';sortcol:' + $('#sortcol').val());
    $target = $(".colheader").eq(parseInt(<string>$("#sortcol").val()));
    let sortcls =
        $("#sortorder").val() === "asc" ? "fa fa-sort-up" : "fa fa-sort-down";
    $target.addClass(sortcls);

    initModals();
    triggerMenu(2, 1);
    keyword = "";
    $("#drpWarehouse").val($infoblk.data("shop"));
    stocklocation = <string>$("#drpLocation").val();

    DicIDItemOptions = $infoblk.data("jsondiciditemoptions");
    //console.log("DicIDItemOptions", DicIDItemOptions);
    GetStocks(1);

    /*$("#txtStock").trigger("focus");*/
});
