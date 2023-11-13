$infoblk = $("#infoblk");
frmlist = true;
searchmodes = "";
searchmodelist =
  $("#searchmode").length && $("#searchmode").val() !== ""
    ? ($("#searchmode").val() as string).split(",")
    : [];

$(document).on("click", "#btnFilter", function (e: JQuery.Event) {
  e.preventDefault();
  if (isapprover) {
    $("#frmSalesOrderList").trigger("submit");
  } else {
    if (searchmodelist.length === 0) searchmodelist.push("0");
    $("#searchmode").val(searchmodelist.join(","));
    $("#frmSalesOrderList").trigger("submit");
  }
});

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

$(document).on("click", ".detail", function () {
    let Id = $(this).data("id");
    let status:string = $(this).data("status").toString();
  //  console.log(status);
    let url = "";
    if (status.toLowerCase() == SalesStatus.presettling.toString()) url = `/Preorder/Edit?Id=${Id}`;
    if (status.toLowerCase() == SalesStatus.presettled.toString() || status.toLowerCase() == SalesStatus.created.toString()) url = `/SalesOrder/Get?Id=${Id}`;  
   // return false;
    window.open(url,
        "_self"
    );
});

$(document).on("click", ".copy", function () {
  $(this).addClass("disabled").off("click");
  recurOrder = initRecurOrder();
  recurOrder.Mode = "savefrmposted";
  recurOrder.rtsUID = $(this).data("id") as number;
  selectedCus = initCustomer();
  $target = $(this).parent("td").parent("tr").find("td.customer");
  selectedCus.cusCode = $target.data("code");
  selectedCus.cusName = $target.data("name");
  openRecurOrderModal();
});

$(document).on("click", "#btnReload", function () {
  window.location.href = "/POSFunc/SalesOrderList";
});

$(document).on("click", ".colheader", function () {
  let $sortorder = $("#sortorder").val($(this).data("order"));
  let $sortname = $("#sortname").val($(this).data("category"));
  $("#frmSalesOrderList")
    .append($sortorder)
    .append($sortname)
    .trigger("submit");
});

$(function () {
  forsales = true;
  isapprover = $infoblk.data("isapprover") === "True";
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
