$infoblk = $("#infoblk");
editmode = <number>$("#UserID").val() > 0; 

function validform_crmuser() {
  let msg = "";
  fillInCrmUser(false);
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

  if (crmuser.Email != "") {
    if (!validateEmail(crmuser.Email)) {
      msg += `${emailformaterr}<br>`;
      $("#Email").addClass("focus");
    }
  }

  //if (!crmuser.RoleTypes.includes(RoleType.CRMAdmin) && !crmuser.RoleTypes.includes(RoleType.CRMSalesManager) && crmuser.ManagerId == 0) {
  //    msg += `${$infoblk.data('managerrequiredtxt')}<br>`;
  //    $('#drpManager').addClass('focus');
  //}

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
  if (validform_crmuser()) {
    console.log("model:", crmuser);
    //return false;
    $.ajax({
      type: "POST",
      url: "",
      data: {
        __RequestVerificationToken: $(
          "input[name=__RequestVerificationToken]"
        ).val(),
        model: crmuser,
      },
      success: function (data) {
        if (data) {
          window.location.href = "/CrmUser/Index";
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

//$(document).on('change', '#drpManager', function () {
//    //if ($(this).val() !== '0') {}
//    crmuser.ManagerId = <number>$(this).val();
//});

//$(document).on('change', '.generalsales', function () {
//    var Id: number = parseInt(<string>$(this).val());
//    var idx: number = -1;
//    if ($(this).is(':checked')) {
//        if (!crmuser.CrmSalesGroupMemberIdList.includes(Id)) {
//            crmuser.CrmSalesGroupMemberIdList.push(Id);
//        }
//    } else {
//        $.each(crmuser.CrmSalesGroupMemberIdList, function (i, e) {
//            if (Id == e) {
//                idx = i;
//                return false;
//            }
//        });
//        if (idx >= 0) {
//            crmuser.CrmSalesGroupMemberIdList.splice(idx, 1);
//        }
//    }
//});

//$(document).on('change', '.salesgroup', function () {
//    var Id: number = parseInt(<string>$(this).val());
//    //console.log('groupid:' + Id);
//    if (crmuser.RoleTypes.includes(RoleType.CRMAdmin)) {
//        if ($(this).is(':checked')) {
//            if (!crmuser.CrmSalesGroupIdList.includes(Id)) {
//                crmuser.CrmSalesGroupIdList.push(Id);
//            }

//            //let checkedmemberIdList: Array<number> = [];
//            $('.generalsales').each(function (i, e) {
//                if (<number>$(e).data('groupid') == Id) {
//                    $(e).prop('checked', true);
//                    //checkedmemberIdList.push(<number>$(e).val());
//                }
//            }).trigger('change');

//            //$.each(checkedmemberIdList, function (k, v) {
//            //    if (!crmuser.CrmSalesGroupMemberIdList.includes(v)) {
//            //        crmuser.CrmSalesGroupMemberIdList.push(v);
//            //    }
//            //});
//        }
//        else {
//            var idx = -1;
//            $.each(crmuser.CrmSalesGroupIdList, function (i, e) {
//                if (e == Id) {
//                    idx = i;
//                    return false;
//                }
//            });
//            if (idx >= 0) {
//                crmuser.CrmSalesGroupIdList.splice(idx, 1);
//            }

//            //let uncheckedmemberIdList: Array<number> = [];
//            $('.generalsales').each(function (i, e) {
//                if (<number>$(e).data('groupid') == Id) {
//                    $(e).prop('checked', false);
//                    //uncheckedmemberIdList.push(<number>$(e).val());
//                }
//            }).trigger('change');

//            //let uncheckedIdxList: Array<number> = [];
//            //$.each(crmuser.CrmSalesGroupMemberIdList, function (k, v) {
//            //    if (uncheckedmemberIdList.includes(v)) {
//            //        uncheckedIdxList.push(k);
//            //    }
//            //});

//            //$.each(uncheckedIdxList, function (i, e) {
//            //    crmuser.CrmSalesGroupMemberIdList.splice(e, 1);
//            //});
//        }
//    } else {
//        crmuser.SalesGroup.Id = Id;
//    }
//});

function fillInCrmUser(init: boolean) {
  if (init) crmuser = initCrmUser();

  crmuser.surUID = <number>$("#UserID").val();
  crmuser.UserCode = <string>$("#UserCode").val();
  crmuser.UserName = <string>$("#UserName").val();
  crmuser.ManagerId = <number>$("#drpManager").val();
  crmuser.Email = <string>$("#Email").val();
  crmuser.AccountProfileId = <number>$infoblk.data("apid");
  crmuser.checkpass = checkpass;
  if (checkpass || !editmode) {
    crmuser.Password = <string>$("#Password").val();
    crmuser.ConfirmPassword = <string>$("#ConfirmPassword").val();
  }
  //var roles = $infoblk.data('userroles').split(',');
  ////console.log('roles:', roles);
  //$.each(roles, function (i, e) {
  //    if (typeof e !== 'undefined' && e !== '') {
  //        let roletype = RoleType[<string>e];
  //        if (!crmuser.RoleTypes.includes(roletype)) {
  //            crmuser.RoleTypes.push(roletype);
  //        }
  //    }
  //});
  //if (init && crmuser.RoleTypes.includes(RoleType.CRMSalesManager)) {

  //    let arr: Array<string> = (<string>$('#crmsalesgroupidlist').val()).split(',');
  //    $.each(arr, function (i, e) {
  //        crmuser.CrmSalesGroupIdList.push(parseInt(e));
  //    });

  //    arr = (<string>$('#crmsalesgroupmemberidlist').val()).split(',');
  //    $.each(arr, function (i, e) {
  //        crmuser.CrmSalesGroupMemberIdList.push(parseInt(e));
  //    });

  //}
  console.log("crmuser:", crmuser);
}

$(document).ready(function () {
  console.log("edit:" + editmode);
  if (!editmode) {
    $("#chkpassblk").hide();
    $("#passblk").removeClass("hide");
  } else {
    $("#chkpassblk").show();
  }
  initModals();

  fillInCrmUser(true);

  DicCrmSalesGroupMembers = $infoblk.data("jsondicgroupmemberlist");
  console.log(DicCrmSalesGroupMembers);
  $("#UserName").focus();
});
