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
printurl = $infoblk.data("printurl");

retailType = RtlType.sales;
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

$(document).on("change", "#drpShop", function () {
    Sale.SelectedShop = $(this).val() as string;
});
$(document).on("change", "#drpDevice", function () {
    Sale.SelectedDevice = $(this).val() as string;
});

$(document).on("change", "#drpDeliveryAddr", function () {
    Sale.deliveryAddressId = <number>$(this).val();
});

$(document).on("change", "#deposit", function () {
    if ($(this).is(":checked")) {
        Sale.Deposit = 1;
    } else {
        Sale.Deposit = 0;
    }
});

$(document).on("change", "#monthlypay", function () {
    if ($(this).is(":checked")) {
        $.fancyConfirm({
            title: confirmsubmit,
            message: confirmmonthlypay,
            shownobtn: true,
            okButton: oktxt,
            noButton: canceltxt,
            callback: function (value) {
                if (value) {
                    Sale.MonthlyPay = 1;
                    payModal.find(".paymenttype").prop("disabled", true);
                    closePayModal();
                    submitSales();
                } else {
                    Sale.MonthlyPay = 0;
                    $("#monthlypay").prop("checked", false);
                    payModal.find(".paymenttype").prop("disabled", false);
                }
            },
        });
    } else {
        Sale.MonthlyPay = 0;
        payModal.find(".paymenttype").prop("disabled", false);
    }
});

$(document).on("change", ".batch", function () {
    currentY = getCurrentY(this);
    updateRow();
});

$(document).on("change", "#txtRoundings", function () {
    let _roundings = $(this).val();
    if (_roundings !== "") {
        //minus current roundings first:
        itotalamt -= Sale.Roundings;
        //add new roundings:
        Sale.Roundings = parseFloat(<any>$(this).val());
        itotalamt += Sale.Roundings;
    } else {
        itotalamt -= Sale.Roundings;
        $(this).val(formatnumber(0));
    }
    $("#txtTotal").val(formatnumber(itotalamt));
});

$(document).on("change", "#txtPayerCode", function () {
    authcode = <string>$(this).val();
    if (authcode !== "") {
        $(".chkpayment").prop("checked", false);
        if (authcode.indexOf("2") === 0) {
            //starts with 2
            //alipay
            $("#chkAlipay").prop("checked", true);
            $(".chkpayment").trigger("change");
            $("#Alipay").val(formatnumber(itotalamt));
        }
        if (authcode.indexOf("1") === 0) {
            //starts with 1
            //wechat
            $("#chkWechat").prop("checked", true);
            $(".chkpayment").trigger("change");
            $("#Wechat").val(formatnumber(itotalamt));
        }
        confirmPay();
    }
});

$(document).on("click", "#transactionEpay", function () {
    //for debug only:
    //selectedSalesCode = 'SA100256';
    //printurl += '?issales=1&salesrefundcode=' + selectedSalesCode;
    $.ajax({
        type: "GET",
        url: "/POSFunc/TransactionResult",
        data: { salescode: selectedSalesCode },
        success: function (data) {
            $.fancyConfirm({
                title: "",
                message: data.msg,
                shownobtn: false,
                okButton: oktxt,
                noButton: notxt,
                callback: function (value) {
                    if (value) {
                        if (data.status == 1) {
                            window.open(printurl);
                            window.location.reload();
                        } else {
                        }
                    }
                },
            });
        },
        dataType: "json",
    });
});

$(document).on("click", ".btnPayment", function () {
    //console.log('saleslist:', SalesList);
    if (SalesLnList.length === 0 || $(`#${gTblName} .focus`).length > 0) {
        falert(salesinfonotenough, oktxt);
    } else {
        openPayModal();
    }
});

$(document).on("change", ".itemdesc", function () {
    seq = parseInt($(this).parent("td").parent("tr").find("td:eq(0)").text());
    selectedSalesLn = $.grep(SalesLnList, function (e: ISalesLn, i) {
        return e.rtlSeq == seq;
    })[0];
    //console.log('selectedsalesitem:', selectedSalesLn);
    selectedSalesLn.Item.itmDesc = <string>$(this).val();
});

$(document).on("change", "#drpSalesman", function () {
    selectedPosSalesmanCode = <string>$(this).val();
});

$(document).on("dblclick", "#txtCustomerName", function () {
    GetCustomers4Sales(1);
});

$(document).on("change", "#txtCustomerName", function (e) {
    handleCustomerNameChange(e);
});

$(document).on("dblclick", ".cuscode", function () {
    closeCusModal();
    selectedCusCodeName = $(this).data("code");
    selectedCus = CusList.filter(
        (x) => x.cusCustomerID.toString() == selectedCusCodeName
    )[0];
    if (!selectedCus) {
        $.ajax({
            type: "GET",
            url: "/Api/GetCustomerById",
            data: { customerId: parseInt(selectedCusCodeName) },
            success: function (data: ICustomer) {
                selectedCus = data;
                selectCus();
            },
            dataType: "json",
        });
    } else {
        selectCus();
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
    dicPayTypes = data.dicpaytypes;
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
    JobList = data.JobList.slice(0);

    useForexAPI = data.UseForexAPI;
    try {
        sessionstartdata.push(cpplList);
        sessionstartdata.push(companyinfo);
        sessionstartdata.push(receipt);
        sessionstartdata.push(dicPayTypes);
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
}





$(document).on("dblclick", ".nopo", function () {
    $("#txtCustomerPO").val("N/A");
});

$(function () {
    forsales = true;
    setFullPage();
    DicLocation = $infoblk.data("jsondiclocation");
    shops = ($infoblk.data("shops") as string).split(",");
    devices = ($infoblk.data("devices") as string).split(",");
    $("#rtsExRate").val(1);
    displayExRate(1);

    batchidx = 5;
    snidx = batchidx + 1;
    vtidx = snidx + 1;

    Sale = initSale();
    shop = Sale.SelectedShop = $infoblk.data("shop") as string;
    $("#drpLocation").val(shop);

    device = Sale.SelectedDevice = $("#drpDevice").val() as string;
    //console.log('DicLocation:', DicLocation);
    exRate = 1;
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
                Sales = new SalesModel(
                    selectedSalesCode,
                    selectedCus.cusCustomerID,
                    $infoblk.data("device"),
                    $infoblk.data("shop"),
                    0,
                    ""
                );
                $(".NextSalesInvoice").val(Sales.rtsCode);
                $(".respond").data("code", Sales.rtsCode);
                $("#txtNotes").val(salesInfo.SalesOrder.rtsRmks);
                $("#chkspecialapproval")
                    .prop("checked", salesInfo.SalesOrder.rtsSpecialApproval)
                    .trigger("change");
                let giftoption = salesInfo.SalesOrder.rtsGiftOption;

                $("#giftDriver").prop("checked", giftoption == 1);
                $("#giftSales").prop("checked", giftoption == 2);
                $("#giftNoGift").prop("checked", giftoption == 3);

                selectedPosSalesmanCode = salesInfo.SalesOrder.KSalesmanCode as string;
                //console.log(selectedPosSalesmanCode);
                $(".drpSalesman").val(selectedPosSalesmanCode);
                //console.log("selectedsalesman:" + $(".drpSalesman").val());
                //$(".salespersonname").val(salesInfo.SalesOrder.SalesPersonName ?? "");

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
                //console.log($target.length); //1
                // return;
                // let pricetdidx: number = kawadamode ? 4 : 5;

                DicItemSNs = salesInfo.DicItemSNs;
                // console.log("dicitemsns#ready:", DicItemSNs);
                // console.log("saleslnviews:", salesInfo.SalesLnViews);
                itemsnlist = [];
                let saleslnlength = salesInfo.SalesLnViews.length;
                // console.log("saleslnlength:" + saleslnlength);

                $.each(salesInfo.SalesLnViews, function (i, e) {
                    //   console.log(e);
                    selectedItem = e.Item;
                    selectedItemCode = selectedItem.itmCode;
                    //   console.log("selecteditemcode#loop:" + selectedItemCode);
                    let salesln: ISalesBase = initSalesBase();
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
                    $tr.find("td:eq(2)").find(".itemdesc").val(e.Item.NameDescTxt);
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

                    idx = 9;
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
                // console.log("itemsnlist:", itemsnlist);
                // console.log("saleslist:", SalesList);
                // console.log("_readonly:", _readonly);
                // console.log("editmode:", editmode);
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
    } else {
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
            dicPayTypes = sessionstartdata[3];
            pagelength = sessionstartdata[5];
            enableTax = sessionstartdata[6];
            inclusivetax = sessionstartdata[7];
            inclusivetaxrate = sessionstartdata[8];
            salesmanlist = sessionstartdata[9];
            defaultcustomer = sessionstartdata[4];
            DicCurrencyExRate = sessionstartdata[10];
            useForexAPI = sessionstartdata[11];
            JobList = sessionstartdata[12];
            //console.log('defaultcustomer:', defaultcustomer);
            selectedCus = defaultcustomer;
            Sales = new SalesModel(
                $infoblk.data("nextsalescode"),
                defaultcustomer.cusCustomerID,
                $infoblk.data("device"),
                $infoblk.data("shop"),
                0,
                ""
            );

            selectedCusCodeName = defaultcustomer.cusCode;
            selectCus();
        }
    }


});


