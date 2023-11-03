$infoblk = $("#infoblk");
let mode: string = "sales";
//selectedRefundLn = [];
let refunditemlist = [];
let PayView = [];
$target = $("#tblsearch tbody");
let idata;
let receiptnolist: string[] = [],
  snnolist: string[] = [],
  batchnolist: string[] = [];
let issilent: boolean = $infoblk.data("issilent") === "True";
RefundList = [];
let txtsearch: string = "";
SalesItemList = [];
let salesitem: ISalesItem;
approvalmode = $infoblk.data("approvalmode") === "True";
approvalmode = $infoblk.data("approvalmode") === "True";

// function respondReview(type) {
//   $.ajax({
//     type: "POST",
//     url: "/Api/RespondSalesOrderReview",
//     data: {
//       __RequestVerificationToken: $(
//         "input[name=__RequestVerificationToken]"
//       ).val(),
//       type,
//       receiptno,
//       usercode: $infoblk.data("usercode"),
//       rejectreason,
//     },
//     success: function (data) {
//       if (data) {
//         $.fancyConfirm({
//           title: "",
//           message: data,
//           shownobtn: false,
//           okButton: oktxt,
//           noButton: notxt,
//           callback: function (value) {
//             if (value) {
//               if (type == "approve") {
//                 $("#btnApprove").prop("disabled", true).off("click");
//               }
//               if (type == "reject") {
//                 $("#btnReject").prop("disabled", true).off("click");
//               }
//               if (type == "pass") {
//                 $("#btnPass").prop("disabled", true).off("click");
//               }
//               $("#txtSearch").focus();
//             }
//           },
//         });
//       }
//     },
//     dataType: "json",
//   });
// }

$(document).on("click", ".respond", function () {
  let type: string = $(this).data("type");
  receiptno = <string>$("#txtSearch").val();

  if (type == "reject") {
    openTextAreaModal();
    $("#textareaModal")
      .find("#lblField")
      .text($infoblk.data("rejectreasontxt"));
  } else {
    respondReview(type);
  }
});

$(document).on("click", "#btnSearch", function () {
  console.log("mode:" + mode);
  txtsearch = <string>$("#txtSearch").val();
  if (txtsearch !== "") {
    resetForm(true);
    openWaitingModal();
    if (mode === "sales") {
      getRemoteData(
        "/Api/SearchReceiptBySalesCode",
        { salescode: txtsearch.trim() },
        getSearchOk,
        getRemoteDataFail
      );
    }
    if (mode === "serial") {
      getRemoteData(
        "/Api/SearchReceiptBySerialNo",
        { serialno: txtsearch.trim() },
        getSearchOk,
        getRemoteDataFail
      );
    }
    if (mode === "batch") {
      getRemoteData(
        "/Api/SearchReceiptByBatchNo",
        { batchno: txtsearch.trim() },
        getSearchOk,
        getRemoteDataFail
      );
    }
  } else {
    if (mode === "sales") {
      falert(salesnorequired, oktxt);
    }
    if (mode === "serial") {
      falert(serialnorequired, oktxt);
    }
    if (mode === "batch") {
      falert(batchnorequired, oktxt);
    }
  }
});

function getSearchOk(data) {
  console.log("data.retmsg:", data.retmsg);
  if (data.retmsg !== "") {
    $(".searchresult").show();
    $(".hide").removeClass("hide");

    CusList = data.customers.slice(0);

    let _SalesList = data.salesLns.slice(0);
    if (typeof data.refundLns !== "undefined" && data.refundLns.length > 0) {
      RefundList = data.refundLns.slice(0);
    }

    DicItemSNs = data.dicItemSNs;
    console.log("dicitemsns:", DicItemSNs);
    ItemList = data.items.slice(0);

    let html = "",
      salesitem: ISalesItem;

    $.each(_SalesList, function (i: number, e) {
      let item = $.grep(ItemList, function (ele, idx) {
        return ele.itmCode == e.rtlItemCode;
      })[0];
      let price = e.rtlSellingPrice;
      let batch = e.rtlBatch == null ? "N/A" : e.rtlBatch;
      totalsalesQty += e.rtlQty;
      let refundamttxt: string = "N/A",
        refundqtytxt: string = "N/A",
        refunddate = "N/A";
      let refundqty: number = 0,
        refundamt: number = 0;
      if (RefundList.length > 0) {
        $.each(RefundList, function (index, val) {
          if (e.rtlCode == val.rtlRefSales && val.itemcode === e.rtlItemCode) {
            console.log("refundamt:" + val.amt);
            refundamttxt = formatmoney(-1 * val.amt);
            refundamt = -1 * val.amt;
            refundqty = val.refundedQty;
            refundqtytxt = val.refundedQty.toString();
            refunddate = val.SalesDateDisplay;
            return false;
          }
        });
      }
      salesitem = initSalesItem();
      salesitem.salescode = e.rtlCode;
      salesitem.itemcode = e.rtlItemCode;
      salesitem.rtlSeq = e.rtlSeq;
      salesitem.desc = item.itmDesc;
      salesitem.batch = batch;
      salesitem.qty = e.rtlQty;
      salesitem.price = price;
      salesitem.pricetxt = formatmoney(price);
      salesitem.disc = e.rtlLineDiscPc;
      salesitem.disctxt = formatnumber(e.rtlLineDiscPc);
      salesitem.tax = e.rtlTaxRate;
      salesitem.taxtxt = formatnumber(e.rtlTaxRate);
      salesitem.amt = e.rtlSalesAmt;
      salesitem.amttxt = formatmoney(e.rtlSalesAmt);
      salesitem.date = e.SalesDateDisplay;
      salesitem.refundqty = refundqty;
      salesitem.refundqtytxt = refundqtytxt;
      salesitem.refundamt = refundamt;
      salesitem.refunddate = refunddate;
      salesitem.refundamttxt = refundamttxt;
      salesitem.depositamt = 0;
      salesitem.depositamttxt = "";
      salesitem.remark = e.rtsRmks;
      salesitem.internalnote = e.rtsInternalRmks;
      salesitem.customerpo = e.rtsCustomerPO;
      salesitem.deliverydatedisplay = e.DeliveryDateDisplay;
      SalesItemList.push(salesitem);
      //項目代碼	數量	 價格	折扣%	金額	 銷售日期	退款金額 	退款日期

      html +=
        "<tr ondblclick=\"salesDetail_search('" +
        e.rtlCode +
        "','" +
        e.rtlItemCode +
        "','" +
        e.rtlSeq +
        '\')"><td class="jexcel_row">' +
        (i + 1).toString() +
        '</td><td class="text-center">' +
        e.rtlCode +
        '</td><td class="text-center">' +
        e.rtlItemCode +
        '</td><td class="text-right">' +
        e.rtlQty +
        '</td><td class="text-right">' +
        formatnumber(price) +
        '</td><td class="text-right">' +
        formatnumber(e.rtlLineDiscPc) +
        '</td><td class="text-right">' +
        formatnumber(e.rtlSalesAmt) +
        '</td><td class="text-center">' +
        e.SalesDateDisplay +
        '</td><td class="text-right">' +
        refundamt +
        '</td><td class="text-center">' +
        refunddate +
        '</td><td class="text-center"><button type="button" class="btn btn-info" onclick="salesDetail_search(\'' +
        e.rtlCode +
        "','" +
        e.rtlItemCode +
        "','" +
        e.rtlSeq +
        "')\">" +
        detailtxt +
        "</button></td></tr>";
      //if (approvalmode) {
      //    html+=`<td><button class='btn btn-outline-success' data-salescode='${e.rtlCode}' onclick="editSalesOrder('${e.rtlCode}');">${edittxt}</button></td>`;
      //}
      //html += '</tr>';
      $target.empty().append(html);
    });
    console.log("SalesItemList#0:", SalesItemList);
    if (html !== "" && approvalmode) {
      $("#tblsearch tfoot").removeClass("hide");
    }
  }
  //}
  else {
    falert(nodatafoundtxt, oktxt);
  }
  closeWaitingModal();

  $("#txtSearch").val(txtsearch);
}

function salesDetail_search(salescode, itemcode, seq) {
  console.log("SalesItemList:", SalesItemList);
  let salesitem: ISalesItem = $.grep(SalesItemList, function (e, i) {
    return e.salescode == salescode && e.itemcode === itemcode && e.rtlSeq == seq;
  })[0];
  console.log("salesitem:", salesitem);
  console.log("salesdate:" + salesitem.date);

  let html = '<ul class="list-group list-group-flush">';
  html +=
    '<li class="list-group-item"><strong>' +
    receiptnotxt +
    "</strong>: " +
    salescode +
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
  if (approvalmode) {
    html +=
      '<li class="list-group-item"><strong>' +
      customerpotxt +
      "</strong>: " +
      salesitem.customerpo +
      "</li>";
    html +=
      '<li class="list-group-item"><strong>' +
      deliverydatetxt +
      "</strong>: " +
      salesitem.deliverydatedisplay +
      "</li>";
  }

  console.log("dicitemsns:", DicItemSNs);
  console.log("itemcode:#detail:" + itemcode + ";rtlSeq#detail:" + seq);
  //if (dicItemSNs !== null) {
  let sncodes: string[] = _getSncodes(salescode, itemcode, seq);
  if (sncodes.length > 0) {
    console.log("sncodes:", sncodes);
    html +=
      '<li class="list-group-item"><strong>' +
      serialnotxt +
      "</strong>: " +
      sncodes.join() +
      "</li>";
  } else {
    html +=
      '<li class="list-group-item"><strong>' +
      serialnotxt +
      "</strong>: N/A</li>";
  }
  html +=
    '<li class="list-group-item"><strong>' +
    qtytxt +
    "</strong>: " +
    salesitem.qty +
    "</li>";
  html +=
    '<li class="list-group-item"><strong>' +
    sellingpricetxt +
    "</strong>: " +
    formatmoney(salesitem.price) +
    "</li>";
  html +=
    '<li class="list-group-item"><strong>' +
    discountitemheader +
    "</strong>: " +
    salesitem.disc +
    "</li>";
  html +=
    '<li class="list-group-item"><strong>' +
    taxitemheader +
    "</strong>: " +
    salesitem.tax +
    "</li>";
  html +=
    '<li class="list-group-item"><strong>' +
    amountitemheader +
    "</strong>: " +
    formatmoney(salesitem.amt) +
    "</li>";
  html +=
    '<li class="list-group-item"><strong>' +
    salesdatetxt +
    "</strong>: " +
    salesitem.date +
    "</li>";

  console.log("cuslist:", CusList);
  selectedCus = $.grep(CusList, function (e, i) {
    return e.salescode == salescode;
  })[0];
  html +=
    '<li class="list-group-item"><strong>' +
    notetxt +
    "</strong>: " +
    salesitem.remark +
    "</li>";
  html +=
    '<li class="list-group-item"><strong>' +
    internalnotetxt +
    "</strong>: " +
    salesitem.internalnote +
    "</li>";

  html +=
    '<li class="list-group-item"><strong>' +
    refundqtytxt +
    "</strong>: " +
    salesitem.refundqty +
    "</li>";
  html +=
    '<li class="list-group-item"><strong>' +
    refundamttxt +
    "</strong>: " +
    formatmoney(salesitem.refundamt) +
    "</li>";
  html +=
    '<li class="list-group-item"><strong>' +
    refunddatetxt +
    "</strong>: " +
    salesitem.refunddate +
    "</li>";

  html +=
    '<li class="list-group-item"><strong>' +
    customertxt +
    "</strong>: " +
    selectedCus.cusName +
    "</li>";
  let _pdesc =
    selectedCus.cusName.toLowerCase() === "guest"
      ? "N/A"
      : selectedCus.cusPriceLevelDescription;
  html +=
    '<li class="list-group-item"><strong>' +
    priceleveltxt +
    "</strong>: " +
    _pdesc +
    "</li>";
  let _phone = selectedCus.cusPhone ?? "N/A";
  html +=
    '<li class="list-group-item"><strong>' +
    phonenotxt +
    "</strong>: " +
    _phone +
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
        printReceipt(salescode);
      }
    },
  });
}

function printReceipt(salescode) {
  console.log("SalesItemList:", SalesItemList);
  //function genSales(_qty, _price, _discount, _amt, _itemcode, _itemdesc, _taxrate, _snlist, _batch, _seq)
  $.each(SalesItemList, function (i, e) {
    genSales(e);
  });

  if (!issilent) {
    let _url =
      $infoblk.data("printurl") + "?issales=1&salesrefundcode=" + salescode;
    window.open(_url);
  }
}

function _getSncodes(
  _salescode: string,
  _itemcode: string | number,
  _seq: number
): string[] {
  let codes: string[] = [];
  let _key: string = _salescode + ":" + _itemcode + ":" + _seq;
  if (typeof DicItemSNs !== "undefined" && DicItemSNs !== null) {
    for (const [key, value] of Object.entries(DicItemSNs)) {
      console.log(`${key}: ${value}`);
      if (key == _key) {
        console.log("value:", value);
        $.each(value, function (i, e) {
          console.log("snocode:" + e.snoCode);
          codes.push(e.snoCode);
        });
        break;
      }
    }
  }
  return codes;
}

function genSales(salesitem: ISalesItem) {
  console.log("SalesItemList before push:", SalesItemList);
  let sncodes: string[] = _getSncodes(
    salesitem.salescode,
    salesitem.itemcode,
    salesitem.rtlSeq
  );
  console.log("sncodes:", sncodes);
  SalesItemList.push(salesitem);
  console.log("SalesItemList after push:", SalesItemList);
}

$(document).on("change", ".searchmode", function () {
  if ($(this).is(":checked")) {
    mode = <string>$(this).val();
    resetForm();
    if (mode === "sales") {
      $("#txtSearch").autocomplete({
        source: receiptnolist,
      });
    }
    if (mode === "serial") {
      $("#txtSearch").autocomplete({
        source: snnolist,
      });
    }
    if (mode === "batch") {
      $("#txtSearch").autocomplete({
        source: batchnolist,
      });
    }
  }
});

function resetForm(partial = false) {
  if (partial) {
    $(".form-control").val("");
    $("#tblsearch tbody").empty();
    $(".searchresult").hide();
  } else {
    $(".form-control").val("");
    $("#tblsearch tbody").empty();
    $(".searchresult").hide();
    $("#txtSearch").focus();
  }
  $("#txtSearch").val("");
}

$(document).ready(function () {
  $(".searchresult").hide();
  initModals();
  let $txtsearch = $("#txtSearch");
  $txtsearch.focus();
  $target.find("tr").each(function (i, e) {
    $(e)
      .find("td")
      .each(function (idx, ele) {
        $(ele).css({ "text-align": "center" });
      });
  });

  let _receiptno = getParameterByName("receiptno");
  console.log("_receiptno:" + _receiptno);
  if (_receiptno !== null) {
    receiptno = _receiptno;
    console.log("receiptno:" + receiptno);
    $txtsearch.val(receiptno);
    $("#btnSearch").trigger("click");
    reviewmode = true;
  } else {
    let receiptnoes: string = <string>$("#receiptnolist").val();
    receiptnolist = receiptnoes.split(",");
    let snnoes: string = <string>$("#snnolist").val();
    snnolist = snnoes.split(",");
    let batchnoes: string = <string>$("#batchnolist").val();
    batchnolist = batchnoes.split(",");
    console.log("receiptlist:", receiptnolist);
    console.log("snnolist:", snnolist);
    console.log("batchnolist:", batchnolist);
    $txtsearch.autocomplete({
      source: receiptnolist,
    });
  }
});
