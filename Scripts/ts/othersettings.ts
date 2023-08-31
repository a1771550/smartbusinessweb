$infoblk = $("#infoblk");

uploadsizelimit = parseInt($infoblk.data("uploadsizelimit"));
uploadsizelimitmb = parseInt($infoblk.data("uploadsizelimitmb"));



$(document).on("change", "#chkEnableBuySellUnits", function () {
  $target = $(this);
  if ($target.is(":checked")) {
    enablebuysellunits = true;
  }
});

$(document).on("change", ".taxtype", function () {
  $("#TaxType").val(<string>$(this).val());
});

$(document).on("change", "#DefaultSalesNotes", function () {
  if ($(this).is(":checked")) {
    $("#UseDefaultNote").val(1);
  } else {
    $("#UseDefaultNote").val(0);
  }
});

$(document).on("change", "#EnableLogoReceipt", function () {
  if ($(this).is(":checked")) {
    $(this).val("1");
    $("#LogoReceipt").val("1");
    openLogoModal();
  } else {
    $(this).val("0");
    $("#LogoReceipt").val("0");
  }
});

// $(document).on('change', 'input[type=checkbox]:not(.fields,.logo)', function () {
//     $target = $('#' + $(this).data('param'));
//     if ($(this).is(':checked')) {
//         $target.val('1');
//         if ($(this).data('param') == 'EnableTax') {
//             openTaxTypeModal();
//         }
//     } else {
//         $target.val('0');
//     }
//     console.log('target:' + $target.attr('id') + ';val:' + $target.val());
// });

$(document).on("click", "#btnSave", function () {
  if (validForm()) {
    if (enablebuysellunits) {
      $.fancyConfirm({
        title: "",
        message: $infoblk.data("confirmirreversibletxt"),
        shownobtn: true,
        okButton: oktxt,
        noButton: notxt,
        callback: function (value) {
          if (value) {
            $("#frmOS").trigger("submit");
          } else {
            $target.trigger("focus");
          }
        },
      });
    } else {
      $("#frmOS").trigger("submit");
    }
  }
});

function validForm() {
  let msg = "";

  if (msg !== "") {
    falert(msg, oktxt);
  }
  return msg === "";
}
