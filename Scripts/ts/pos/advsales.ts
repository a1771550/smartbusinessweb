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


$(document).on("click", ".btnRequestApproval", function () {
    if (validSalesForm()) {
        // $("#txtConvertDate").val("");
        _submitSales();
    }
});

$(document).on("click", ".btnNewSales", function () {
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
                    window.location.href = "/PosFunc/AdvSales";
                }
            },
        });
    } else {
        window.location.href = "/PosFunc/AdvSales";
    }
});



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
    triggerMenu(0, 1);

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