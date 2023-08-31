$infoblk = $("#infoblk");
lang = parseInt($infoblk.data("lang"));
checkoutportal = $infoblk.data("checkoutportal");

$(document).on("change", "#kingdee", function () {
  changeCheckoutPortal("kingdee", "export");
});
$(document).on("change", "#abss", function () {
  changeCheckoutPortal("abss", "export");
});

$(document).on("click", ".export", function () {
  let offline: boolean = $infoblk.data("isoffline") == "1";
  let type = $(this).data("type") as string;
  $("#exportType").val(type);
  //console.log('type:' + type);
  //console.log('formdata:', $('#frmExport').serialize());
  //return false
  $.ajax({
    type: "GET",
    url: "/Api/CheckIfFileLocked",
    data: { file: "" },
    success: function (data) {
      if (data == "1") {
        $.fancyConfirm({
          title: "",
          message: abssfilelockedalerttxt,
          shownobtn: false,
          okButton: oktxt,
          noButton: notxt,
        });
      } else {
        openWaitingModal();
        let url = offline
          ? "/DataTransfer/DoExportFrmShop"
          : "/DataTransfer/DoExportFrmShopAsync";
        $.ajax({
          type: "POST",
          url: url,
          data: $("#frmExport").serialize(),
          success: function (data) {
            console.log("returned data:", data);
            if (checkoutportal === "kingdee") {
              console.log("result:", data.result); //result: {"customer":true,"sales":true}
            }

            $.fancyConfirm({
              title: "",
              message: $infoblk.data("importdonemsg"),
              shownobtn: false,
              okButton: oktxt,
              noButton: canceltxt,
              callback: function (value) {
                if (value) {
                  if (data.PendingInvoices == 1) {
                    window.location.href = "/POSFunc/PendingInvoices";
                  } else {
                    /*$('#result').empty().addClass('alert alert-info').html(data.msg);*/
                    if (data.PendingInvoices == 1) {
                      url = "/POSFunc/PendingInvoices";
                      if (forproview) url = "/WholeSales/ZeroStocks";
                      window.open(url);
                    } else {
                      $(`.export.${type}`).addClass("disabled").off("click");
                    }
                  }
                  if (data.offlinemode == 1) {
                    let msg =
                      $infoblk.data("exportpathtxt") + ": " + data.folder;
                    $("#exportedpathmsg").removeClass("hide").text(msg);
                  }
                }
              },
            });
            closeWaitingModal();
          },
          dataType: "json",
        });
      }
    },
    dataType: "json",
  });
});
