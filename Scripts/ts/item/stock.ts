$infoblk = $("#infoblk");
enablebuysellunits = $infoblk.data("enablebuysellunits") == "True";
//var barcode = document.querySelector("#txtKeyword");

//$('#txtKeyword').on({
//    keypress: function (e) {
//        if (e.key !== "Enter") {
//            barcode!.value += e.key;
//        }
//        e.preventDefault();
//    },
//    keyup: function () {
//        var $field = $(this);
//        setTimeout(function () {
//            keyword = $field.val();
//            GetStocks(1);
//        }, 500);
//    }
//});

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

    /*$("#txtKeyword").trigger("focus");*/
});
