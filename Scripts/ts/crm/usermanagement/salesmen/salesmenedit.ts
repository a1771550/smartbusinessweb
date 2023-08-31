$infoblk = $("#infoblk");
editmode = <number>$("#UserID").val() > 0; 

function validform_salesman() {
  let msg = "";
  fillInSalesman();
  $target = $("#UserName");
  let username = $target.val();
  if (username === "") {
    msg += `${usernamerequiredtxt}<br>`;
    $target.addClass("focus");
  }
  if (checkpass || !editmode) {
    $target = $("#Password");
    let password = <string>$target.val();
    if (password === "") {
      msg += `${passwordrequiredtxt}<br>`;
      $target.addClass("focus");
    } else {
      if (password.length < 6 && password.length > 10) {
        msg += `${passwordstrengtherrtxt}<br>`;
        $target.addClass("focus");
      }
    }

    $target = $("#ConfirmPassword");
    let confirmpass = <string>$target.val();
    if (confirmpass === "") {
      msg += `${confirmpassrequiredtxt}<br>`;
      $target.addClass("focus");
    } else {
      if (password !== confirmpass) {
        msg += `${passconfirmpassnotmatchtxt}<br>`;
        $target.addClass("focus");
      }
    }
  }

  if (salesman.Email != "") {
    if (!validateEmail(salesman.Email)) {
      msg += `${emailformaterr}<br>`;
      $("#Email").addClass("focus");
    }
  }

  if (salesman.ManagerId == 0) {
    msg += `${$infoblk.data("managerrequiredtxt")}<br>`;
    $("#drpManager").addClass("focus");
  }

  if (msg !== "") {
    $.fancyConfirm({
      title: "",
      message: msg,
      shownobtn: false,
      okButton: oktxt,
      noButton: canceltxt,
      callback: function (value) {
        if (value) {
          $(".focus").eq(0).focus();
        }
      },
    });
  }

  return msg === "";
}

$(document).on("click", "#btnSave", function () {
  if (validform_salesman()) {
    console.log("model:", salesman);
    //return false;
    $.ajax({
      type: "POST",
      url: "",
      data: {
        __RequestVerificationToken: $(
          "input[name=__RequestVerificationToken]"
        ).val(),
        model: salesman,
      },
      success: function (data) {
        if (data) {
          window.location.href = "/Salesmen/Index";
        }
      },
      dataType: "json",
    });
  }
});

$(document).on("change", "#chkpass", function () {
  let checked: boolean = $(this).is(":checked");

  if (checked) {
    checkpass = true;
    $("#passblk").removeClass("hide");
    $("#currpass").attr("name", "");
    $("#Password").attr("name", "Password").addClass("focus");
  } else {
    checkpass = false;
    $("#passblk").addClass("hide");
    $("#currpass").attr("name", "Password");
    $("#Password").attr("name", "");
  }
  let icheck = checked ? 1 : 0;
  $("#icheckpass").val(icheck);
});

$(document).ready(function () {
  console.log("edit:" + editmode);
  if (!editmode) {
    $("#chkpassblk").hide();
    $("#passblk").removeClass("hide");
  } else {
    $("#chkpassblk").show();
  }
  initModals();

  fillInSalesman();

  $("#UserName").focus();
});

function fillInSalesman() {
  salesman = initCrmUser();
  salesman.surUID = <number>$("#UserID").val();
  salesman.UserCode = <string>$("#UserCode").val();
  salesman.UserName = <string>$("#UserName").val();
  salesman.ManagerId = <number>$("#drpManager").val();
  salesman.Email = <string>$("#Email").val();
  salesman.AccountProfileId = <number>$infoblk.data("apid");
  salesman.checkpass = checkpass;
  if (checkpass || !editmode) {
    salesman.Password = <string>$("#Password").val();
    salesman.ConfirmPassword = <string>$("#ConfirmPassword").val();
  }
}
