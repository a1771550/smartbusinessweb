$infoblk = $("#infoblk");

$(document).on("click", "#btnReload", function () {
  window.location.href = "/Transfer/List";
});

$(document).on("click", ".colheader", function () {
  let $sortorder = $("#sortorder").val($(this).data("order"));
  let $sortcol = $("#sortcol").val($(this).data("col"));
  $("#frmTransferList").append($sortorder).append($sortcol).trigger("submit");
});
$(function () {
  setFullPage();
  fortransfer = true;
  gTblName = gFrmName = "TransferList";
    triggerMenu(2, 3);

  $target = $(".colheader").eq(parseInt(<string>$("#sortcol").val()));
  let sortcls =
    $("#currentsortorder").val() === "asc"
      ? "fa fa-sort-up"
      : "fa fa-sort-down";
  $target.addClass(sortcls);

  initModals();

  $target = $(".pagination");
  $target
    .wrap('<nav aria-label="Page navigation"></nav>')
    .find("li")
    .addClass("page-item")
    .find("a")
    .addClass("page-link");
  keyword = "";
  $("#txtKeyword").trigger("focus");
});
