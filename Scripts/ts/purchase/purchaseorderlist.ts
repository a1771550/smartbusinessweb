$infoblk = $("#infoblk");
approvalmode = $infoblk.data("approvalmode") === "True";
frmlist = true;

$(document).on("dblclick", ".remark", function () {
  $.fancyConfirm({
    title: "",
    message: $(this).data("remark") as string,
    shownobtn: false,
    okButton: oktxt,
    noButton: notxt,
  });
});

$(document).on("change", "#txtKeyword", function () {
  var keyword = $(this).val() as string;
  if (keyword !== "") {
    $(".searchmode").first().prop("checked", true);
    searchmodelist.push("0");
    $("#searchmode").val(searchmodelist.join(","));
  }
});

$(document).on("change", ".searchmode", function () {
  const _search = $(this).is(":checked");
  const _mode = $(this).val() as string;
  if (_search) {
    searchmodelist.push(_mode);
  } else {
    var idx = searchmodelist.findIndex((x) => x == _mode);
    searchmodelist.splice(idx, 1);
  }
  console.log(searchmodelist);
  //return;
  $("#searchmode").val(searchmodelist.join(","));
});

$(document).on("click", ".whatsapp", function () {
  //訂單 AL100098 (顧客 Chan Sek Hung ) 正在等待您的批准 (跟司機;商品行:1)。
  const orderId = $(this).data("id");
  $.ajax({
    type: "GET",
    url: "/Api/GetWhatsAppMsg",
    data: { orderId },
    success: function (data) {
      if (data) {
        const phoneno: string = data.specialapproval
          ? "85261877187"
          : "85264622867";

        let whatsapplnk: string = decodeURIComponent(
          $infoblk.data("whatsapplinkurl") as string
        );
        whatsapplnk = whatsapplnk
          .replace("{0}", phoneno)
          .replace("{1}", data.msg);

        console.log("msg:" + data.msg);
        // return;
        window.open(whatsapplnk, "_blank");
      }
    },
    dataType: "json",
  });
});

$(document).on("click", ".void", function () {
  let $ele: JQuery = $(this);
  receiptno = $ele.data("code");

  $.fancyConfirm({
    title: "",
    message: confirmvoidinvoicetxt,
    shownobtn: true,
    okButton: oktxt,
    noButton: notxt,
    callback: function (value) {
      if (value) {
        $.fancyConfirm({
          title: "",
          message: recreateinvoice4voidtxt,
          shownobtn: true,
          okButton: oktxt,
          noButton: notxt,
          callback: function (value) {
            if (value) {
              $ele.addClass("disabled").off("click");
              recreateOnVoid = 1;
              forsales = true;
            }
            respondReview("void");
          },
        });
      } else {
        $("#txtKeyword").trigger("focus");
      }
    },
  });
});
$(document).on("click", ".edit", function () {
  window.open(
    "/Purchase/Review?mode=edit&receiptno=" +
      $(this).data("code") +
      "&ireadonly=" +
      $(this).data("readonly"),
    "_self"
  );
});
$(document).on("click", ".detail", function () {
  window.open(
    "/Purchase/Review?receiptno=" +
      $(this).data("code") +
      "&ireadonly=" +
      $(this).data("readonly") +
      "&mode=" +
      $(this).data("mode"),
    "_self"
  );
});

$(document).on("click", ".copy", function () {
  $(this).addClass("disabled").off("click");
  recurOrder = initRecurOrder();
  recurOrder.Mode = "savefrmposted";
  recurOrder.pstUID = $(this).data("id") as number;
  SelectedSupplier = initSupplier();
  $target = $(this).parent("td").parent("tr").find("td.supplier");
  SelectedSupplier.supCode = $target.data("code");
  SelectedSupplier.supName = $target.data("name");
  openRecurOrderModal();
});

$(document).on("click", "#btnReload", function () {
  window.location.href = "/Purchase/PurchaseOrderList";
});

$(document).on("click", ".colheader", function () {
  let $sortorder = $("#sortorder").val($(this).data("order"));
  let $sortname = $("#sortname").val($(this).data("category"));
  $("#frmPurchaseOrderList")
    .append($sortorder)
    .append($sortname)
    .trigger("submit");
});

$(function () {
  forpurchase = true;
  setFullPage();
  //console.log('sortorder:' + $('#currentsortorder').val() + ';sortname:' + $('#sortname').val());
  const filter: any = getParameterByName("filter");
  if (filter !== null && Number(filter) === 1) {
    $(".colheader").each(function (i, e) {
      if ($(e).data("category") == $("#sortname").val()) {
        let sortcls =
          $("#currentsortorder").val() === "asc"
            ? "fa fa-sort-down"
            : "fa fa-sort-up";
        $(e).addClass(sortcls);
        return false;
      }
    });
  } else {
    $(".colheader").each(function (i, e) {
      if ($(e).data("category") == $("#sortname").val()) {
        let sortcls =
          $("#currentsortorder").val() === "asc"
            ? "fa fa-sort-up"
            : "fa fa-sort-down";
        $(e).addClass(sortcls);
        return false;
      }
    });
  }

  initModals();
  $("#txtKeyword").trigger("focus");

  $target = $(".pagination");
  $target
    .wrap('<nav aria-label="Page navigation"></nav>')
    .find("li")
    .addClass("page-item")
    .find("a")
    .addClass("page-link");

  $(".disabled").off("click");

  let keyword = getParameterByName("Keyword");
  if (keyword !== null) {
    $("#txtKeyword").val(keyword);
  }
});
