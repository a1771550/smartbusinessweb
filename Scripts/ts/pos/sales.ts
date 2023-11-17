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

    MyobJobList = data.JobList.slice(0);
    
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
        sessionstartdata.push(MyobJobList);
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
        //console.log("reviewmode:", reviewmode);
        //console.log("editmode:", editmode);
        if (reviewmode || editmode || _mode == "created") {
          
            //$.ajax({
            //    type: "GET",
            //    url: "/SalesOrder/GetSalesOrderInfo",
            //    data: { salescode: selectedSalesCode },
            //    success: function (data: ISimpleSalesOrderInfo) {                  
            //        SalesOrderInfo = data;
            //        DicItemOptions = structuredClone(SalesOrderInfo.DicItemOptions);
            //        DicCurrencyExRate = structuredClone(SalesOrderInfo.DicCurrencyExRate);
            //        //console.log("salesinfo:", salesInfo);
            //        selectedCus = SalesOrderInfo.Customer ?? initCustomer();//if salesInfo.Customer==null=>GUEST               
            //        SimpleSales = structuredClone(SalesOrderInfo.SalesOrder);
            //        //console.log("Sales@getsalesorderinfo:", Sales);  
            //        $(".NextSimpleSalesInvoice").val(SimpleSales.rtsCode);
            //        $("#txtNotes").val(SimpleSales.rtsRmks);

            //        selectCus();

            //        SimpleItemList = SalesOrderInfo.Items.slice(0);
            //        currentY = 0;
            //        gTblName = "tblSales";
            //        $target = $(`#${gTblName} tbody tr`);

            //        DicItemSnList = SalesOrderInfo.DicItemSNs;
            //        itemsnlist = [];
            //        $.each(SalesOrderInfo.SalesLnViews, function (i:number, e:ISalesLn|ISimpleSalesLn) {
            //            //   console.log(e);                       
            //            var item = structuredClone(e.Item);
            //            selectedItemCode = item.itmCode; 

            //            selectedSalesLn = structuredClone(e) as ISalesLn;
            //            currentY = i;                       
            //            populateItemRow();                     
            //            addRow();
            //        });

            //        const status = getParameterByName("status");
            //        if (!editmode) {
            //            isapprover = $infoblk.data("isapprover") === "True";
            //            ismanager = $infoblk.data("ismanager") === "True";
            //            //console.log("ismanager:", ismanager);

            //            if (_readonly) {
            //                /* make all inputs readonly */
            //                $("input").prop("disabled", true);
            //                $("textarea").prop("disabled", true);
            //                $("select").prop("disabled", true);
            //            }
                      
            //            if (isapprover) {                           
            //                if (
            //                    _mode === "created" ||
            //                    (status != null && (status == "CREATED" || status == "VOIDED"))
            //                ) {
            //                    //$("button").not(".btnNewSimpleSales, .btnVoid").addClass("disabled").off("click");
            //                    //console.log("here");
            //                    if (status == "CREATED")
            //                        $("button").not(".btnNewSales, .btnVoid").addClass("disabled").off("click");
            //                    if (status == "VOIDED")
            //                        $("button").not(".btnNewSales").addClass("disabled").off("click");
            //                }                           
            //            }
            //            else {
            //                // console.log("_readonly:" + _readonly);
            //                if (_readonly) {
            //                    $("button").not(".btn-success").addClass("disabled").off("click");
            //                } else {
            //                    $("button")
            //                        .not(".btn-success")
            //                        .not(".respond")
            //                        .not(".request")
            //                        .not(".whatspplink")
            //                        .not(".ui-button")
            //                        .addClass("disabled")
            //                        .off("click");
            //                    $("button").data("code", SimpleSales.rtsCode);
            //                }
            //            }
            //        }
            //        editmode = false;

            //        $("#txtTotal").val(
            //            formatnumber(Number(SimpleSales.rtsFinalTotal))
            //        );

            //        if (reviewmode || _mode == "created") {
            //            removeEmptyRow();
            //        }
            //    },
            //    dataType: "json",
            //});
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
                MyobJobList = sessionstartdata[12];
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