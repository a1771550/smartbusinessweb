$infoblk = $("#infoblk");


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
    triggerMenu(2, 1);
    keyword = "";
    $("#drpWarehouse").val($infoblk.data("shop"));
    stocklocation = <string>$("#drpLocation").val();

    DicIDItemOptions = $infoblk.data("jsondiciditemoptions");

    sortByName = true;
    ConfigSimpleSortingHeaders();
});
