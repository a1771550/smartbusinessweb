$infoblk = $("#infoblk");



$(function () {
  setFullPage();
  fortransfer = true;
    gTblId = "TransferList";
    gFrmId = "frmTransferList";
    triggerMenuByCls("menuitem", 3);

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
