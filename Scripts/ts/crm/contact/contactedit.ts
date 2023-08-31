$infoblk = $("#infoblk");
phonelist = $infoblk.data("codelist").split(",");
maillist = $infoblk.data("maillist").split(",");
editmode = $infoblk.data("edit") === "True";
debug = true;

let _attrvaldelimiter = $infoblk.data("attrvaldelimiter");
let _frmenquiry: boolean = $infoblk.data("frmenquiry") == 1;
let contact: IContact;

$(document).on("click", "#btnAddCustomAttr", function () {
  openCustomAttributeModal();
  editmode = false;
});

$(document).on("click", "#btnEdit", function () {
  if (validContactForm()) {
    //let token = $('input[name=__RequestVerificationToken]').val();
    console.log("dicAttrVals:", dicAttrVals);
    console.log("attributelist:", AttributeList);

    contact.SelectedType = <string>$("#SelectedType").val();
    contact.FrmEnquiry = _frmenquiry;
    console.log("contact:", contact);

    let _formdata: IContactFormData = initContactFormData();
    _formdata.model = contact;
    let _url = "";
    if (contact.SelectedType === "") {
      _url = "/Contact/Edit";
      _formdata.AttributeList = AttributeList.slice(0);
    } else {
      let _globalattrlist: Array<IAttribute> = [];
      $.each(AttributeList, function (i, e) {
        if (e.iIsDefault == 1 && e.iIsGlobal == 1) {
          _globalattrlist.push(e);
        }
      });
      _formdata.AttributeList = _globalattrlist.slice(0);
      _url = "/Contact/SaveGlobal";
    }

    console.log("formdata:", _formdata);
    console.log("url:" + _url);
    //return false;
    openWaitingModal();
    $.ajax({
      type: "POST",
      url: _url,
      data: _formdata,
      success: function (data) {
        closeWaitingModal();
        window.location.href = "/Contact/Index";
      },
      dataType: "json",
    });
  }
});

$(document).on("click", "#btnSaveDefault", function () {
  let _attributes: Array<IAttribute> = [];
  $("#tblDefault tbody tr").each(function (i, e) {
    let _input = $(e).find("td:eq(1)").find(".default.date");
    let _attvals: string = <string>_input.val();
    console.log("_attvals:" + _attvals);

    let _attribute: IAttribute = {
      attrId: $(e).data("attrid"),
      contactId: $(e).data("contactid"),
      attrName: $(e).data("attrname"),
      attrType: $(e).data("attrtype"),
      attrOrder: 0,
      attrIsDefault: true,
      attrIsGlobal: false,
      iIsDefault: 1,
      iIsGlobal: 0,
      AccountProfileId: $(e).data("apid"),
      attrValue: _attvals,
      CreateTime: "",
      ModifyTime: "",
      Id: "",
      attrValues: "",
      operator: "",
    };
    _attributes.push(_attribute);
  });

  console.log("_attributes:", _attributes);
  //return false;

  let data = {
    __RequestVerificationToken: $(
      "input[name=__RequestVerificationToken]"
    ).val(),
    attributes: _attributes,
  };
  $.ajax({
    type: "POST",
    url: "/CustomerAttribute/SaveDefaults",
    data: data,
    success: function (data) {
      if (data !== null) {
        $.fancyConfirm({
          title: "",
          message: data,
          shownobtn: false,
          okButton: oktxt,
          noButton: notxt,
          callback: function (value) {
            if (value) {
            }
          },
        });
      }
    },
    dataType: "json",
  });
});

$(document).on("click", ".attrsave", function () {
  let idx: number = parseInt($(this).parent("td").parent("tr").data("idx"));
  let $tr = $("#tblAttribute tbody tr").eq(idx);
  let _attrval = <string>$tr.find("td:eq(1)").find(".attrvalue").val();
  selectedAttribute = fillAttribute($tr, _attrval);
  saveAttributeVals(true);
});

$(document).on("change", ".attr", function () {
  if ($(this).val() !== "") {
    $(this).removeClass("focus");
  } else {
    $(this).addClass("focus");
  }
});

$(document).on("click", ".border", function () {
  var ele = $(this).prev(".form-control");
  openDropDownModal(ele);
});

function fillInAttributes(init: boolean = true) {
  if (init) {
    AttributeList = [];
    dicAttrs = $infoblk.data("jsondicattrs");
    console.log("dicattrs:", dicAttrs);

    for (const [key, value] of Object.entries(dicAttrs)) {
      //console.log(`${key}: ${value}`);
      AttributeList.push(value);
    }

    console.log("AttrbuteList#fillin:", AttributeList);
    console.log(
      "debug:" + debug + ";editmode:" + editmode + ":attrmode:" + _attrmode
    );

    if ((debug && !editmode && !_attrmode) || (debug && _frmenquiry)) {
      dicAttrVals = $infoblk.data("dicattrvals");
      console.log("dicattrvals:", dicAttrVals);

      defaultAttVals = $("#JsonDefaultAttrVals").data("jsondefaultattrvals");
      console.log("defaultattvals:", defaultAttVals);

      $(".combo.attr").each(function (i, e) {
        let _val = (<string>$(e).data("attrvalue")).split(_attrvaldelimiter)[0];
        $(e).val(_val);
      });

      let _placetxt: string = $infoblk.data("followupdaterequiredtxt");
      $target = $("#tblDefault tbody tr:first");
      $target
        .find("td:eq(1)")
        .find(".default")
        .attr("placeholder", _placetxt.replace("{0}", $target.data("attname")));
      //$('#tblDefault tbody tr').each(function (i, e) {
      //    console.log('placetxt:' + _placetxt);
      //    $(e).find('td:eq(1)').find('.default').attr('placeholder', _placetxt.replace('{0}', $(e).data('attname')));
      //});
    } else {
      dicAttrVals = $infoblk.data("jsondicattrvals");
      console.log("dicattrvals#fillin:", dicAttrVals);
      $(".text.attr").each(function (i, e) {
        $(e).val(dicAttrVals[$(e).data("attrname")]);
      });
      $(".combo.attr").each(function (i, e) {
        $(e).val(dicAttrVals[$(e).data("attrname")]);
        if ($(e).val() == "") {
          let _val = (<string>$(e).data("attrvalue")).split(
            _attrvaldelimiter
          )[0];
          $(e).val(_val);
        }
      });
    }
  } else {
    console.log("AttributeList#fillin:0", AttributeList);

    $(".text.attr").each(function (i, e) {
      $.each(AttributeList, function (k, v) {
        if (
          v.attrName.toLowerCase() ==
          (<string>$(e).data("attrname")).toLowerCase()
        ) {
          v.attrValue = <string>$(e).val();
        }
      });
    });

    $(".combo.attr").each(function (i, e) {
      $.each(AttributeList, function (k, v) {
        if (
          v.attrName.toLowerCase() ==
          (<string>$(e).data("attrname")).toLowerCase()
        ) {
          v.attrValue = <string>$(e).val();
        }
      });
    });

    $(".date.default.attr").each(function (i, e) {
      $.each(AttributeList, function (k, v) {
        if (
          v.attrName.toLowerCase() ==
          (<string>$(e).data("attrname")).toLowerCase()
        ) {
          v.attrValue = <string>$(e).val();
        }
      });
    });

    console.log("AttributeList#fillin:1", AttributeList);
  }
}

function validContactForm() {
  let msg = "";

  fillInContact();

  fillInAttributes(false);
  $target = $("#gattrblk")
    .find(".col-4:eq(2)")
    .find("form")
    .find(".form-group");
  let valcount = 0;
  $target.each(function (i, e) {
    let _target = $(e).find(".attr");
    if (_target.val() !== "") {
      valcount++;
    } else {
      _target.addClass("focus");
      console.log("added focus cls#global");
    }
  });
  console.log("valcount:" + valcount);
  if (valcount === 0) {
    msg += $infoblk.data("plsenteralldropdownattrvals") + "<br>";
  }

  $target = $("#tblDefault tbody tr:eq(0)").find("td:eq(1)").find(".attr");
  if ($target.val() === "") {
    $target.addClass("focus");
    console.log("added focus cls#date");
    msg += $infoblk.data("followupdaterequired");
  }

  let $cusname = $("#cusName");
  let $cusfname = $("#cusFirstName");
  let $contact = $("#cusContact");
  let $cuscode = $("#cusPhone");
  let duplicated = false;
  let $cusemail = $("#cusEmail");
  let emailerr = false;
  if (!_attrmode) {
    console.log("isorgan:" + isorgan);
    if (isorgan) {
      if (contact.cusName === "") {
        msg += $infoblk.data("contactnamerequired") + "<br>";
      }
    } else {
      if (contact.cusFirstName === "") {
        msg += $infoblk.data("firstnamerequired") + "<br>";
      }
    }

    if (contact.cusPhone === "") {
      msg += $infoblk.data("contactphonerequired") + "<br>";
    }

    if (contact.cusContact === "") {
      msg += $infoblk.data("contactrequired") + "<br>";
    }

    let email = contact.cusEmail;

    if (email !== "") {
      if (!validateEmail(email)) {
        msg += emailformaterr + "<br>";
        emailerr = true;
      }
    }
  }

  console.log("msg:" + msg);
  if (msg !== "") {
    $.fancyConfirm({
      title: "",
      message: msg,
      shownobtn: false,
      okButton: oktxt,
      noButton: canceltxt,
      callback: function (value) {
        console.log("duplicated:" + duplicated);
        if (value) {
          if (_attrmode) {
            if (isorgan && contact.cusName === "") {
              $cusname.addClass("focus");
            }
            if (!isorgan && contact.cusFirstName === "") {
              $cusfname.addClass("focus");
            }
            if (contact.cusPhone === "") {
              $cuscode.addClass("focus");
            }
            if (contact.cusContact === "") {
              $contact.addClass("focus");
            }
            if (duplicated) {
              $cuscode.addClass("focus");
            }
            if (emailerr) {
              $cusemail.addClass("focus");
            }
          }
        }
      },
    });
  }
  return msg === "";
}

$(document).on("click", "#mplus", function () {
  _mobilecount++;
  console.log("mobilecount:" + _mobilecount);
  if (_mobilecount <= 3) {
    $(".mobile:first")
      .clone()
      .insertAfter(".mobile:last")
      .addClass("my-1")
      .attr("id", `cusAddrPhone${_mobilecount}`)
      .attr("name", `cusAddrPhone${_mobilecount}`);
  }
});

function fillInContact() {
  contact = initContact();
  contact.cusContactID = <number>$("#cusContactID").val();
  contact.cusName = isorgan
    ? <string>$("#cusName").val()
    : <string>$("#cusLastName").val();
  contact.cusPhone = <string>$("#cusPhone").val();
  contact.cusPointsSoFar = <number>$("#cusPointsSoFar").val();
  contact.cusEmail = <string>$("#cusEmail").val();
  contact.IsActive = <number>$("#IsActive").val();
  contact.AccountProfileId = <number>$("#AccountProfileId").val();
  contact.IsOrganization = <string>$("#IsOrgan").val();
  contact.cusContact = <string>$("#cusContact").val();
  contact.cusFirstName = <string>$("#cusFirstName").val();
  contact.cusAddrCity = <string>$("#cusCity").val();
  contact.cusAddrCountry = <string>$("#cusCountry").val();
  contact.cusAddrWeb = <string>$("#cusAddrWeb").val();

  contact.cusAddrStreetLine1 = <string>$("#cusAddrStreetLine1").val();
  contact.cusAddrStreetLine2 = <string>$("#cusAddrStreetLine2").val();
  contact.cusAddrStreetLine3 = <string>$("#cusAddrStreetLine3").val();
  contact.cusAddrStreetLine4 = <string>$("#cusAddrStreetLine4").val();

  contact.cusAddrPhone1 = <string>$("#cusAddrPhone1").val();
  let $phone2 = $("#cusAddrPhone2");
  if ($phone2.length) {
    contact.cusAddrPhone2 = <string>$("#cusAddrPhone2").val();
  }
  let $phone3 = $("#cusAddrPhone3");
  if ($phone3.length) {
    contact.cusAddrPhone3 = <string>$("#cusAddrPhone3").val();
  }

  if (editmode && !_attrmode) {
    isorgan = <number>$("#IsOrgan").val() == 1;
    console.log(isorgan);
    toggleNames();
    if (!isorgan) {
      console.log("lastname:" + $("#namesblk").data("lastname"));
      $("#cusFirstName").focus();
      $("#cusLastName").val($("#namesblk").data("lastname"));
    } else {
      $("#cusName").focus();
    }
  }

  contact.OverWrite = <string>$("#OverWrite").val() == "True";
}

$(document).on("change", ".isorgan", function () {
  $("#IsOrgan").val(<string>$(this).val());
  isorgan = $(this).val() == 1;
  toggleNames();
});

$(document).on("change", "#cusPhone", function () {
  let $cusphone = $(this);
  let cusphone = <string>$cusphone.val();
  if (cusphone !== "") {
    if (cusphone.toUpperCase() === "GUEST") {
      $.fancyConfirm({
        title: "",
        message: guestcantaddedmsg,
        shownobtn: false,
        okButton: oktxt,
        noButton: canceltxt,
        callback: function (value) {
          if (value) {
            $cusphone.val("").focus();
          }
        },
      });
    }

    if (phonelist.includes(cusphone)) {
      $("#phonewarning").removeClass("hide");
      $cusphone.focus();
    }
  }
});
$(document).on("change", "#cusName", function () {
  let $cusname = $(this);
  let _cname = <string>$cusname.val();
  if (_cname !== "" && _cname.toUpperCase() === "GUEST") {
    $.fancyConfirm({
      title: "",
      message: guestcantaddedmsg,
      shownobtn: false,
      okButton: oktxt,
      noButton: canceltxt,
      callback: function (value) {
        if (value) {
          $cusname.val("").focus();
        }
      },
    });
  }
});

$(document).on("change", "#cusFirstName", function () {
  _firstname = <string>$(this).val();
  fillFullName();
});
$(document).on("change", "#cusLastName", function () {
  _lastname = <string>$(this).val();
  fillFullName();
});

$(document).on("change", "#cusEmail", function () {
  let $email = $(this);
  let _email: string = <string>$email.val();
  if (_email !== "") {
    if (maillist.includes(_email)) {
      $("#emailwarning").removeClass("hide");
      $email.focus();
    }
  }
});

$(document).on("click", "#lnkcusattr", function () {
  window.location.href = $(this).data("lnk");
});

$(document).on("click", ".attrremove", function () {
  if (!$(this).hasClass("disabled")) {
    let idx: number = parseInt($(this).parent("td").parent("tr").data("idx"));
    let $tr = $("#tblAttribute tbody tr").eq(idx);
    $.fancyConfirm({
      title: "",
      message: confirmremove,
      shownobtn: true,
      okButton: oktxt,
      noButton: canceltxt,
      callback: function (value) {
        if (value) {
          //<tr data-idx="0" data-attid="10test2text1" data-contactid="10" data-attname="test2" data-atttype="text" data-apid="1" data-datetime="2022/2/16 上午 10:53:10">
          let av: IAttribute = fillAttribute($tr);
          $tr.remove();
          $.ajax({
            type: "POST",
            url: "/CustomerAttribute/Delete",
            data: {
              __RequestVerificationToken: $(
                "input[name=__RequestVerificationToken]"
              ).val(),
              av: av,
            },
            success: function (data) {
              if (data !== null) window.location.reload();
            },
            dataType: "json",
          });
        } else {
          $tr.find("td").eq(0).find(".attrname").focus();
        }
      },
    });
  }
});

$(document).on("change", "#isActive", function () {
  if ($(this).is(":checked")) {
    $("#IsActive").val(1);
  } else {
    $("#IsActive").val(0);
  }
});

$(document).on("change", ".atttype", function () {
  if ($(this).val() !== "") {
    reload = true;
    savemode = <string>$(this).val();
    if (savemode === "combo") {
      openComboModal();
      let $tr: JQuery = $(this).parent("td").parent("tr");
      selectedAttribute = fillAttribute($tr);
      selectedAttribute.attrValue = dicAttrVals[selectedAttribute.attrId];
      addValRows(selectedAttribute, selectedAttribute.attrValue);
    }
  }
});

$(document).on("change", ".attval", function () {
  editAttVals(this, editmode);
});

$(document).on("click", ".attvalue", function () {
  editAttribute(this, editmode);
});
$(document).on("click", ".default.combo", function () {
  editAttribute(this, editmode);
});

$(document).on("change", ".attvalue", function () {
  let $tr: JQuery = $(this).parent("td").parent("tr");
  selectedAttribute = fillAttribute($tr);
  editAttVals(this, editmode);
});

//function openDropDownModal(ele: JQuery<any>) {
//  dropdownModal.dialog("open");
//  //console.log('ele:', ele);
//  let _attrname: string = $(ele).data("attrname");
//  //console.log('name:' + _attrname);

//  dropdownModal.find("#lblattrname").text(_attrname);
//  let options: string = "";
//  let $dropdown: JQuery = dropdownModal.find(".dropdown");
//  $dropdown.data("attrname", _attrname);
//  //let _selecttxt: string = `-- ${selecttxt} --`;
//  //options += `<option value=''>${_selecttxt}</option>`;

//  $dropdown.attr("id", _attrname);
//  let _items: string[] = $(ele).data("attrvalue").split("||");
//  $.each(_items, function (i, e) {
//    options += `<option value="${e}">${e}</option>`;
//  });
//  $dropdown.empty().append(options);
//}
//function closeDropDownModal() {
//  dropdownModal.dialog("close");
//  if (reload) {
//    window.location.reload();
//  }
//}

$(document).ready(function () {
  var selectedtype = getParameterByName("SelectedType");
  _attrmode = selectedtype !== null;
  console.log("_attrmode:" + _attrmode);

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

  let _defaultdateoptions = {
    format: sysdateformat,
    todayHighlight: true,
  };
  $(".datepicker").datepicker(_defaultdateoptions);
  if (!_attrmode) {
    $(".datepicker:eq(0)").datepicker("setDate", new Date());
  }

  fillInContact();

  fillInAttributes();

  _toggleBlks();

  $("#cusName").attr("maxlength", maxconamelength).focus();

  console.log("editmode:" + editmode + ";attrmode:" + _attrmode);
  console.log("attributelist#ready:", AttributeList);
});

function _toggleBlks() {
  if (_attrmode) {
    $("#statusblk").hide();
    $("#saveblk")
      .insertBefore($("#gattrblk"))
      .addClass("float-right")
      .find("div:eq(0)")
      .addClass("my-3");
    $("#savedefaultblk").show();
  } else {
    $("#statusblk").show();
    $("#saveblk").show();
    $("#savedefaultblk").hide();
  }
}
