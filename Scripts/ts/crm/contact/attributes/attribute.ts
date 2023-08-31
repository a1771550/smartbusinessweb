editmode = true; 

function searchAttr(fieldname: string = "Keyword") {
  openWaitingModal();
  let $sortcol = $("<input>").attr({
    type: "hidden",
    name: fieldname,
    value: keyword.trim(),
  });
  $("#frmAttribute").append($sortcol).submit();
  $("#frmAttribute").submit();
}

$(document).on("click", "#btnSearch", function () {
  keyword = <string>$("#txtKeyword").val();
  if (keyword !== "") {
    searchAttr();
  }
});

$(document).on("change", "#attrName", function () {
  selectedAttribute.attrName = <string>$(this).val();
});

$(document).on("change", ".attval", function () {
  editAttVals(this, editmode);
});

$(document).on("click", ".edit", function () {
  editAttribute(this, editmode);
});

$(document).on("click", ".attvalue", function () {
  editAttribute(this, editmode);
});

$(document).ready(function () {
  console.log(
    "sortorder:" + $("#sortorder").val() + ";sortcol:" + $("#sortcol").val()
  );
  $target = $(".colheader").eq(parseInt(<string>$("#sortcol").val()));
  let sortcls =
    $("#sortorder").val() === "asc" ? "fa fa-sort-up" : "fa fa-sort-down";
  $target.addClass(sortcls);
  $target = $(".pagination");
  $target
    .wrap('<nav aria-label="Page navigation"></nav>')
    .find("li")
    .addClass("page-item")
    .find("a")
    .addClass("page-link");

  initModals();
  $("#txtKeyword").focus();

  let keyword = getParameterByName("Keyword");
  if (keyword !== null) {
    $("#txtKeyword").val(keyword);
  }

  dicAttrVals = $infoblk.data("dicattrvals");
  console.log(dicAttrVals);

  $(".datepicker").datepicker({
    format: "yyyy-mm-dd",
    setDate: new Date(),
    todayHighlight: true,
  });

  comboModal.dialog({
    buttons: [
      {
        text: savetxt,
        class: "savebtn",
        click: function () {
          saveAttributeVals(editmode);
        },
      },
      {
        text: canceltxt,
        click: closeComboModal,
      },
    ],
  });
});

$(document).on("click", ".remove", function () {
  selectedAttribute = fillAttribute($(this).parent("td").parent("tr"));
  $.fancyConfirm({
    title: "",
    message: confirmremove,
    shownobtn: true,
    okButton: oktxt,
    noButton: canceltxt,
    callback: function (value) {
      if (value) {
        $.ajax({
          type: "POST",
          url: "/CustomerAttribute/Delete",
          data: {
            av: selectedAttribute,
            __RequestVerificationToken: $(
              "input[name=__RequestVerificationToken]"
            ).val(),
          },
          success: function () {
            window.location.reload();
          },
          dataType: "json",
        });
      }
    },
  });
});

$(document).on("click", "#btnReload", function () {
  $("#frmAttribute").trigger("reset");
  window.location.href =
    "/CustomerAttribute/Index?contactId=" +
    $("#contactId").val() +
    "&accountProfileId=" +
    $("#apId").val();
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
  $("#frmAttribute").append($sortcol).append($keyword).submit();
});

$(document).on("change", "#txtKeyword", function () {
  keyword = <string>$(this).val();
  if (keyword !== "") {
    searchAttr();
  }
});

$(document).on("change", "#drpType", function () {
  keyword = <string>$(this).val();
  if (keyword !== "") {
    searchAttr("SelectedType");
  }
});
