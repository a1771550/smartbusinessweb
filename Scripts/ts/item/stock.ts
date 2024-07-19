﻿$infoblk = $("#infoblk");


$(document).on("change", "#drpLocation", function () {
    stocklocation = <string>$(this).val();
    GetStocks(1);
});

$(function () {
    setFullPage();
    forstock = true;
    gTblId = "tblStock";
    gFrmId = "frmStock";
    shops = (<string>$infoblk.data("shops")).split(",");
    enablebuysellunits = $infoblk.data("enablebuysellunits") == "True";
    initModals();
    triggerMenuByCls("menuitem", 1);
    keyword = "";
    $("#drpWarehouse").val($infoblk.data("shop"));
    stocklocation = <string>$("#drpLocation").val();

    DicCodeItemOptions = $infoblk.data("jsondiccodeitemoptions");

    sortByName = true;
    ConfigSimpleSortingHeaders();
});
