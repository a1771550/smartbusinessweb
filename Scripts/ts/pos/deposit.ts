$infoblk = $("#infoblk");
priceeditable = false; //item price in deposit should not be editable
retailType = RtlType.deposit;

function submitRemaining() {
    if (Sale.Change > 0) {
        $("#changeModal").dialog("close");
    }

    Sale.Notes = <string>$("#txtNotes").val();
    Sale.CusID = selectedCus.cusCustomerID;
    Sale.salescode = rno;
    Sale.TotalRemainAmt = itotalremainamt;
    Sale.rtsDvc = $("#txtDeviceCode").val() as string;

    console.log("salesitemlist:", salesitemlist);
    console.log("Payments:", Payments);
    //return false;
    if (salesitemlist.length > 0) {
        const url = "/POSFunc/ProcessRemain";
        openWaitingModal();
        $.ajax({
            type: "POST",
            url: url,
            data: { Sale, SalesItemList: salesitemlist, Payments },
            success: function (data) {
                closeWaitingModal();
                console.log("returned data:", data);
                if (data.msg !== "silent") {
                    let _url =
                        $infoblk.data("printurl") +
                        "?issales=1&salesrefundcode=" +
                        data.salescode;
                    window.open(_url);
                }
                window.location.reload();
            },
            dataType: "json",
        });
    }
}

$(document).on("change", "#txtReceiptNo", function () {
    $("#btnSearchReceipt").trigger("click");
});
function resetDePage() {
  $(":input", "#frmCus")
    .not(":button, :submit, :reset, :hidden")
    .val("")
    .prop("checked", false)
    .prop("selected", false);
  $("#tblSales tbody").empty();
  $(".misc").val("");
}

$(document).on("click", "#btnSearchReceipt", function () {
  resetDePage();
  device = <string>$("#txtDeviceCode").val();
  rno = <string>$("#txtReceiptNo").val();
  phoneno = <string>$("#txtPhoneNo").val();
  if (rno === "" && phoneno === "") {
    $.fancyConfirm({
      title: "",
      message: renoorphonerequired,
      shownobtn: false,
      okButton: oktxt,
      noButton: canceltxt,
      callback: function (value) {
        if (value) {
          $("#txtReceiptNo").trigger("focus");
        }
      },
    });
    return false;
  } else if (device == "") {
    $.fancyConfirm({
      title: "",
      message: devicecoderequired,
      shownobtn: false,
      okButton: oktxt,
      noButton: canceltxt,
      callback: function (value) {
        if (value) {
          $("#txtDeviceCode").trigger("focus");
        }
      },
    });
    return false;
  } else {
    openWaitingModal();
    getRemoteData(
      "/Api/GetReceipt",
      { receiptno: rno, devicecode: device, phoneno: phoneno, refund: 0 },
      getReceiptOk_De,
      getRemoteDataFail
    );
  }
});

function getReceiptOk_De(data) {
  closeWaitingModal();
  console.log("data:", data);
  //return;
  if (data.msg != null) {
    falert(data.msg, oktxt);
  } else {
    Sales = data.sales;
    selectedSalesCode = Sales.rtsCode;
    selectedCus = data.customer;
    selectedCusCodeName = selectedCus.cusCode;
    companyinfo = data.companyinfo;
    receipt = data.receipt;
    dicPayTypes = data.dicpaytypes;
    SalesLnList = data.salesLns.slice(0);
    //console.log('saleslnlist:', SalesLnList);

    ItemList = data.items.slice(0);
    snlist = data.snlist.slice(0);
    cpplList = data.customerpointpricelevels.slice(0);

    if (data.depositLns.length > 0) {
      depositLns = data.depositLns.slice(0);
    }
    //console.log('depositLns:', depositLns);
    itotalremainamt = data.remainamt;
    $("#txtTotalRemain").val(formatnumber(itotalremainamt));
    fillinForm_De();
  }
}

function fillinForm_De() {
  $("#txtCustomerCode").val(selectedCusCodeName);
  $("#txtStaticCustomerName").val(selectedCus.cusName);

  if (selectedCusCodeName.toLowerCase() !== "guest") {
    $("#txtPoints").val(selectedCus.PointsActive);
    $("#txtPhone").val(selectedCus.cusCode);
    if (selectedCus.PointsActive == 0) {
      $("#txtPriceLevel").val(cpplList[0].PriceLevelDescription);
      selectedCus.cusPriceLevelID = cpplList[0].PriceLevelID;
    } else {
      $.each(cpplList, function (i, e) {
        if (e.CustomerPoint == selectedCus.PointsActive) {
          $("#txtPriceLevel").val(cpplList[i].PriceLevelDescription);
          selectedCus.cusPriceLevelID = cpplList[i].PriceLevelID;
          return false;
        }
        if (e.CustomerPoint > selectedCus.PointsActive) {
          if (typeof cpplList[i - 1].PriceLevelDescription !== "undefined") {
            $("#txtPriceLevel").val(cpplList[i - 1].PriceLevelDescription);
            selectedCus.cusPriceLevelID = cpplList[i - 1].PriceLevelID;
            return false;
          }
        }
      });
      if (
        selectedCus.PointsActive > cpplList[cpplList.length - 1].CustomerPoint
      ) {
        $("#txtPriceLevel").val(
          cpplList[cpplList.length - 1].PriceLevelDescription
        );
        selectedCus.cusPriceLevelID =
          cpplList[cpplList.length - 1].PriceLevelID;
      }
    }
  }

  if (Sales.rtsRmks !== null) {
    console.log("remark:" + Sales.rtsRmks);
    let $rblk = $("#salesremarkblk");
    $rblk.find("span").text(Sales.rtsRmks);
    $rblk.show();
  }

  let html = "";
  let salesitem: ISalesItem;

  $.each(SalesLnList, function (i, e) {
    let item = $.grep(ItemList, function (ele, idx) {
      return ele.itmCode == e.rtlItemCode;
    })[0];
    let batch = e.rtlBatchCode == null ? "N/A" : e.rtlBatchCode;
    totalsalesQty += e.rtlQty!;
    let depositqty: number = 0,
      depositdate = "N/A",
      depositamt: number = 0,
      depositamttxt: string = "";

    if (depositLns.length > 0) {
      $.each(depositLns, function (index, val) {
        /* console.log('depositlist seq:' + val.rtl) */
        if (
          e.rtlCode.toString().toLowerCase().indexOf("de") >= 0 &&
          val.rtlItemCode.toString() == e.rtlItemCode.toString() &&
          val.rtlSeq == e.rtlSeq
        ) {
          //console.log('depositamt:' + val.DepositAmt);
          depositamt = val.DepositAmt as number;
          depositamttxt = formatmoney(val.DepositAmt as number);
          depositqty = val.rtlQty!;
          depositdate = val.SalesDateDisplay;
          return false;
        }
      });
    }
    //console.log('depositamt:' + depositamt);
    salesitem = initSalesItem();
    salesitem.salescode = e.rtlCode;
    salesitem.itemcode = e.rtlItemCode;
    salesitem.rtlSeq = e.rtlSeq as number;
    salesitem.desc = item.itmDesc;
    salesitem.batch = batch;
    salesitem.qty = e.rtlQty as number;
    salesitem.price = e.rtlSellingPrice as number;
    salesitem.pricetxt = formatmoney(e.rtlSellingPrice as number);
    salesitem.disc = e.rtlLineDiscPc as number;
    salesitem.disctxt = formatnumber(e.rtlLineDiscPc as number);
    salesitem.taxtxt = formatnumber(e.rtlTaxPc as number);
    salesitem.tax = e.rtlTaxPc as number;
    salesitem.amttxt = formatmoney(e.rtlSalesAmt as number);
    salesitem.amt = e.rtlSalesAmt as number;
    salesitem.date = e.SalesDateDisplay;
    salesitem.depositqty = depositqty;
    salesitem.depositamttxt = depositamttxt;
    salesitem.depositamt = depositamt;
    salesitem.depositdate = depositdate;
      salesitem.qtyavailable = item.Qty;
      salesitem.rtlStockLoc = e.rtlStockLoc;
    salesitemlist.push(salesitem);
    //項目代碼	數量	 價格	折扣%	金額	 銷售日期	退款金額 	退款日期 	詳細
    html +=
      '<tr data-desc="' +
      item.itmDesc +
      '">' +
      /* '<td class="jexcel_row">' + (i + 1) + '</td>' +*/
      '<td class="text-center">' +
      e.rtlSeq +
      '</td><td class="text-center">' +
      e.rtlItemCode +
      '</td><td class="text-right">' +
      e.rtlQty +
      '</td><td class="text-right">' +
      formatnumber(e.rtlSellingPrice as number) +
      '</td><td class="text-right">' +
      formatnumber(e.rtlLineDiscPc as number) +
      '</td><td class="text-right">' +
      formatnumber(e.rtlSalesAmt as number) +
      '</td><td class="text-center">' +
      e.SalesDateDisplay +
      '</td><td class="text-right">' +
      formatnumber(depositamt) +
      '</td><td class="text-center">' +
      depositdate +
      '</td><td class="text-center">' +
      e.rtlStockLoc +
      "</td></tr>";
  });
  //console.log("salesitemlist:", salesitemlist);

  $("#tblSales tbody").empty().append(html);

  $("#tblSales tbody tr").each(function (i, e) {
    $(e)
      .find("td")
      .each(function (idx, ele) {
        $(ele).css({ "text-align": "center" });
      });
  });

  //check if all saleslns contain the same itemcode:
  let codes: Array<string | number> = [];
  $.each(salesitemlist, function (i, e) {
    codes.push(e.itemcode);
  });
}

function salesDetail_De(itemcode, seq) {
  let salesitem = $.grep(salesitemlist, function (e, i) {
    return e.itemcode === itemcode && e.rtlSeq == seq;
  })[0];
  //console.log('salesitem:', salesitem);
  //console.log('salesdate:' + salesitem.date);
  //console.log('snlist:', snlist);
  let _snlist = $.grep(snlist, function (e, i) {
    console.log(
      "salescode:" +
        e.snoRtlSalesCode +
        ";rtlSeq:" +
        e.snoRtlSalesSeq +
        ";date:" +
        e.SalesDateDisplay
    );
    return (
      e.snoItemCode === itemcode &&
      e.snoRtlSalesCode === salesitem.salescode &&
      e.snoRtlSalesSeq == seq &&
      e.SalesDateDisplay == salesitem.date
    );
  });
  //console.log('_snlist:', _snlist);

  let html = '<ul class="list-group list-group-flush">';
  html +=
    '<li class="list-group-item"><strong>' +
    receiptnotxt +
    "</strong>: " +
    salesitem.salescode +
    "</li>";
  html +=
    '<li class="list-group-item"><strong>' +
    itemcodetxt +
    "</strong>: " +
    salesitem.itemcode +
    "</li>";
  html +=
    '<li class="list-group-item"><strong>' +
    description +
    "</strong>: " +
    salesitem.desc +
    "</li>";
  html +=
    '<li class="list-group-item"><strong>' +
    batchtxt +
    "</strong>: " +
    salesitem.batch +
    "</li>";
  if (_snlist.length > 0) {
    let sncodes: string[] = [];
    $.each(_snlist, function (i, e) {
      sncodes.push(e.snoCode);
    });
    console.log("sncodes:", sncodes);
    html +=
      '<li class="list-group-item"><strong>' +
      serialnotxt +
      "</strong>: " +
      sncodes.join() +
      "</li>";
  }

  html +=
    '<li class="list-group-item"><strong>' +
    sellingpricetxt +
    "</strong>: " +
    salesitem.pricetxt +
    "</li>";
  html +=
    '<li class="list-group-item"><strong>' +
    discountitemheader +
    "</strong>: " +
    salesitem.disctxt +
    "</li>";
  html +=
    '<li class="list-group-item"><strong>' +
    taxitemheader +
    "</strong>: " +
    salesitem.taxtxt +
    "</li>";
  html +=
    '<li class="list-group-item"><strong>' +
    amountitemheader +
    "</strong>: " +
    salesitem.amttxt +
    "</li>";
  html +=
    '<li class="list-group-item"><strong>' +
    salesdatetxt +
    "</strong>: " +
    salesitem.date +
    "</li>";
  html +=
    '<li class="list-group-item"><strong>' +
    qtytxt +
    "</strong>: " +
    salesitem.qty +
    "</li>";
  //html += '<li class="list-group-item"><strong>' + qtyavailable + '</strong>: ' + salesitem.qtyavailable + '</li>';
  html +=
    '<li class="list-group-item"><strong>' +
    depositamt +
    "</strong>: " +
    salesitem.depositamttxt +
    "</li>";
  html +=
    '<li class="list-group-item"><strong>' +
    depositdate +
    "</strong>: " +
    salesitem.depositdate +
    "</li>";
  html += "</ul>";
  $.fancyConfirm({
    title: "",
    message: html,
    shownobtn: false,
    okButton: oktxt,
    noButton: canceltxt,
    callback: function (value) {
      if (value) {
        //focusItemCode();
      }
    },
  });
}

$(document).on("click", "#btnPayment", function () {
  if (SalesLnList.length === 0) {
    falert(salesinfonotenough, oktxt);
  } else {
    openPayModel_De();
  }
});

function openPayModel_De() {
  payModal.dialog("option", { width: 600, title: processpayments });
  payModal.dialog("open");
  //console.log('itotalremainamt#paymodal:' + itotalremainamt);
  $("#totalremainamt").text(formatmoney(itotalremainamt));
  $("#remainamt").text(formatmoney(0));
  let cashtxt = itotalremainamt.toFixed(2);
  $("#Cash").val(cashtxt);
}

$(document).on("click", "#btnReload", function () {
  if (SalesLnList.length > 0) {
    $.fancyConfirm({
      title: "",
      message: confirmreload,
      shownobtn: true,
      okButton: oktxt,
      noButton: canceltxt,
      callback: function (value) {
        if (value) {
          window.location.reload();
        }
      },
    });
  }
});

$(function () {
  fordeposit = true;
  $("body")
    .find(".container.body-content")
    .removeClass("container")
    .addClass("container-fluid");
  initModals();
  Sale = initSale();
  Sale.Deposit = 1;
  device = $infoblk.data("devicecode");

  $("#txtDeviceCode").trigger("focus");

  $("#tblDeposit tr td input").hover(
    function () {
      $(this).css("background-color", "#FFFFB0");
    },
    function () {
      $("#tblDeposit tr td input").css("background-color", "#fff"); //apply to other inputs as well!
    }
  );
});
