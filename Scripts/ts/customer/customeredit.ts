$infoblk = $("#infoblk");

let cusId: number = editmode ? Number($infoblk.data("cusid")) : 0;
let gattrnamelist: string[] = [];

$(document).on("change", "#cusPhone", function () {
    let maxlength = Number($(this).attr("maxlength"));
    let phone = $(this).val() as string;
    if (phone && phone!.length > maxlength) {
        phone = phone.substring(0, maxlength);
        $(this).val(phone);
    }
});
$(document).on("change", ".labeltxt", function () {
    let attrname = $(this).val() as string;
    if (attrname) {
        let oldattrname = $(this).data("oldname");
        let gattr: IGlobalAttribute = {
            attrName: attrname,
            oldAttrName: oldattrname
        } as IGlobalAttribute;
        //UpdateGattrName
        $.ajax({
            //contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: '/Customer/UpdateGattrName',
            data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), gattr },
            success: function (data: IGlobalAttribute) {
                if (data) {
                    //console.log(data);
                    $("#gattrblk .form-group").each(function (i, e) {
                        let gattrId: string = $(e).find(".info").data("gattrid");
                        console.log("gattrid:" + gattrId);
                        if (data.gattrId == gattrId) {
                            $(e).find("label").text(data.attrName).show();
                            $(e).find(".form-control.labeltxt").addClass("hide");
                            return false;
                        }
                    });
                }
            },
            dataType: 'json'
        });
    }
});

$(document).on("dblclick", ".pointer.attr", function () {
    $target = $(this).parent(".form-group");
    $(this).hide();
    //$target.find(".form-control.attr").hide();
    $target.find(".labeltxt").removeClass("hide").trigger("focus");
});

$(document).on("click", "#btnSaveGattr", function () {
    saveGattr(customer.cusCustomerID);
});

$(document).on("change", "#cusSaleComment", function () {
    let salecomment = <string>$(this).val();
    if (salecomment !== null && salecomment !== "") {
        let pattern =
            /^BR\:(0?[1-9]|[12][0-9]|3[01])\/{1}(0?[1-9]|1[012])\/{1}\d{4}\;{1}.+$/gm;
        let result: boolean = <boolean>pattern.test(salecomment);
        if (!result) {
            $.fancyConfirm({
                title: "",
                message: $infoblk.data("formaterrwarning"),
                shownobtn: false,
                okButton: oktxt,
                noButton: notxt,
                callback: function (value) {
                    if (value) {
                        $("#cusSaleComment").trigger("focus");
                    }
                },
            });
        }
    }
});

$(document).on("click", "#btnEdit", function () {
    fillInCustomer();
    if (validCusForm()) {
        let _formdata: ICustomerFormData = initCustomerFormData(customer);
        _formdata.model = customer;

        let _url = "/Customer/Edit";
        //console.log("formdata:", _formdata);
        //console.log("url:" + _url);
        //return false;
        openWaitingModal();
        $.ajax({
            type: "POST",
            url: _url,
            data: _formdata,
            success: function () {
                closeWaitingModal();
                window.location.href = `/Customer/${$infoblk.data("referrer")}`;
            },
            dataType: "json",
        });
    }
});

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

$(document).on("change", ".isorgan", function () {
    $("#IsOrgan").val(<string>$(this).val());
    isorgan = $(this).val() == 1;
    toggleNames();
});

$(document).on("change", "#cusCode", function () {
    let $cuscode = $(this);
    let cuscode = <string>$cuscode.val();
    if (cuscode !== "") {
        if (cuscode.toUpperCase() === "GUEST") {
            $.fancyConfirm({
                title: "",
                message: guestcantaddedmsg,
                shownobtn: false,
                okButton: oktxt,
                noButton: canceltxt,
                callback: function (value) {
                    if (value) {
                        $cuscode.val("").trigger("focus");
                    }
                },
            });
        }

        if (phonelist.includes(cuscode)) {
            $.fancyConfirm({
                title: "",
                message: customerphoneduplicatederrtxt,
                shownobtn: false,
                okButton: oktxt,
                noButton: canceltxt,
                callback: function (value) {
                    if (value) {
                        $cuscode.val("").trigger("focus");
                    }
                },
            });
        }
    }
});
$(document).on("change", "#cusName", function () {
    let $cusname = $(this);
    let _cname = <string>$cusname.val();
    if (_cname !== "") {
        if (_cname.toUpperCase() === "GUEST") {
            $.fancyConfirm({
                title: "",
                message: guestcantaddedmsg,
                shownobtn: false,
                okButton: oktxt,
                noButton: canceltxt,
                callback: function (value) {
                    if (value) {
                        $cusname.val("").trigger("focus");
                    }
                },
            });
        }
        if (namelist.includes(_cname)) {
            $.fancyConfirm({
                title: "",
                message: duplicatedcustomernamewarning,
                shownobtn: false,
                okButton: oktxt,
                noButton: canceltxt,
                callback: function (value) {
                    if (value) {
                        $cusname.val("").trigger("focus");
                    }
                },
            });
        }
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
            $.fancyConfirm({
                title: "",
                message: $infoblk.data("duplicatedemailalert"),
                shownobtn: true,
                okButton: oktxt,
                noButton: canceltxt,
                callback: function (value) {
                    if (value) {
                        $email.trigger("focus");
                    } else {
                        $email.val("").trigger("focus");
                    }
                },
            });
        }
    }
});

function removeCattr(cattr: string) {
    $.ajax({
        //contentType: 'application/json; charset=utf-8',
        type: "POST",
        url: '/Customer/RemoveCattr',
        data: { '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val(), cusId, cattr },
        success: function (data: ICustomAttribute[]) {
            if (data) {
                //console.log("data:", data);
                cAttributes = data.slice(0);
                console.log("cattrbutes:", cAttributes);
                displayCustomAttributes();
            }
        },
        dataType: 'json'
    });
}
$(document).on("click", ".cattr.pointer.fa-close", function () {
    removeCattr($(this).data("cattr"));
});
function handleAttrAccordionActivated() {
    //console.log("cattrlist#handle:", cAttributes);    
    if (cAttributes) {
        displayCustomAttributes();
    }
}
function displayCustomAttributes() {
    let html = "";
    cAttributes.forEach((x) => {
        if (x.attrType == "custom") {
            html += `<span class="d-inline-block p-2 alert-info small rounded mx-1 my-2">${x.attrValue} <i class="text-danger cattr fa fa-close pointer" data-cattr="${x.attrValue}"></i></span>`;
        }
    });
    $("#cattrlist").find(".small.rounded").remove();
    $(html).insertBefore(".form-control.cattr");
    cAttributes = [];
    $(".form-control.cattr").first().trigger("focus");
}

$(function () {
    setFullPage();
    triggerMenu(1, 2);
    forcustomer = true;
    apId = Number($infoblk.data("apid"));
   
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

    phonelist = $infoblk.data("phonelist").split(",");   
    maillist = $infoblk.data("maillist").split(",");
    namelist = $infoblk.data("namelist").split(",");
    approvalmode = $infoblk.data("approvalmode") === "True";
    editmode = Number($("#cusCustomerID").val()) > 0;

    fillInCustomer();

    let $cusname = $("#cusName");
    let $salecomment = $("#cusSaleComment");
    if (approvalmode) {
        if (!editmode) {
            $salecomment.val("BR:");
        }
        $salecomment.trigger("focus");
    } else {
        $cusname.trigger("focus");
    }
    $cusname.attr("maxlength", maxconamelength);
    //console.log('editmode:' + editmode);

    cAttributes = $infoblk.data("jscustomattributelist") as ICustomAttribute[];
    //console.log("cAttributes:", cAttributes);

    $("#globalattr").accordion({
        collapsible: true,
        active: "none",
        heightStyle: "content",
        activate: function (event, ui) {
            //console.log("ui:", ui);
            //$(ui.newPanel).find(".form-control").first().trigger("focus");            
            handleAttrAccordionActivated();
        },
    });

    if (getParameterByName("saveattr") != null) {
        //console.log("here");
        $(".ui-accordion-header").addClass("ui-state-active");
        $(".ui-accordion-content").show();
        handleAttrAccordionActivated();
    }

    uploadsizelimit = parseInt($infoblk.data("uploadsizelimit"));
    uploadsizelimitmb = parseInt($infoblk.data("uploadsizelimitmb"));
    if ($infoblk.data("uploadfilelist") !== "") {
        customer.UploadFileList = ($infoblk.data("uploadfilelist").toString()).split(",");
        $("#btnViewFile").removeClass("hide");
    }

    gattrnamelist = $infoblk.data("gattrnamelist").toString().split(",");

    if ($("#CustomerInfo_FollowUpDateDisplay").val() === "") {
        initDatePicker("followUpDate", new Date());
    } else {
        initDatePicker("followUpDate", convertCsharpDateStringToJsDate($("#CustomerInfo_FollowUpDateDisplay").val() as string));
    }
});