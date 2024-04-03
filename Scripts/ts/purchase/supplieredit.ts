$infoblk = $("#infoblk");

$(document).on("change", "#supEmail", function () {
    handleCardEmailChange.call(this);
});
$(document).on("change", "#supPhone", function () {
    handleCardPhoneChange.call(this);
});
$(document).on("change", "#supName", function () {
    handleCardNameChange.call(this);
});

$(document).on("click", "#btnSave", function () {
    if (_validSupplier()) {
        console.log("supplier:", supplier);
        //return false;
        $.ajax({
            type: "POST",
            url: "/Supplier/Edit",
            data: {
                __RequestVerificationToken: $(
                    "input[name=__RequestVerificationToken]"
                ).val(),
                model: supplier,
            },
            success: function (data) {
                if (data.msg !== "") {
                    window.location.href = "/Supplier/Index";
                }
            },
            dataType: "json",
        });
    }
});

function _validSupplier(): boolean {
    let msg = "";
    supplier = fillInSupplier();

    if (supplier.supName == "") {
        msg += `${namerequiredtxt}<br>`;
        $("#supName").addClass("focus");
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
                    $(".focus").eq(0).trigger("focus");
                }
            },
        });
    }
    return msg === "";
}

function fillInSupplier(): ISupplier {
    return {
        supId: Number($("#supId").val()),
        supName: <string>$("#supName").val(),
        supPhone: <string>$("#supPhone").val(),
        supEmail: <string>$("#supEmail").val(),
        supContact: <string>$("#supContact").val(),
        supAddrStreetLine1: <string>$("#supAddrStreetLine1").val(),
        supAddrStreetLine2: <string>$("#supAddrStreetLine2").val(),
        supAddrStreetLine3: <string>$("#supAddrStreetLine3").val(),
        supAddrStreetLine4: <string>$("#supAddrStreetLine4").val(),
        supAddrCity: <string>$("#supAddrCity").val(),
        supAddrCountry: <string>$("#supAddrCountry").val(),
        supAddrWeb: <string>$("#supAddrWeb").val(),
        supAddrPhone1: <string>$("#supAddrPhone1").val(),
        supAddrPhone2: <string>$("#supAddrPhone2").val(),
        supAddrPhone3: <string>$("#supAddrPhone3").val(),
        CreateTimeDisplay: "",
        ModifyTimeDisplay: "",
    } as ISupplier;
}

$(function () {
    setFullPage();
    triggerMenu(5,2);
    forsupplier = true;
    initModals();
    supplier = fillInSupplier();

    PhoneNameEmailList = $infoblk.data("phonenameemaillist");

    editmode = supplier.supId > 0;

    uploadsizelimit = parseInt($infoblk.data("uploadsizelimit"));
    uploadsizelimitmb = parseInt($infoblk.data("uploadsizelimitmb"));
    if ($infoblk.data("uploadfilelist") !== "") {
        supplier.UploadFileList = ($infoblk.data("uploadfilelist").toString()).split(",");
        $("#btnViewFile").removeClass("hide");
    }
    $("#supName").trigger("focus");
});
