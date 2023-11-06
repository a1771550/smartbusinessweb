$infoblk = $("#infoblk");
enableSN = $infoblk.data("enablesn") === "True";
enableTax = $infoblk.data("enabletax") === "True";
priceeditable = $infoblk.data("priceeditable") === "True";
disceditable = $infoblk.data("disceditable") === "True";

$wholesalesDateDisplay = $("#wholesalesDate");
$deliveryDateDisplay = $("#promisedDate");

$(document).on("click", "#btnSave", function () {
  $.ajax({
    type: "POST",
    url: "/WholeSales/Delivery",
    data: {
      __RequestVerificationToken: $(
        "input[name=__RequestVerificationToken]"
      ).val(),
      model: DeliveryItems,
    },
    success: function (data) {
      window.location.href = "/WholeSales/Index";
    },
    dataType: "json",
  });
});

$(document).on("change", ".chkitem", function () {
  console.log(
    "hassn?" +
      $(this).data("hassn") +
      ";wsluid:" +
      $(this).data("wsluid") +
      ";snouid:" +
      $(this).data("snouid")
  );
  if ($(this).is("checked")) {
    $target = $(this).parent("td").parent("tr");
    let seq: number = ($target.data("idx") as number) + 1;
    let deliveryItem = initWholeSalesLn();
    deliveryItem.wslSeq = seq;
    deliveryItem.wslHasSn = $(this).data("hassn") == "1";
    // deliveryItem.wslBatchCode = $target.find('td').eq(5).find('.batch')
    if (deliveryItem.wslHasSn) {
      deliveryItem.snoUID = $(this).data("snouid") as number;
    } else {
    }
  } else {
  }
});

$(document).on("change", ".chkall", function () {
  $(".chkitem").prop("checked", $(this).is("checked")).trigger("change");
});

$(document).ready(function () {
  initModals();
  DicCurrencyExRate = $infoblk.data("jsondiccurrencyexrate");
  gTblName = "tblWSI";
  fordelivery = true;
  itotalamt = 0;
  $(".datepicker").datepicker({
    dateFormat: jsdateformat,
    beforeShow: function () {
      setTimeout(function () {
        $(".ui-datepicker").css("z-index", 99999999999999);
      }, 0);
    },
  });
  let bgcls: string = "deliverybg";
  $("body").addClass(bgcls);

  Wholesales = fillInWholeSale();

  wholesaleslnswosn = $infoblk.data("jsonwholesaleslnswosn");
  console.log("wholesaleslnswosn:", wholesaleslnswosn);

  DicInvoiceItemSeqSerialNoList = $infoblk.data(
    "jsondicinvoiceitemseqserialnolist"
  );
  console.log("DicInvoiceItemSeqSerialNoList:", DicInvoiceItemSeqSerialNoList);

  let idx = 0;
  let html = "";
  if (DicInvoiceItemSeqSerialNoList) {
    for (const [key, value] of Object.entries(DicInvoiceItemSeqSerialNoList)) {
      let _qty = value.length;
      $.each(value as ISerialNo[], function (i, e: ISerialNo) {
        var batch = e.snoBatchCode ?? "";
        var validthru = e.ValidThruDisplay ?? "";
        var formattedprice: string = formatnumber(e.wslSellingPrice as number);
        var formatteddiscpc: string = formatnumber(<number>e.wslLineDiscPc);
        var salesamt = (e.wslSalesAmt as number) / _qty;
        var formattedamt: string = formatnumber(salesamt);
        var sellunit: string = e.wslSellUnit ?? "N/A";

        html += `<tr data-idx="${idx}"><td><input type='checkbox' class='chkitem' data-hassn='1' data-wsluid='${e.wslUID}' data-snouid='${e.snoUID}' /></td><td><input type="text" name="itemcode" class="itemcode text-left" value="${e.snoItemCode}"></td><td><input type="text" name="itemdesc" class="itemdesc text-left" data-itemname="${e.itmNameDesc}" value="${e.itmNameDesc}"></td><td class="text-right"><input type="text" name="sellunit" class="sellunit text-right" value="${sellunit}"></td><td class="text-right"><input type="number" name="snqty" class="snqty text-right" value="1"></td>`;

        html += `<td><input type="text" name="batch" class="batch text-center" value="${batch}" /></td>`;
        html += `<td><input type="text" name="serailno" readonly class="serialno text-center" value="${e.snoCode}" /></td>`;
        html += `<td><input type="datetime" name="validthru" class="small validthru datepicker text-center" value="${validthru}" /></td>`;
        html += `<td class="text-right"><input type="number" name="price" class="price text-right" data-price="${e.wslSellingPrice}" value="${formattedprice}"></td><td class="text-right"><input type="number" name="discpc" class="discpc text-right" data-discpc="${e.wslLineDiscPc}" value="${formatteddiscpc}"></td>`;
        if (enableTax && !inclusivetax) {
          html += `<td class="text-right"><input type="number" name="taxpc" class="taxpc text-right" value="${e.wslTaxPc}"></td>`;
        }
        html += `<td class="text-right"><input type="number" name="amount" class="amount text-right" data-amt="${salesamt}" value="${formattedamt}"></td>`;
        html += "</tr>";
        idx++;
      });
    }
  }

  if (wholesaleslnswosn.length > 0) {
    $.each(wholesaleslnswosn, function (i, wholesalesln: IWholeSalesLn) {
      var batch = wholesalesln.wslBatchCode ?? "";
      var validthru = wholesalesln.ValidThruDisplay ?? "";
      var formattedprice: string = formatnumber(
        wholesalesln.wslSellingPrice as number
      );
      var formatteddiscpc: string = formatnumber(
        <number>wholesalesln.wslLineDiscPc
      );
      var formattedamt: string = formatnumber(<number>wholesalesln.wslSalesAmt);
      var sellunit: string = wholesalesln.wslSellUnit ?? "N/A";
      console.log("amt@loop:" + wholesalesln.wslSalesAmt);
      html += `<tr data-idx="${idx}"><td><input type='checkbox' class='chkitem'/></td><td><input type="text" name="itemcode" class="itemcode text-left" value="${wholesalesln.wslItemCode}"></td><td><input type="text" name="itemdesc" class="itemdesc text-left" data-itemname="${wholesalesln.itmName}" value="${wholesalesln.itmNameDesc}"></td><td class="text-right"><input type="text" name="sellunit" class="sellunit text-right" value="${sellunit}"></td><td class="text-right"><input type="number" name="qty" class="qty text-right" value="${wholesalesln.wslQty}"></td>`;

      html += `<td><input type="text" name="batch" class="batch text-center" value="${batch}" /></td>`;

      html += `<td><input type="text" name="serailno" readonly class="serialno text-center" value="" /></td>`;

      html += `<td><input type="datetime" name="validthru" class="small validthru datepicker text-center" value="${validthru}" /></td>`;

      html += `<td class="text-right"><input type="number" name="price" class="price text-right" data-price="${wholesalesln.wslSellingPrice}" value="${formattedprice}"></td><td class="text-right"><input type="number" name="discpc" class="discpc text-right" data-discpc="${wholesalesln.wslLineDiscPc}" value="${formatteddiscpc}"></td>`;
      if (enableTax && !inclusivetax) {
        html += `<td class="text-right"><input type="number" name="taxpc" class="taxpc text-right" value="${wholesalesln.wslTaxPc}"></td>`;
      }
      html += `<td class="text-right"><input type="number" name="amount" class="amount text-right" data-amt="${wholesalesln.wslSalesAmt}" value="${formattedamt}"></td>`;
      html += "</tr>";
      idx++;
    });
  }

  $target = $("#tblWSI tbody");
  $target.empty().html(html);

  if (Wholesales.DeliveryDateDisplay != null) {
    let pdate: Date = convertCsharpDateStringToJsDate(
      Wholesales.DeliveryDateDisplay
    );
    initDatePicker("promisedDate", pdate);
  } else {
    initDatePicker("promisedDate", tomorrow);
  }
  initDatePicker(
    "wholesalesDate",
    convertCsharpDateStringToJsDate(Wholesales.WsDateDisplay)
  );

  WholeSalesLns = wholesaleslns;
  Wholesales.JsWholesalesDate = <string>$wholesalesDateDisplay.val();
  Wholesales.JsDeliveryDate = <string>$deliveryDateDisplay.val();

  $("input").not("[type=checkbox]").not(".qty").prop("readonly", true);
  $("select").prop("disabled", true);
  $("textarea").prop("readonly", true);
  //addRow();
});
