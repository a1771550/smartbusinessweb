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
        console.log("Supplier:", Supplier);
        //return false;
        $.ajax({
            type: "POST",
            url: "/Supplier/Edit",
            data: {
                __RequestVerificationToken: $(
                    "input[name=__RequestVerificationToken]"
                ).val(),
                model: Supplier,
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
    fillInSupplier();

    if (Supplier.supName == "") {
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

function fillInSupplier() {
    Supplier = {
        supId: Number($("#supId").val()),
        supName: <string>$("#supName").val(),
        supCode: <string>$("#supPhone").val(), //NOT #supCode!!!
        supPhone: <string>$("#supPhone").val(),
        supEmail: <string>$("#supEmail").val(),
        supContact: <string>$("#supContact").val(),
        supAddrStreetLine1: <string>$("#supAddrStreetLine1").val(),
        supAddrStreetLine2: <string>$("#supAddrStreetLine2").val(),
        supAddrStreetLine3: <string>$("#supAddrStreetLine3").val(),
        supAddrStreetLine4: <string>$("#supAddrStreetLine4").val(),
        supAddrCity: <string>$("#city").val(), //NOT ("#drpCity").val()!        
        supAddrCountry: <string>$("#drpCountry").val(),     
        CityTxt: $("#drpCity option:selected").text() as string,
        CountryTxt: $("#drpCountry option:selected").text() as string,
        supAddrWeb: <string>$("#supAddrWeb").val(),
        supAddrPhone1: <string>$("#supAddrPhone1").val(),
        supAddrPhone2: <string>$("#supAddrPhone2").val(),
        supAddrPhone3: <string>$("#supAddrPhone3").val(),
        IsLastPurchasePrice: $("#IsLastPurchasePrice").is(":checked"),
    } as unknown as ISupplier;
}

$(function () {
    setFullPage();
    triggerMenu(5,2);
    forsupplier = true;
    initModals();
    fillInSupplier();
    //console.log("supplier:", supplier);

    PhoneNameEmailList = $infoblk.data("phonenameemaillist");

    editmode = Supplier.supId > 0;

    uploadsizelimit = parseInt($infoblk.data("uploadsizelimit"));
    uploadsizelimitmb = parseInt($infoblk.data("uploadsizelimitmb"));
    if ($infoblk.data("uploadfilelist") !== "") {
        Supplier.UploadFileList = ($infoblk.data("uploadfilelist").toString()).split(",");
        //console.log("Supplier.UploadFileList:", Supplier.UploadFileList);
        $("#btnViewFile").removeClass("hide");
    }

    SelectedCountry = editmode ? Number(Supplier.supAddrCountry) ?? 1 : 1;
    let selectedCity = editmode ? Supplier.supAddrCity ?? "" : "";
    //console.log("selectedCity:" + selectedCity);
    lang = Number($infoblk.data("lang")) + 1;
    initCityDropDown(selectedCity, lang);
    $("#drpCountry").select2();
    $("#drpCity").select2();

    $("#supName").trigger("focus");
});
