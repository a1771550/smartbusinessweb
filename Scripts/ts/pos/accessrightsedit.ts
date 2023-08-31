$infoblk = $("#infoblk");

editmode = <number>$("#UserID").val() > 0; 

$(document).ready(function () {
  if (!editmode) {
    $("#chkpassblk").hide();
    $("#passblk").removeClass("hide");
  } else {
    $("#chkpassblk").show();
    checkpass = false;
    $("#icheckpass").val(0);
    $("#passblk").addClass("hide");
    $("#currpass").attr("name", "Password");
    $("#Password").attr("name", "");
  }
  $("#UserName").focus();
});

$(document).on("change", "#chkpass", function () {
  if (editmode) {
    let checked: boolean = $(this).is(":checked");

    if (checked) {
      checkpass = true;
      $("#passblk").removeClass("hide");
      $("#currpass").attr("name", "");
      $("#Password").attr("name", "Password");
    } else {
      checkpass = false;
      $("#passblk").addClass("hide");
      $("#currpass").attr("name", "Password");
      $("#Password").attr("name", "");
    }
    let icheck = checked ? 1 : 0;
    $("#icheckpass").val(icheck);
  }
});

//$(document).on('change', '.userstatus', function () {
//    $('#userstatus').val(<number>$(this).val());
//});

function validform_ar(): boolean {
  let msg = "";
  $target = $("#UserName");
  let username = $target.val();
  if (username === "") {
    msg += usernamerequiredtxt + "<br>";
    $target.addClass("focus");
  }

  $target = $("#Email");
  let email = $target.val();
  if (email !== "" && !validateEmail(email)) {
    msg += emailformaterr + "<br>";
    $target.addClass("focus");
  }

  if (checkpass) {
    $target = $("#Password");
    let password = <string>$target.val();
    if (password === "") {
      msg += passwordrequiredtxt + "<br>";
      $target.addClass("focus");
    } else if (password.length < 6 && password.length > 10) {
      msg += passwordstrengtherrtxt + "<br>";
      $target.addClass("focus");
    }

    $target = $("#ConfirmPassword");
    let confirmpass = <string>$target.val();
    if (confirmpass === "") {
      msg += confirmpassrequiredtxt + "<br>";
      $target.addClass("focus");
    } else {
      if (password !== confirmpass) {
        msg += passconfirmpassnotmatchtxt + "<br>";
        $target.addClass("focus");
      }
    }
  }

  if (msg !== "") {
    $.fancyConfirm({
      title: "",
      message: msg,
      shownobtn: false,
      okButton: oktxt,
      noButton: notxt,
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
  /* alert('here');*/
  /* console.log('userstatus:' + $('#userstatus').val());
return false;*/
  if (validform_ar()) {
    /*return false;*/
    /* console.log($('#arform'));*/
    $("#arform").submit();
  } else {
  }
});
