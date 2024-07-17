$infoblk = $("#infoblk");

let zerostockItemList: Array<IItem> = [];
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

function initInfoBlk4AdvSales() {   
    enableSN = true;
    priceeditable = $infoblk.data("priceeditable") === "True";
    disceditable = $infoblk.data("disceditable") === "True";
    device = $infoblk.data("devicecode");
    DicPayServiceCharge = $infoblk.data("dicpayservicecharge");
    defaultcustomer = $infoblk.data("defaultcustomer");
    debug = $infoblk.data("debug") == "1";
    DicPayTypesChecked = $infoblk.data("dicpaytypeschecked");
}

function getSessionStartDataOk(data) {
    closeWaitingModal();

    cpplList = data.CustomerPointPriceLevels.slice(0);
    receipt = data.receipt;
    DicPayTypes = data.dicpaytypes;
    selectedCus = defaultcustomer;
    PageSize = data.pagelength;
    inclusivetax = data.inclusivetax;
    inclusivetaxrate = data.inclusivetaxrate;
    salesmen = data.salesmanlist;
    enableTax = data.enableTax;
    DicCurrencyExRate = Object.assign({}, data.DicCurrencyExRate);
    UseForexAPI = data.UseForexAPI;
    //MyobJobList = data.JobList.slice(0);

    try {
        sessionstartdata.push(cpplList);
        sessionstartdata.push(receipt);
        sessionstartdata.push(DicPayTypes);
        //sessionstartdata.push(defaultcustomer);
        sessionstartdata.push(PageSize);
        sessionstartdata.push(enableTax);
        sessionstartdata.push(inclusivetax);
        sessionstartdata.push(inclusivetaxrate);
        sessionstartdata.push(salesmen);
        sessionstartdata.push(DicCurrencyExRate);
        sessionstartdata.push(UseForexAPI);
        //sessionstartdata.push(MyobJobList);
        localStore.setItem("sessionstartdata", JSON.stringify(sessionstartdata));
    } catch (e) {
        alert("Please go away");
    }

    if (defaultcustomer !== null) {
        selectedCus = defaultcustomer;
        selectedCusCodeName = defaultcustomer.cusCode;
        selectCus();
    } else {
        $("#txtCustomerName").trigger("focus");
    }
    Sales = initSales();
}
$(document).on("dblclick", ".nopo", function () {
    $("#txtCustomerPO").val("N/A");
});
$(function () {
    forsales = getParameterByName("reserveId") == null;
    forReservePaidOut = !forsales;
    salesType = SalesType.retail;
    setFullPage();
    triggerMenuByCls("menusales", 1);
    initInfoBlk4AdvSales();
    initVariablesFrmInfoblk();
   
    shop = comInfo.Shop;
    device = comInfo.Device;
    shops = comInfo.Shops.split(",");
    devices = comInfo.Devices.split(",");

    $("#drpLocation").val(shop); 
    $("#drpDevice").val(device);

    $("#rtsExRate").val(1);
    displayExRate(1);
  
    gTblId = "tblSales";
    let _url = getParameterByName("url");
    //console.log('_url:' + _url);
    if (_url !== null) {
        //console.log('ready to open new window...');
        window.open(_url, "_blank");
    }
 
    initModals();

    if (forsales) {      

        editmode = $("#mode").val() === "edit";
        let _receiptno = getParameterByName("receiptno");        

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
                receipt = sessionstartdata[2];
                DicPayTypes = sessionstartdata[3];
                PageSize = sessionstartdata[5];
                enableTax = sessionstartdata[6];
                inclusivetax = sessionstartdata[7];
                inclusivetaxrate = sessionstartdata[8];
                salesmen = sessionstartdata[9];
                //defaultcustomer = sessionstartdata[4];
                DicCurrencyExRate = sessionstartdata[10];
                //MyobJobList = sessionstartdata[12];
                selectedCus = defaultcustomer;
                Sales = initSales();
                Sales.rtsCusCode = selectedCus.cusCode;
                Sales.rtsRefCode = "";
                selectedCusCodeName = defaultcustomer.cusCode;
                selectCus();
            }
        }
    }

    if (forReservePaidOut) {
        initVTDatePicker();
    }

    setInput4NumberOnly("number");
});