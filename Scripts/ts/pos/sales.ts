$infoblk = $("#infoblk");
enablelogo = $infoblk.data("enablelogo") === "True";
enableSN = true;
// enableTax = $infoblk.data("enabletax") === "True";
priceeditable = $infoblk.data("priceeditable") === "True";
disceditable = $infoblk.data("disceditable") === "True";
//printfields = $infoblk.data('printfields');
device = $infoblk.data("devicecode");
enablecashdrawer = $infoblk.data("enablecashdrawer") == "1";

let zerostockItemList: Array<IItem> = [];

checkoutportal = $infoblk.data("checkoutportal");

checkedcashdrawer = $infoblk.data("checkedcashdrawer")
    ? $infoblk.data("checkedcashdrawer") == "1"
    : false;

DicBatTotalQty = $infoblk.data("jsondicbattotalqty");

$(document).on("click", ".btnNewSales", function () {
    window.location.reload();
});
$(document).on("click", ".btnRequestApproval", function () {
    if (validSalesForm()) {
        // $("#txtConvertDate").val("");
        _submitSales();
    }
});


$(document).on("click", "#btnNewSales", function () {
    if (SalesLnList.length > 0) {
        $.fancyConfirm({
            title: "",
            message: confirmnewsales,
            shownobtn: true,
            okButton: oktxt,
            noButton: canceltxt,
            callback: function (value) {
                console.log("value:", value);
                if (value) {
                    window.location.href = "/PosFunc/Sales";
                }
            },
        });
    } else {
        window.location.href = "/PosFunc/Sales";
    }
});

$(document).on("change", "#txtCashDrawerAmt", function () {
    let _amt = $(this).val();
    let _token = cashdrawerModal
        .find('input[name="__RequestVerificationToken"]')
        .val();
    /* console.log(_amt + ';' + _token); return false;*/
    if (_amt !== "") {
        $.ajax({
            type: "POST",
            url: "/POSFunc/CashDrawer",
            data: { cashdraweramt: _amt, __RequestVerificationToken: _token },
            success: function (data) {
                checkedcashdrawer = true;
                closeCashDrawerModal();
                getSessionStartDataOk(data);
            },
            dataType: "json",
        });
    } else {
        falert(cashdraweramtprompt, oktxt);
        $("#txtCashDrawerAmt").trigger("focus");
    }
});

let localStore = window["localStorage"];
let sessionstartdata: Array<any> = [];

function getSessionStartDataOk(data) {
    closeWaitingModal();
    //console.log('data:', data);

    cpplList = data.CustomerPointPriceLevels.slice(0);
    companyinfo = data.companyinfo;
    receipt = data.receipt;
    DicPayTypes = data.dicpaytypes;
    /* itemlist = data.items;*/
    selectedCus = defaultcustomer = data.defaultcustomer;
    //console.log('selectedCus#getsessionok:', selectedCus);
    pagelength = data.pagelength;
    //console.log('data.inclusivetax:' + data.inclusivetax);
    inclusivetax = data.inclusivetax;
    inclusivetaxrate = data.inclusivetaxrate;
    //console.log('inclusivetax#sessionstart:' + inclusivetax + ';inclusivetaxrate:' + inclusivetaxrate);
    salesmanlist = data.salesmanlist;
    enableTax = data.enableTax;
    DicCurrencyExRate = Object.assign({}, data.DicCurrencyExRate);
    //console.log(DicCurrencyExRate);
    useForexAPI = data.UseForexAPI;

    JobList = data.JobList.slice(0);
    
    try {
        sessionstartdata.push(cpplList);
        sessionstartdata.push(companyinfo);
        sessionstartdata.push(receipt);
        sessionstartdata.push(DicPayTypes);
        sessionstartdata.push(defaultcustomer);
        sessionstartdata.push(pagelength);
        sessionstartdata.push(enableTax);
        sessionstartdata.push(inclusivetax);
        sessionstartdata.push(inclusivetaxrate);
        sessionstartdata.push(salesmanlist);
        sessionstartdata.push(DicCurrencyExRate);
        sessionstartdata.push(useForexAPI);
        sessionstartdata.push(JobList);
        localStore.setItem("sessionstartdata", JSON.stringify(sessionstartdata));
    } catch (e) {
        alert("Please go away");
    }

    if (defaultcustomer !== null) {
        //console.log('default customer:', defaultcustomer);
        //console.log('cuscode:' + defaultcustomer.cusCode);
        selectedCusCodeName = defaultcustomer.cusCode;
        selectCus();
    } else {
        $("#txtCustomerName").trigger("focus");
    }

    Sales = initSales();
    //console.log("Sales@getsessiondataok:", Sales);

}
$(document).on("dblclick", ".nopo", function () {
    $("#txtCustomerPO").val("N/A");
});

$(function () {   
    forsales = true;
    salesType = SalesType.retail;
    setFullPage();

    DicLocation = $infoblk.data("jsondiclocation");

    comInfo = $infoblk.data("cominfo");
    shop = comInfo.Shop;
    device = comInfo.Device;
    shops = comInfo.Shops.split(",");
    devices = comInfo.Devices.split(",");

    $("#drpLocation").val(shop);
    $("#drpDevice").val(device);

    $("#rtsExRate").val(1);
    displayExRate(1);

    batchidx = 5;
    snidx = batchidx + 1;
    vtidx = snidx + 1;
    //exRate = 1;
    //DicCurrencyExRate = $infoblk.data('jsondiccurrencyexrate');
    gTblName = "tblSales";
    let _url = getParameterByName("url");
    //console.log('_url:' + _url);
    if (_url !== null) {
        //console.log('ready to open new window...');
        window.open(_url, "_blank");
    }

    AccountProfileId = parseInt(<string>$infoblk.data("accountprofileid"));
    initModals();

    if (forsales) {
        if (enablecashdrawer && !checkedcashdrawer) {
            openCashDrawerModal();
        }

        editmode = $("#mode").val() === "edit";
        let _receiptno = getParameterByName("receiptno");
        let _readonly: boolean =
            getParameterByName("readonly") !== null &&
            getParameterByName("readonly") == "1";

        let _mode: string = getParameterByName("mode") ?? "";
        // console.log("_mode:" + _mode);

        if (_receiptno !== null || editmode) {
            receiptno = selectedSalesCode = _receiptno as string;
            reviewmode = _receiptno !== null && !editmode;
        }

        if (reviewmode || editmode || _mode == "created") {
            //console.log("here");
            $.ajax({
                type: "GET",
                url: "/Api/GetSalesOrderInfo",
                data: { salescode: selectedSalesCode },
                success: function (data: ISalesOrderEditModel) {
                    salesInfo = data;
                    //console.log("salesinfo:", salesInfo);
                    selectedCus = salesInfo.Customer ?? initCustomer();//if salesInfo.Customer==null=>GUEST               
                    Sales = initSales();
                    //console.log("Sales@getsalesorderinfo:", Sales);
                    Sales.rtsCode = selectedSalesCode;
                    Sales.rtsCusID = selectedCus.cusCustomerID;
                    //Sales.rtsDvc = $infoblk.data("device");
                    //Sales.rtsSalesLoc = $infoblk.data("shop");
                    Sales.rtsGiftOption = 0;
                    Sales.rtsRefCode = "";
                    $(".NextSalesInvoice").val(Sales.rtsCode);
                    $("#txtNotes").val(salesInfo.SalesOrder.rtsRmks);
                    $target = $("#txtDeliveryDate").datepicker();
                    $target.each(function () {
                        $.datepicker._clearDate(this);
                    });
                    let deldate = new Date(salesInfo.SalesOrder.DeliveryDateDisplay);
                    $target.datepicker("setDate", deldate);
                    $target.datepicker("option", { dateFormat: "yy-mm-dd" });

                    $("#txtCustomerPO").val(salesInfo.SalesOrder.rtsCustomerPO);

                    deliveryAddressId = <number>salesInfo.SalesOrder.rtsDeliveryAddressId;
                    //console.log("deliveryAddressId:" + deliveryAddressId);
                    fillInAddressList();

                    selectCus();

                    ItemList = salesInfo.Items.slice(0);
                    currentY = 0;
                    $target = $("#tblSales tbody tr");

                    DicItemSNs = salesInfo.DicItemSNs;
                    itemsnlist = [];
                    $.each(salesInfo.SalesLnViews, function (i, e) {
                        //   console.log(e);
                        selectedItem = e.Item;
                        selectedItemCode = selectedItem.itmCode;
                        //   console.log("selecteditemcode#loop:" + selectedItemCode);
                        let salesln: ISalesBase = {} as ISalesBase;
                        salesln.amount = <number>e.rtlSalesAmt;
                        salesln.batchcode = e.rtlBatchCode;
                        salesln.discount = <number>e.rtlLineDiscAmt;
                        salesln.itemcode = selectedItemCode;
                        salesln.itemdesc = e.Item.itmDesc;
                        salesln.itemname = e.Item.itmName;
                        salesln.price = <number>e.rtlSellingPrice;
                        salesln.qty = <number>e.rtlQty;
                        salesln.rtlBatchCode = e.rtlBatchCode;
                        salesln.rtlItemCode = selectedItemCode;
                        salesln.rtlLineDiscPc = <number>e.rtlLineDiscPc;
                        salesln.rtlQty = <number>e.rtlQty;
                        salesln.rtlSalesAmt = <number>e.rtlSalesAmt;
                        salesln.rtlSellingPrice = <number>e.rtlSellingPrice;
                        salesln.rtlSeq = <number>e.rtlSeq;
                        salesln.rtlTaxPc = <number>e.rtlTaxPc;
                        //   console.log("salesln:", salesln);
                        SalesList.push(salesln);

                        currentY = i;
                        let $tr = $target.eq(currentY);

                        let idx = 0;
                        $tr.find("td:eq(1)").find(".itemcode").val(selectedItemCode);
                        $tr.find("td:eq(2)").find(".itemdesc").val(e.Item.NameDesc);
                        // .trigger("change");
                        idx = 4;
                        $tr
                            .find("td")
                            .eq(idx)
                            .find(".qty")
                            .val(<number>e.rtlQty)
                            .trigger("change");
                        // console.log("qty triggered change@load");

                        for (const [key, value] of Object.entries(DicItemSNs)) {
                            // console.log(`key:${key}: value:${value}`);
                            let keyarr = key.split(":");
                            if (
                                e.rtlCode == keyarr[0] &&
                                e.rtlItemCode == keyarr[1] &&
                                e.rtlSeq == parseInt(keyarr[2])
                            ) {
                                //console.log('matched!');
                                let arrSN: Array<string> = [];
                                $.each(value, function (k, v) {
                                    arrSN.push(v.snoCode);
                                });
                                let objSN: IItemSN = {
                                    itemcode: selectedItem.itmCode,
                                    seq: <number>e.rtlSeq,
                                    serialcodes: arrSN,
                                } as IItemSN;
                                //   console.log("objsn#loop:", objSN);
                                itemsnlist.push(objSN);
                                //   console.log("itemsnlist#loop:", itemsnlist);
                            }
                        }
                        if (e.rtlHasSerialNo) {
                            setSNmark(false);
                        }

                        idx = PriceIdx4Sales;
                        let $price = $tr.find("td").eq(idx).find(".price");
                        $price.val(formatnumber(e.rtlSellingPrice!));
                        $price.prop("readonly", !selectedItemCode.startsWith("/"));
                        idx++;
                        $tr.find("td").eq(idx).find(".discpc").val(formatnumber(e.rtlLineDiscPc ?? 0));
                        idx++;
                        $tr.find("td").eq(idx).find(".taxpc").val(formatnumber(e.rtlTaxPc ?? 0));
                        $tr
                            .find("td")
                            .last()
                            .find(".amount")
                            .val(formatnumber(e.rtlSalesAmt ?? 0));
                        // .trigger("change");

                        updateRow(e.rtlSellingPrice ?? 0, e.rtlLineDiscPc ?? 0);
                        // console.log("amount triggered changed@load");

                        addRow();
                    });

                    const status = getParameterByName("status");
                    if (!editmode) {
                        isapprover = $infoblk.data("isapprover") === "True";
                        ismanager = $infoblk.data("ismanager") === "True";
                        //console.log("ismanager:", ismanager);

                        if (_readonly) {
                            /* make all inputs readonly */
                            $("input").prop("disabled", true);
                            $("textarea").prop("disabled", true);
                            $("select").prop("disabled", true);
                        }
                        // console.log("isapprover:", isapprover);
                        // console.log("_mode:" + _mode);
                        if (isapprover) {
                            //console.log("specialapproval?", salesInfo.SalesOrder.rtsSpecialApproval);
                            if (!ismanager && salesInfo.SalesOrder.rtsSpecialApproval && status === "REQUESTING") {
                                $("button").not(".btnNewSales").addClass("disabled").off("click");
                            }
                            if (
                                _mode === "created" ||
                                (status != null && (status == "CREATED" || status == "VOIDED"))
                            ) {
                                //$("button").not(".btnNewSales, .btnVoid").addClass("disabled").off("click");
                                //console.log("here");
                                if (status == "CREATED")
                                    $("button").not(".btnNewSales, .btnVoid").addClass("disabled").off("click");
                                if (status == "VOIDED")
                                    $("button").not(".btnNewSales").addClass("disabled").off("click");
                            }
                            //if (status != null && status == "VOIDED") {
                            //    $("button.btnVoid").addClass("disabled").off("click");
                            //}
                        }
                        else {
                            // console.log("_readonly:" + _readonly);
                            if (_readonly) {
                                $("button").not(".btn-success").addClass("disabled").off("click");
                            } else {
                                $("button")
                                    .not(".btn-success")
                                    .not(".respond")
                                    .not(".request")
                                    .not(".whatspplink")
                                    .not(".ui-button")
                                    .addClass("disabled")
                                    .off("click");
                                $("button").data("code", selectedSalesCode);
                            }
                        }
                    }
                    editmode = false;

                    $("#txtTotal").val(
                        formatnumber(Number(salesInfo.SalesOrder.rtsFinalTotal))
                    );

                    if (reviewmode || _mode == "created") {
                        // console.log("here");
                        $("#tblSales tbody tr").each(function (i, e) {
                            let itemcode = $(e).find("td").eq(1).find(".itemcode").val();
                            //console.log("itemcode:" + itemcode);
                            if (itemcode === "") {
                                //console.log("here");
                                $(e).remove();
                                return false;
                            }
                        });
                    }
                },
                dataType: "json",
            });
        }
        else {
            if (localStore.getItem("sessionstartdata") === null) {
                openWaitingModal();
                getRemoteData(
                    "/Api/GetSessionStartData",
                    {},
                    getSessionStartDataOk,
                    getRemoteDataFail
                );
            }
            else {
                //if (localStorage.length > 0) {
                sessionstartdata = JSON.parse(
                    <string>localStore.getItem("sessionstartdata")
                );
                //console.log('sessionstartdata:', sessionstartdata);
                cpplList = sessionstartdata[0];
                companyinfo = sessionstartdata[1];
                receipt = sessionstartdata[2];
                DicPayTypes = sessionstartdata[3];
                pagelength = sessionstartdata[5];
                enableTax = sessionstartdata[6];
                inclusivetax = sessionstartdata[7];
                inclusivetaxrate = sessionstartdata[8];
                salesmanlist = sessionstartdata[9];
                defaultcustomer = sessionstartdata[4];
                DicCurrencyExRate = sessionstartdata[10];
                //console.log("DicCurrencyExRate:", DicCurrencyExRate);
                //useForexAPI = sessionstartdata[11];
                JobList = sessionstartdata[12];
                //console.log('defaultcustomer:', defaultcustomer);
                selectedCus = defaultcustomer;
                Sales = initSales();
                /*console.log("Sales@loadpostback:", Sales);*/
                Sales.rtsCusID = selectedCus.cusCustomerID;
                //Sales.rtsDvc = $infoblk.data("device");
                //Sales.rtsSalesLoc = $infoblk.data("shop");
                Sales.rtsGiftOption = 0;
                Sales.rtsRefCode = "";

                selectedCusCodeName = defaultcustomer.cusCode;
                selectCus();
            }
        }
    }
});