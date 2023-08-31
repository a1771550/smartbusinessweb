$infoblk = $("#infoblk");

$(document).on("click", ".remove", function () {
  const Id = $(this).data("id");
  $.fancyConfirm({
    title: "",
    message: confirmremovetxt,
    shownobtn: true,
    okButton: oktxt,
    noButton: notxt,
    callback: function (value) {
      if (value) {
        $.ajax({
          //contentType: 'application/json; charset=utf-8',
          type: "POST",
          url: "/WholeSales/Delete",
          data: {
            __RequestVerificationToken: $(
              "input[name=__RequestVerificationToken]"
            ).val(),
            Id,
          },
          success: function () {
            window.location.href = "/WholeSales/Index";
          },
          dataType: "json",
        });
      } else {
        $("#txtKeyword").trigger("focus");
      }
    },
  });
});

$(document).on("click", "#btnReload", function () {
  window.location.href = "/Wholesales/Index";
});

$(document).on("click", ".colheader", function () {
  let $sortcol = $("<input>").attr({
    type: "hidden",
    name: "SortCol",
    value: $(this).data("col"),
  });
  let $keyword = $("<input>").attr({
    type: "hidden",
    name: "Keyword",
    value: $(this).data("keyword"),
  });
  $("#frmWholeSales").append($sortcol).append($keyword).trigger("submit");
});

$(document).on("change", "#txtKeyword", function () {
  keyword = <string>$(this).val();
  if (keyword !== "") {
    openWaitingModal();
    let $sortcol = $("<input>").attr({
      type: "hidden",
      name: "Keyword",
      value: keyword.trim(),
    });
    $("#frmWholeSales").append($sortcol).trigger("submit");
  }
});

$(document).on("click", "#btnSearch", function () {
  $("#txtKeyword").trigger("change");
});

$(function () {
  setFullPage();
  let $sortorder = $("#sortorder");
  let $sortcol = $("#sortcol");
  console.log("sortorder:" + $sortorder.val() + ";sortcol:" + $sortcol.val());
  $target = $(".colheader").eq(<number>$sortcol.val());
  let sortcls =
    $sortorder.val() === "asc" ? "fa fa-sort-down" : "fa fa-sort-up";
  $target.addClass(sortcls);

  initModals();
  $("#txtKeyword").trigger("focus");

  $target = $(".pagination");
  $target
    .wrap('<nav aria-label="Page navigation"></nav>')
    .find("li")
    .addClass("page-item")
    .find("a")
    .addClass("page-link");

  let keyword = getParameterByName("Keyword");
  if (keyword !== null) {
    $("#txtKeyword").val(keyword);
  }
});
