$infoblk = $("#infoblk");

enablebuysellunits = $infoblk.data("enablebuysellunits") == "True";

let JsStockList: Array<IJsStock> = [];

$(document).on("click", "#btnTransfer", function () {
    $target = $("#tblTransfer tr");
    let outofbalancefound: boolean = false;
    $target.each(function (i, e) {
        if ($(e).find("td:last").find(".balance").hasClass("outofbalance")) {
            outofbalancefound = true;
            return false;
        }
    });
    //   console.log("outofbalancefound:", outofbalancefound);
    if (outofbalancefound) {
        $.fancyConfirm({
            title: "",
            message: $infoblk.data("outofbalancewarningtxt"),
            shownobtn: false,
            okButton: oktxt,
            noButton: notxt,
            callback: function (value) {
                if (value) {
                    $(".outofbalance").addClass("glowing-border").addClass("focus");
                }
            },
        });
    } else {
        $target = $("#tblTransfer tr:gt(0)");
        $target.each(function (i, e) {
            $(e)
                .find("td:gt(3)")
                .each(function (k, v) {
                    let $input = $(v).find("input");
                    //console.log('has class locqty?', $input.hasClass('locqty'));
                    if ($input.hasClass("locqty")) {
                        let jsstock: IJsStock = initJsStock();
                        let Id: number = <number>$input.data("id");
                        let itmCode: string = $input.data("code") as string;
                        //console.log('id:' + Id);
                        //if (Id > 0) {
                            jsstock.Id = Id;
                            let shop: any = $input.data("shop");
                            if (!isNaN(shop)) {
                                shop = Number(shop).toString();
                            }
                            //   console.log("shop:" + shop);
                            jsstock.LocCode = shop;
                            jsstock.itmCode = itmCode;
                            jsstock.Qty = Number($input.val());
                            //   console.log("qty:" + jsstock.Qty);
                            JsStockList.push(jsstock);
                        //}
                    }
                });
        });
         console.log("JsStockList:", JsStockList);
         console.log("transferlist:", TransferList);
         //return false;

        if (JsStockList.length > 0 && TransferList.length > 0) {
            $.ajax({
                type: "POST",
                url: "/Transfer/ProcessTransfer",
                data: {
                    __RequestVerificationToken: $(
                        "input[name=__RequestVerificationToken]"
                    ).val(),
                    JsStockList,
                    TransferList,
                },
                success: function (data) {
                    if (data) {
                        $.fancyConfirm({
                            title: "",
                            message: data.msg,
                            shownobtn: false,
                            okButton: oktxt,
                            noButton: notxt,
                            callback: function (value) {
                                if (value) {
                                    window.location.reload();
                                    window.open("/Transfer/Print", "_blank");
                                    //window.location.href = '/Transfer/Print';
                                }
                            },
                        });
                    }
                },
                dataType: "json",
            });
        }        
    }
});

$(document).on("change", ".locqty", function () {
    let itmcode: string = $(this).data("code") as string;
    let shop: string = convertVarNumToString($(this).data("shop"));

    //console.log('itemcode:' + itmcode + ';shop:' + shop);

    var result = TransferList.filter(function (v, i) {
        return v.itmCode == itmcode && v.stShop == shop;
    });

    if (result.length == 0) {
        stocktransfer = initStockTransfer();
        stocktransfer.itmCode = itmcode;
        stocktransfer.stShop = shop;
    } else {
        stocktransfer = result[0];
    }

    let originalqty: number = <number>$(this).data("oldval");
    let changeqty: number = <number>$(this).val();

    let diff: number = changeqty - originalqty;
    stocktransfer.stReceiver = diff > 0 ? shop : "";
    stocktransfer.stSender = diff > 0 ? "" : shop;
    //console.log("diff:" + diff);

    if (diff > 0) {
        stocktransfer.inQty = diff;
        stocktransfer.outQty = 0;
    } else {
        stocktransfer.inQty = 0;
        stocktransfer.outQty = -1 * diff;
    }

    let onhandstock: number = <number>$(this).data("onhandstock");
    //console.log("onhandstock:" + onhandstock);
    let {
        $balance,
        balance,
    }: { $balance: JQuery<HTMLElement>; balance: number } = getBalance.call(
        this,
        onhandstock
    );
    $balance.val(balance);
    if (balance < 0) {
        $balance.removeClass("okbalance").addClass("outofbalance");
    } else {
        $balance.removeClass("outofbalance").addClass("okbalance");
    }

    if (result.length == 0) {
        TransferList.push(stocktransfer);
    } else {
        $.each(TransferList, function (i, e) {
            if (e.itmCode == itmcode && e.stShop == shop) {
                e = stocktransfer;
                return false;
            }
        });
    }
});

$(document).on("click", ".TransferPager .page", function () {
    pageindex = parseInt(<string>$(this).attr("page"));
    GetStocks(pageindex);
});
$(document).on("click", "#btnReload", function () {
    window.location.href = "/Transfer/Index";
});

$(document).on("change", "#txtStock", function () {
    keyword = <string>$(this).val();
    if (keyword !== "") {
        GetStocks(1);
    }
});

$(document).on("click", "#btnSearch", function () {
    $("#txtStock").trigger("change");
});

function getBalance(this: any, onhandstock: number) {
    let totalqty: number = 0;
    $target = $(this).parent("td").parent("tr");
    $target.find("td").each(function (i, e) {
        let $input = $(e).find("input");
        if ($input.hasClass("locqty")) {
            totalqty += Number($input.val());
        }
    });
    console.log("qty:" + totalqty);
    let balance: number = onhandstock - totalqty;
    console.log("balance:" + balance);
    let $balance = $target.find("td:last").find(".balance");
    return { $balance, balance };
}

$(document).on("dblclick", ".itemoption.locqty", function () {
    openWaitingModal();
    window.location.href = "/Transfer/Transfer?hasItemOption=1&hasIvOnly=0&itemId=" + $(this).data("itemid")+"&location="+$(this).data("shop")+"&qty="+$(this).val()+"&stcode="+$("#stCode").text();
});
$(document).on("dblclick", ".vari.locqty", function () {
    openWaitingModal();
    window.location.href = "/Transfer/Transfer?hasItemOption=0&hasIvOnly=1&itemId=" + $(this).data("itemid") + "&location=" + $(this).data("shop") + "&qty=" + $(this).val() + "&stcode=" + $("#stCode").text();
});
$(function () {
    setFullPage();
    /*forstock = fortransfer = true;*/
    fortransfer = true;
    gTblName = gFrmName = "Transfer";
    stockTransferCode = <string>$("#stCode").text();
    shops = $infoblk.data("shops")? (<string>$infoblk.data("shops")).split(","):[];

    //console.log('sortorder:' + $('#sortorder').val() + ';sortcol:' + $('#sortcol').val());
    $target = $(".colheader").eq(parseInt(<string>$("#sortcol").val()));
    let sortcls =
        $("#sortorder").val() === "asc" ? "fa fa-sort-up" : "fa fa-sort-down";
    $target.addClass(sortcls);

    initModals();

    $target = $(".pagination");
    $target
        .wrap('<nav aria-label="Page navigation"></nav>')
        .find("li")
        .addClass("page-item")
        .find("a")
        .addClass("page-link");

    keyword = "";
    $("#drpWarehouse").val($infoblk.data("shop"));
    stocklocation = <string>$("#drpLocation").val();

    DicIDItemOptions = $infoblk.data("jsondiciditemoptions");
    GetStocks(1);
    
    $("#txtStock").trigger("focus");
});
