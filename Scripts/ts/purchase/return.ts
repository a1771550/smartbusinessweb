$infoblk = $("#infoblk");
$target = $("#tblReturn");
enableSN = $infoblk.data("enablesn") === "True";
enableTax = $infoblk.data("enabletax") === "True";
priceeditable = $infoblk.data("priceeditable") === "True";
disceditable = $infoblk.data("disceditable") === "True";
let returnpurchaseln: IPurchaseItem;
let ReturnList: Array<IReturnBase> = [];

$(document).on("change", ".rtlSeq", function () {
  if ($(this).val() !== "") {
    currentY = parseInt($(this).parent("td").parent("tr").data("idx")) - 1;
    selectedItemCode = <string>(
      $(this)
        .parent("td")
        .parent("tr")
        .find("td:first")
        .find(".itemcode")
        .val()
        ?.toString()
    );
    seq = parseInt(<string>$(this).val());
    console.log("rtlSeq:" + seq);

    if (selectedItemCode === "") {
      let $tr = $("#tblpurchase tbody tr").eq(seq - 1);
      selectedItemCode = $tr.find("td:eq(1)").text();
    }

    console.log("selecteditemcode#seqchange:" + selectedItemCode);

    returnpurchaseln = $.grep(ReturnableItemList, function (e, i) {
      console.log("e.rtlitemcode:" + e.itmCode + ";type:" + typeof e.itmCode);
      return e.piSeq == seq;
    })[0];

    console.log("returnpurchaseln#seqchange#0:", returnpurchaseln);

    if (typeof returnpurchaseln !== "undefined") {
      $("#btnReturn").prop("disabled", false).css({ cursor: "pointer" });
      console.log("ready to selectrefitem...");
      selectRetItem();
    } else {
      $.fancyConfirm({
        title: "",
        message: sequencewrongwarning,
        shownobtn: false,
        okButton: oktxt,
        noButton: canceltxt,
        callback: function (value) {
          if (value) {
            let $tr: JQuery = $("#tblReturn tbody tr").eq(currentY);
            $tr.find("td:last").find(".rtlSeq").val($tr.data("rtlSeq")).focus();
            console.log("disable button");
            $("#btnReturn").prop("disabled", true).css({ cursor: "default" });
          }
        },
      });
    }
  }
});

$(document).on("change", ".qtytoreturn", function () {
  currentY = parseInt($(this).parent("td").parent("tr").data("idx")) - 1;
  let qtytoreturn: number = parseInt(<string>$(this).val());
  let $tr: JQuery = $(this).parent("td").parent("tr");
  let seq: number = parseInt(<string>$tr.find("td:last").find(".rtlSeq").val());

  console.log("ReturnableItemList:", ReturnableItemList);

  if (enableSN) {
    let sn: string = <string>$tr.find("td").eq(5).find(".serialno").val();
    if (typeof sn !== "undefined" && sn !== null && sn !== "") {
      $.each(Purchase.PurchaseItems, function (i, e) {
        if (e.piHasSN) {
          $.each(e.SerialNoList, function (k, v) {
            if (v.snoCode == sn) {
              returnpurchaseln = e;
              return false;
            }
          });
        }
      });
    }
  } else {
    returnpurchaseln = $.grep(ReturnableItemList, function (e, i) {
      //return e.itmCode.toString() == returnitemcode.toString() && e.piSeq == seq;
      return e.piSeq == seq;
    })[0];
    console.log("returnpurchaseln#qtychange:", returnpurchaseln);
  }

  if (returnpurchaseln !== null) {
    returnpurchaseln.qtyToReturn = qtytoreturn;

    if (returnpurchaseln.qtyToReturn > returnpurchaseln.returnableQty) {
      $.fancyConfirm({
        title: "",
        message: returnqtycantgtpurchaseqtywarning,
        shownobtn: false,
        okButton: oktxt,
        noButton: canceltxt,
        callback: function (value) {
          if (value) {
            console.log("currenty:" + currentY);
            let idx = enableTax && !inclusivetax ? 6 : 5;
            console.log("idx:" + idx);
            $target = $("#tblReturn tbody tr")
              .eq(currentY)
              .find("td")
              .eq(idx)
              .find(".qtytoreturn");
            returnpurchaseln.qtyToReturn = returnpurchaseln.returnableQty;
            $target.val(returnpurchaseln.returnableQty);
            $target.focus();
          }
        },
      });
    } else {
      currentY = parseInt($(this).parent("td").parent("tr").data("idx")) - 1;
      console.log("to call updateretrow#qtytoreturn change:");
      updateRetRow(returnpurchaseln);
    }
  }
});

$(document).on("click", "#btnSearchPurchase", function () {
  resetPage();
  let purchasecode = <string>$("#txtPurchaseNo").val();
  if (purchasecode === "") {
    $.fancyConfirm({
      title: "",
      message: $infoblk.data("purchasenorequiredtxt"),
      shownobtn: false,
      okButton: oktxt,
      noButton: canceltxt,
      callback: function (value) {
        if (value) {
          $("#txtPurchaseNo").focus();
        }
      },
    });
    return false;
  } else {
    openWaitingModal();
    getRemoteData(
      "/Purchase/GetPurchaseByCode",
      { code: purchasecode },
      getPurchaseOk,
      getRemoteDataFail
    );
  }
});
function getPurchaseOk(data) {
  closeWaitingModal();
  console.log("data:", data);
  if (data.msg != "") {
    $.fancyConfirm({
      title: "",
      message: data.msg,
      shownobtn: false,
      okButton: oktxt,
      noButton: canceltxt,
      callback: function (value) {
        if (value) {
          $("#txtPurchaseNo").val("").focus();
        }
      },
    });
  } else {
    Purchase = data.purchase as IPurchase;
    //stockitems = (data.purchase as IPurchase).PurchaseItems.slice(0);
    console.log("original items:", (data.purchase as IPurchase).PurchaseItems);
    console.log("purchasestock:", Purchase);
    //console.log('stockitems:', stockitems);
    returnLns = Purchase.ReturnItems;
    fillinReturnForm();
  }
}
let purchasereturnlist: Array<IPurchaseReturnBase> = [];

function fillinReturnForm() {
  $("#txtNotes").val(Purchase.pstRemark);
  let html = "",
    purchasereturn: IPurchaseReturnBase;
  $.each(Purchase.PurchaseItems, function (i, e) {
    let price = e.piUnitPrice;
    let taxrate = e.piTaxPc ?? 0;
    let batch = e.batchList ?? "N/A";
    totalpurchaseQty += e.piReceivedQty;

    console.log("returnLns:", returnLns);
    let returnedamt: number = 0,
      returnedqty: number = 0,
      returndates: string[] = [];
    if (returnLns != null && returnLns.length > 0) {
      $.each(returnLns, function (index, val) {
        if (
          e.pstCode == val.pstCode &&
          val.itmCode === e.itmCode &&
          val.piSeq == e.piSeq
        ) {
          console.log("returnamt:" + val.piAmtPlusTax);
          returnedamt += val.piAmtPlusTax;
          console.log(
            `returnedqty#itemcode->${e.itmCode}#rtlSeq->${e.piSeq}: ${val.piQty}`
          );
          returnedqty += val.piQty;
          console.log("returndate:" + val.ReturnDateDisplay);
          returndates.push(val.ReturnDateDisplay);
        }
        console.log("returndates:", returndates);
      });
      //console.log('returnedqty:#' + e.itmCode + ';qty:' + returnedqty);
    }

    let returnableqty: number = e.piQty - returnedqty;
    console.log(
      `returnableqty#itemcode->${e.itmCode}#rtlSeq->${e.piSeq}: ${returnableqty}`
    );
    console.log(
      `discpc#itemcode#itemcode->${e.itmCode}#rtlSeq->${e.piSeq}: ${e.piDiscPc}`
    );
    if (returnableqty > 0) {
      e.returnedQty = returnedqty;
      e.qtyToReturn = e.returnableQty = returnableqty;
      console.log("e#fill:", e);
      ReturnableItemList.push(e);
    }

    //todo:
    //purchasereturn = {
    //    pstcode: e.pstCode,
    //    itemcode: e.itmCode,
    //    seq: e.piSeq,
    //    namedesc: e.itmNameDesc,
    //    qty: e.piQty,
    //    price: price,
    //    discpc: e.piDiscPc as number ?? 0,
    //    discamt: 0,
    //    taxpc: taxrate,
    //    taxamt: 0,
    //    amt: e.piAmt,
    //    amtplustax: e.piAmtPlusTax,
    //    date: e.PurchaseDateDisplay,
    //    pricetxt: formatnumber(price),
    //    disctxt: e.piDiscPc == null ? formatnumber(0) : formatnumber(e.piDiscPc as number),
    //    taxtxt: formatnumber(taxrate),
    //    amttxt: formatnumber(e.piAmtPlusTax),
    //    datetxt: e.PurchaseDateDisplay,
    //    returnedQty: returnedqty,
    //    returnedAmt: -1 * returnedamt,
    //    returnedqtyTxt: returnedqty === 0 ? '0' : returnedqty.toString(),
    //    returnedamtTxt: returnedamt === 0 ? formatnumber(0) : formatnumber(-1 * returnedamt),
    //    returnedDates: returndates.length === 0 ? 'N/A' : returndates.join(),
    //    serialNoList: e.SerialNoList,
    //};
    //purchasereturn.batchList.push({ batch });
    purchasereturnlist.push(purchasereturn);
    console.log("purchasereturnlist:", purchasereturnlist);
    console.log("returnableitemlist:", ReturnableItemList);
  });
  // return false;

  $.each(purchasereturnlist, function (i, e) {
    //項目代碼	數量	 價格	折扣%	金額	 銷售日期 退貨數量 	退款金額 	退款日期 	詳細
    html +=
      "<tr>" +
      '<td class="text-center">' +
      e.seq +
      '</td><td class="text-center">' +
      e.itemcode +
      '</td><td class="text-right">' +
      e.qty +
      '</td><td class="text-right">' +
      e.price +
      '</td><td class="text-right">' +
      e.disctxt +
      '</td><td class="text-right">' +
      e.amt +
      '</td><td class="text-center">' +
      e.datetxt +
      '</td><td class="text-right">' +
      e.returnedqtyTxt +
      '</td><td class="text-right">' +
      e.returnedamtTxt +
      '</td><td class="text-center">' +
      e.returnedDates +
      '</td><td class="text-center"><button type="button" class="btn btn-info" onclick="purchaseDetail(\'' +
      e.itemcode +
      "','" +
      e.seq +
      "')\">" +
      detailtxt +
      "</button></td></tr>";
  });

  let $target = $("#tblpurchase tbody");
  $target.empty().append(html);
  $target.find("tr").each(function (i, e) {
    $(e)
      .find("td")
      .each(function (idx, ele) {
        $(ele).css({ "text-align": "center" });
      });
  });

  if (ReturnableItemList.length > 0) {
    //check if all purchaselns contain the same itemcode:
    let codes: Array<string | number> = [];
    $.each(purchasereturnlist, function (i, e) {
      codes.push(e.itemcode);
    });
    if (codes.every((val, i, arr) => val === arr[0])) {
      selectedItemCode = codes[0];
      //console.log('here#0#fillin');
      //addRetRow();
      selectRetItem();
    } else {
      //console.log('here#1#fillin');
      addRetRow();
    }
  } else {
    $.fancyConfirm({
      title: "",
      message: purchasefullyreturnedtxt,
      shownobtn: false,
      okButton: oktxt,
      noButton: canceltxt,
      callback: function (value) {
        if (value) {
          $("#txtPurchaseNo").focus();
        }
      },
    });
  }
}

function purchaseDetail(itemcode, seq) {
  let purchasereturn = $.grep(purchasereturnlist, function (e, i) {
    return e.itemcode === itemcode && e.seq == seq;
  })[0];
  console.log("purchasereturn:", purchasereturn);
  console.log("purchasedate:" + purchasereturn.date);

  let _snlist: ISerialNo[] = $.grep(
    purchasereturn.serialNoList,
    function (e, i) {
      console.log(
        "purchasecode:" +
          e.snoStockInCode +
          ";rtlSeq:" +
          e.snoStockInSeq +
          ";date:" +
          e.StockInDateDisplay
      );
      return (
        e.snoItemCode === itemcode &&
        e.snoStockInCode === purchasereturn.pstcode &&
        e.snoStockInSeq == seq &&
        e.StockInDateDisplay == purchasereturn.date
      );
    }
  );
  console.log("_snlist:", _snlist);

  let html = '<ul class="list-group list-group-flush">';
  html += `<li class="list-group-item"><strong>${$infoblk.data(
    "purchasenotxt"
  )}</strong>: ${purchasereturn.pstcode}</li>`;
  html += `<li class="list-group-item"><strong>${itemcodetxt}</strong>: ${purchasereturn.itemcode}</li>`;
  html += `<li class="list-group-item"><strong>${description}</strong>: ${purchasereturn.namedesc}</li>`;
  html += `<li class="list-group-item"><strong>${batchtxt}</strong>: ${purchasereturn.batchList}</li>`;
  if (_snlist.length > 0) {
    let sncodes: string[] = [];
    $.each(_snlist, function (i, e) {
      sncodes.push(e.snoCode);
    });
    console.log("sncodes:", sncodes);
    html += `<li class="list-group-item"><strong>${serialnotxt}</strong>: ${sncodes.join()}</li>`;
  }
  html += `<li class="list-group-item"><strong>${qtytxt}</strong>: ${purchasereturn.qty}</li>`;
  html += `<li class="list-group-item"><strong>${sellingpricetxt}</strong>: ${purchasereturn.pricetxt}</li>`;
  html += `<li class="list-group-item"><strong>${discountitemheader}</strong>: ${purchasereturn.disctxt}</li>`;
  html += `<li class="list-group-item"><strong>${taxitemheader}</strong>: ${purchasereturn.taxtxt}</li>`;
  html += `<li class="list-group-item"><strong>${amountitemheader}</strong>: ${purchasereturn.amttxt}</li>`;
  html += `<li class="list-group-item"><strong>${purchasedatetxt}</strong>: ${purchasereturn.datetxt}</li>`;
  html += `<li class="list-group-item"><strong>${returnqtytxt}</strong>: ${purchasereturn.returnedqtyTxt}</li>`;
  html += `<li class="list-group-item"><strong>${returnamttxt}</strong>: ${purchasereturn.returnedamtTxt}</li>`;
  html += `<li class="list-group-item"><strong>${returndatetxt}</strong>: ${purchasereturn.returnedDates}</li>`;
  html += "</ul>";
  $.fancyConfirm({
    title: "",
    message: html,
    shownobtn: false,
    okButton: oktxt,
    noButton: canceltxt,
    callback: function (value) {
      if (value) {
        focusRetItemCode();
      }
    },
  });
}

function addRetRow() {
  $target = $("#tblReturn tbody");
  let idx = $target.find("tr").length;
  let i = idx + 1;

  let html =
    '<tr data-idx="' +
    i +
    '" data-rtlSeq="1" data-taxpc="0" data-discpc="0" data-returnedqty="0" data-returnableqty="-1">' +
    /* '<td class="text-center"><span>' + i + '</span></td>' +*/
    '<td class="text-center"><input type="text" name="itemcode" class="itemcode text-center" /></td><td class="text-center"><span class="itemdesc"></span></td><td class="text-center"><input type="text" class="baseunit text-right" readonly /></td><td class="text-right"><input type="number" name="returnedqty" class="returnedqty text-right" readonly /></td>';
  html += `<td><input type="text" name="batch" class="batch text-center" readonly /></td><td><input type="text" name="serailno" readonly class="serialno text-center" readonly /></td><td><input type="datetime" name="validthru" class="small validthru datepicker text-center" readonly /></td>`;
  //let preadonly = isEpay ? 'readonly' : priceeditable ? '' : 'readonly';

  html +=
    '<td class="text-right"><input type="number" name="price" min="0" class="price text-right" readonly /></td>';
  html +=
    '<td class="text-right"><input type="number" min="0" name="discpc" class="discpc text-right" readonly /></td>';

  console.log("inclusivetax:" + inclusivetax);
  if (enableTax && !inclusivetax) {
    html +=
      '<td class="text-right"><input type="number" name="tax" min="0" class="taxpc text-right" readonly/></td>';
  }

  //let qreadonly = isEpay ? 'readonly' : '';
  html +=
    '<td class="text-right"><input type="number" min="0" name="qtytoreturn" class="qtytoreturn text-right" /></td>';

  //let areadonly = isEpay ? 'readonly' : amteditable ? '' : 'readonly';
  let areadonly = amteditable ? "" : "readonly";
  html += `<td class="text-right"><input type="number" name="amount" class="amount text-right" ${areadonly} /></td><td class="text-center"><input type="number" name="rtlSeq" class="rtlSeq" min="1" /></td>`;
  html += "</tr>";
  $target.append(html);
  focusRetItemCode(idx);
}

function focusRetItemCode(idx: number = -1) {
  $target = $("#tblReturn tbody tr");
  if (idx === -1) {
    $target.each(function (i, e) {
      let $itemcode = $(e).find("td:eq(0)").find(".itemcode");
      if ($itemcode.val() === "") {
        $itemcode.focus();
        console.log("focus set;i:" + i);
        return false;
      }
    });
  } else {
    $target.eq(idx).find("td:eq(0)").find(".itemcode").focus();
  }
}

function selectRetItem() {
  console.log("selecteditemcode:" + selectedItemCode);
  if (selectedItemCode === "") {
    $.fancyConfirm({
      title: "",
      message: selectitemrequired,
      shownobtn: false,
      okButton: oktxt,
      noButton: canceltxt,
      callback: function (value) {
        if (value) {
          $("#tblReturn tbody tr")
            .eq(currentY)
            .find("td:first")
            .find(".itemcode")
            .focus();
        }
      },
    });
  } else {
    console.log("ReturnableItemList:", ReturnableItemList);
    console.log("returnLns:", returnLns);
    console.log("enableTax:" + enableTax + ";inclusivetax:" + inclusivetax);
    //return false;
    if (ReturnableItemList.length > 0) {
      let returnableQty: number = 0;

      let $returnableQty: JQuery;
      console.log("currenty:" + currentY);
      let $rows = $("#tblReturn tbody tr");
      $target = $rows.eq(currentY);
      let idx = enableTax && !inclusivetax ? 10 : 9;
      $returnableQty = $target.find("td").eq(idx).find(".qtytoreturn");
      console.log("rtlSeq#select:" + seq);

      if (seq > 0) {
        if (returnpurchaseln.returnableQty === 0) {
          $.fancyConfirm({
            title: "",
            message: itemreturnedinfullqty,
            shownobtn: false,
            okButton: oktxt,
            noButton: canceltxt,
            callback: function (value) {
              if (value) {
                resetPage(true);
                addRetRow();
                $target.find("td:first").find(".itemcode").focus();
              }
            },
          });
        }

        seq = 0; //reset seq
        $target.data("rtlSeq", returnpurchaseln.piSeq);
        $target.data("returnedqty", returnpurchaseln.returnedQty);
        $target.data("returnableqty", returnpurchaseln.returnableQty);
        $target
          .find("td:first")
          .find(".itemcode")
          .val(returnpurchaseln.itmCode);
        $target
          .find("td:eq(1)")
          .find(".itemdesc")
          .text(returnpurchaseln.itmNameDesc);
        $target
          .find("td:eq(2)")
          .find(".baseunit")
          .val(returnpurchaseln.piBaseUnit);
        $target
          .find("td:eq(3)")
          .find(".returnedqty")
          .val(returnpurchaseln.returnedQty);
        //todo:
        var batch = returnpurchaseln.batchList ?? "";
        //$target.find('td:eq(4)').find('.batch').val(batch);
        $target.find("td:eq(5)").find(".serialno").val("");
        $target
          .find("td:eq(6)")
          .find(".validthru")
          .val(returnpurchaseln.ValidThruDisplay);

        $target
          .find("td:eq(7)")
          .find(".price")
          .val(formatnumber(returnpurchaseln.piUnitPrice));
        $target
          .find("td:eq(8)")
          .find(".discpc")
          .val(formatnumber(returnpurchaseln.piDiscPc as number));

        if (enableTax && !inclusivetax) {
          $target
            .find("td:eq(9)")
            .find(".taxpc")
            .val(formatnumber(returnpurchaseln.piTaxPc as number));
        }

        $returnableQty.val(returnpurchaseln.returnableQty);
        $target.find("td:last").find(".rtlSeq").val(returnpurchaseln.piSeq);

        $("#btnReturn").prop("disabled", false).css({ cursor: "pointer" });
        console.log("to call updateretrow#selectretitem#0:");
        updateRetRow(returnpurchaseln);
      } else {
        let returnpurchaselns: Array<IPurchaseItem> = [];

        returnpurchaselns = $.grep(ReturnableItemList, function (e, i) {
          console.log(
            "e.rtlitemcode:" +
              e.itmCode.toString() +
              ";selecteditemcode:" +
              selectedItemCode.toString()
          );
          return e.itmCode.toString() === selectedItemCode.toString();
        });
        console.log("returnpurchaselns:", returnpurchaselns);
        //return false;

        if (returnpurchaselns.length > 0) {
          let snlns: IPurchaseItem[] = [];
          let nonsnlns: IPurchaseItem[] = [];
          $.each(returnpurchaselns, function (i, e) {
            returnableQty += e.returnableQty;
            if (e.piHasSN) {
              snlns.push(e);
            } else {
              nonsnlns.push(e);
            }
          });

          if (returnableQty == 0) {
            $.fancyConfirm({
              title: "",
              message: itemreturnedinfullqty,
              shownobtn: false,
              okButton: oktxt,
              noButton: canceltxt,
              callback: function (value) {
                if (value) {
                  resetPage(true);
                  addRetRow();
                  $target.find("td:first").find(".itemcode").focus();
                }
              },
            });
          } else {
            if (snlns.length > 0) {
              $.each(snlns, function (i, e) {
                console.log("serialnolist#loop:", e.SerialNoList);
                $.each(e.SerialNoList, function (k, v) {
                  addRetRow();
                  e.qtyToReturn = e.returnableQty = 1;
                  //todo:
                  //e.serialNo = v;
                  if (enableTax) {
                    e.piAmtPlusTax = inclusivetax
                      ? calAmount(1, e.piUnitPrice, e.piDiscPc)
                      : calAmountPlusTax(
                          1,
                          e.piUnitPrice,
                          e.piTaxPc??0,
                          e.piDiscPc??0
                        );
                  } else {
                    e.piAmt = calAmount(1, e.piUnitPrice, e.piDiscPc);
                  }
                  fillInReturnRow(e, k);
                });
              });
            }

            console.log("nonsnlns:", nonsnlns);
            if (nonsnlns.length > 0) {
              if (nonsnlns.length == 1) {
                $.each(nonsnlns, function (i, e) {
                  /* if (e.itmCode == selectedItemCode) {*/
                  addRetRow();
                  fillInReturnRow(e, currentY);
                  return false;
                  //}
                });
              } else {
              }
            }
          }

          if (returnpurchaselns.length === 1) {
            $("#btnReturn").prop("disabled", false).css({ cursor: "pointer" });
          } else {
            $target.find("td:last").find(".rtlSeq").focus();
            $("#btnReturn").prop("disabled", true).css({ cursor: "default" });
          }
        } else {
          $.fancyConfirm({
            title: "",
            message: itemreturnedinfullqty,
            shownobtn: false,
            okButton: oktxt,
            noButton: canceltxt,
            callback: function (value) {
              if (value) {
                resetPage(true);
                addRetRow();
                $target.find("td:first").find(".itemcode").focus();
              }
            },
          });
        }
      }

      //if ($rows.eq($rows.length).length) {
      //    console.log('here#0');
      //    if (returnpurchaseln.returnableQty === 0) {
      //        $returnableQty.focus();
      //    } else {
      //        focusRetItemCode($rows.length);
      //    }

      //}
      //else if ($rows.eq(currentY + 1).length) {
      //    console.log('here#1');
      //    if ($rows.eq(currentY + 1).find('td:first').find('.itemcode').val() !== '') {
      //        if (seq === 0) {
      //            addRetRow();
      //        } else {
      //            if (returnpurchaseln.returnableQty === 0) {
      //                $returnableQty.focus();
      //            } else {
      //                focusRetItemCode($rows.length);
      //            }
      //        }
      //    } else {
      //        if (returnpurchaseln.returnableQty === 0) {
      //            $returnableQty.focus();
      //        } else {
      //            focusRetItemCode(currentY + 1);
      //        }
      //    }
      //}
      //else {
      //    console.log('here#2');
      //    if ($target.find('td:last').find('.seq').val() != '') {
      //        if (ReturnableItemList.length > 1) {
      //            addRetRow();
      //            if (returnpurchaseln.returnableQty === 0) {
      //                $returnableQty.focus();
      //            }
      //        }
      //    }

      //}
    }
  }
}

function fillInReturnRow(returnpurchaseln: IPurchaseItem, i: number) {
  console.log("returnpurchaseln#fillinrow:", returnpurchaseln);
  //if (i == 0)
  //    i = returnpurchaseln.piSeq - 1;
  console.log("i#fillinrow:" + i);
  $target = $("#tblReturn tbody tr").eq(i);

  $target.data("rtlSeq", returnpurchaseln.piSeq);
  $target.data("returnedqty", returnpurchaseln.returnedQty);
  $target.data("returnableqty", returnpurchaseln.returnableQty);

  $target.find("td:eq(0)").find(".itemcode").val(returnpurchaseln.itmCode);
  $target.find("td:eq(1)").find(".itemdesc").text(returnpurchaseln.itmNameDesc);
  $target.find("td:eq(2)").find(".baseunit").val(returnpurchaseln.piBaseUnit);
  $target
    .find("td:eq(3)")
    .find(".returnedqty")
    .val(returnpurchaseln.returnedQty);
  //todo:
  //$target.find('td:eq(4)').find('.batch').val(returnpurchaseln.batchList);
  let idx = 5;
  if (enableSN) {
    if (returnpurchaseln.piHasSN) {
      //todo:
      //$target.find('td').eq(idx).find('.serialno').val(<string>returnpurchaseln.serialNo?.snoCode);
    }
    idx++;
  }
  console.log("validthru idx:" + idx);
  $target
    .find("td")
    .eq(idx)
    .find(".validthru")
    .val(returnpurchaseln.ValidThruDisplay);
  idx++;
  console.log("price idx:" + idx);
  $target
    .find("td")
    .eq(idx)
    .find(".price")
    .val(formatnumber(returnpurchaseln.piUnitPrice));
  idx++;
  let _disc = returnpurchaseln.piDiscPc ?? 0;
  $target.find("td").eq(idx).find(".discpc").val(formatnumber(_disc));
  idx++;
  if (enableTax && !inclusivetax) {
    $target
      .find("td")
      .eq(idx)
      .find(".taxpc")
      .val(returnpurchaseln.piTaxPc as number);
    idx++;
  }
  $target
    .find("td")
    .eq(idx)
    .find(".qtytoreturn")
    .val(returnpurchaseln.qtyToReturn);
  idx++;
  let amt = enableTax ? returnpurchaseln.piAmtPlusTax : returnpurchaseln.piAmt;
  $target
    .find("td")
    .eq(idx)
    .find(".amount")
    .val(formatnumber(amt as number));
  let $seq = $target.find("td:last").find(".rtlSeq");
  $seq.val(returnpurchaseln.piSeq);
  if (returnpurchaseln.piHasSN) {
    $seq.prop("readonly", true);
  }
  updateRetRow(returnpurchaseln);
}

function updateRetRow(returnpurchaseln: IPurchaseItem) {
  $target = $("#tblReturn tbody tr").eq(currentY);

  console.log("returnpurchaseln#updaterefrow:", returnpurchaseln);
  console.log("inclusivetax:" + inclusivetax);

  let idx = 0;
  if (enableTax) {
    returnpurchaseln.piAmtPlusTax = !inclusivetax
      ? calAmountPlusTax(
          returnpurchaseln.qtyToReturn,
          returnpurchaseln.piUnitPrice,
          returnpurchaseln.piTaxPc??0,
          returnpurchaseln.piDiscPc??0
        )
      : calAmount(
          returnpurchaseln.qtyToReturn,
          returnpurchaseln.piUnitPrice,
          returnpurchaseln.piDiscPc
        );
    returnpurchaseln.piAmt = 0;
    idx = !inclusivetax ? 11 : 10;
    $target
      .find("td")
      .eq(idx)
      .find(".amount")
      .val(formatnumber(returnpurchaseln.piAmtPlusTax));
  } else {
    returnpurchaseln.piAmt = calAmount(
      returnpurchaseln.qtyToReturn,
      returnpurchaseln.piUnitPrice,
      returnpurchaseln.piDiscPc
    );
    returnpurchaseln.piAmtPlusTax = 0;
    idx = 10;
    $target
      .find("td")
      .eq(idx)
      .find(".amount")
      .val(formatnumber(returnpurchaseln.piAmt));
  }

  if (!isNaN(returnpurchaseln.qtyToReturn)) {
    updateReturn();
  }
}

function updateReturn() {
  ReturnList = [];

  $("#tblReturn tbody tr").each(function (i, e) {
    returnpurchaseln = initPurchaseItem();
    returnpurchaseln.piSeq = <number>$(e).find("td:last").find(".rtlSeq").val();
    returnpurchaseln.itmCode = <string>(
      $(e).find("td:first").find(".itemcode").val()
    );
    if (returnpurchaseln.itmCode !== "") {
      returnpurchaseln.itmNameDesc = <string>(
        $(e).find("td:eq(1)").find(".itemdesc").text()
      );
      returnpurchaseln.piBaseUnit = <string>(
        $(e).find("td:eq(2)").find(".baseunit").val()
      );
      returnpurchaseln.returnedQty = <number>(
        $(e).find("td:eq(3)").find(".returnedqty").val()
      );
      //todo:
      //returnpurchaseln.batchList = <string>$(e).find('td:eq(4)').find('.batch').val();
      let idx = 4;
      if (enableSN) {
        idx++;
        //todo:
        //returnpurchaseln.sncode = <string>$(e).find('td').eq(idx).find('.serialno').val();
        //if (typeof returnpurchaseln.sncode !== 'undefined' && returnpurchaseln.sncode !== null && returnpurchaseln.sncode !== '') {
        //    returnpurchaseln.piHasSN = true;
        //    returnpurchaseln.serialNo = initSerialNo();
        //    returnpurchaseln.serialNo.snoCode = returnpurchaseln.sncode;
        //    returnpurchaseln.serialNo.snoItemCode = returnpurchaseln.itmCode;
        //    console.log('seq#updatereturn:' + returnpurchaseln.piSeq);
        //    returnpurchaseln.serialNo.snoStockInSeq = returnpurchaseln.piSeq;
        //}
      }
      //validthru
      idx++;
      returnpurchaseln.JsValidThru = <string>(
        $(e).find("td").eq(idx).find(".validthru").val()
      );
      idx++;
      //price:
      returnpurchaseln.piUnitPrice = parseFloat(
        <string>$(e).find("td").eq(idx).find(".price").val()
      );
      idx++;
      returnpurchaseln.piDiscPc = parseFloat(
        <string>$(e).find("td").eq(idx).find(".discpc").val()
      );
      idx++;
      if (enableTax && !inclusivetax) {
        returnpurchaseln.piTaxPc = parseFloat(
          <string>$(e).find("td").eq(idx).find(".taxpc").val()
        );
        idx++;
      }
      returnpurchaseln.qtyToReturn = <number>(
        $(e).find("td").eq(idx).find(".qtytoreturn").val()
      );
      idx++;
      if (enableTax && !inclusivetax) {
        returnpurchaseln.piAmtPlusTax = parseFloat(
          <string>$(e).find("td").eq(idx).find(".amount").val()
        );
      } else {
        returnpurchaseln.piAmt = parseFloat(
          <string>$(e).find("td").eq(idx).find(".amount").val()
        );
      }
      //idx++;
      //returnpurchaseln.piSeq = <number>$(e).find('td').eq(idx).find('.seq').val();
      if (returnpurchaseln.qtyToReturn > 0) genReturn(returnpurchaseln);
    }
  });

  console.log("ReturnList#updatereturn:", ReturnList);

  let _totalamt = 0;

  $.each(ReturnList, function (i, e) {
    console.log("e:", e);
    _totalamt += e.amount;
  });
  console.log("_totalamt:" + _totalamt);
  $("#txtTotal").val(formatnumber(_totalamt));
  itotalamt = _totalamt;
  focusRetItemCode();
}

function genReturn(returnpurchaseln: IPurchaseItem) {
  let returnitem: IReturnBase = initReturnItem();
  returnitem.psRefCode = Purchase.pstCode;
  returnitem.itemcode = returnpurchaseln.itmCode;
  returnitem.itmNameDesc = returnpurchaseln.itmNameDesc;
  returnitem.baseUnit = returnpurchaseln.piBaseUnit;
  returnitem.hasSN = returnpurchaseln.piHasSN;
  //todo:
  // returnitem.serialNo = returnpurchaseln.serialNo as ISerialNo;
  returnitem.JsValidThru = returnpurchaseln.JsValidThru;
  returnitem.price = returnpurchaseln.piUnitPrice;
  returnitem.discpc = returnpurchaseln.piDiscPc as number;
  returnitem.qtyToReturn = returnpurchaseln.qtyToReturn;
  returnitem.returnedQty = returnpurchaseln.returnedQty;
  returnitem.returnableQty = returnpurchaseln.returnableQty;
  returnitem.amount = returnpurchaseln.piAmt;
  returnitem.amountplustax = returnpurchaseln.piAmtPlusTax;
  returnitem.seq = returnpurchaseln.piSeq;

  returnitem.taxrate = returnpurchaseln.piTaxPc as number;

  ReturnList.push(returnitem);
  console.log("Returnlist after push:", ReturnList);
}

$(document).on("change", ".itemcode", function () {
  resetRetRow(returnpurchaseln);
  currentY = parseInt($(this).parent("td").parent("tr").data("idx")) - 1;
  console.log("currentY#itemcode:" + currentY);
  selectedItemCode = <string>$(this).val();
  console.log("itemlist:", ItemList);
  if (selectedItemCode !== "") {
    console.log("selecteditemcode:" + selectedItemCode);
    console.log(ReturnableItemList);
    selectRetItem();
  }
});
function resetRetRow(returnpurchaseln: IPurchaseItem) {
  if (typeof returnpurchaseln !== "undefined")
    itotalamt -=
      enableTax && !inclusivetax
        ? returnpurchaseln.piAmtPlusTax
        : returnpurchaseln.piAmt;
  seq = 0;
  returnpurchaseln = initPurchaseItem();
}

$(document).ready(function () {
  forreturn = true;
  initModals();
  let $txtpurchaseno = $("#txtPurchaseNo");
  let purchasenoes: string = <string>$("#purchasenolist").val();
  let purchasenolist: string[] = purchasenoes.split(",");
  //console.log('receiptlist:', purchasenolist);

  $txtpurchaseno.autocomplete({
    source: purchasenolist,
  });

  $txtpurchaseno.focus();
});

$(document).on("click", "#btnNewReturn", function () {
  if (purchasereturnlist.length > 0 && confirm(confirmnewreturn)) {
    window.location.reload();
  }
});

$(document).on("click", "#btnReturn", function () {
  console.log("ReturnList#btnreturnclick:", ReturnList);
  if (ReturnList.length === 0) {
    $.fancyConfirm({
      title: "",
      message: returninfonotenough,
      shownobtn: false,
      okButton: oktxt,
      noButton: canceltxt,
      callback: function (value) {
        if (value) {
          $("#tblReturn tbody tr")
            .eq(currentY)
            .find("td:first")
            .find(".itemcode")
            .focus();
        }
      },
    });
  } else {
    //return false;
    $.ajax({
      type: "POST",
      url: "/Purchase/ProcessReturn",
      data: {
        __RequestVerificationToken: $(
          "input[name=__RequestVerificationToken]"
        ).val(),
        ReturnList,
      },
      success: function (data) {
        if (data) {
          $.fancyConfirm({
            title: "",
            message: data,
            shownobtn: false,
            okButton: oktxt,
            noButton: notxt,
            callback: function (value) {
              if (value) {
                window.location.reload();
              }
            },
          });
        }
      },
      dataType: "json",
    });
  }
});
